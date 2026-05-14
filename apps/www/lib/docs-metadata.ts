export type TrophyDocsFrontmatter = {
  title: string
  description?: string
  seoTitle?: string
  keywords?: string[]
}

export function resolveDocsSeoTitle(
  doc: Pick<TrophyDocsFrontmatter, "title" | "seoTitle">
): string {
  const custom = doc.seoTitle?.trim()
  if (custom) return custom
  return `${doc.title} | Trophy UI`
}

export function resolveDocsMetaKeywords(
  doc: Pick<TrophyDocsFrontmatter, "title" | "keywords">
): string[] {
  const base = [
    doc.title,
    "gamification UI component",
    "React component",
    "shadcn UI",
    "Tailwind CSS",
    "Trophy UI",
  ]
  const extra = doc.keywords?.map((k) => k.trim()).filter(Boolean) ?? []
  return [...new Set([...extra, ...base])]
}
