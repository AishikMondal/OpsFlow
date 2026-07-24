import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { InvoiceResults } from '@/components/invoices/invoice-results'

export const metadata: Metadata = {
  title: 'Invoice Results — OpsFlow AI',
  description: 'AI-extracted invoice details, confidence score, and recommended actions.',
}

export default function InvoiceResultsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Extraction Results"
        description="Review the AI-extracted data and take the recommended next steps."
      />
      <InvoiceResults />
    </div>
  )
}
