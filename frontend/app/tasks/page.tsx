import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { TasksView } from '@/components/tasks/tasks-view'

export const metadata: Metadata = {
  title: 'Tasks — OpsFlow AI',
  description: 'Track and complete operational tasks.',
}

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="Track and complete operational to-dos across your team."
      />
      <TasksView />
    </div>
  )
}
