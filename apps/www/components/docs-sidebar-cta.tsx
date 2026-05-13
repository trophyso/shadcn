import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"

import { Icons } from "./icons"

export function DocsSidebarCta({ className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group bg-surface text-surface-foreground relative flex flex-col gap-2 overflow-hidden rounded-lg p-6 text-sm",
        className
      )}
    >
      <Icons.logo className="size-6" />
      <div className="relative z-10 text-base leading-tight font-semibold text-balance group-hover:underline">
        Power Gamification with Trophy
      </div>
      <div className="text-foreground relative z-10">
        Trophy powers the infrastructure you need to ship reliable gamification
        features at scale.
      </div>
      <Button size="sm" className="relative z-10 mt-2 w-fit" asChild>
        <Link
          href="https://trophy.so?utm_source=trophy-ui"
          target="_blank"
          rel="noreferrer"
        >
          Get Started
        </Link>
      </Button>
    </div>
  )
}
