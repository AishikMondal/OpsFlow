// OpsFlow AI — API client
// All backend calls go through here. Types mirror the backend Pydantic models.

import type { InvoiceResult } from './mock-data'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {}

async function apiFetch<T>(path: string, init?: RequestInit, timeoutMs = 30000): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...init, signal: controller.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(
        `Request to ${path} timed out after ${Math.round(timeoutMs / 1000)}s. The backend may be busy — try again.`,
      )
    }
    throw new ApiError(`Can't reach the OpsFlow backend at ${API_BASE_URL}. Is it running?`)
  } finally {
    clearTimeout(timer)
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body?.detail || `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

// ---- Invoices ----

export async function analyzeInvoice(file: File): Promise<InvoiceResult> {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<InvoiceResult>('/api/invoices/analyze', { method: 'POST', body: formData }, 90000)
}

export async function listInvoices(): Promise<{ items: (InvoiceResult & { id: string; filename: string; created_at: string })[] }> {
  return apiFetch('/api/invoices')
}

export const RESULT_STORAGE_KEY = 'opsflow_invoice_result'

// ---- Dashboard ----

export type DashboardStats = {
  kpis: { label: string; value: number; change: number; trend: 'up' | 'down' }[]
  summary: {
    invoices_processed: number
    high_risk_invoices: number
    low_stock_items: number
    out_of_stock_items: number
    open_tasks: number
    unread_notifications: number
  }
  risk_alerts: { id: string; title: string; detail: string; severity: 'high' | 'medium' | 'low' }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch('/api/dashboard/stats')
}

// ---- Activity ----

export type ActivityItem = {
  id: string
  title: string
  detail: string
  time: string
  type: 'invoice' | 'inventory' | 'payment' | 'task' | 'ai' | 'system'
}

export async function listActivity(): Promise<{ items: ActivityItem[] }> {
  return apiFetch('/api/activity')
}

// ---- Products (Inventory) ----

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  supplier: string
  stock: number
  reorder_point: number
  price: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

export type Supplier = {
  id: string
  name: string
  products: number
  onTime: number
  spend: string
}

export async function listProducts(params?: { category?: string; search?: string }): Promise<{ items: Product[]; categories: string[]; suppliers: Supplier[] }> {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.search) qs.set('search', params.search)
  const query = qs.toString() ? `?${qs}` : ''
  return apiFetch(`/api/products${query}`)
}

export async function createProduct(data: { name: string; sku: string; category: string; supplier: string; stock: number; reorder_point: number; price: number }): Promise<Product> {
  return apiFetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string): Promise<{ ok: boolean }> {
  return apiFetch(`/api/products/${id}`, { method: 'DELETE' })
}

// ---- Tasks ----

export type Task = {
  id: string
  title: string
  assignee: string
  due: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
}

export async function listTasks(): Promise<{ items: Task[] }> {
  return apiFetch('/api/tasks')
}

export async function createTask(data: { title: string; assignee?: string; due?: string; priority?: string }): Promise<Task> {
  return apiFetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  return apiFetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteTask(id: string): Promise<{ ok: boolean }> {
  return apiFetch(`/api/tasks/${id}`, { method: 'DELETE' })
}

// ---- Notifications ----

export type Notification = {
  id: string
  title: string
  detail: string
  time: string
  read: boolean
  type: 'alert' | 'payment' | 'inventory' | 'system' | 'ai'
}

export async function listNotifications(): Promise<{ items: Notification[] }> {
  return apiFetch('/api/notifications')
}

export async function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  return apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' })
}

export async function markAllNotificationsRead(): Promise<{ ok: boolean }> {
  return apiFetch('/api/notifications/read-all', { method: 'PUT' })
}

// ---- AI Assistant ----

export async function chatWithAssistant(message: string): Promise<{ response: string }> {
  return apiFetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
}

// ---- Analytics ----

export type RevenueSeriesItem = { month: string; revenue: number; expenses: number; profit: number }
export type CashflowSeriesItem = { week: string; inflow: number; outflow: number }
export type ExpenseItem = { category: string; amount: number }
export type InventoryTrendItem = { month: string; stock: number; sold: number }
export type HealthMetric = { label: string; score: number }

export async function getRevenueSeries(): Promise<{ items: RevenueSeriesItem[] }> {
  return apiFetch('/api/analytics/revenue')
}

export async function getCashflowSeries(): Promise<{ items: CashflowSeriesItem[] }> {
  return apiFetch('/api/analytics/cashflow')
}

export async function getExpenseBreakdown(): Promise<{ items: ExpenseItem[] }> {
  return apiFetch('/api/analytics/expenses')
}

export async function getInventoryTrend(): Promise<{ items: InventoryTrendItem[] }> {
  return apiFetch('/api/analytics/inventory-trend')
}

export async function getHealthMetrics(): Promise<{ overall: number; metrics: HealthMetric[] }> {
  return apiFetch('/api/analytics/health')
}

// ---- Reports ----

export type Report = {
  id: string
  name: string
  period: string
  generated: string
  type: string
}

export async function listReports(): Promise<{ items: Report[] }> {
  return apiFetch('/api/reports')
}
