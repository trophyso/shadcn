"use client";

import * as React from "react";
import { Sparkle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

interface PointsBadgeData {
  name: string;
  badgeUrl: string | null;
  total: number;
}

const pointsBadgeVariants = cva(
  "flex items-center gap-3 rounded-lg transition-colors",
  {
    variants: {
      size: {
        sm: "text-sm gap-2",
        default: "",
        lg: "text-lg gap-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface PointsBadgeProps
  extends
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof pointsBadgeVariants> {
  points: PointsBadgeData;
  icon?: React.ComponentType<{ className?: string }>;
  formatValue?: (value: number) => string;
}

const PointsBadge = React.forwardRef<HTMLDivElement, PointsBadgeProps>(
  (
    {
      className,
      size,
      points,
      icon: CustomIcon,
      formatValue,
      ...props
    },
    ref,
  ) => {
    const Icon = CustomIcon ?? Sparkle;
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
    const statusLabel = `${displayValue} ${points.name}`;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={statusLabel}
        className={cn(pointsBadgeVariants({ size }), "border bg-card p-4", className)}
        {...props}
      >
        {points.badgeUrl ? (
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

        <div className="flex min-w-0 flex-col">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-bold tabular-nums",
                size === "lg" && "text-2xl",
                size === "sm" && "text-base",
                size === "default" && "text-xl",
              )}
            >
              {displayValue}
            </span>
            <span className="truncate text-muted-foreground">{points.name}</span>
          </div>
        </div>
      </div>
    );
  },
);
PointsBadge.displayName = "PointsBadge";

export { PointsBadge, pointsBadgeVariants };
export type { PointsBadgeProps, PointsBadgeData };
