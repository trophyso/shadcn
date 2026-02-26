"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarContent } from "@/registry/trophy/ui/sidebar"

type PageTree = typeof source.pageTree
type PageTreeNode = PageTree["children"][number]

function SidebarLink({
  href,
  isActive,
  children,
}: {
  href: string
  isActive: boolean
  children: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:text-foreground block rounded-md px-3 py-1.5 text-sm transition-colors",
        isActive &&
          "bg-primary/10 text-primary font-medium"
      )}
    >
      {children}
    </Link>
  )
}

function SidebarSeparator({ name }: { name: string }) {
  return (
    <div className="text-foreground mt-6 mb-2 px-3 text-xs font-semibold tracking-wide first:mt-0">
      {name}
    </div>
  )
}

function SidebarSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <h4 className="text-muted-foreground mb-2 px-3 text-xs font-medium uppercase tracking-wider">
        {title}
      </h4>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function renderNodes(
  nodes: PageTreeNode[],
  pathname: string
): React.ReactNode[] {
  const result: React.ReactNode[] = []

  for (const node of nodes) {
    if (node.type === "separator") {
      const name = typeof node.name === "string" ? node.name : String(node.name)
      result.push(
        <SidebarSeparator key={node.$id || name} name={name} />
      )
    } else if (node.type === "page") {
      if (node.url === "/docs" || node.url === "/docs/components") {
        continue
      }
      const nodeName = typeof node.name === "string" ? node.name : String(node.name)
      result.push(
        <SidebarLink
          key={node.url}
          href={node.url}
          isActive={pathname === node.url}
        >
          {nodeName}
        </SidebarLink>
      )
    } else if (node.type === "folder" && node.children) {
      result.push(...renderNodes(node.children, pathname))
    }
  }

  return result
}

export function DocsSidebar({ tree }: { tree: PageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden px-2 pb-12">
        <div className="h-(--top-spacing) shrink-0" />
        <nav className="flex flex-col gap-1 px-1">
          <SidebarSection title="Getting Started">
            <SidebarLink href="/docs" isActive={pathname === "/docs"}>
              Introduction
            </SidebarLink>
            <SidebarLink
              href="/docs/components"
              isActive={pathname === "/docs/components"}
            >
              Components
            </SidebarLink>
          </SidebarSection>

          <div className="mt-6">
            <h4 className="text-muted-foreground mb-2 px-3 text-xs font-medium uppercase tracking-wider">
              Components
            </h4>
            <div className="flex flex-col gap-0.5">
              {renderNodes(tree.children, pathname)}
            </div>
          </div>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
