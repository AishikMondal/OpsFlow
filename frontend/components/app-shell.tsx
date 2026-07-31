'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search, Sparkles } from 'lucide-react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AppSidebar } from '@/components/app-sidebar'
import { AiAssistant } from '@/components/ai-assistant'
import { listNotifications } from '@/lib/api'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/invoices': 'Invoice Upload',
  '/invoices/results': 'Invoice Results',
  '/inventory': 'Inventory',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/tasks': 'Tasks',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/assistant': 'AI Assistant',
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'OpsFlow AI'
  const [unread, setUnread] = React.useState(0)

  React.useEffect(() => {
    listNotifications()
      .then((data) => setUnread(data.items.filter((n) => !n.read).length))
      .catch(() => {})
  }, [])

  return (
    <>
      <div aria-hidden="true" className="aurora-scene">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div aria-hidden="true" className="spatial-grid" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="glass sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ms-1" />
            <Separator orientation="vertical" className="me-1 data-[orientation=vertical]:h-4" />
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="ms-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search…" className="h-8 w-52 ps-8 text-sm" aria-label="Search" />
              </div>
              <Button variant="ghost" size="icon-sm" className="relative" nativeButton={false} render={<Link href="/notifications" />}>
                <Bell />
                {unread > 0 && (
                  <span className="absolute end-1 top-1 size-2 rounded-full bg-primary" aria-hidden="true" />
                )}
                <span className="sr-only">Notifications ({unread} unread)</span>
              </Button>
              <Sheet>
                <SheetTrigger render={<Button variant="outline" size="sm" />}>
                  <Sparkles data-icon="inline-start" />
                  <span className="hidden sm:inline">Ask AI</span>
                </SheetTrigger>
                <SheetContent side="right" className="relative w-full gap-0 overflow-hidden p-0 sm:max-w-md">
                  <div aria-hidden="true" className="ai-orb" />
                  <div aria-hidden="true" className="ai-sheen" />
                  <SheetHeader className="shrink-0 border-b border-border">
                    <SheetTitle className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      OpsFlow Assistant
                    </SheetTitle>
                    <SheetDescription>AI-powered insights from your business data</SheetDescription>
                  </SheetHeader>
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <AiAssistant showInsights={false} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
