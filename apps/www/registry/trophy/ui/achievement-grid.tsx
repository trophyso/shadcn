"use client";

import * as React from "react";
import { Trophy } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined - only fields used by this component)
interface Achievement {
  id: string;
  name: string;
  trigger: "metric" | "api" | "streak";
  badgeUrl?: string | null;
}

interface UserAchievement extends Achievement {
  achievedAt: string | null; // null = locked
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
});

// Badge size mapping
const badgeSizeMap = {
  sm: "w-20",
  default: "w-28",
  lg: "w-36",
} as const;

// Props
interface AchievementGridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof achievementGridVariants> {
  /** Array of achievements */
  achievements: UserAchievement[];
  /** Filter achievements */
  filter?: "all" | "earned" | "locked";
  /** Sort achievements */
  sortBy?: "name" | "earned" | "trigger";
  /** Size of achievement badges */
  badgeSize?: "sm" | "default" | "lg";
  /** Variant for badges */
  badgeVariant?: "card" | "badge" | "minimal";
  /** Style for locked achievements */
  lockedStyle?: "grayscale" | "silhouette" | "hidden";
  /** Custom empty state */
  emptyState?: React.ReactNode;
  /** Callback when achievement clicked */
  onAchievementClick?: (achievement: UserAchievement) => void;
}

const AchievementGrid = React.forwardRef<HTMLDivElement, AchievementGridProps>(
  (
    {
      className,
      columns,
      gap,
      achievements,
      filter = "all",
      sortBy = "name",
      badgeSize = "default",
      badgeVariant = "card",
      lockedStyle = "grayscale",
      emptyState,
      onAchievementClick,
      ...props
    },
    ref,
  ) => {
    // Filter achievements
    const filtered = React.useMemo(() => {
      switch (filter) {
        case "earned":
          return achievements.filter((a) => a.achievedAt !== null);
        case "locked":
          return achievements.filter((a) => a.achievedAt === null);
        default:
          return achievements;
      }
    }, [achievements, filter]);

    // Sort achievements
    const sorted = React.useMemo(() => {
      const copy = [...filtered];
      switch (sortBy) {
        case "earned":
          return copy.sort((a, b) => {
            if (a.achievedAt && b.achievedAt) {
              return (
                new Date(b.achievedAt).getTime() -
                new Date(a.achievedAt).getTime()
              );
            }
            if (a.achievedAt) return -1;
            if (b.achievedAt) return 1;
            return 0;
          });
        case "trigger":
          return copy.sort((a, b) => a.trigger.localeCompare(b.trigger));
        case "name":
        default:
          return copy.sort((a, b) => a.name.localeCompare(b.name));
      }
    }, [filtered, sortBy]);

    // Empty state
    if (sorted.length === 0) {
      if (emptyState) {
        return <>{emptyState}</>;
      }
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">
            {filter === "earned"
              ? "No achievements earned yet"
              : filter === "locked"
                ? "All achievements unlocked!"
                : "No achievements available"}
          </p>
        </div>
      );
    }

    const imageSize = {
      sm: "h-12 w-12",
      default: "h-16 w-16",
      lg: "h-20 w-20",
    }[badgeSize];

    const iconSize = {
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-12 w-12",
    }[badgeSize];

    return (
      <div
        ref={ref}
        role="list"
        aria-label="Achievements"
        className={cn(achievementGridVariants({ columns, gap }), className)}
        {...props}
      >
        {sorted.map((achievement) => {
          const isUnlocked = achievement.achievedAt !== null;

          // Skip if hidden and locked
          if (!isUnlocked && lockedStyle === "hidden") {
            return null;
          }

          const statusLabel = isUnlocked ? "Earned" : "Locked";
          const itemLabel = `${achievement.name} - ${statusLabel}`;

          return (
            <div
              key={achievement.id}
              role={onAchievementClick ? "button" : "listitem"}
              aria-label={onAchievementClick ? itemLabel : undefined}
              tabIndex={onAchievementClick ? 0 : undefined}
              onClick={() => onAchievementClick?.(achievement)}
              onKeyDown={
                onAchievementClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onAchievementClick(achievement);
                      }
                    }
                  : undefined
              }
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg p-4 transition-all",
                badgeVariant === "card" &&
                  "border bg-card shadow-sm hover:shadow-md",
                badgeVariant === "badge" && "bg-transparent",
                badgeVariant === "minimal" && "bg-transparent p-2",
                onAchievementClick && "cursor-pointer",
                !isUnlocked && lockedStyle === "grayscale" && "opacity-50",
              )}
            >
              {/* Badge image */}
              {achievement.badgeUrl ? (
                <img
                  src={achievement.badgeUrl}
                  alt={`${achievement.name} badge - ${statusLabel}`}
                  className={cn(
                    imageSize,
                    "rounded-full object-cover",
                    !isUnlocked && lockedStyle === "grayscale" && "grayscale",
                    !isUnlocked &&
                      lockedStyle === "silhouette" &&
                      "brightness-0 opacity-30",
                  )}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={cn(
                    imageSize,
                    "flex items-center justify-center rounded-full",
                    isUnlocked
                      ? "bg-purple-500 text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Trophy className={iconSize} />
                </div>
              )}

              {/* Name */}
              <span
                className={cn(
                  "text-sm text-center font-medium leading-tight",
                  !isUnlocked && "text-muted-foreground",
                )}
              >
                {achievement.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  },
);
AchievementGrid.displayName = "AchievementGrid";

export { AchievementGrid, achievementGridVariants };
export type { AchievementGridProps, Achievement, UserAchievement };
