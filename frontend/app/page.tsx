import { KpiCards } from '@/components/dashboard/kpi-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CashflowChart } from '@/components/dashboard/cashflow-chart'
import { RiskAlerts } from '@/components/dashboard/risk-alerts'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { TodaySummary } from '@/components/dashboard/today-summary'
import { FadeIn } from '@/components/motion-fade'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <FadeIn>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Good morning, Alex</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening at Rivera Trading Co. today.
          </p>
        </div>
      </FadeIn>

      <KpiCards />

      <FadeIn delay={0.1}>
        <TodaySummary />
      </FadeIn>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <FadeIn delay={0.15}>
          <RevenueChart />
        </FadeIn>
        <FadeIn delay={0.2}>
          <CashflowChart />
        </FadeIn>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <FadeIn delay={0.25} className="lg:col-span-1">
          <RiskAlerts />
        </FadeIn>
        <FadeIn delay={0.3} className="lg:col-span-1">
          <ActivityTimeline />
        </FadeIn>
        <FadeIn delay={0.35} className="lg:col-span-1">
          <QuickActions />
        </FadeIn>
      </div>
    </div>
  )
}
