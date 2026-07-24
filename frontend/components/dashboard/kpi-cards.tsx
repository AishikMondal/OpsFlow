'use client'

import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StaggerGroup, StaggerItem } from '@/components/motion-fade'
import { kpis } from '@/lib/mock-data'

export function KpiCards() {
  return (
    <StaggerGroup className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 md:gap-4">
      {kpis.map((kpi) => (
        <StaggerItem key={kpi.label}>
          <Card className="h-full">
            <CardContent className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <span className="font-mono text-xl font-semibold tracking-tight">{kpi.value}</span>
              <Badge variant="secondary" className="w-fit gap-1 text-xs">
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="size-3 text-primary" />
                ) : (
                  <ArrowDownRight className="size-3 text-destructive" />
                )}
                {Math.abs(kpi.change)}%
              </Badge>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
