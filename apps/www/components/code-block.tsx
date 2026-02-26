"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { highlight } from "@/lib/highlight"
import { Button } from "@/registry/trophy/ui/button"

const languageLabels: Record<string, string> = {
  tsx: "TypeScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "JavaScript",
  js: "JavaScript",
  javascript: "JavaScript",
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  json: "JSON",
  css: "CSS",
}

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractTextContent).join("")
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    if (props.children) return extractTextContent(props.children)
  }
  return ""
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  code?: string
  language?: string
  "data-language"?: string
  children?: React.ReactNode
}

export function CodeBlock({
  children,
  code,
  language,
  className,
  "data-language": dataLanguage,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [highlighted, setHighlighted] = React.useState<React.JSX.Element>()

  const lang = language || dataLanguage
  const codeText = code || extractTextContent(children)
  const displayLanguage = lang ? languageLabels[lang] || lang : null

  React.useEffect(() => {
    if (code) {
      void highlight(code, (lang || "tsx") as any).then(setHighlighted)
    }
  }, [code, lang])

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [codeText])

  return (
    <figure
      className={cn(
        "group relative my-4 overflow-hidden rounded-lg border border-border",
        className
      )}
      {...props}
    >
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
      <div className="bg-muted/30 px-4 py-2 [&_pre]:p-0">
        {code ? (
          highlighted ?? (
            <pre
              className="overflow-x-auto p-4"
              style={{ margin: 0, background: "transparent" }}
            >
              <code className="font-mono text-sm leading-relaxed">
                {code}
              </code>
            </pre>
          )
        ) : (
          <pre
            className="overflow-x-auto p-4"
            style={{ margin: 0, background: "transparent" }}
          >
            {children}
          </pre>
        )}
      </div>
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
