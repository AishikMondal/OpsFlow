'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { getCashflowSeries, type CashflowSeriesItem } from '@/lib/api'

const chartConfig = {
  inflow: { label: 'Inflow', color: 'var(--chart-1)' },
  outflow: { label: 'Outflow', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function CashflowChart() {
  const [data, setData] = React.useState<CashflowSeriesItem[]>([])

  React.useEffect(() => {
    getCashflowSeries().then((d) => setData(d.items)).catch(() => {})
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
        <CardDescription>Weekly inflow vs outflow, last 6 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="inflow" fill="var(--color-inflow)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" fill="var(--color-outflow)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
