"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Trophy } from "lucide-react"

import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  name: string
  description?: string | null
  trigger: "metric" | "api" | "streak"
  badgeUrl?: string | null
  progress?: number
  rarity?: number
}

interface UserAchievement extends Achievement {
  achievedAt: string | null
}

const achievementListVariants = cva("flex flex-col", {
  variants: {
    columns: {
      2: "",
      3: "",
      4: "",
      auto: "",
    },
    gap: {
      sm: "gap-2",
      default: "gap-3",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    columns: "auto",
    gap: "default",
  },
})

interface AchievementListProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof achievementListVariants> {
  achievements: UserAchievement[]
  badgeSize?: "sm" | "default" | "lg"
  lockedStyle?: "grayscale" | "silhouette" | "hidden"
  onAchievementClick?: (achievement: UserAchievement) => void
}

const badgeSizeMap = {
  sm: "h-10 w-10",
  default: "h-12 w-12",
  lg: "h-14 w-14",
} as const

const iconSizeMap = {
  sm: "h-5 w-5",
  default: "h-6 w-6",
  lg: "h-7 w-7",
} as const

const progressSizeMap = {
  sm: 42,
  default: 48,
  lg: 56,
} as const

const AchievementList = React.forwardRef<HTMLDivElement, AchievementListProps>(
  (
    {
      className,
      columns,
      gap,
      achievements,
      badgeSize = "default",
      lockedStyle = "grayscale",
      onAchievementClick,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <div
          role="list"
          aria-label="Achievements"
          className={achievementListVariants({ columns, gap })}
        >
          {achievements.map((achievement) => {
            const isUnlocked = achievement.achievedAt !== null
            const hasProgress =
              isUnlocked && typeof achievement.progress === "number"

            if (!isUnlocked && lockedStyle === "hidden") {
              return null
            }

            const progress = hasProgress
              ? Math.min(100, Math.max(0, achievement.progress ?? 0))
              : 0
            const progressSize = progressSizeMap[badgeSize]
            const progressStroke = 3
            const progressRadius = (progressSize - progressStroke) / 2
            const circumference = 2 * Math.PI * progressRadius
            const dashOffset = circumference - (progress / 100) * circumference

            return (
              <div
                key={achievement.id}
                role={onAchievementClick ? "button" : "listitem"}
                tabIndex={onAchievementClick ? 0 : undefined}
                onClick={() => onAchievementClick?.(achievement)}
                onKeyDown={
                  onAchievementClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onAchievementClick(achievement)
                        }
                      }
                    : undefined
                }
                className={cn(
                  "bg-background flex items-center gap-4 rounded-2xl border px-4 py-3",
                  onAchievementClick && "cursor-pointer"
                )}
              >
                {achievement.badgeUrl ? (
                  <img
                    src={achievement.badgeUrl}
                    alt={achievement.name}
                    className={cn(
                      badgeSizeMap[badgeSize],
                      "shrink-0 rounded-xl object-cover",
                      !isUnlocked && lockedStyle === "grayscale" && "grayscale",
                      !isUnlocked &&
                        lockedStyle === "silhouette" &&
                        "opacity-30 brightness-0"
                    )}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={cn(
                      badgeSizeMap[badgeSize],
                      "flex shrink-0 items-center justify-center rounded-xl",
                      isUnlocked
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <Trophy className={iconSizeMap[badgeSize]} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-base font-semibold",
                      !isUnlocked && "text-muted-foreground"
                    )}
                  >
                    {achievement.name}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {achievement.description ?? "Complete the required steps"}
                  </p>
                </div>

                {hasProgress ? (
                  <div
                    className="relative shrink-0"
                    style={{ width: progressSize, height: progressSize }}
                  >
                    <svg
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full"
                      viewBox={`0 0 ${progressSize} ${progressSize}`}
                    >
                      <circle
                        cx={progressSize / 2}
                        cy={progressSize / 2}
                        r={progressRadius}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth={progressStroke}
                      />
                      <circle
                        cx={progressSize / 2}
                        cy={progressSize / 2}
                        r={progressRadius}
                        fill="none"
                        stroke="var(--primary)"
                        strokeLinecap="round"
                        strokeWidth={progressStroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform={`rotate(-90 ${progressSize / 2} ${progressSize / 2})`}
                      />
                    </svg>
                    <div className="text-foreground absolute inset-0 grid place-items-center text-sm font-semibold">
                      {Math.round(progress)}%
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
AchievementList.displayName = "AchievementList"

export { AchievementList, achievementListVariants }
export type { AchievementListProps, Achievement, UserAchievement }
