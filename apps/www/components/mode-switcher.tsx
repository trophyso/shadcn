"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/registry/trophy/ui/button"
import { Icons } from "@/components/icons"

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Icons.sun className="size-4 dark:hidden" />
      <Icons.moon className="hidden size-4 dark:block" />
    </Button>
  )
}
