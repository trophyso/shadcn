"use client"

import * as React from "react"
import { Code2, Eye } from "lucide-react"

import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/registry/trophy/ui/button"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  children: React.ReactNode
  code?: string
}

export function ComponentPreview({
  children,
  code,
  className,
  ...props
}: ComponentPreviewProps) {
  const [view, setView] = React.useState<"preview" | "code">("preview")

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
      </div>

      {view === "preview" ? (
        <div className="flex min-h-[200px] items-center justify-center bg-[repeating-linear-gradient(45deg,var(--muted)_0,var(--muted)_1px,transparent_0,transparent_50%)] bg-[size:8px_8px] p-8">
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg bg-background p-6 shadow-sm">
            {children}
          </div>
        </div>
      ) : (
        <CodeBlock
          code={code}
          language="tsx"
          className="my-0 rounded-none border-0"
        />
      )}
    </div>
  )
}
