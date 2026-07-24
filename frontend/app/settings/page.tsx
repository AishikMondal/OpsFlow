import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = {
  title: 'Settings — OpsFlow AI',
  description: 'Company profile, preferences, and notification settings.',
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your company profile and workspace preferences."
      />
      <SettingsView />
    </div>
  )
}
