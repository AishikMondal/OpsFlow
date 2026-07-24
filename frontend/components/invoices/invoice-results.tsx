"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  FileTextIcon,
  FlagIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { invoiceResult, formatCurrency, type InvoiceResult as InvoiceResultType } from "@/lib/mock-data"
import { RESULT_STORAGE_KEY } from "@/lib/api"

const riskVariant = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
} as const

export function InvoiceResults() {
  const [result, setResult] = React.useState<InvoiceResultType>(invoiceResult)
  const [isLive, setIsLive] = React.useState(false)

  // If a real analysis was just run (see invoice-uploader.tsx), use it.
  // Otherwise fall back to the demo mock data so this page always renders.
  React.useEffect(() => {
    const stored = sessionStorage.getItem(RESULT_STORAGE_KEY)
    if (stored) {
      try {
        setResult(JSON.parse(stored))
        setIsLive(true)
      } catch {
        // ignore malformed storage, keep mock data
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
            <FileTextIcon className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {result.vendor}
            </h2>
            <p className="text-sm text-muted-foreground">
              Invoice {result.invoiceNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="secondary" className="gap-1">
              <SparklesIcon className="size-3.5" />
              Live Gemma 4 result
            </Badge>
          )}
          <Badge variant={riskVariant[result.risk]} className="capitalize">
            <FlagIcon data-icon="inline-start" />
            {result.risk} risk
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <CalendarIcon className="size-3.5" />
              Invoice Date
            </CardDescription>
            <CardTitle className="text-lg">{result.invoiceDate}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardDescription>Tax</CardDescription>
            <CardTitle className="text-lg">
              {formatCurrency(result.tax)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardDescription>GST</CardDescription>
            <CardTitle className="text-lg">
              {formatCurrency(result.gst)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-lg text-primary">
              {formatCurrency(result.total)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheckIcon className="size-4 text-primary" />
            Extraction Confidence
          </CardTitle>
          <CardDescription>
            AI confidence score for the extracted fields
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Progress value={result.confidence} className="flex-1" />
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {result.confidence}%
          </span>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Line Items</CardTitle>
          <CardDescription>
            {result.lineItems.length} items extracted from the invoice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.lineItems.map((item) => (
                <TableRow key={item.description}>
                  <TableCell className="font-medium">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {result.recommendedActions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="size-4 text-primary" />
                  {action.title}
                </CardTitle>
                <CardDescription>{action.detail}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  Take action
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
