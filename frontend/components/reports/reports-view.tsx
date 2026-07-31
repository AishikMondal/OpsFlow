'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { listReports, type Report } from '@/lib/api'

export function ReportsView() {
  const [reports, setReports] = React.useState<Report[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    listReports()
      .then((data) => setReports(data.items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Loading reports…</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report, i) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary">
                  <FileText className="size-4 text-primary" />
                </div>
                <Badge variant="outline">{report.type}</Badge>
              </div>
              <CardTitle className="text-sm">{report.name}</CardTitle>
              <CardDescription>
                {report.period} · Generated {report.generated}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast(`Downloading ${report.name}…`)}
              >
                <Download data-icon="inline-start" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
