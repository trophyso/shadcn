import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/trophy/ui/button"

export function GitHubLink() {
  return (
    <Button variant="ghost" size="icon" className="size-8" asChild>
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub className="size-4" />
        <span className="sr-only">GitHub</span>
      </Link>
    </Button>
  )
}
