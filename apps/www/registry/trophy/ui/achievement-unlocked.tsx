"use client"

import * as React from "react"
import { CalendarDays, Share2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AchievementBadge,
  type UserAchievement,
} from "@/registry/trophy/ui/achievement-badge"

import { Button } from "./button"

// Types (inlined - only fields used by this component)
interface Achievement {
  id: string
  name: string
  trigger?: "metric" | "api" | "streak"
  description?: string | null
  unlockedAt?: string
}

// Props
interface AchievementUnlockedProps {
  /** Achievement that was unlocked */
  achievement: Achievement
  /** Control open state */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Label for the secondary action button */
  secondaryActionLabel?: string
  /** Callback for the secondary action button (e.g. social share) */
  onSecondaryActionClick?: () => void
  /** @deprecated Use onSecondaryActionClick instead */
  onShare?: () => void
  /** Custom class for the dialog */
  className?: string
}

const AchievementUnlocked = React.forwardRef<
  HTMLDivElement,
  AchievementUnlockedProps
>(
  (
    {
      achievement,
      open,
      onOpenChange,
      secondaryActionLabel = "Share",
      onSecondaryActionClick,
      onShare,
      className,
    },
    ref
  ) => {
    const handleSecondaryActionClick = onSecondaryActionClick ?? onShare
    const unlockedDateLabel = React.useMemo(() => {
      const input = achievement.unlockedAt ?? new Date().toISOString()
      const date = new Date(input)
      if (Number.isNaN(date.getTime())) return "Earned today"
      return `Earned ${date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`
    }, [achievement.unlockedAt])

    const badgeAchievement = React.useMemo<UserAchievement>(() => {
      return {
        id: achievement.id,
        name: achievement.name,
        trigger: achievement.trigger ?? "streak",
        achievedAt: achievement.unlockedAt ?? new Date().toISOString(),
      }
    }, [achievement])

    // Handle escape key
    React.useEffect(() => {
      if (!open) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false)
        }
      }

      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }, [open, onOpenChange])

    // Prevent body scroll when open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
      return () => {
        document.body.style.overflow = ""
      }
    }, [open])

    if (!open) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="bg-foreground/80 fixed inset-0 z-50"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />

        {/* Dialog */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievement-title"
          className={cn(
            "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "bg-card w-full max-w-md rounded-xl p-6 shadow-2xl",
            className
          )}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute top-4 right-4"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="flex flex-col items-center text-center">
            <AchievementBadge
              achievement={badgeAchievement}
              badgeSize="xl"
              className="mt-8 mb-12 border-0 bg-transparent p-0 shadow-none hover:shadow-none [&>span:last-child]:hidden"
            />

            <span className="text-muted-foreground mb-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
              <CalendarDays className="h-4 w-4" />
              {unlockedDateLabel}
            </span>

            <h2
              id="achievement-title"
              className="mb-2 text-4xl font-bold tracking-tight"
            >
              {achievement.name}
            </h2>

            {achievement.description && (
              <p className="text-muted-foreground mb-3 text-lg">
                {achievement.description}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              {handleSecondaryActionClick && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSecondaryActionClick}
                >
                  <Share2 className="h-4 w-4" />
                  {secondaryActionLabel}
                </Button>
              )}

              <Button onClick={() => onOpenChange(false)}>Awesome!</Button>
            </div>
          </div>
        </div>
      </>
    )
  }
)
AchievementUnlocked.displayName = "AchievementUnlocked"

export { AchievementUnlocked }
export type { AchievementUnlockedProps, Achievement }
