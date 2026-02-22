import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { findNeighbour } from "fumadocs-core/server"

import { mdxComponents } from "@/mdx-components"
import { source } from "@/lib/source"
import { siteConfig } from "@/lib/config"
import { Button } from "@/registry/trophy/ui/button"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data

  if (!doc.title || !doc.description) {
    notFound()
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: `${siteConfig.url}${page.url}`,
      images: [
        {
          url: `/og?title=${encodeURIComponent(doc.title)}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(doc.title)}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
      creator: "@trophyso",
    },
  }
}

export default async function DocsPage(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data
  // @ts-expect-error - fumadocs types
  const MDX = doc.body
  const neighbours = await findNeighbour(source.pageTree, page.url)

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                {doc.title}
              </h1>
              <div className="flex items-center gap-2">
                {neighbours.previous && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8 shadow-none md:size-7"
                    asChild
                  >
                    <Link href={neighbours.previous.url}>
                      <ChevronLeft className="size-4" />
                      <span className="sr-only">Previous</span>
                    </Link>
                  </Button>
                )}
                {neighbours.next && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8 shadow-none md:size-7"
                    asChild
                  >
                    <Link href={neighbours.next.url}>
                      <span className="sr-only">Next</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {doc.description && (
              <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                {doc.description}
              </p>
            )}
          </div>
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
          {neighbours.previous && (
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="shadow-none"
            >
              <Link href={neighbours.previous.url}>
                <ChevronLeft className="size-4" /> {neighbours.previous.name}
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shadow-none"
              asChild
            >
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <ChevronRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
