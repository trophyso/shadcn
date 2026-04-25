"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/trophy/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/trophy/ui/dialog"

type FlatPage = {
  group: string
  name: string
  url: string
}

function flattenPages(tree: typeof source.pageTree): FlatPage[] {
  const pages: FlatPage[] = []

  const addPages = (
    nodes: (typeof source.pageTree.children)[number][],
    group: string
  ) => {
    for (const node of nodes) {
      if (node.type === "page") {
        pages.push({
          group,
          name: String(node.name),
          url: node.url,
        })
        continue
      }

      if (node.type === "folder") {
        addPages(node.children, group)
      }
    }
  }

  let currentGroup = "Docs"

  for (const node of tree.children) {
    if (node.type === "separator") {
      currentGroup = String(node.name)
      continue
    }

    if (node.type === "page") {
      pages.push({
        group: currentGroup,
        name: String(node.name),
        url: node.url,
      })
      continue
    }

    if (node.type === "folder") {
      addPages(node.children, String(node.name))
    }
  }

  return pages
}

function useIsMac() {
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform))
  }, [])

  return isMac
}

export function CommandMenu({
  tree,
  navItems,
  className,
}: {
  tree: typeof source.pageTree
  navItems?: { href: string; label: string }[]
  className?: string
}) {
  const router = useRouter()
  const isMac = useIsMac()
  const [open, setOpen] = React.useState(false)
  const pages = React.useMemo(() => flattenPages(tree), [tree])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((current) => !current)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64",
            className
          )}
          onClick={() => setOpen(true)}
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
            <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
            <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a page to navigate to.</DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
          filter={(value: string, search: string, keywords?: string[]) => {
            const extended = value + " " + (keywords?.join(" ") || "")
            return extended.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }}
        >
          <CommandInput placeholder="Search documentation..." />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              No results found.
            </CommandEmpty>

            {navItems?.length ? (
              <CommandGroup
                heading="Navigation"
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {navItems.map((item) => (
                  <CommandMenuItem
                    key={item.href}
                    value={`Navigation ${item.label}`}
                    keywords={["navigation", item.label.toLowerCase()]}
                    onSelect={() => {
                      setOpen(false)
                      router.push(item.href)
                    }}
                  >
                    <ChevronRight />
                    {item.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            ) : null}

            {Array.from(new Set(pages.map((page) => page.group))).map((group) => (
              <CommandGroup
                key={group}
                heading={group}
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {pages
                  .filter((page) => page.group === group)
                  .map((page) => (
                    <CommandMenuItem
                      key={page.url}
                      value={`${group} ${page.name}`}
                      onSelect={() => {
                        setOpen(false)
                        router.push(page.url)
                      }}
                    >
                      <ChevronRight />
                      {page.name}
                    </CommandMenuItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandMenuItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof CommandItem>) {
  return (
    <CommandItem
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none",
        className
      )}
      {...props}
    />
  )
}
