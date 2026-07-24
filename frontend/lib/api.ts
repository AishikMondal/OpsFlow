// Minimal client for the OpsFlow AI backend.
// Only the invoice analysis flow is wired to a real API in this MVP pass —
// everything else in the app still reads from lib/mock-data.ts.

import type { InvoiceResult } from './mock-data'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {}

export async function analyzeInvoice(file: File): Promise<InvoiceResult> {
  const formData = new FormData()
  formData.append('file', file)

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}/api/invoices/analyze`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new ApiError(`Can't reach the OpsFlow backend at ${API_BASE_URL}. Is it running?`)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body?.detail || 'Analysis failed. Please try again.')
  }

  return (await res.json()) as InvoiceResult
}

export const RESULT_STORAGE_KEY = 'opsflow_invoice_result'
