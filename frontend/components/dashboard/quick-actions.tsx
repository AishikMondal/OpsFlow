'use client'

import Link from 'next/link'
import { FileUp, PackagePlus, FileBarChart, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const actions = [
  { label: 'Upload Invoice', href: '/invoices', icon: FileUp },
  { label: 'Add Product', href: '/inventory', icon: PackagePlus },
  { label: 'Generate Report', href: '/reports', icon: FileBarChart },
  { label: 'Ask AI', href: '/assistant', icon: Sparkles },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common workflows, one click away</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            render={<Link href={action.href} />}
          >
            <action.icon className="size-5 text-primary" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
