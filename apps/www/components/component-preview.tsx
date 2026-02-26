"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

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
        "border-border bg-background my-6 overflow-hidden rounded-lg border",
        className
      )}
      {...props}
    >
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-2">
          <Button
            variant={view === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("preview")}
            className="h-7 text-xs"
          >
            Preview
          </Button>
          {code && (
            <Button
              variant={view === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("code")}
              className="h-7 text-xs"
            >
              Code
            </Button>
          )}
        </div>
        {code && view === "code" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="text-muted-foreground h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      {view === "preview" ? (
        <div className="bg-background flex min-h-[200px] items-center justify-center p-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        </div>
      ) : (
        <pre className="bg-muted no-scrollbar overflow-x-auto p-4 text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
