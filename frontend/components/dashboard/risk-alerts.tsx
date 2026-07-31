'use client'

import * as React from 'react'
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDashboardStats, type DashboardStats } from '@/lib/api'
import { cn } from '@/lib/utils'

const severityConfig: Record<
  string,
  { icon: typeof ShieldAlert; className: string; badgeClass: string; iconWrapClass: string; label: string }
> = {
  high: { icon: ShieldAlert, className: 'text-destructive', badgeClass: 'bg-destructive/10 border-destructive/30', iconWrapClass: 'border-destructive/40 bg-destructive/10', label: 'High' },
  medium: { icon: AlertTriangle, className: 'text-amber-500', badgeClass: 'bg-amber-500/10 border-amber-500/30', iconWrapClass: 'border-amber-500/40 bg-amber-500/10', label: 'Medium' },
  low: { icon: Info, className: 'text-muted-foreground', badgeClass: '', iconWrapClass: '', label: 'Low' },
}

export function RiskAlerts() {
  const [alerts, setAlerts] = React.useState<DashboardStats['risk_alerts']>([])

  React.useEffect(() => {
    getDashboardStats()
      .then(data => setAlerts(data.risk_alerts))
      .catch(() => {})
  }, [])

  if (alerts.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Alerts</CardTitle>
        <CardDescription>AI-detected risks from invoices and inventory</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alerts.map(alert => {
          const config = severityConfig[alert.severity] || severityConfig.low
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-3"
            >
              <span className={cn('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border', config.iconWrapClass)}>
                <config.icon className={cn('size-3.5', config.className)} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium leading-snug">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.detail}</p>
              </div>
              <Badge
                variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'outline' : 'secondary'}
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
