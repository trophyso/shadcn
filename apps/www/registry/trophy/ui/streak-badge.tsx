"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined)
interface StreakPeriod {
  periodStart: string;
  periodEnd: string;
  length: number;
  usedFreeze?: boolean;
}

interface StreakResponse {
  length: number;
  frequency: "daily" | "weekly" | "monthly";
  started: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  expires: string | null;
  streakHistory: StreakPeriod[];
  rank: number | null;
  freezes?: number;
  maxFreezes?: number;
  freezeAutoEarnInterval?: number;
  freezeAutoEarnAmount?: number;
}

// Variants
const streakBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white hover:bg-orange-600",
        outline:
          "border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-50 dark:hover:bg-orange-950",
        ghost: "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        default: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Props
interface StreakBadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof streakBadgeVariants> {
  /** Trophy API streak response */
  streak?: StreakResponse;
  /** Manual streak length (alternative to streak prop) */
  length?: number;
  /** Show frequency label (day/week/month) */
  showFrequency?: boolean;
  /** Show flame icon */
  showFlame?: boolean;
  /** Custom icon to replace flame */
  icon?: React.ReactNode;
  /** Animate on mount/change */
  animate?: boolean;
}

const StreakBadge = React.forwardRef<HTMLDivElement, StreakBadgeProps>(
  (
    {
      className,
      variant,
      size,
      streak,
      length,
      showFrequency = false,
      showFlame = true,
      icon,
      animate = true,
      ...props
    },
    ref,
  ) => {
    const streakLength = streak?.length ?? length ?? 0;
    const frequency = streak?.frequency ?? "daily";

    const frequencyLabel = {
      daily: "day",
      weekly: "week",
      monthly: "month",
    }[frequency];

    const pluralLabel =
      streakLength === 1 ? frequencyLabel : `${frequencyLabel}s`;

    const iconSize = {
      sm: "h-3 w-3",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    }[size ?? "default"];

    return (
      <div
        ref={ref}
        className={cn(
          streakBadgeVariants({ variant, size }),
          animate && "motion-safe:animate-streak-pulse",
          className,
        )}
        {...props}
      >
        {showFlame && (icon ?? <Flame className={cn(iconSize, "shrink-0")} />)}
        <span>{streakLength}</span>
        {showFrequency && (
          <span className="font-normal opacity-80">{pluralLabel}</span>
        )}
      </div>
    );
  },
);
StreakBadge.displayName = "StreakBadge";

export { StreakBadge, streakBadgeVariants };
export type { StreakBadgeProps, StreakResponse, StreakPeriod };
