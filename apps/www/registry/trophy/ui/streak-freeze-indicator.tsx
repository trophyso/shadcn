"use client";

import * as React from "react";
import { Snowflake } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined)
interface StreakResponse {
  length: number;
  frequency: "daily" | "weekly" | "monthly";
  started: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  expires: string | null;
  streakHistory: Array<{
    periodStart: string;
    periodEnd: string;
    length: number;
    usedFreeze?: boolean;
  }>;
  rank: number | null;
  freezes?: number;
  maxFreezes?: number;
  freezeAutoEarnInterval?: number;
  freezeAutoEarnAmount?: number;
}

// Variants
const freezeIndicatorVariants = cva("inline-flex items-center gap-1", {
  variants: {
    variant: {
      dots: "gap-1",
      snowflakes: "gap-0.5",
      text: "gap-1.5",
    },
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "dots",
    size: "default",
  },
});

// Props
interface StreakFreezeIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof freezeIndicatorVariants> {
  /** Trophy API streak response */
  streak?: StreakResponse;
  /** Manual freeze count (alternative to streak prop) */
  freezes?: number;
  /** Manual max freezes (alternative to streak prop) */
  maxFreezes?: number;
  /** Show "2/3" format instead of just indicators */
  showMax?: boolean;
  /** Custom filled indicator */
  filledIcon?: React.ReactNode;
  /** Custom empty indicator */
  emptyIcon?: React.ReactNode;
}

const StreakFreezeIndicator = React.forwardRef<
  HTMLDivElement,
  StreakFreezeIndicatorProps
>(
  (
    {
      className,
      variant,
      size,
      streak,
      freezes: freezesProp,
      maxFreezes: maxFreezesProp,
      showMax = false,
      filledIcon,
      emptyIcon,
      ...props
    },
    ref,
  ) => {
    const freezes = streak?.freezes ?? freezesProp ?? 0;
    const maxFreezes = streak?.maxFreezes ?? maxFreezesProp ?? freezes;

    // If no freezes configured, don't render
    if (maxFreezes === 0) {
      return null;
    }

    const iconSize = {
      sm: "h-3 w-3",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    }[size ?? "default"];

    const dotSize = {
      sm: "h-2 w-2",
      default: "h-2.5 w-2.5",
      lg: "h-3 w-3",
    }[size ?? "default"];

    const ariaLabel = `${freezes} of ${maxFreezes} streak freeze${maxFreezes === 1 ? "" : "s"} available`;

    // Text variant
    if (variant === "text") {
      return (
        <div
          ref={ref}
          role="status"
          aria-label={ariaLabel}
          className={cn(freezeIndicatorVariants({ variant, size }), className)}
          {...props}
        >
          <Snowflake className={cn(iconSize, "text-blue-500")} aria-hidden="true" />
          <span className="font-medium" aria-hidden="true">
            {freezes}
            {showMax && (
              <span className="text-muted-foreground">/{maxFreezes}</span>
            )}
          </span>
        </div>
      );
    }

    // Dots or snowflakes variant
    const indicators = [];
    for (let i = 0; i < maxFreezes; i++) {
      const isFilled = i < freezes;

      if (variant === "snowflakes") {
        indicators.push(
          <Snowflake
            key={i}
            className={cn(
              iconSize,
              isFilled ? "text-blue-500" : "text-muted-foreground/30",
            )}
          />,
        );
      } else {
        // dots variant (default)
        indicators.push(
          <div
            key={i}
            className={cn(
              dotSize,
              "rounded-full transition-colors",
              isFilled ? "bg-blue-500" : "bg-muted-foreground/30",
            )}
          />,
        );
      }
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn(freezeIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        <span aria-hidden="true" className="inline-flex items-center gap-inherit">
          {indicators}
          {showMax && variant === "dots" && (
            <span className="ml-1 text-muted-foreground">
              {freezes}/{maxFreezes}
            </span>
          )}
        </span>
      </div>
    );
  },
);
StreakFreezeIndicator.displayName = "StreakFreezeIndicator";

export { StreakFreezeIndicator, freezeIndicatorVariants };
export type { StreakFreezeIndicatorProps, StreakResponse };
