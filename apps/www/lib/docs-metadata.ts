import { siteConfig } from "@/lib/config"

export type TrophyDocsFrontmatter = {
  title: string
  description?: string
  seoTitle?: string
  keywords?: string[]
}

export function formatDocsSeoTitle(core: string): string {
  const trimmed = core.trim()
  const suffix = siteConfig.title.trim()
  if (!suffix) return trimmed
  return `${trimmed} | ${suffix}`
}

export function resolveDocsSeoTitle(
  doc: Pick<TrophyDocsFrontmatter, "title" | "seoTitle">
): string {
  const custom = doc.seoTitle?.trim()
  if (custom) return formatDocsSeoTitle(custom)
  return formatDocsSeoTitle(doc.title)
}

export function resolveDocsMetaKeywords(
  doc: Pick<TrophyDocsFrontmatter, "title" | "keywords">
): string[] {
  const base = [
    doc.title,
    "gamification UI component",
    "React component",
    "shadcn UI",
    "Tailwind CSS"
  ]
  const extra = doc.keywords?.map((k) => k.trim()).filter(Boolean) ?? []
  return [...new Set([...extra, ...base])]
}
