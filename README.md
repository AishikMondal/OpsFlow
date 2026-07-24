# OpsFlow AI — MVP (integrated)

```
OpsFlow-mvp/
├── backend/     FastAPI + Gemma 4 + SQLite (one real endpoint)
└── frontend/    Your existing Next.js app, unmodified except for 2 files
```

## What's actually wired up (and what isn't)

This is a **working prototype**, scoped deliberately small so it's real
rather than impressive-looking-but-fake:

- **Real**: uploading an invoice on `/invoices` now sends the image to a
  live FastAPI backend, which calls **Gemma 4 vision** and returns genuine
  extracted data — vendor, line items, totals, risk, recommended actions —
  rendered on `/invoices/results`. This is the one thing worth demoing.
- **Still mock data**: the dashboard, analytics, inventory, tasks,
  notifications, reports, settings, and the AI assistant chat are untouched
  and still read from `frontend/lib/mock-data.ts`, exactly as they did
  before. Wiring those up is real, separate work — see "Next steps" below.
- **No auth, no Postgres, no Celery, no multi-agent system.** The full
  Clean-Architecture spec (companies/roles/workflow engine/specialized
  agents/Alembic/Redis/etc.) is a multi-week backend build. Scaffolding it
  unverified would hand you broken code, which is worse than not having it.

Only two frontend files were touched, both required to make the upload flow
real instead of simulated:
- `components/invoices/invoice-uploader.tsx` — now actually POSTs the file
  to the backend (kept the existing animation/UX as-is).
- `components/invoices/invoice-results.tsx` — now reads the real result
  from `sessionStorage` if present, falling back to the original mock data
  otherwise, so the page still renders fine with no upload.

## 1. Backend setup

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and set `GEMINI_API_KEY` (from
https://aistudio.google.com/apikey).

```bash
python main.py
# or: uvicorn main:app --reload --port 8000
```

Check `http://localhost:8000/health` — should show `"gemini_configured": true`.
Interactive docs at `http://localhost:8000/docs`.

## 2. Frontend setup

```bash
cd frontend
npm install   # or pnpm install — pnpm-lock.yaml is included
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000/invoices`, upload a real invoice/receipt photo,
and watch it land on `/invoices/results` with genuine Gemma 4 output instead
of the canned mock.

## 3. Environment variables

| File | Variable | Required |
|---|---|---|
| `backend/.env` | `GEMINI_API_KEY` | **Yes** |
| `backend/.env` | `GEMMA_MODEL` | No (default `gemma-4-31b-it`) |
| `backend/.env` | `DATABASE_URL` | No (default local SQLite) |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | **Yes** — points at the backend |

## 4. Persistence

Every real analysis is saved to `backend/opsflow.db` (SQLite, auto-created).
`GET /api/invoices` returns the last 25 — not wired into the UI yet, but
there for you to build a real "recent invoices" list on the dashboard next.

## 5. Next steps, roughly in order of demo value

1. **Wire the dashboard KPI cards and activity timeline** to
   `GET /api/invoices` instead of `lib/mock-data.ts` — moderate effort,
   makes the whole app feel connected.
2. **Auth** (Supabase or similar) — needed before this touches real data.
3. **Inventory/analytics/reports** backed by real tables — this is the
   multi-week piece from the original spec; happy to scope it into phases
   once the demo direction is confirmed.
4. **Postgres + Alembic migrations** once SQLite's single-file simplicity
   stops being enough (multi-user, concurrent writes).

Tell me which of these matters most for what's next and I'll build and
actually test that piece, the same way this pass was built and tested.
