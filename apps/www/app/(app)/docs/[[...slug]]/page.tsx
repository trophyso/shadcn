import { notFound } from "next/navigation"

import { mdxComponents } from "@/mdx-components"
import { source } from "@/lib/source"

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

  return {
    title: doc.title,
    description: doc.description,
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

  return (
    <div className="flex items-stretch xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 md:px-0 lg:py-8">
          <div className="flex flex-col gap-2">
            <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight">
              {doc.title}
            </h1>
            {doc.description && (
              <p className="text-muted-foreground text-base text-balance">
                {doc.description}
              </p>
            )}
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDX components={mdxComponents} />
          </div>
        </div>
      </div>
    </div>
  )
}
