'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Bell, Boxes, CreditCard, Server, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '@/lib/api'

const typeIcon = {
  alert: AlertTriangle,
  payment: CreditCard,
  inventory: Boxes,
  system: Server,
  ai: Sparkles,
} as const

export function NotificationsView() {
  const [items, setItems] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const unread = items.filter((n) => !n.read).length

  React.useEffect(() => {
    listNotifications()
      .then((data) => setItems(data.items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead()
    } catch {
      listNotifications().then((data) => setItems(data.items)).catch(() => {})
    }
  }

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await markNotificationRead(id)
    } catch {
      listNotifications().then((data) => setItems(data.items)).catch(() => {})
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4 text-primary" />
              Notification Center
              {unread > 0 && <Badge>{unread} unread</Badge>}
            </CardTitle>
            <CardDescription>Alerts, payments, inventory, and AI insights</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0 || loading}>
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading notifications…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No notifications.</p>
        ) : (
          items.map((n, i) => {
            const Icon = typeIcon[n.type] || Bell
            return (
              <motion.button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className={cn(
                  'relative flex items-start gap-3 border-s-2 px-4 py-4 text-start transition-colors hover:bg-secondary/40',
                  n.read ? 'border-border' : 'border-primary bg-primary/[0.03]',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border',
                    n.read
                      ? 'border-border text-muted-foreground'
                      : 'border-primary/40 bg-primary/10 text-primary',
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'truncate text-sm',
                        n.read ? 'text-muted-foreground' : 'font-medium text-foreground',
                      )}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{n.detail}</span>
                  <span className="text-xs text-muted-foreground/70">{n.time}</span>
                </span>
              </motion.button>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
