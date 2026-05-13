"use client"

import * as React from "react"

import {
  resolveOpenApiMethodSamples,
  type OpenApiMethod,
  type OpenApiSpec,
} from "@/lib/openapi-code-samples"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"

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
  const initialLanguage = result.ok
    ? Object.keys(result.data.samplesByLanguage)[0]
    : undefined
  const [activeLanguage, setActiveLanguage] = React.useState(initialLanguage)
  const [activeSampleIndex, setActiveSampleIndex] = React.useState(0)

  React.useEffect(() => {
    setActiveSampleIndex(0)
  }, [activeLanguage])

  if (!result.ok) {
    return (
      <div
        className={cn(
          "border-destructive/30 bg-destructive/5 my-6 rounded-lg border px-4 py-3 text-sm",
          className
        )}
      >
        <p className="mt-0 font-medium">Unable to load SDK snippets.</p>
        <p className="text-muted-foreground mt-1">{result.error}</p>
      </div>
    )
  }

  const languages = Object.keys(result.data.samplesByLanguage)
  const currentLanguage = activeLanguage ?? languages[0]
  const snippets = result.data.samplesByLanguage[currentLanguage] ?? []
  const activeSnippet = snippets[activeSampleIndex] ?? snippets[0]
  const hasMultipleSamples = snippets.length > 1

  if (!activeSnippet) {
    return null
  }

  const languageSelector = (
    <label className="flex min-w-0 items-center gap-2">
      <span className="sr-only">SDK language</span>
      <select
        value={currentLanguage}
        onChange={(event) => setActiveLanguage(event.target.value)}
        className="border-border bg-background text-foreground min-w-0 max-w-full rounded border px-2 py-1 text-xs"
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
        <label className="text-muted-foreground mb-2 flex min-w-0 items-center gap-2 text-xs">
          <span className="shrink-0">Snippet</span>
          <select
            value={String(activeSampleIndex)}
            onChange={(event) =>
              setActiveSampleIndex(Number(event.target.value))
            }
            className="border-border bg-background text-foreground min-w-0 max-w-full rounded border px-2 py-1 text-xs"
            aria-label="Snippet variant"
          >
            {snippets.map((snippet, index) => (
              <option key={`${currentLanguage}-${index}`} value={String(index)}>
                {getSampleLabel(index, snippet.label)}
              </option>
            ))}
          </select>
        </label>
      )}

      <CodeBlock
        code={activeSnippet.source}
        language={
          currentLanguage === "javascript" ? "typescript" : currentLanguage
        }
        languageLabel={getLanguageLabel(currentLanguage)}
        languageControl={languageSelector}
      />
    </div>
  )
}
