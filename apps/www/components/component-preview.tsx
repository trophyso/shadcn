"use client"

import * as React from "react"
import { Check, Code2, Copy, Eye } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  children: React.ReactNode
  code?: string
}

export function ComponentPreview({
  name,
  children,
  code,
  className,
  ...props
}: ComponentPreviewProps) {
  const [copied, setCopied] = React.useState(false)
  const [view, setView] = React.useState<"preview" | "code">("preview")

  const copyToClipboard = React.useCallback(() => {
    if (!code) return

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-border bg-background",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex gap-1">
          <Button
            variant={view === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("preview")}
            className="h-7 gap-1.5 px-2.5 text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
          {code && (
            <Button
              variant={view === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("code")}
              className="h-7 gap-1.5 px-2.5 text-xs"
            >
              <Code2 className="h-3.5 w-3.5" />
              Code
            </Button>
          )}
        </div>
        {code && view === "code" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        )}
      </div>

      {view === "preview" ? (
        <div className="flex min-h-[200px] items-center justify-center bg-[repeating-linear-gradient(45deg,var(--muted)_0,var(--muted)_1px,transparent_0,transparent_50%)] bg-[size:8px_8px] p-8">
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg bg-background p-6 shadow-sm">
            {children}
          </div>
        </div>
      ) : (
        <pre className="no-scrollbar overflow-x-auto bg-muted/50 p-4 text-sm">
          <code className="text-foreground">{code}</code>
        </pre>
      )}
    </div>
  )
}
