import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { AiAssistant } from '@/components/ai-assistant'

export const metadata: Metadata = {
  title: 'AI Assistant — OpsFlow AI',
  description: 'Chat with your AI business assistant for insights and actions.',
}

export const dynamic = 'force-dynamic'

export default function AssistantPage() {
  return (
    <div className="mx-auto flex h-[calc(100svh-8rem)] w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="AI Assistant"
        description="Ask about cashflow, invoices, inventory, and revenue trends."
      />
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card/50">
        <AiAssistant showInsights={false} />
      </div>
    </div>
  )
}
