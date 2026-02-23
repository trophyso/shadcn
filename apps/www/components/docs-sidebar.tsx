"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
} from "@/registry/trophy/ui/sidebar"

type PageTree = typeof source.pageTree
type PageTreeNode = PageTree["children"][number]

function collectPages(nodes: PageTreeNode[]): { name: string; url: string }[] {
  const pages: { name: string; url: string }[] = []
  for (const node of nodes) {
    if (node.type === "page" && node.url !== "/docs" && node.url !== "/docs/components") {
      pages.push({ name: node.name as string, url: node.url })
    }
    if (node.type === "folder" && node.children) {
      pages.push(...collectPages(node.children))
    }
  }
  return pages
}

function SidebarLink({
  href,
  isActive,
  children,
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-2 py-1.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-foreground",
        isActive && "bg-accent text-foreground"
      )}
    >
      {children}
    </Link>
  )
}

export function DocsSidebar({ tree }: { tree: PageTree }) {
  const pathname = usePathname()
  const componentPages = collectPages(tree.children)

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden px-2 pb-12">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="flex flex-col gap-4 px-2">
          <div className="flex flex-col gap-0.5">
            <h4 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
              Getting Started
            </h4>
            <SidebarLink href="/docs" isActive={pathname === "/docs"}>
              Introduction
            </SidebarLink>
            <SidebarLink
              href="/docs/components"
              isActive={pathname === "/docs/components"}
            >
              Components
            </SidebarLink>
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
              Components
            </h4>
            {componentPages.map((page) => (
              <SidebarLink
                key={page.url}
                href={page.url}
                isActive={pathname === page.url}
              >
                {page.name}
              </SidebarLink>
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
