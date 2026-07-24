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
import { notifications as initialNotifications, type Notification } from '@/lib/mock-data'

const typeIcon = {
  alert: AlertTriangle,
  payment: CreditCard,
  inventory: Boxes,
  system: Server,
  ai: Sparkles,
} as const

export function NotificationsView() {
  const [items, setItems] = React.useState<Notification[]>(initialNotifications)
  const unread = items.filter((n) => !n.read).length

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
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
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {items.map((n, i) => {
          const Icon = typeIcon[n.type]
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
        })}
      </CardContent>
    </Card>
  )
}
