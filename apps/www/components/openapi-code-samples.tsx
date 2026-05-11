"use client"

import * as React from "react"

import { CodeBlock } from "@/components/code-block"
import {
  type OpenApiMethod,
  type OpenApiSpec,
  resolveOpenApiMethodSamples,
} from "@/lib/openapi-code-samples"
import { cn } from "@/lib/utils"

interface OpenApiCodeSamplesProps {
  spec: OpenApiSpec
  method: OpenApiMethod
  endpoint: string
  className?: string
}

function getSampleLabel(index: number, label?: string) {
  if (label && label.trim()) {
    return label.trim()
  }

  return `Example ${index + 1}`
}

function getLanguageLabel(language: string) {
  if (language === "javascript") {
    return "TypeScript"
  }

  if (language === "python") {
    return "Python"
  }

  return language
}

export function OpenApiCodeSamples({
  spec,
  method,
  endpoint,
  className,
}: OpenApiCodeSamplesProps) {
  const result = resolveOpenApiMethodSamples({ spec, method, endpoint })

  if (!result.ok) {
    return (
      <div
        className={cn(
          "my-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm",
          className
        )}
      >
        <p className="mt-0 font-medium">Unable to load SDK snippets.</p>
        <p className="mt-1 text-muted-foreground">{result.error}</p>
      </div>
    )
  }

  const languages = Object.keys(result.data.samplesByLanguage)
  const [activeLanguage, setActiveLanguage] = React.useState(languages[0])
  const [activeSampleIndex, setActiveSampleIndex] = React.useState(0)

  const snippets = result.data.samplesByLanguage[activeLanguage] ?? []
  const activeSnippet = snippets[activeSampleIndex] ?? snippets[0]
  const hasMultipleSamples = snippets.length > 1

  React.useEffect(() => {
    setActiveSampleIndex(0)
  }, [activeLanguage])

  if (!activeSnippet) {
    return null
  }

  const languageSelector = (
    <label className="flex items-center gap-2">
      <span className="sr-only">SDK language</span>
      <select
        value={activeLanguage}
        onChange={(event) => setActiveLanguage(event.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
        aria-label="SDK language"
      >
        {languages.map((language) => (
          <option key={language} value={language}>
            {getLanguageLabel(language)}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div className={cn("my-6", className)}>
      {hasMultipleSamples && (
        <label className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Snippet</span>
          <select
            value={String(activeSampleIndex)}
            onChange={(event) => setActiveSampleIndex(Number(event.target.value))}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
            aria-label="Snippet variant"
          >
            {snippets.map((snippet, index) => (
              <option key={`${activeLanguage}-${index}`} value={String(index)}>
                {getSampleLabel(index, snippet.label)}
              </option>
            ))}
          </select>
        </label>
      )}

      <CodeBlock
        code={activeSnippet.source}
        language={activeLanguage === "javascript" ? "typescript" : activeLanguage}
        languageLabel={getLanguageLabel(activeLanguage)}
        languageControl={languageSelector}
      />
    </div>
  )
}

