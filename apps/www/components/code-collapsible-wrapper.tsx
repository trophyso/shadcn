"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/trophy/ui/button"
import { Separator } from "@/registry/trophy/ui/separator"

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <CollapsiblePrimitive.Root
      open={isOpened}
      onOpenChange={setIsOpened}
      className={cn("group/collapsible relative md:-mx-1", className)}
      {...props}
    >
      <CollapsiblePrimitive.CollapsibleContent
        forceMount
        className="relative mt-6 overflow-hidden data-[state=closed]:max-h-64 [&>figure]:mt-0 [&>figure]:md:!mx-0"
      >
        {children}
      </CollapsiblePrimitive.CollapsibleContent>
      <CollapsiblePrimitive.CollapsibleTrigger className="from-code/30 to-code text-muted-foreground absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b text-sm group-data-[state=open]/collapsible:hidden cursor-pointer">
        {isOpened ? "Collapse" : "Expand"}
      </CollapsiblePrimitive.CollapsibleTrigger>
    </CollapsiblePrimitive.Root>
  )
}
