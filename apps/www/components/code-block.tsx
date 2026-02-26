"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string
}

const languageLabels: Record<string, string> = {
  tsx: "TypeScript",
  ts: "TypeScript",
  jsx: "JavaScript",
  js: "JavaScript",
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  json: "JSON",
  css: "CSS",
  html: "HTML",
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

  const displayLanguage = language
    ? languageLabels[language] || language
    : null

  return (
    <figure className="group relative my-4 overflow-hidden rounded-lg border border-border">
      {displayLanguage && (
        <figcaption className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>{displayLanguage}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1.5 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </figcaption>
      )}
      {!displayLanguage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={copyToClipboard}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      )}
      <pre
        ref={preRef}
        className={cn(
          "no-scrollbar overflow-x-auto p-4 text-sm",
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
        "relative rounded-md bg-muted px-[0.3rem] py-[0.15rem] font-mono text-[0.85em] break-words",
        className
      )}
      {...props}
    />
  )
}
