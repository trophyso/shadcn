import { notFound } from "next/navigation"
import { NextResponse } from "next/server"

import { source } from "@/lib/source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const params = await context.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data as {
    getText?: (type: "raw" | "processed") => Promise<string>
  }

  if (!doc.getText) {
    notFound()
  }

  const text = await doc.getText("raw")

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
