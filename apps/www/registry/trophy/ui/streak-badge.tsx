"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined - only fields used by this component)
interface StreakResponse {
  length: number;
  frequency: "daily" | "weekly" | "monthly";
}

// Variants
const streakBadgeVariants = cva(
  "inline-flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-card text-center text-card-foreground transition-colors",
  {
    variants: {
      size: {
        sm: "w-28 gap-1.5 p-3",
        default: "w-40 gap-2.5 p-5",
        lg: "w-52 gap-3 p-6",
      },
    },
    defaultVariants: {
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
  /** Optional subtitle shown below streak length */
  subtitle?: string;
  /** Custom icon to replace flame */
  icon?: React.ReactNode;
}

const StreakBadge = React.forwardRef<HTMLDivElement, StreakBadgeProps>(
  (
    {
      className,
      size,
      streak,
      length,
      showFrequency = false,
      showFlame = true,
      subtitle,
      icon,
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
      sm: "h-10 w-10",
      default: "h-16 w-16",
      lg: "h-20 w-20",
    }[size ?? "default"];

    const valueSize = {
      sm: "text-2xl",
      default: "text-5xl",
      lg: "text-6xl",
    }[size ?? "default"];

    const subtitleSize = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    }[size ?? "default"];

    const subtitleText =
      subtitle ?? (showFrequency ? `${pluralLabel} streak` : `${frequencyLabel} streak`);
    const valueUnit = showFrequency ? pluralLabel : frequencyLabel;

    // Build accessible label
    const ariaLabel = showFrequency
      ? `${streakLength} ${pluralLabel} streak`
      : `${streakLength} ${frequency} streak`;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn(
          streakBadgeVariants({ size }),
          className,
        )}
        {...props}
      >
        {showFlame &&
          (icon ?? (
            <Flame
              className={cn(
                iconSize,
                "shrink-0 text-primary",
              )}
              aria-hidden="true"
            />
          ))}
        <span className={cn("font-semibold tracking-tight", valueSize)} aria-hidden="true">
          {streakLength}
          <span className="ml-2 font-medium text-muted-foreground">{valueUnit}</span>
        </span>
        <span className={cn("font-normal text-muted-foreground", subtitleSize)} aria-hidden="true">
          {subtitleText}
        </span>
      </div>
    );
  },
);
StreakBadge.displayName = "StreakBadge";

export { StreakBadge, streakBadgeVariants };
export type { StreakBadgeProps, StreakResponse };
