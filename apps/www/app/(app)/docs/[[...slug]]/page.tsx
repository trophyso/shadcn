import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import { findNeighbour } from "fumadocs-core/server"
import { ChevronLeft, ChevronRight, CircleAlert, GitFork } from "lucide-react"

import { siteConfig } from "@/lib/config"
import {
  resolveDocsMetaKeywords,
  resolveDocsSeoTitle,
  type TrophyDocsFrontmatter,
} from "@/lib/docs-metadata"
import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { DocsSidebarCta } from "@/components/docs-sidebar-cta"
import { DocsTableOfContents } from "@/components/docs-toc"
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

  const doc = page.data as typeof page.data & TrophyDocsFrontmatter

  if (!doc.title || !doc.description) {
    notFound()
  }

  const metaTitle = resolveDocsSeoTitle(doc)
  const metaKeywords = resolveDocsMetaKeywords(doc)

  return {
    title: metaTitle,
    description: doc.description,
    keywords: metaKeywords,
    alternates: {
      canonical: `${siteConfig.url}${page.url}`,
    },
    openGraph: {
      title: metaTitle,
      description: doc.description,
      type: "article",
      url: `${siteConfig.url}${page.url}`,
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: doc.description,
      images: [siteConfig.ogImage],
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
  // @ts-expect-error - fumadocs-mdx DocMethods
  const pageMarkdown: string = await doc.getText("raw")

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex md:min-w-0 min-w-full flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                {doc.title}
              </h1>
              <div className="hidden md:flex shrink-0 items-center gap-2">
                <DocsCopyPage page={pageMarkdown} url={absoluteUrl(page.url)} />
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
              <p className="text-muted-foreground text-[1.05rem] sm:text-base">
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
        <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-end gap-2 px-4 pb-8 md:px-0">
          <Button variant="secondary" size="sm" asChild className="shadow-none">
            <Link
              href={`${siteConfig.links.github}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CircleAlert className="size-4" /> Raise an issue
            </Link>
          </Button>
          <Button variant="secondary" size="sm" asChild className="shadow-none">
            <Link
              href={`${siteConfig.links.github}/fork`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitFork className="size-4" /> Contribute
            </Link>
          </Button>
        </div>
      </div>
      <div className="hidden md:block w-72" />
      <div className="fixed right-8 top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4  overscroll-none pb-8 hidden md:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {/* @ts-expect-error - fumadocs types */}
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            {/* @ts-expect-error - fumadocs types */}
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-12 px-6 w-72 ml-6">
          <DocsSidebarCta />
        </div>
      </div>
    </div>
  )
}
