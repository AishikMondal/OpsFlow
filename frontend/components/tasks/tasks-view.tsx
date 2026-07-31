'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { listTasks, updateTask, type Task } from '@/lib/api'

const priorityVariant = {
  high: 'destructive',
  medium: 'outline',
  low: 'secondary',
} as const

export function TasksView() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    listTasks()
      .then((data) => setTasks(data.items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus as Task['status'] } : t)))
    try {
      await updateTask(id, { status: newStatus })
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: task.status } : t)))
    }
  }

  const open = tasks.filter((t) => t.status !== 'done')
  const done = tasks.filter((t) => t.status === 'done')

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Open Tasks</CardTitle>
          <CardDescription>{loading ? 'Loading…' : `${open.length} tasks need attention`}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {open.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
            >
              <Checkbox
                checked={false}
                onCheckedChange={() => toggle(task.id)}
                aria-label={`Mark ${task.title} as done`}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{task.title}</span>
                <span className="text-xs text-muted-foreground">Due {task.due}</span>
              </div>
              <Badge variant={priorityVariant[task.priority] || 'secondary'} className="capitalize">
                {task.priority}
              </Badge>
              <Avatar className="size-7">
                <AvatarFallback className="text-xs">
                  {task.assignee.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          ))}
          {!loading && open.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">All caught up!</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Completed</CardTitle>
          <CardDescription>{loading ? 'Loading…' : `${done.length} tasks finished`}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {done.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 opacity-60"
            >
              <Checkbox
                checked
                onCheckedChange={() => toggle(task.id)}
                aria-label={`Mark ${task.title} as not done`}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className={cn('truncate text-sm font-medium line-through')}>
                  {task.title}
                </span>
                <span className="text-xs text-muted-foreground">Done · was due {task.due}</span>
              </div>
              <Avatar className="size-7">
                <AvatarFallback className="text-xs">
                  {task.assignee.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
          {!loading && done.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No completed tasks yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
