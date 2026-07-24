"""
OpsFlow AI — MVP backend

Scope (intentionally minimal, per "working prototype first" request):
- One real endpoint that matters for the demo: POST /api/invoices/analyze
  Uploads an invoice/receipt image, runs Gemma 4 vision, returns JSON that
  matches the frontend's `InvoiceResult` type EXACTLY (see lib/mock-data.ts),
  so the existing UI components render it with zero changes to their shape.
- Persists each analysis to SQLite (opsflow.db) for a lightweight history.
- No auth, no other modules (inventory/tasks/notifications/etc. stay on the
  frontend's existing mock data for this pass — see README for the roadmap).
"""

import io
import json
import logging
import os
import time
import uuid
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from pydantic import BaseModel, Field
from sqlalchemy import DateTime, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

from google import genai
from google.genai import types
from google.genai.errors import APIError

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("opsflow")

GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemma-4-31b-it")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./opsflow.db")

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024

# --------------------------------------------------------------------------
# DB (SQLite, zero setup — swap DATABASE_URL for Postgres later)
# --------------------------------------------------------------------------

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class InvoiceRecord(Base):
    __tablename__ = "invoices"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename: Mapped[str] = mapped_column(String(255), default="")
    result_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[str] = mapped_column(DateTime, default=lambda: __import__("datetime").datetime.utcnow())


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------------------------------
# Schemas — field names match the frontend's `InvoiceResult` type verbatim
# (see frontend/lib/mock-data.ts) so the UI needs zero transformation.
#
# IMPORTANT: Gemini API rejects response schemas that contain `default` values,
# so we define TWO sets of models:
#   1. Clean models (no defaults) → used as the Gemini response_schema
#   2. Response models (with defaults) → used for Pydantic validation of the
#      raw JSON the model returns, and as FastAPI response_model.
# --------------------------------------------------------------------------

class LineItemGemini(BaseModel):
    description: str
    quantity: float
    unitPrice: float
    amount: float


class RecommendedActionGemini(BaseModel):
    title: str
    detail: str


class InvoiceResultGemini(BaseModel):
    vendor: str
    invoiceNumber: str
    invoiceDate: str
    subtotal: float
    tax: float
    gst: float
    total: float
    confidence: float = Field(description="0-100 extraction confidence")
    risk: str = Field(description="one of: low, medium, high")
    lineItems: list[LineItemGemini]
    recommendedActions: list[RecommendedActionGemini]


# --- Response / storage models (with defaults for graceful handling) ---

class LineItem(BaseModel):
    description: str = ""
    quantity: float = 0
    unitPrice: float = 0
    amount: float = 0


class RecommendedAction(BaseModel):
    title: str = ""
    detail: str = ""


class InvoiceResult(BaseModel):
    vendor: str = ""
    invoiceNumber: str = ""
    invoiceDate: str = ""
    subtotal: float = 0
    tax: float = 0
    gst: float = 0
    total: float = 0
    confidence: float = 0
    risk: str = "low"
    lineItems: list[LineItem] = []
    recommendedActions: list[RecommendedAction] = []


ANALYSIS_PROMPT = (
    "You are OpsFlow AI, analyzing a photographed invoice or receipt for a small "
    "business. Extract every field precisely, even if the image is skewed, "
    "handwritten, low-light, or blurred.\n\n"
    "For 'risk', return exactly one of: low, medium, high — based on whether the "
    "totals reconcile, dates look valid, and the vendor looks legitimate.\n"
    "For 'confidence', return your extraction confidence as a number 0-100.\n"
    "For 'recommendedActions', give 2-3 short, concrete next steps a business "
    "owner should take (e.g. approve payment, update stock, flag for review).\n"
    "If a field can't be read, use a sensible default (empty string / 0) rather "
    "than guessing. Output strictly valid JSON matching the schema — no markdown."
)

# --------------------------------------------------------------------------
# Gemma client
# --------------------------------------------------------------------------

_client: Optional[genai.Client] = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set.")
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("SQLite ready (opsflow.db)")
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — /api/invoices/analyze will fail until configured.")
    yield


app = FastAPI(title="OpsFlow AI — MVP Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo-only; lock this to your frontend origin before real deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok", "model": GEMMA_MODEL, "gemini_configured": bool(GEMINI_API_KEY)}


def _validate_image(raw: bytes, content_type: Optional[str]) -> str:
    if not raw:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Uploaded file is empty.")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "File too large (max 10MB).")
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Use JPEG, PNG, or WEBP.")
    try:
        Image.open(io.BytesIO(raw)).verify()
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "File is not a valid image.")
    return "image/jpeg" if content_type == "image/jpg" else content_type


@app.post("/api/invoices/analyze", response_model=InvoiceResult)
async def analyze_invoice(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not GEMINI_API_KEY:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Server missing GEMINI_API_KEY.")

    raw = await file.read()
    mime_type = _validate_image(raw, file.content_type)

    client = get_client()
    last_error = None

    for attempt in range(2):
        try:
            response = client.models.generate_content(
                model=GEMMA_MODEL,
                contents=[
                    types.Part.from_bytes(data=raw, mime_type=mime_type),
                    ANALYSIS_PROMPT,
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InvoiceResultGemini,
                    temperature=0.1,
                ),
            )
            text = (response.text or "").strip()
            if not text:
                raise ValueError("Empty response from model.")
            raw_result = InvoiceResultGemini.model_validate_json(text)
            result = InvoiceResult.model_validate(raw_result.model_dump())
            break
        except (APIError, ValueError) as exc:
            last_error = exc
            logger.warning("Gemma attempt %d failed: %s", attempt + 1, exc)
            time.sleep(0.5)
    else:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Analysis failed after retries.") from last_error

    record = InvoiceRecord(filename=file.filename or "upload.jpg", result_json=result.model_dump_json())
    db.add(record)
    db.commit()

    return result


@app.get("/api/invoices")
async def list_invoices(db: Session = Depends(get_db)):
    records = db.query(InvoiceRecord).order_by(InvoiceRecord.created_at.desc()).limit(25).all()
    return {
        "items": [
            {"id": r.id, "filename": r.filename, "created_at": str(r.created_at), **json.loads(r.result_json)}
            for r in records
        ]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
