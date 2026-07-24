import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { InventoryView } from '@/components/inventory/inventory-view'

export const metadata: Metadata = {
  title: 'Inventory — OpsFlow AI',
  description: 'Track products, stock levels, suppliers, and categories.',
}

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory"
        description="Track products, stock levels, suppliers, and categories."
      />
      <InventoryView />
    </div>
  )
}
