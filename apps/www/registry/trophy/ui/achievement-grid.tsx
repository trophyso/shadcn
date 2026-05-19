"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { AchievementBadge } from "@/components/ui/achievement-badge"

// Types (inlined - only fields used by this component)
interface Achievement {
  id: string
  name: string
  trigger: "metric" | "api" | "streak"
  badgeUrl?: string | null
  progress?: number
  rarity?: number
}

interface UserAchievement extends Achievement {
  achievedAt: string | null // null = locked
}

// Variants
const achievementGridVariants = cva("grid", {
  variants: {
    columns: {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      auto: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    },
    gap: {
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    columns: "auto",
    gap: "default",
  },
})

// Badge size mapping
// Props
interface AchievementGridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof achievementGridVariants> {
  /** Array of achievements */
  achievements: UserAchievement[]
  /** Size of achievement badges */
  badgeSize?: "sm" | "default" | "lg"
  /** Callback when achievement clicked */
  onAchievementClick?: (achievement: UserAchievement) => void
}

const AchievementGrid = React.forwardRef<HTMLDivElement, AchievementGridProps>(
  (
    {
      className,
      columns,
      gap,
      achievements,
      badgeSize = "default",
      onAchievementClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="list"
        aria-label="Achievements"
        className={cn(achievementGridVariants({ columns, gap }), className)}
        {...props}
      >
        {achievements.map((achievement) => {
          return (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              badgeSize={badgeSize}
              onAchievementClick={onAchievementClick}
            />
          )
        })}
      </div>
    )
  }
)
AchievementGrid.displayName = "AchievementGrid"

export { AchievementGrid, achievementGridVariants }
export type { AchievementGridProps, Achievement, UserAchievement }
