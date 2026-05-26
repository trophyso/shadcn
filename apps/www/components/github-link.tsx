import { Suspense } from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/trophy/ui/button"

function githubRepoPath(): string {
  const { pathname } = new URL(siteConfig.links.github)
  return pathname.replace(/^\/|\/$/g, "")
}

function formatStarCount(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toLocaleString()
}

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub className="size-4" />
        <span className="sr-only">GitHub</span>
        <Suspense
          fallback={
            <div className="bg-muted h-4 w-8 animate-pulse rounded" />
          }
        >
          <StarsCount />
        </Suspense>
      </Link>
    </Button>
  )
}

export async function StarsCount() {
  const data = await fetch(
    `https://api.github.com/repos/${githubRepoPath()}`,
    {
      next: { revalidate: 3600 }, // 1 hour
    }
  )

  if (!data.ok) {
    return null
  }

  const json = (await data.json()) as { stargazers_count?: number }

  if (typeof json.stargazers_count !== "number") {
    return null
  }

  return (
    <span className="text-muted-foreground text-xs tabular-nums">
      {formatStarCount(json.stargazers_count)}
    </span>
  )
}
