import { NextRequest, NextResponse, type NextFetchEvent } from "next/server"

import { sendProfoundCustomLogs } from "@/lib/profound/customLogs"

const PROFOUND_LOG_HOST = "ui.trophy.so";

const SAFE_QUERY_PARAMS = new Set(
  (process.env.PROFOUND_LOG_QUERY_PARAM_ALLOWLIST ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
)

function isSafeQueryParam(key: string): boolean {
  return SAFE_QUERY_PARAMS.has(key.toLowerCase())
}

function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim()
    if (firstIp) return firstIp
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp

  return "0.0.0.0"
}

function getSafeQueryParams(url: URL): Record<string, string> | undefined {
  const safeEntries = Array.from(url.searchParams.entries()).filter(([key]) =>
    isSafeQueryParam(key)
  )

  if (safeEntries.length === 0) return undefined
  return Object.fromEntries(safeEntries)
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next()

  const referer = request.headers.get("referer") || undefined
  const queryParams = getSafeQueryParams(request.nextUrl)

  event.waitUntil(
    sendProfoundCustomLogs({
      timestamp: new Date().toISOString(),
      method: request.method,
      host: PROFOUND_LOG_HOST,
      path: request.nextUrl.pathname,
      status_code: response.status,
      ip: getRequestIp(request),
      user_agent: request.headers.get("user-agent") || "unknown-user-agent",
      referer,
      query_params: queryParams,
    })
  )

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
}
