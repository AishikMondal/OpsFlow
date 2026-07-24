# OpsFlow AI - MVP

Multimodal business operations and execution engine for MSMEs.

OpsFlow turns unstructured retail documents and physical inventory ledgers into actionable workflows powered by Gemma 4.

## Theme

AI for Small Businesses

## Problem

Micro, Small, and Medium Enterprises (MSMEs) are the backbone of many local economies, but shopkeepers and operators still spend hours every week on manual administrative work:

- Auditing physical invoices
- Reconciling handwritten store ledgers
- Tracking supplier debt
- Calculating cash-flow risk

Existing ERP systems are often too expensive and complex for small businesses, while standard AI chat wrappers tend to return passive text instead of structured data and operational workflows.

## Solution

OpsFlow AI lets business owners upload or photograph invoices, receipts, and inventory sheets. The FastAPI backend uses Gemma 4 vision to extract structured transactional data, compute risk signals, and return data the frontend can render as operational UI.

The current MVP focuses on one real demo path: invoice upload and analysis.

## Project Structure

```text
OpsFlow-mvp/
|-- backend/     FastAPI + Gemma 4 + SQLite
`-- frontend/    Next.js app
```

## What Is Wired Up

- Real invoice upload from `/invoices` to the FastAPI backend
- Gemma 4 vision extraction for vendor, line items, totals, risk, and recommended actions
- Result rendering on `/invoices/results`
- SQLite persistence for analyzed invoices
- Mock data still used for dashboard, analytics, inventory, tasks, notifications, reports, settings, and assistant chat

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Set `GEMINI_API_KEY` in `backend/.env`.

```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```

Health check:

```text
http://localhost:8000/health
```

API docs:

```text
http://localhost:8000/docs
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000/invoices
```

Upload a real invoice or receipt image, then review the extracted result on `/invoices/results`.

## Environment Variables

| File | Variable | Required |
| --- | --- | --- |
| `backend/.env` | `GEMINI_API_KEY` | Yes |
| `backend/.env` | `GEMMA_MODEL` | No, defaults to `gemma-4-31b-it` |
| `backend/.env` | `DATABASE_URL` | No, defaults to local SQLite |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | Yes, points at the backend |

## Persistence

Invoice analyses are saved to `backend/opsflow.db`, which is created locally at runtime and is intentionally ignored by Git.

`GET /api/invoices` returns the last 25 invoice analyses. The endpoint exists, but the dashboard is not wired to it yet.

## Next Steps

1. Wire dashboard KPI cards and activity timeline to `GET /api/invoices`.
2. Add authentication before handling real customer data.
3. Back inventory, analytics, and reports with real database tables.
4. Move from SQLite to Postgres with migrations once multi-user persistence is needed.
