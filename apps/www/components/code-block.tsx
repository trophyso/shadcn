"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript"
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"

SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("tsx", typescript)
SyntaxHighlighter.registerLanguage("ts", typescript)
SyntaxHighlighter.registerLanguage("javascript", javascript)
SyntaxHighlighter.registerLanguage("jsx", javascript)
SyntaxHighlighter.registerLanguage("js", javascript)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("sh", bash)
SyntaxHighlighter.registerLanguage("shell", bash)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("css", css)

const syntaxTheme: { [key: string]: React.CSSProperties } = {
  "hljs": {
    display: "block",
    overflowX: "auto",
    padding: "1rem",
    background: "transparent",
  },
  "hljs-keyword": {
    color: "#cf222e",
  },
  "hljs-built_in": {
    color: "#8250df",
  },
  "hljs-type": {
    color: "#953800",
  },
  "hljs-literal": {
    color: "#0550ae",
  },
  "hljs-number": {
    color: "#0550ae",
  },
  "hljs-string": {
    color: "#0a3069",
  },
  "hljs-title": {
    color: "#8250df",
  },
  "hljs-name": {
    color: "#116329",
  },
  "hljs-attr": {
    color: "#0550ae",
  },
  "hljs-attribute": {
    color: "#0550ae",
  },
  "hljs-variable": {
    color: "#953800",
  },
  "hljs-params": {
    color: "#24292f",
  },
  "hljs-comment": {
    color: "#6e7781",
    fontStyle: "italic",
  },
  "hljs-doctag": {
    color: "#cf222e",
  },
  "hljs-meta": {
    color: "#8250df",
  },
  "hljs-section": {
    color: "#0550ae",
    fontWeight: "bold",
  },
  "hljs-tag": {
    color: "#116329",
  },
  "hljs-selector-id": {
    color: "#0550ae",
  },
  "hljs-selector-class": {
    color: "#6639ba",
  },
  "hljs-selector-attr": {
    color: "#0550ae",
  },
  "hljs-selector-pseudo": {
    color: "#8250df",
  },
  "hljs-addition": {
    color: "#116329",
    backgroundColor: "#dafbe1",
  },
  "hljs-deletion": {
    color: "#82071e",
    backgroundColor: "#ffebe9",
  },
  "hljs-symbol": {
    color: "#0550ae",
  },
  "hljs-bullet": {
    color: "#953800",
  },
  "hljs-subst": {
    color: "#24292f",
  },
  "hljs-regexp": {
    color: "#0a3069",
  },
  "hljs-property": {
    color: "#0550ae",
  },
  "hljs-function": {
    color: "#8250df",
  },
  "hljs-class": {
    color: "#953800",
  },
}

const darkSyntaxTheme: { [key: string]: React.CSSProperties } = {
  "hljs": {
    display: "block",
    overflowX: "auto",
    padding: "1rem",
    background: "transparent",
  },
  "hljs-keyword": {
    color: "#ff7b72",
  },
  "hljs-built_in": {
    color: "#d2a8ff",
  },
  "hljs-type": {
    color: "#ffa657",
  },
  "hljs-literal": {
    color: "#79c0ff",
  },
  "hljs-number": {
    color: "#79c0ff",
  },
  "hljs-string": {
    color: "#a5d6ff",
  },
  "hljs-title": {
    color: "#d2a8ff",
  },
  "hljs-name": {
    color: "#7ee787",
  },
  "hljs-attr": {
    color: "#79c0ff",
  },
  "hljs-attribute": {
    color: "#79c0ff",
  },
  "hljs-variable": {
    color: "#ffa657",
  },
  "hljs-params": {
    color: "#c9d1d9",
  },
  "hljs-comment": {
    color: "#8b949e",
    fontStyle: "italic",
  },
  "hljs-doctag": {
    color: "#ff7b72",
  },
  "hljs-meta": {
    color: "#d2a8ff",
  },
  "hljs-section": {
    color: "#79c0ff",
    fontWeight: "bold",
  },
  "hljs-tag": {
    color: "#7ee787",
  },
  "hljs-selector-id": {
    color: "#79c0ff",
  },
  "hljs-selector-class": {
    color: "#d2a8ff",
  },
  "hljs-selector-attr": {
    color: "#79c0ff",
  },
  "hljs-selector-pseudo": {
    color: "#d2a8ff",
  },
  "hljs-addition": {
    color: "#aff5b4",
    backgroundColor: "#033a16",
  },
  "hljs-deletion": {
    color: "#ffdcd7",
    backgroundColor: "#67060c",
  },
  "hljs-symbol": {
    color: "#79c0ff",
  },
  "hljs-bullet": {
    color: "#ffa657",
  },
  "hljs-subst": {
    color: "#c9d1d9",
  },
  "hljs-regexp": {
    color: "#a5d6ff",
  },
  "hljs-property": {
    color: "#79c0ff",
  },
  "hljs-function": {
    color: "#d2a8ff",
  },
  "hljs-class": {
    color: "#ffa657",
  },
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  "data-language"?: string
  children?: React.ReactNode
}

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

function extractTextContent(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(extractTextContent).join("")
  }
  if (React.isValidElement(children) && children.props?.children) {
    return extractTextContent(children.props.children)
  }
  return ""
}

export function CodeBlock({
  children,
  className,
  "data-language": language,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const codeContent = extractTextContent(children)

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(codeContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [codeContent])

  const displayLanguage = language
    ? languageLabels[language] || language
    : null

  const highlightLanguage = language || "typescript"

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
      <div className="bg-muted/30">
        <SyntaxHighlighter
          language={highlightLanguage}
          style={isDark ? darkSyntaxTheme : syntaxTheme}
          customStyle={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
        >
          {codeContent.trim()}
        </SyntaxHighlighter>
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
