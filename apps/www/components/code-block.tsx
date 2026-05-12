"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { highlight } from "@/lib/highlight"
import { cn } from "@/lib/utils"
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
  languageLabel?: string
  languageControl?: React.ReactNode
  "data-language"?: string
  children?: React.ReactNode
}

export function CodeBlock({
  children,
  code,
  language,
  languageLabel,
  languageControl,
  className,
  "data-language": dataLanguage,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [highlighted, setHighlighted] = React.useState<React.JSX.Element>()

  const lang = language || dataLanguage
  const codeText = code || extractTextContent(children)
  const displayLanguage =
    languageLabel || (lang ? languageLabels[lang] || lang : null)

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
        "group border-border relative my-4 overflow-hidden rounded-lg border",
        className
      )}
      {...props}
    >
      {displayLanguage && (
        <figcaption className="bg-muted/50 text-muted-foreground flex items-center justify-between px-4 py-2 text-xs font-medium">
          {languageControl ?? <span>{displayLanguage}</span>}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1.5 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="text-success h-3 w-3" />
                <span className="text-success">Copied</span>
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
          className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={copyToClipboard}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <Check className="text-success h-3.5 w-3.5" />
          ) : (
            <Copy className="text-muted-foreground h-3.5 w-3.5" />
          )}
        </Button>
      )}
      <div className="bg-muted/30 px-4 py-2 [&_pre]:p-0">
        {code ? (
          (highlighted ?? (
            <pre
              className="overflow-x-auto p-4"
              style={{ margin: 0, background: "transparent" }}
            >
              <code className="font-mono text-sm leading-relaxed">{code}</code>
            </pre>
          ))
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
        "bg-muted relative rounded-md px-[0.3rem] py-[0.15rem] font-mono text-[0.85em] break-words",
        className
      )}
      {...props}
    />
  )
}
