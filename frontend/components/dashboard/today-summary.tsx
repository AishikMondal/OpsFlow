'use client'

import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const summaryStats = [
  { label: 'Invoices processed', value: '4' },
  { label: 'Payments received', value: '$3,260' },
  { label: 'New orders', value: '17' },
  { label: 'Tasks due', value: '2' },
]

export function TodaySummary() {
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
          {
            "Strong day so far. You've received $3,260 in payments and processed 4 invoices. One overdue invoice needs follow-up, and 2 inventory items are below reorder points. Cashflow remains positive for the fifth consecutive week."
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
