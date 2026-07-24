import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { AnalyticsView } from '@/components/analytics/analytics-view'

export const metadata: Metadata = {
  title: 'Analytics — OpsFlow AI',
  description: 'Revenue, expenses, profit, inventory trends, and business health.',
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Deep dive into revenue, expenses, profit, and business health."
      />
      <AnalyticsView />
    </div>
  )
}
