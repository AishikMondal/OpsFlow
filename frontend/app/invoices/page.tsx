import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { InvoiceUploader } from '@/components/invoices/invoice-uploader'

export const metadata: Metadata = {
  title: 'Invoice Upload — OpsFlow AI',
  description: 'Upload invoices for AI-powered extraction and validation.',
}

export default function InvoicesPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Invoice Upload"
        description="Drop an invoice and let AI extract vendors, totals, taxes, and line items."
      />
      <InvoiceUploader />
    </div>
  )
}
