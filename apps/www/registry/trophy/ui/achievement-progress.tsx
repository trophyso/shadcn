"use client";

import * as React from "react";
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
}

// Variants
const achievementProgressVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      gradient: "",
    },
    size: {
      sm: "space-y-1",
      default: "space-y-1.5",
      lg: "space-y-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const progressBarVariants = cva(
  "h-full rounded-full transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-purple-500",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Props
interface AchievementProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof achievementProgressVariants> {
  /** Achievement data (must be metric type with metricValue) */
  achievement: Achievement;
  /** Current progress value */
  currentValue: number;
  /** Show numeric value (e.g., "45/100") */
  showValue?: boolean;
  /** Show percentage */
  showPercentage?: boolean;
  /** Show achievement name */
  showName?: boolean;
  /** Animate the progress bar */
  animate?: boolean;
}

const AchievementProgress = React.forwardRef<
  HTMLDivElement,
  AchievementProgressProps
>(
  (
    {
      className,
      variant,
      size,
      achievement,
      currentValue,
      showValue = true,
      showPercentage = false,
      showName = false,
      animate = true,
      ...props
    },
    ref,
  ) => {
    const target = achievement.metricValue ?? 0;
    const progress =
      target > 0 ? Math.min((currentValue / target) * 100, 100) : 0;
    const isComplete = currentValue >= target;

    const barHeight = {
      sm: "h-1.5",
      default: "h-2",
      lg: "h-3",
    }[size ?? "default"];

    const textSize = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    }[size ?? "default"];

    // For animation, start at 0 and animate to actual value
    const [displayProgress, setDisplayProgress] = React.useState(
      animate ? 0 : progress,
    );

    React.useEffect(() => {
      if (animate) {
        // Small delay to ensure the animation is visible
        const timeout = setTimeout(() => {
          setDisplayProgress(progress);
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setDisplayProgress(progress);
      }
    }, [progress, animate]);

    return (
      <div
        ref={ref}
        className={cn(
          achievementProgressVariants({ variant, size }),
          className,
        )}
        {...props}
      >
        {/* Header row */}
        {(showName || showValue || showPercentage) && (
          <div className={cn("flex items-center justify-between", textSize)}>
            {showName && (
              <span className="font-medium truncate mr-2">
                {achievement.name}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto text-muted-foreground">
              {showValue && (
                <span>
                  {currentValue}/{target}
                </span>
              )}
              {showPercentage && <span>{Math.round(progress)}%</span>}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-muted",
            barHeight,
          )}
          role="progressbar"
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-label={`${achievement.name} progress`}
        >
          <div
            className={cn(
              progressBarVariants({ variant }),
              isComplete && "bg-green-500",
            )}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Completion message */}
        {isComplete && (
          <p className={cn("text-green-600 dark:text-green-400", textSize)}>
            Complete! 🎉
          </p>
        )}
      </div>
    );
  },
);
AchievementProgress.displayName = "AchievementProgress";

export { AchievementProgress, achievementProgressVariants };
export type { AchievementProgressProps, Achievement };
