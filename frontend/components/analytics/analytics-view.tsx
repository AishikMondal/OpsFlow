'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
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
import { Progress } from '@/components/ui/progress'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CashflowChart } from '@/components/dashboard/cashflow-chart'
import { expenseBreakdown, inventoryTrend, revenueSeries } from '@/lib/mock-data'

const expenseConfig = {
  amount: { label: 'Amount', color: 'var(--chart-2)' },
} satisfies ChartConfig

const inventoryConfig = {
  stock: { label: 'Stock', color: 'var(--chart-1)' },
  sold: { label: 'Sold', color: 'var(--chart-3)' },
} satisfies ChartConfig

const profitConfig = {
  profit: { label: 'Profit', color: 'var(--chart-1)' },
} satisfies ChartConfig

const healthMetrics = [
  { label: 'Cash Position', score: 88 },
  { label: 'Receivables Health', score: 72 },
  { label: 'Inventory Efficiency', score: 81 },
  { label: 'Expense Control', score: 90 },
]

export function AnalyticsView() {
  const overallHealth = Math.round(
    healthMetrics.reduce((sum, m) => sum + m.score, 0) / healthMetrics.length,
  )

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" />
              Business Health Score
            </CardTitle>
            <CardDescription>
              Composite score across cash, receivables, inventory, and expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-semibold tabular-nums text-primary">
                {overallHealth}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {healthMetrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-medium tabular-nums">{m.score}</span>
                  </div>
                  <Progress value={m.score} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <Card>
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
            <CardDescription>Monthly profit over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={profitConfig} className="h-64 w-full">
              <LineChart data={revenueSeries} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  width={44}
                  tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Line
                  dataKey="profit"
                  type="monotone"
                  stroke="var(--color-profit)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Where money went this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={expenseConfig} className="h-64 w-full">
              <BarChart data={expenseBreakdown} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  width={44}
                  tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Trends</CardTitle>
            <CardDescription>Stock held vs units sold per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={inventoryConfig} className="h-64 w-full">
              <BarChart data={inventoryTrend} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={4} width={44} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="stock" fill="var(--color-stock)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sold" fill="var(--color-sold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <CashflowChart />
    </div>
  )
}
