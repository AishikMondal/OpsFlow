'use client'

import { AlertTriangle, ShieldAlert, Info } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { riskAlerts, type RiskAlert } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const severityConfig: Record<
  RiskAlert['severity'],
  { icon: typeof ShieldAlert; className: string; label: string }
> = {
  high: { icon: ShieldAlert, className: 'text-destructive', label: 'High' },
  medium: { icon: AlertTriangle, className: 'text-warning', label: 'Medium' },
  low: { icon: Info, className: 'text-muted-foreground', label: 'Low' },
}

export function RiskAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Alerts</CardTitle>
        <CardDescription>AI-detected issues that need attention</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {riskAlerts.map((alert) => {
          const config = severityConfig[alert.severity]
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-3"
            >
              <config.icon className={cn('mt-0.5 size-4 shrink-0', config.className)} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium leading-snug">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.detail}</p>
              </div>
              <Badge
                variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                className="shrink-0 text-xs"
              >
                {config.label}
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
