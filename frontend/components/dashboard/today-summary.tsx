'use client'

import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDashboardStats, type DashboardStats } from '@/lib/api'

export function TodaySummary() {
  const [stats, setStats] = React.useState<DashboardStats['summary'] | null>(null)

  React.useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data.summary))
      .catch(() => {})
  }, [])

  if (!stats) return null

  const summaryStats = [
    { label: 'Invoices processed', value: String(stats.invoices_processed) },
    { label: 'High risk invoices', value: String(stats.high_risk_invoices) },
    { label: 'Low stock items', value: String(stats.low_stock_items + stats.out_of_stock_items) },
    { label: 'Tasks due', value: String(stats.open_tasks) },
  ]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/8 to-transparent">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Today&apos;s Summary</h2>
          </div>
          <Badge variant="secondary" className="text-xs">AI generated</Badge>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {stats.invoices_processed === 0
            ? "No invoices processed yet. Upload your first invoice to get started."
            : `You've processed ${stats.invoices_processed} invoice(s). ${stats.high_risk_invoices > 0 ? `${stats.high_risk_invoices} flagged as high risk.` : 'No risk flags detected.'} ${stats.low_stock_items + stats.out_of_stock_items > 0 ? `${stats.low_stock_items + stats.out_of_stock_items} inventory item(s) need attention.` : 'All inventory levels look good.'}`
          }
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5 rounded-lg border border-border bg-card/60 px-3 py-2">
              <span className="font-mono text-lg font-semibold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
