import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

import { parse } from "yaml"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OPENAPI_DIR = path.join(__dirname, "../openapi")
const OUTPUT_PATH = path.join(
  __dirname,
  "../lib/generated/openapi-code-samples.json"
)

const SPEC_FILES = ["admin.yml", "application.yml"] as const
const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const

interface RawCodeSample {
  lang?: unknown
  label?: unknown
  source?: unknown
}

interface RawOperation {
  "x-codeSamples"?: unknown
}

interface OpenApiMethodSamples {
  spec: string
  method: string
  path: string
  samplesByLanguage: Record<string, { label?: string; source: string }[]>
}

function parseCodeSamples(value: unknown): RawCodeSample[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((sample): sample is RawCodeSample => {
    return (
      typeof sample === "object" &&
      sample !== null &&
      "lang" in sample &&
      "source" in sample
    )
  })
}

function normalizeOperationSamples(
  spec: string,
  method: string,
  endpointPath: string,
  operation: RawOperation
): OpenApiMethodSamples | null {
  const codeSamples = parseCodeSamples(operation["x-codeSamples"])
  if (codeSamples.length === 0) {
    return null
  }

  const samplesByLanguage: Record<string, { label?: string; source: string }[]> = {}

  for (const sample of codeSamples) {
    if (typeof sample.lang !== "string" || typeof sample.source !== "string") {
      continue
    }

    const language = sample.lang.trim().toLowerCase()
    if (!language) {
      continue
    }

    if (!samplesByLanguage[language]) {
      samplesByLanguage[language] = []
    }

    samplesByLanguage[language].push({
      ...(typeof sample.label === "string" && sample.label.trim()
        ? { label: sample.label.trim() }
        : {}),
      source: sample.source,
    })
  }

  if (Object.keys(samplesByLanguage).length === 0) {
    return null
  }

  return {
    spec,
    method,
    path: endpointPath,
    samplesByLanguage,
  }
}

function readSpec(specFile: (typeof SPEC_FILES)[number]) {
  const specPath = path.join(OPENAPI_DIR, specFile)
  const raw = fs.readFileSync(specPath, "utf8")
  return parse(raw) as {
    paths?: Record<string, Partial<Record<(typeof HTTP_METHODS)[number], RawOperation>>>
  }
}

async function buildOpenApiCodeSamples() {
  const entries: Record<string, OpenApiMethodSamples> = {}
  let sampleCount = 0

  for (const specFile of SPEC_FILES) {
    const document = readSpec(specFile)
    const paths = document.paths ?? {}

    for (const [endpointPath, pathItem] of Object.entries(paths)) {
      for (const method of HTTP_METHODS) {
        const operation = pathItem[method]
        if (!operation) {
          continue
        }

        const normalized = normalizeOperationSamples(
          specFile,
          method,
          endpointPath,
          operation
        )

        if (!normalized) {
          continue
        }

        const key = `${specFile} ${method} ${endpointPath}`
        entries[key] = normalized
        sampleCount += Object.values(normalized.samplesByLanguage).reduce(
          (total, snippets) => total + snippets.length,
          0
        )
      }
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2) + "\n")

  console.log(
    `Built OpenAPI code sample index: ${Object.keys(entries).length} operations, ${sampleCount} snippets.`
  )
  console.log(`  ✓ ${path.relative(path.join(__dirname, ".."), OUTPUT_PATH)}`)
}

void buildOpenApiCodeSamples().catch((error) => {
  console.error(error)
  process.exit(1)
})
