// Centralized mock data for OpsFlow AI.
// Replace these with real API calls when the backend is connected.

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value)
}

export type Kpi = {
  label: string
  value: string
  change: number
  trend: 'up' | 'down'
}

export const kpis: Kpi[] = [
  { label: 'Revenue', value: '₹70,40,720', change: 12.4, trend: 'up' },
  { label: 'Expenses', value: '₹26,70,330', change: -4.2, trend: 'down' },
  { label: 'Profit', value: '₹43,70,390', change: 18.9, trend: 'up' },
  { label: 'Cashflow', value: '₹22,63,685', change: 6.3, trend: 'up' },
  { label: 'Pending Payments', value: '₹10,39,575', change: 3.1, trend: 'up' },
  { label: 'Inventory Value', value: '₹39,06,130', change: -1.8, trend: 'down' },
]

export const revenueSeries = [
  { month: 'Jan', revenue: 3507000, expenses: 2004000, profit: 1503000 },
  { month: 'Feb', revenue: 4049750, expenses: 2187700, profit: 1862050 },
  { month: 'Mar', revenue: 3849350, expenses: 2095850, profit: 1753500 },
  { month: 'Apr', revenue: 4625900, expenses: 2287900, profit: 2338000 },
  { month: 'May', revenue: 5110200, expenses: 2488300, profit: 2621900 },
  { month: 'Jun', revenue: 4901450, expenses: 2380500, profit: 2521700 },
  { month: 'Jul', revenue: 5619550, expenses: 2513350, profit: 3106200 },
  { month: 'Aug', revenue: 6078800, expenses: 2605200, profit: 3473600 },
  { month: 'Sep', revenue: 5803250, expenses: 2555100, profit: 3248200 },
  { month: 'Oct', revenue: 6529700, expenses: 2705400, profit: 3824300 },
  { month: 'Nov', revenue: 6813600, expenses: 2663650, profit: 4149950 },
  { month: 'Dec', revenue: 7040720, expenses: 2670330, profit: 4370390 },
]

export const cashflowSeries = [
  { week: 'W1', inflow: 1519700, outflow: 1035400 },
  { week: 'W2', inflow: 1795250, outflow: 1177350 },
  { week: 'W3', inflow: 1402800, outflow: 1302600 },
  { week: 'W4', inflow: 2029050, outflow: 1102200 },
  { week: 'W5', inflow: 1845350, outflow: 1235800 },
  { week: 'W6', inflow: 2229450, outflow: 1327650 },
]

export const inventoryTrend = [
  { month: 'Jul', stock: 1240, sold: 420 },
  { month: 'Aug', stock: 1180, sold: 510 },
  { month: 'Sep', stock: 1320, sold: 470 },
  { month: 'Oct', stock: 1260, sold: 560 },
  { month: 'Nov', stock: 1410, sold: 610 },
  { month: 'Dec', stock: 1350, sold: 680 },
]

export const expenseBreakdown = [
  { category: 'Payroll', amount: 1185700 },
  { category: 'Suppliers', amount: 743150 },
  { category: 'Rent', amount: 350700 },
  { category: 'Marketing', amount: 223780 },
  { category: 'Software', amount: 116900 },
  { category: 'Other', amount: 50100 },
]

export type RiskAlert = {
  id: string
  title: string
  detail: string
  severity: 'high' | 'medium' | 'low'
}

export const riskAlerts: RiskAlert[] = [
  {
    id: 'r1',
    title: 'Invoice INV-2091 overdue 14 days',
    detail: 'Acme Traders — ₹3,60,720 outstanding',
    severity: 'high',
  },
  {
    id: 'r2',
    title: 'Low stock: Thermal Paper Rolls',
    detail: '8 units left, reorder point is 25',
    severity: 'medium',
  },
  {
    id: 'r3',
    title: 'Supplier price increase detected',
    detail: 'Nova Supplies raised unit cost by 7%',
    severity: 'low',
  },
]

export type ActivityItem = {
  id: string
  title: string
  detail: string
  time: string
  type: 'invoice' | 'inventory' | 'payment' | 'task' | 'ai'
}

export const activityTimeline: ActivityItem[] = [
  { id: 'a1', title: 'Invoice INV-2107 processed', detail: 'Extracted 12 line items with 98% confidence', time: '8 min ago', type: 'invoice' },
  { id: 'a2', title: 'Payment received', detail: '₹1,78,690 from Brightline Retail', time: '42 min ago', type: 'payment' },
  { id: 'a3', title: 'Stock updated', detail: '120 units of Shipping Boxes added', time: '1 h ago', type: 'inventory' },
  { id: 'a4', title: 'AI flagged duplicate invoice', detail: 'INV-2103 matches INV-2098', time: '3 h ago', type: 'ai' },
  { id: 'a5', title: 'Task completed', detail: 'Monthly reconciliation finished by Priya', time: '5 h ago', type: 'task' },
  { id: 'a6', title: 'Invoice INV-2106 uploaded', detail: 'Awaiting review — Nova Supplies', time: 'Yesterday', type: 'invoice' },
]

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  supplier: string
  stock: number
  reorderPoint: number
  price: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

export const products: Product[] = [
  { id: 'p1', name: 'Thermal Paper Rolls', sku: 'TPR-80MM', category: 'Office Supplies', supplier: 'Nova Supplies', stock: 8, reorderPoint: 25, price: 375.75, status: 'low-stock' },
  { id: 'p2', name: 'Shipping Boxes (M)', sku: 'SHB-M-01', category: 'Packaging', supplier: 'PackRight Co', stock: 342, reorderPoint: 100, price: 100.20, status: 'in-stock' },
  { id: 'p3', name: 'Barcode Labels', sku: 'BCL-500', category: 'Office Supplies', supplier: 'Nova Supplies', stock: 156, reorderPoint: 50, price: 743.15, status: 'in-stock' },
  { id: 'p4', name: 'Bubble Wrap Rolls', sku: 'BWR-50M', category: 'Packaging', supplier: 'PackRight Co', stock: 0, reorderPoint: 20, price: 1035.40, status: 'out-of-stock' },
  { id: 'p5', name: 'Ink Cartridges (Black)', sku: 'INK-BK-22', category: 'Electronics', supplier: 'TechFlow Ltd', stock: 47, reorderPoint: 30, price: 2086.67, status: 'in-stock' },
  { id: 'p6', name: 'POS Receipt Printer', sku: 'POS-RP-3', category: 'Electronics', supplier: 'TechFlow Ltd', stock: 12, reorderPoint: 5, price: 15781.50, status: 'in-stock' },
  { id: 'p7', name: 'Packing Tape', sku: 'PKT-48MM', category: 'Packaging', supplier: 'PackRight Co', stock: 18, reorderPoint: 40, price: 192.05, status: 'low-stock' },
  { id: 'p8', name: 'A4 Copy Paper', sku: 'A4-CP-500', category: 'Office Supplies', supplier: 'Nova Supplies', stock: 220, reorderPoint: 80, price: 467.60, status: 'in-stock' },
]

export const suppliers = [
  { id: 's1', name: 'Nova Supplies', products: 3, onTime: 94, spend: '₹7,03,070' },
  { id: 's2', name: 'PackRight Co', products: 3, onTime: 88, spend: '₹4,93,485' },
  { id: 's3', name: 'TechFlow Ltd', products: 2, onTime: 97, spend: '₹5,12,690' },
]

export type InvoiceResult = {
  vendor: string
  invoiceNumber: string
  invoiceDate: string
  subtotal: number
  tax: number
  gst: number
  total: number
  confidence: number
  risk: 'low' | 'medium' | 'high'
  lineItems: { description: string; quantity: number; unitPrice: number; amount: number }[]
  recommendedActions: { title: string; detail: string }[]
}

export const invoiceResult: InvoiceResult = {
  vendor: 'Nova Supplies Pvt Ltd',
  invoiceNumber: 'INV-2107',
  invoiceDate: '2026-07-18',
  subtotal: 156104.40,
  tax: 7805.22,
  gst: 14037.56,
  total: 177948.18,
  confidence: 98.2,
  risk: 'low',
  lineItems: [
    { description: 'Thermal Paper Rolls 80mm (Box of 50)', quantity: 4, unitPrice: 17535.00, amount: 70140.00 },
    { description: 'Barcode Labels 500-pack', quantity: 6, unitPrice: 3715.75, amount: 22294.50 },
    { description: 'A4 Copy Paper 500 sheets', quantity: 20, unitPrice: 2338.00, amount: 46760.00 },
    { description: 'Delivery & Handling', quantity: 1, unitPrice: 16816.90, amount: 16816.90 },
  ],
  recommendedActions: [
    { title: 'Approve and schedule payment', detail: 'Due 2026-08-17 · Net 30 terms match vendor history' },
    { title: 'Update stock levels', detail: 'Add received quantities to Thermal Paper Rolls and Barcode Labels' },
    { title: 'Compare unit prices', detail: 'Thermal roll price up 5% vs last order — review supplier pricing' },
  ],
}

export type Notification = {
  id: string
  title: string
  detail: string
  time: string
  read: boolean
  type: 'alert' | 'payment' | 'inventory' | 'system' | 'ai'
}

export const notifications: Notification[] = [
  { id: 'n1', title: 'Invoice INV-2091 is 14 days overdue', detail: 'Acme Traders owes ₹3,60,720. Consider sending a reminder.', time: '10 min ago', read: false, type: 'alert' },
  { id: 'n2', title: 'Payment received from Brightline Retail', detail: '₹1,78,690 credited to your primary account.', time: '42 min ago', read: false, type: 'payment' },
  { id: 'n3', title: 'Low stock warning', detail: 'Thermal Paper Rolls dropped below reorder point (8/25).', time: '1 h ago', read: false, type: 'inventory' },
  { id: 'n4', title: 'AI detected a duplicate invoice', detail: 'INV-2103 appears to duplicate INV-2098 from Nova Supplies.', time: '3 h ago', read: true, type: 'ai' },
  { id: 'n5', title: 'Weekly report is ready', detail: 'Your operations summary for Jul 14–20 has been generated.', time: 'Yesterday', read: true, type: 'system' },
  { id: 'n6', title: 'Supplier price change', detail: 'Nova Supplies increased thermal roll pricing by 7%.', time: 'Yesterday', read: true, type: 'alert' },
  { id: 'n7', title: 'Inventory sync completed', detail: '412 SKUs synced without conflicts.', time: '2 days ago', read: true, type: 'inventory' },
]

export type Task = {
  id: string
  title: string
  assignee: string
  due: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
}

export const tasks: Task[] = [
  { id: 't1', title: 'Follow up on INV-2091 overdue payment', assignee: 'Priya', due: 'Today', priority: 'high', status: 'in-progress' },
  { id: 't2', title: 'Reorder Thermal Paper Rolls', assignee: 'Marcus', due: 'Today', priority: 'high', status: 'todo' },
  { id: 't3', title: 'Review Nova Supplies price increase', assignee: 'You', due: 'Tomorrow', priority: 'medium', status: 'todo' },
  { id: 't4', title: 'Reconcile June bank statement', assignee: 'Priya', due: 'Jul 28', priority: 'medium', status: 'todo' },
  { id: 't5', title: 'Approve pending supplier invoices', assignee: 'You', due: 'Jul 29', priority: 'low', status: 'todo' },
  { id: 't6', title: 'Monthly reconciliation', assignee: 'Priya', due: 'Jul 22', priority: 'medium', status: 'done' },
  { id: 't7', title: 'Update product pricing sheet', assignee: 'Marcus', due: 'Jul 21', priority: 'low', status: 'done' },
]

export const reports = [
  { id: 'rp1', name: 'Monthly P&L Statement', period: 'June 2026', generated: 'Jul 2, 2026', type: 'Financial' },
  { id: 'rp2', name: 'Cashflow Forecast', period: 'Q3 2026', generated: 'Jul 5, 2026', type: 'Financial' },
  { id: 'rp3', name: 'Inventory Valuation', period: 'June 2026', generated: 'Jul 3, 2026', type: 'Inventory' },
  { id: 'rp4', name: 'Supplier Performance', period: 'H1 2026', generated: 'Jul 8, 2026', type: 'Operations' },
  { id: 'rp5', name: 'Tax Summary (GST)', period: 'Q2 2026', generated: 'Jul 10, 2026', type: 'Tax' },
  { id: 'rp6', name: 'Weekly Operations Digest', period: 'Jul 14–20', generated: 'Jul 21, 2026', type: 'Operations' },
]

export const aiSuggestions = [
  'Summarize this month\u2019s cashflow',
  'Which invoices are overdue?',
  'What should I reorder this week?',
  'Compare revenue vs last quarter',
]

export const aiInsights = [
  { title: 'Cash position is healthy', detail: 'Inflows exceeded outflows in 5 of the last 6 weeks.' },
  { title: 'Reorder recommended', detail: '2 SKUs are below reorder point and trending down.' },
  { title: 'Margin improving', detail: 'Gross margin rose 2.1 points since April.' },
]

// Simple canned AI responses keyed by intent keywords.
export function getMockAiResponse(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('cashflow') || m.includes('cash')) {
    return 'Your cashflow this month is +₹22,63,685. Inflows totaled ₹1,08,21,800 across 6 weeks while outflows were ₹71,81,000. Week 3 was your only negative week, driven by a bulk supplier payment. Overall trend: healthy and improving.'
  }
  if (m.includes('overdue') || m.includes('invoice')) {
    return 'You have 1 overdue invoice: INV-2091 from Acme Traders (₹3,60,720), now 14 days past due. I recommend sending a payment reminder today. There are also 2 invoices due within the next 7 days totaling ₹3,23,980.'
  }
  if (m.includes('reorder') || m.includes('stock') || m.includes('inventory')) {
    return 'Two products need reordering: Thermal Paper Rolls (8 left, reorder point 25) and Packing Tape (18 left, reorder point 40). Bubble Wrap Rolls are fully out of stock. Based on sales velocity, I suggest ordering within 3 days to avoid stockouts.'
  }
  if (m.includes('revenue') || m.includes('compare') || m.includes('quarter')) {
    return 'Q4 revenue is tracking at ₹2,03,84,020, up 17.8% vs Q3 (₹1,73,01,200). December alone hit ₹70,40,720 — your best month this year. Profit margin also improved from 58.1% to 62.1% quarter over quarter.'
  }
  return 'Based on your current data: revenue is up 12.4% this month, you have 1 overdue invoice worth ₹3,60,720, and 3 inventory items need attention. Ask me about cashflow, overdue invoices, reordering, or revenue trends for a deeper breakdown.'
}
