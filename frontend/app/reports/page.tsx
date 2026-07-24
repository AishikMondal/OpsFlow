import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ReportsView } from '@/components/reports/reports-view'

export const metadata: Metadata = {
  title: 'Reports — OpsFlow AI',
  description: 'Generated financial, inventory, and operations reports.',
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Download and review generated business reports."
      />
      <ReportsView />
    </div>
  )
}
