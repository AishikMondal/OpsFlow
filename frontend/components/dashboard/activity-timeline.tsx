'use client'

import { FileText, Package, CreditCard, CheckCircle2, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { activityTimeline, type ActivityItem } from '@/lib/mock-data'

const typeIcons: Record<ActivityItem['type'], typeof FileText> = {
  invoice: FileText,
  inventory: Package,
  payment: CreditCard,
  task: CheckCircle2,
  ai: Sparkles,
}

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Latest events across your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-5 before:absolute before:inset-y-1 before:start-[13px] before:w-px before:bg-border">
          {activityTimeline.map((item) => {
            const Icon = typeIcons[item.type]
            return (
              <li key={item.id} className="relative flex items-start gap-3">
                <span className="relative z-[1] flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                  <Icon className="size-3.5 text-muted-foreground" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
