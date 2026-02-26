"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string
}

export function CodeBlock({
  children,
  className,
  "data-language": language,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const preRef = React.useRef<HTMLPreElement>(null)

  const copyToClipboard = React.useCallback(() => {
    if (!preRef.current) return

    const code = preRef.current.textContent || ""
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <figure className="group relative my-4">
      {language && (
        <figcaption className="bg-secondary text-muted-foreground border-border flex items-center justify-between rounded-t-lg border-b px-4 py-2 text-xs font-medium">
          <span>{language}</span>
        </figcaption>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={copyToClipboard}
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="text-muted-foreground h-3.5 w-3.5" />
        )}
      </Button>
      <pre
        ref={preRef}
        className={cn(
          "no-scrollbar overflow-x-auto rounded-lg p-4 text-sm",
          language && "rounded-t-none",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </figure>
  )
}

export function InlineCode({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded-md px-[0.3rem] py-[0.15rem] font-mono text-[0.85em] break-words",
        className
      )}
      {...props}
    />
  )
}
