"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Sparkle } from "lucide-react"

import { cn } from "@/lib/utils"

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
  }
)

interface PointsBadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pointsBadgeVariants> {
  name: string
  total: number
  /** When omitted or `null`, the default icon is shown instead of an image. */
  badgeUrl?: string | null
  icon?: React.ComponentType<{ className?: string }>
  formatValue?: (value: number) => string
}

const PointsBadge = React.forwardRef<HTMLDivElement, PointsBadgeProps>(
  (
    {
      className,
      size,
      name,
      badgeUrl,
      total,
      icon: CustomIcon,
      formatValue,
      ...props
    },
    ref
  ) => {
    const Icon = CustomIcon ?? Sparkle
    const displayValue = formatValue
      ? formatValue(total)
      : total.toLocaleString()

    const iconSize = {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
    }[size ?? "default"]

    const badgeSize = {
      sm: "h-6 w-6",
      default: "h-8 w-8",
      lg: "h-10 w-10",
    }[size ?? "default"]
    const statusLabel = `${displayValue} ${name}`

    return (
      <div
        ref={ref}
        role="status"
        aria-label={statusLabel}
        className={cn(
          pointsBadgeVariants({ size }),
          "bg-card border p-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {badgeUrl ? (
            <div>
              <img
                src={badgeUrl}
                alt=""
                aria-hidden="true"
                className={cn("shrink-0 rounded object-contain", badgeSize)}
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className={cn(
                "bg-primary/10 flex shrink-0 items-center justify-center rounded-full",
                badgeSize
              )}
            >
              <Icon className={cn(iconSize, "text-primary")} />
            </div>
          )}

          <div>
            <span
              className={cn(
                "font-bold tabular-nums",
                size === "lg" && "text-2xl",
                size === "sm" && "text-base",
                size === "default" && "text-xl"
              )}
            >
              {displayValue}
            </span>
          </div>
        </div>

        <div>
          <span className="text-muted-foreground truncate">{name}</span>
        </div>
      </div>
    )
  }
)
PointsBadge.displayName = "PointsBadge"

export { PointsBadge, pointsBadgeVariants }
export type { PointsBadgeProps }
