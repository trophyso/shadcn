import rawCodeSamples from "@/lib/generated/openapi-code-samples.json"

export interface OpenApiCodeSample {
  label?: string
  source: string
}

export interface OpenApiMethodSamples {
  spec: string
  method: string
  path: string
  samplesByLanguage: Record<string, OpenApiCodeSample[]>
}

export interface OpenApiCodeSamplesIndex {
  [methodRef: string]: OpenApiMethodSamples
}

type MethodRefKey = keyof typeof rawCodeSamples

export type OpenApiSpec = MethodRefKey extends `${infer Spec} ${string} ${string}`
  ? Spec
  : never

export type OpenApiMethod =
  MethodRefKey extends `${string} ${infer Method} ${string}` ? Method : never

export interface OpenApiMethodRefParts {
  spec: OpenApiSpec
  method: OpenApiMethod
  endpoint: string
}

type ResolveResult =
  | { ok: true; data: OpenApiMethodSamples; key: string }
  | { ok: false; error: string; key?: string }

const openApiCodeSamplesIndex = rawCodeSamples as OpenApiCodeSamplesIndex

export function toOpenApiMethodRef({
  spec,
  method,
  endpoint,
}: OpenApiMethodRefParts) {
  if (!endpoint.startsWith("/")) {
    return {
      ok: false as const,
      error: `Invalid endpoint "${endpoint}". Expected a leading "/".`,
    }
  }

  return {
    ok: true as const,
    spec,
    method: method.toLowerCase() as OpenApiMethod,
    endpoint,
    key: `${spec} ${method.toLowerCase()} ${endpoint}`,
  }
}

export function resolveOpenApiMethodSamples(
  ref: OpenApiMethodRefParts
): ResolveResult {
  const parsed = toOpenApiMethodRef(ref)
  if (!parsed.ok) {
    return parsed
  }

  const data = openApiCodeSamplesIndex[parsed.key]
  if (!data) {
    return {
      ok: false,
      key: parsed.key,
      error: `No x-codeSamples found for "${parsed.key}".`,
    }
  }

  const languages = Object.keys(data.samplesByLanguage)
  if (languages.length === 0) {
    return {
      ok: false,
      key: parsed.key,
      error: `No language samples found for "${parsed.key}".`,
    }
  }

  return {
    ok: true,
    data,
    key: parsed.key,
  }
}

