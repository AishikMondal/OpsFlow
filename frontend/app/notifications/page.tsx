import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { NotificationsView } from '@/components/notifications/notifications-view'

export const metadata: Metadata = {
  title: 'Notifications — OpsFlow AI',
  description: 'Alerts, payments, inventory updates, and AI insights.',
}

export default function NotificationsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Everything that needs your attention, in one place."
      />
      <NotificationsView />
    </div>
  )
}
