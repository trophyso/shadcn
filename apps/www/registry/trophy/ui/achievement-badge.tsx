"use client";

import * as React from "react";
import { Lock, Trophy } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined)
interface Achievement {
  id: string;
  name: string;
  trigger: "metric" | "api" | "streak";
  description?: string | null;
  badgeUrl?: string | null;
  key?: string;
  metricId?: string;
  metricName?: string;
  metricValue?: number;
  streakLength?: number;
  userAttributes?: Array<{ key: string; value: string }>;
  eventAttribute?: { key: string; value: string };
}

interface UserAchievement extends Achievement {
  achievedAt: string | null; // null = locked
}

// Variants
const achievementBadgeVariants = cva(
  "relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
  {
    variants: {
      variant: {
        card: "bg-card shadow-sm hover:shadow-md",
        badge: "bg-transparent border-none p-2",
        minimal: "border-none bg-transparent p-1",
      },
      size: {
        sm: "w-20",
        default: "w-28",
        lg: "w-36",
        xl: "w-44",
      },
    },
    defaultVariants: {
      variant: "card",
      size: "default",
    },
  },
);

// Props
interface AchievementBadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof achievementBadgeVariants> {
  /** Achievement data (use UserAchievement for locked/unlocked state) */
  achievement: UserAchievement;
  /** Show description below name */
  showDescription?: boolean;
  /** Show progress for metric achievements */
  showProgress?: boolean;
  /** Current value for metric progress */
  currentValue?: number;
  /** Style for locked achievements */
  lockedStyle?: "grayscale" | "silhouette" | "hidden";
  /** Show lock icon on locked achievements */
  showLockIcon?: boolean;
  /** Custom icon when no badgeUrl */
  icon?: React.ReactNode;
}

const AchievementBadge = React.forwardRef<
  HTMLDivElement,
  AchievementBadgeProps
>(
  (
    {
      className,
      variant,
      size,
      achievement,
      showDescription = false,
      showProgress = false,
      currentValue = 0,
      lockedStyle = "grayscale",
      showLockIcon = true,
      icon,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isUnlocked = achievement.achievedAt !== null;
    const isMetric = achievement.trigger === "metric";
    const target = achievement.metricValue ?? 0;
    const progress =
      target > 0 ? Math.min((currentValue / target) * 100, 100) : 0;

    // Don't render if locked and lockedStyle is "hidden"
    if (!isUnlocked && lockedStyle === "hidden") {
      return null;
    }

    // Build accessible label
    const statusLabel = isUnlocked ? "Unlocked" : "Locked";
    const progressLabel =
      showProgress && isMetric && !isUnlocked
        ? `, ${currentValue} of ${target} progress`
        : "";
    const ariaLabel = `${achievement.name}, ${statusLabel}${progressLabel}`;

    const imageSize = {
      sm: "h-12 w-12",
      default: "h-16 w-16",
      lg: "h-20 w-20",
      xl: "h-24 w-24",
    }[size ?? "default"];

    const iconSize = {
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-14 w-14",
    }[size ?? "default"];

    const textSize = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    }[size ?? "default"];

    return (
      <div
        ref={ref}
        role={onClick ? "button" : "article"}
        aria-label={ariaLabel}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={cn(
          achievementBadgeVariants({ variant, size }),
          onClick && "cursor-pointer",
          !isUnlocked && lockedStyle === "grayscale" && "opacity-50",
          className,
        )}
        {...props}
      >
        {/* Badge image or icon */}
        <div className="relative">
          {achievement.badgeUrl ? (
            <img
              src={achievement.badgeUrl}
              alt={achievement.name}
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
              className={cn(
                imageSize,
                "flex items-center justify-center rounded-full",
                isUnlocked
                  ? "bg-purple-500 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {icon ?? <Trophy className={iconSize} />}
            </div>
          )}

          {/* Lock icon overlay */}
          {!isUnlocked && showLockIcon && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow-sm">
              <Lock className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Name */}
        <span
          className={cn(
            textSize,
            "text-center font-medium leading-tight",
            !isUnlocked && "text-muted-foreground",
          )}
        >
          {achievement.name}
        </span>

        {/* Description */}
        {showDescription && achievement.description && (
          <span className="text-xs text-center text-muted-foreground line-clamp-2">
            {achievement.description}
          </span>
        )}

        {/* Progress bar for metric achievements */}
        {showProgress && isMetric && !isUnlocked && (
          <div className="w-full space-y-1" aria-hidden="true">
            <div
              role="progressbar"
              aria-valuenow={currentValue}
              aria-valuemin={0}
              aria-valuemax={target}
              aria-label={`Progress: ${currentValue} of ${target}`}
              className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground text-center block">
              {currentValue}/{target}
            </span>
          </div>
        )}
      </div>
    );
  },
);
AchievementBadge.displayName = "AchievementBadge";

export { AchievementBadge, achievementBadgeVariants };
export type { AchievementBadgeProps, Achievement, UserAchievement };
