const PROFOUND_CUSTOM_LOGS_ENDPOINT =
  "https://artemis.api.tryprofound.com/v1/logs/custom"
const MAX_BATCH_SIZE = 1000

type QueryParams = Record<string, string>

export type ProFoundCustomLogEntry = {
  timestamp: string | number
  method: string
  host: string
  path: string
  status_code: number
  ip: string
  user_agent: string
  query_params?: QueryParams
  referer?: string
  bytes_sent?: number
  duration_ms?: number
}

type ProfoundSendOptions = {
  apiKey?: string
  enabled?: boolean
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 1200

type ProcessEnv = Record<string, string | undefined>

function getProcessEnv(): ProcessEnv | undefined {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: ProcessEnv }
  }
  return globalWithProcess.process?.env
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return value.slice(0, maxLength)
}

function toIsoTimestamp(value: string | number): string | number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null
    return value
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function sanitizeQueryParams(
  value: ProFoundCustomLogEntry["query_params"]
): QueryParams | undefined {
  if (!value || typeof value !== "object") return undefined

  const entries = Object.entries(value)
    .slice(0, 50)
    .map(([key, val]) => [
      truncate(String(key), 100),
      truncate(String(val), 1000),
    ])

  if (entries.length === 0) return undefined
  return Object.fromEntries(entries)
}

export function sanitizeCustomLogEntry(
  entry: ProFoundCustomLogEntry
): ProFoundCustomLogEntry | null {
  const timestamp = toIsoTimestamp(entry.timestamp)
  if (!timestamp) return null

  const statusCode = Number(entry.status_code)
  if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) {
    return null
  }

  const method = truncate(String(entry.method || ""), 10)
  const host = truncate(String(entry.host || ""), 255)
  const path = truncate(String(entry.path || ""), 2048)
  const ip = truncate(String(entry.ip || ""), 45)
  const userAgent = truncate(String(entry.user_agent || ""), 1024)

  if (!method || !host || !path || !ip || !userAgent) return null

  const sanitized: ProFoundCustomLogEntry = {
    timestamp,
    method,
    host,
    path,
    status_code: statusCode,
    ip,
    user_agent: userAgent,
  }

  const queryParams = sanitizeQueryParams(entry.query_params)
  if (queryParams) sanitized.query_params = queryParams

  if (typeof entry.referer === "string" && entry.referer) {
    sanitized.referer = truncate(entry.referer, 2048)
  }

  if (typeof entry.bytes_sent === "number" && entry.bytes_sent >= 0) {
    sanitized.bytes_sent = entry.bytes_sent
  }

  if (typeof entry.duration_ms === "number" && entry.duration_ms >= 0) {
    sanitized.duration_ms = entry.duration_ms
  }

  return sanitized
}

function chunkLogs(
  entries: ProFoundCustomLogEntry[],
  chunkSize: number
): ProFoundCustomLogEntry[][] {
  const chunks: ProFoundCustomLogEntry[][] = []

  for (let index = 0; index < entries.length; index += chunkSize) {
    chunks.push(entries.slice(index, index + chunkSize))
  }

  return chunks
}

export async function sendProfoundCustomLogs(
  payload: ProFoundCustomLogEntry | ProFoundCustomLogEntry[],
  options: ProfoundSendOptions = {}
): Promise<void> {
  const env = getProcessEnv()
  const enabled =
    options.enabled ?? env?.PROFOUND_CUSTOM_LOGGING_ENABLED === "true"
  const apiKey = options.apiKey ?? env?.PROFOUND_API_KEY

  if (!enabled || !apiKey) return

  const entries = Array.isArray(payload) ? payload : [payload]
  const sanitizedEntries = entries
    .map((entry) => sanitizeCustomLogEntry(entry))
    .filter((entry): entry is ProFoundCustomLogEntry => entry !== null)

  if (sanitizedEntries.length === 0) return

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const batches = chunkLogs(sanitizedEntries, MAX_BATCH_SIZE)

  await Promise.all(
    batches.map(async (batch) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetch(PROFOUND_CUSTOM_LOGS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(batch),
          signal: controller.signal,
        })

        if (!response.ok) {
          console.error("Profound custom logs request failed", {
            status: response.status,
            statusText: response.statusText,
          })
        }
      } catch (error) {
        console.error("Profound custom logs request error", error)
      } finally {
        clearTimeout(timeout)
      }
    })
  )
}
