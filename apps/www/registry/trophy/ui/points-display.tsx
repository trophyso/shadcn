"use client";

import * as React from "react";
import { Star, Zap, Award, Gift } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined from Trophy API)
interface PointsTrigger {
  id: string;
  type: "metric" | "api";
  points: number;
  metricName: string | null;
  metricThreshold: number | null;
}

interface PointsAward {
  id: string;
  awarded: number;
  date: string;
  total: number;
  trigger: PointsTrigger | null;
  boosts: PointsBoost[] | null;
}

interface PointsBoost {
  id: string;
  name: string;
  multiplier: number;
}

interface PointsResponse {
  id: string;
  name: string;
  description: string | null;
  badgeUrl: string | null;
  total: number;
  awards: PointsAward[];
}

// Variants
const pointsDisplayVariants = cva(
  "flex items-center gap-3 rounded-lg transition-colors",
  {
    variants: {
      variant: {
        default: "border bg-card p-4",
        minimal: "p-0",
        highlight: "border border-primary/50 bg-primary/5 p-4",
        inline: "gap-2 p-0",
      },
      size: {
        sm: "text-sm gap-2",
        default: "",
        lg: "text-lg gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Icon mapping for different point types
const iconMap = {
  xp: Zap,
  points: Star,
  credits: Gift,
  default: Award,
} as const;

// Props
interface PointsDisplayProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pointsDisplayVariants> {
  /** Points data from Trophy API */
  points: PointsResponse;
  /** Icon type to display */
  iconType?: keyof typeof iconMap;
  /** Custom icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Show badge image if available */
  showBadge?: boolean;
  /** Show points name */
  showName?: boolean;
  /** Show recent awards count */
  showRecentAwards?: number;
  /** Animate on change */
  animated?: boolean;
  /** Custom formatter for points value */
  formatValue?: (value: number) => string;
}

const PointsDisplay = React.forwardRef<HTMLDivElement, PointsDisplayProps>(
  (
    {
      className,
      variant,
      size,
      points,
      iconType = "default",
      icon: CustomIcon,
      showBadge = true,
      showName = true,
      showRecentAwards,
      animated = false,
      formatValue,
      ...props
    },
    ref,
  ) => {
    const Icon = CustomIcon ?? iconMap[iconType];
    const displayValue = formatValue
      ? formatValue(points.total)
      : points.total.toLocaleString();

    const iconSize = {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
    }[size ?? "default"];

    const badgeSize = {
      sm: "h-6 w-6",
      default: "h-8 w-8",
      lg: "h-10 w-10",
    }[size ?? "default"];

    const recentAwards = showRecentAwards
      ? points.awards.slice(0, showRecentAwards)
      : [];

    const statusLabel = `${displayValue} ${points.name}${recentAwards.length > 0 ? `, ${recentAwards.length} recent award${recentAwards.length > 1 ? "s" : ""}` : ""}`;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={statusLabel}
        className={cn(pointsDisplayVariants({ variant, size }), className)}
        {...props}
      >
        {/* Badge or Icon */}
        {showBadge && points.badgeUrl ? (
          <img
            src={points.badgeUrl}
            alt=""
            aria-hidden="true"
            className={cn("rounded object-contain shrink-0", badgeSize)}
          />
        ) : (
          <div
            aria-hidden="true"
            className={cn(
              "flex items-center justify-center rounded-full bg-primary/10 shrink-0",
              badgeSize,
            )}
          >
            <Icon className={cn(iconSize, "text-primary")} />
          </div>
        )}

        {/* Points info */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-bold tabular-nums",
                animated && "transition-all duration-300",
                size === "lg" && "text-2xl",
                size === "sm" && "text-base",
                size === "default" && "text-xl",
              )}
            >
              {displayValue}
            </span>
            {showName && variant !== "inline" && (
              <span className="text-muted-foreground truncate">
                {points.name}
              </span>
            )}
          </div>

          {/* Recent awards */}
          {recentAwards.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {recentAwards.map((award) => (
                <span
                  key={award.id}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <span className="text-green-500">+{award.awarded}</span>
                  {award.trigger?.metricName && (
                    <span className="truncate max-w-[100px]">
                      {award.trigger.metricName}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Inline variant shows name after value */}
        {showName && variant === "inline" && (
          <span className="text-muted-foreground">{points.name}</span>
        )}
      </div>
    );
  },
);
PointsDisplay.displayName = "PointsDisplay";

export { PointsDisplay, pointsDisplayVariants };
export type {
  PointsDisplayProps,
  PointsResponse,
  PointsAward,
  PointsTrigger,
  PointsBoost,
};
