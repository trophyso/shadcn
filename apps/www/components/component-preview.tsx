"use client"

import * as React from "react"

import { getExampleCode } from "@/components/component-examples"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/registry/trophy/ui/button"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  children: React.ReactNode
  code?: string
  showPreviewCard?: boolean
}

export function ComponentPreview({
  name,
  children,
  code,
  showPreviewCard = true,
  className,
  ...props
}: ComponentPreviewProps) {
  const [view, setView] = React.useState<"preview" | "code">("preview")
  const displayCode = getExampleCode(name) ?? code

  return (
    <div
      className={cn(
        "border-border bg-background my-6 overflow-hidden rounded-lg border",
        className
      )}
      {...props}
    >
      <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-1">
          <Button
            variant={view === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("preview")}
            className="h-7 px-2.5 text-xs"
          >
            Preview
          </Button>
          {displayCode && (
            <Button
              variant={view === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("code")}
              className="h-7 px-2.5 text-xs"
            >
              Code
            </Button>
          )}
        </div>
      </div>

      {view === "preview" ? (
        <div className="flex min-h-[200px] items-center justify-center bg-[repeating-linear-gradient(45deg,var(--muted)_0,var(--muted)_1px,transparent_0,transparent_50%)] bg-[size:8px_8px] p-8">
          {showPreviewCard ? (
            <div className="bg-background flex flex-wrap items-center justify-center gap-4 rounded-lg p-6 shadow-sm">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      ) : (
        <CodeBlock
          code={displayCode}
          language="tsx"
          className="my-0 rounded-none border-0"
        />
      )}
    </div>
  )
}
