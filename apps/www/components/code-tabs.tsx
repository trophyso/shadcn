"use client"

import * as React from "react"

import { Tabs } from "@/registry/trophy/ui/tabs"

export function CodeTabs({ children, ...props }: React.ComponentProps<typeof Tabs>) {
  const hasExplicitValue = props.value !== undefined || props.defaultValue !== undefined

  const tabsProps = hasExplicitValue
    ? props
    : {
        ...props,
        defaultValue: "cli" as const,
      }

  return (
    <Tabs className="relative mt-6 w-full" {...tabsProps}>
      {children}
    </Tabs>
  )
}
