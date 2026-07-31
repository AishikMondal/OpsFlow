'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, CloudUpload, FileImage, Loader2, RotateCcw, ScanLine, Sparkles, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { analyzeInvoice, ApiError, RESULT_STORAGE_KEY } from '@/lib/api'
import type { InvoiceResult } from '@/lib/mock-data'

type Stage = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

const processingSteps = [
  { label: 'Scanning document', icon: ScanLine },
  { label: 'Extracting line items', icon: FileImage },
  { label: 'Running AI validation', icon: Sparkles },
  { label: 'Finalizing results', icon: CheckCircle2 },
]

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function InvoiceUploader() {
  const router = useRouter()
  const [stage, setStage] = React.useState<Stage>('idle')
  const [progress, setProgress] = React.useState(0)
  const [activeStep, setActiveStep] = React.useState(0)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string>('')
  const [isDragging, setIsDragging] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Holds the real backend result once it arrives, independent of the
  // (purely cosmetic) step animation timing below.
  const analysisRef = React.useRef<{ result?: InvoiceResult; error?: string } | null>(null)

  // Revoke object URL on unmount to avoid memory leaks.
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFile = (file: File) => {
    if (!file) return

    if (!ALLOWED_MIME.has(file.type)) {
      setErrorMessage('Unsupported file type. Please upload a JPG, PNG, or WEBP image.')
      setStage('error')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 10 MB.')
      setStage('error')
      return
    }

    // Clear any previous result so the results page never shows stale data.
    sessionStorage.removeItem(RESULT_STORAGE_KEY)

    // Revoke previous preview URL to avoid memory leak.
    if (preview) URL.revokeObjectURL(preview)

    setFileName(file.name)
    setPreview(URL.createObjectURL(file))
    setStage('uploading')
    setProgress(0)
    setErrorMessage(null)
    analysisRef.current = null

    // Fire the real analysis request now; the UI's step animation below is
    // cosmetic and simply waits for this to resolve before advancing past
    // the final step.
    analyzeInvoice(file)
      .then((result) => {
        analysisRef.current = { result }
      })
      .catch((err) => {
        analysisRef.current = { error: err instanceof ApiError ? err.message : 'Something went wrong.' }
      })
  }

  // Upload progress bar (cosmetic — the real request already started above).
  React.useEffect(() => {
    if (stage !== 'uploading') return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setStage('processing')
          setActiveStep(0)
          return 100
        }
        return p + 8
      })
    }, 120)
    return () => clearInterval(interval)
  }, [stage])

  // Processing step animation — on the final step, wait for the real
  // backend result (polling the ref) instead of a fixed timeout.
  React.useEffect(() => {
    if (stage !== 'processing') return

    if (activeStep < processingSteps.length - 1) {
      const timeout = setTimeout(() => setActiveStep((s) => s + 1), 1100)
      return () => clearTimeout(timeout)
    }

    // On the last step, poll for the real analysis result.
    const poll = setInterval(() => {
      const outcome = analysisRef.current
      if (!outcome) return
      clearInterval(poll)

      if (outcome.error) {
        setErrorMessage(outcome.error)
        setStage('error')
        return
      }

      if (outcome.result) {
        sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(outcome.result))
        setStage('done')
        setTimeout(() => router.push('/invoices/results'), 700)
      }
    }, 150)

    return () => clearInterval(poll)
  }, [stage, activeStep, router])

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setStage('idle')
    setProgress(0)
    setActiveStep(0)
    setPreview(null)
    setFileName('')
    setErrorMessage(null)
    analysisRef.current = null
    // Reset the file input so the same file can be re-selected.
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Card>
      <CardContent>
        <AnimatePresence mode="wait">
          {stage === 'idle' && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files[0]
                  if (file) handleFile(file)
                }}
                className={cn(
                  'flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-16 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  isDragging && 'border-primary bg-primary/5',
                )}
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <CloudUpload className="size-6 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium">Drop your invoice here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, and WEBP up to 10 MB
                  </p>
                </div>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="sr-only"
                aria-label="Upload invoice file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </motion.div>
          )}

          {stage === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-10 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="size-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium">Analysis failed</p>
                <p className="mt-1 text-xs text-muted-foreground">{errorMessage}</p>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw data-icon="inline-start" />
                Try another file
              </Button>
            </motion.div>
          )}

          {(stage === 'uploading' || stage === 'processing' || stage === 'done') && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 py-4"
            >
              <div className="flex items-center gap-4">
                {preview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={preview}
                    alt="Invoice preview"
                    className="size-16 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-lg border border-border bg-secondary">
                    <FileImage className="size-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{fileName || 'invoice.jpg'}</p>
                    {stage === 'uploading' && (
                      <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Cancel upload">
                        <X />
                      </Button>
                    )}
                  </div>
                  {stage === 'uploading' ? (
                    <>
                      <Progress value={progress} />
                      <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
                    </>
                  ) : (
                    <p className="flex items-center gap-1.5 text-xs text-primary">
                      <CheckCircle2 className="size-3.5" />
                      Upload complete
                    </p>
                  )}
                </div>
              </div>

              {(stage === 'processing' || stage === 'done') && (
                <div className="flex flex-col gap-1">
                  {processingSteps.map((step, index) => {
                    const isDone = index < activeStep || stage === 'done'
                    const isActive = index === activeStep && stage === 'processing'
                    return (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                          isActive && 'bg-primary/5',
                        )}
                      >
                        <span
                          className={cn(
                            'flex size-7 items-center justify-center rounded-full border',
                            isDone
                              ? 'border-primary/40 bg-primary/10 text-primary'
                              : isActive
                                ? 'border-primary/40 text-primary'
                                : 'border-border text-muted-foreground',
                          )}
                        >
                          {isActive ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <step.icon className="size-3.5" />
                          )}
                        </span>
                        <span
                          className={cn(
                            'text-sm',
                            isDone || isActive ? 'text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {step.label}
                        </span>
                        {isDone && <CheckCircle2 className="ms-auto size-4 text-primary" />}
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {stage === 'done' && (
                <p className="text-center text-sm text-muted-foreground">
                  Processing complete — redirecting to results…
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
