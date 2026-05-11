"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  Award,
  Clock,
  Flame,
  Sparkles,
  Target,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface PointsAwardTrigger {
  id: string;
  type: string;
  points: number;
  metricName?: string | null;
  metricThreshold?: number | null;
  achievementName?: string | null;
  streakLengthThreshold?: number | null;
  timeUnit?: "hour" | "day";
  timeInterval?: number | null;
}

export interface PointsAward {
  id: string;
  awarded: number;
  /** ISO 8601 datetime */
  date: string;
  /** User's total points after this award */
  total: number;
  trigger: PointsAwardTrigger;
}

interface PointsAwardsProps extends React.HTMLAttributes<HTMLDivElement> {
  awards: PointsAward[];
  formatTotalPoints?: (value: number) => string;
  formatAwardedPoints?: (value: number) => string;
  /** Format the award `date` for the first column (default: short locale date). */
  formatDate?: (isoDate: string) => string;
}

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 max-w-xs overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const triggerIconMap: Record<string, LucideIcon> = {
  metric: Target,
  achievement: Award,
  streak: Flame,
  time: Clock,
  user_creation: UserPlus,
};

function triggerIcon(type: string): LucideIcon {
  return triggerIconMap[type] ?? Sparkles;
}

/** Human-readable action line for tooltips — prefers `metricName` when present. */
function awardActionDescription(trigger: PointsAwardTrigger): string {
  if (trigger.metricName) {
    if (
      trigger.metricThreshold != null &&
      trigger.metricThreshold !== undefined
    ) {
      return `${trigger.metricName} · threshold ${Number(trigger.metricThreshold).toLocaleString()}`;
    }
    return trigger.metricName;
  }
  if (trigger.type === "achievement") {
    return trigger.achievementName ?? "Achievement";
  }
  if (trigger.type === "streak") {
    return trigger.streakLengthThreshold != null
      ? `Streak · ${trigger.streakLengthThreshold.toLocaleString()}`
      : "Streak";
  }
  if (
    trigger.type === "time" &&
    trigger.timeInterval != null &&
    trigger.timeUnit
  ) {
    return `Every ${trigger.timeInterval} ${trigger.timeUnit}(s)`;
  }
  if (trigger.type === "user_creation") {
    return "Account created";
  }
  return trigger.type.replace(/_/g, " ");
}

function defaultFormatAwardedPoints(value: number) {
  return value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString();
}

function defaultFormatAwardDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso.length >= 10 ? iso.slice(0, 10) : iso;
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PointsAwards = React.forwardRef<HTMLDivElement, PointsAwardsProps>(
  (
    {
      className,
      awards,
      formatTotalPoints,
      formatAwardedPoints,
      formatDate,
      ...props
    },
    ref
  ) => {
    const formatRowDate = formatDate ?? defaultFormatAwardDate;

    return (
      <div
        ref={ref}
        className={cn("w-full rounded-xl border bg-card", className)}
        {...props}
      >
        <TooltipProvider>
          <div role="list" aria-label="Points awards history" className="divide-y divide-border">
            {awards.map((award) => {
              const awardedLabel = formatAwardedPoints
                ? formatAwardedPoints(award.awarded)
                : defaultFormatAwardedPoints(award.awarded);
              const totalLabel = formatTotalPoints
                ? formatTotalPoints(award.total)
                : award.total.toLocaleString();
              const description = awardActionDescription(award.trigger);
              const tooltip = `${awardedLabel} — ${description}`;
              const Icon = triggerIcon(award.trigger.type);

              return (
                <div
                  key={award.id}
                  role="listitem"
                  className="grid grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 py-3"
                >
                  <span className="truncate text-muted-foreground text-sm">
                    {formatRowDate(award.date)}
                  </span>

                  <p className="flex items-center gap-2">
                    <span className="justify-self-center font-bold tabular-nums text-foreground">
                      {totalLabel}
                    </span>
                    <span className="font-medium tabular-nums text-success">
                      {awardedLabel}
                    </span>
                  </p>

                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          aria-label={tooltip}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground"
                        >
                          <Icon className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{tooltip}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    );
  }
);

PointsAwards.displayName = "PointsAwards";

export { PointsAwards };
export type { PointsAwardsProps };
