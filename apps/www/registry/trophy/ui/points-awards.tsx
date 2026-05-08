"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  BookOpenCheck,
  Brain,
  CheckCheck,
  FileCheck2,
  Flame,
  MessageSquarePlus,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type PointsAwardActionType =
  | "lesson-completed"
  | "quiz-passed"
  | "assignment-submitted"
  | "streak-maintained"
  | "discussion-contribution"
  | "flashcards-reviewed";

interface PointsAwardAction {
  type: PointsAwardActionType;
  points: number;
  label?: string;
}

interface PointsAwardRow {
  id: string;
  date: string;
  totalPoints: number;
  actions: PointsAwardAction[];
}

interface PointsAwardsProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: PointsAwardRow[];
  formatTotalPoints?: (value: number) => string;
  formatAwardedPoints?: (value: number) => string;
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
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const actionIconMap: Record<PointsAwardActionType, LucideIcon> = {
  "lesson-completed": BookOpenCheck,
  "quiz-passed": CheckCheck,
  "assignment-submitted": FileCheck2,
  "streak-maintained": Flame,
  "discussion-contribution": MessageSquarePlus,
  "flashcards-reviewed": Brain,
};

const actionLabelMap: Record<PointsAwardActionType, string> = {
  "lesson-completed": "completed lessons",
  "quiz-passed": "passed quizzes",
  "assignment-submitted": "submitted assignments",
  "streak-maintained": "maintained your streak",
  "discussion-contribution": "contributed to discussions",
  "flashcards-reviewed": "reviewed flashcards",
};

function defaultFormatAwardedPoints(value: number) {
  return value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString();
}

const PointsAwards = React.forwardRef<HTMLDivElement, PointsAwardsProps>(
  ({ className, rows, formatTotalPoints, formatAwardedPoints, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full rounded-xl border bg-card", className)}
        {...props}
      >
        <TooltipProvider>
          <div role="list" aria-label="Points awards history" className="divide-y divide-border">
            {rows.map((row) => {
              const awardedPoints = row.actions.reduce((sum, action) => sum + action.points, 0);
              const awardedLabel = formatAwardedPoints
                ? formatAwardedPoints(awardedPoints)
                : defaultFormatAwardedPoints(awardedPoints);
              const totalLabel = formatTotalPoints
                ? formatTotalPoints(row.totalPoints)
                : row.totalPoints.toLocaleString();

              return (
                <div
                  key={row.id}
                  role="listitem"
                  className="grid grid-cols-[11rem_8rem_minmax(0,1fr)] items-center gap-4 px-4 py-3"
                >
                  <span className="truncate text-muted-foreground">{row.date}</span>

                  <span className="justify-self-center font-bold tabular-nums text-foreground">
                    {totalLabel}
                  </span>

                  <div className="flex items-center justify-end gap-2">
                    <span className="font-medium tabular-nums text-success">
                      {awardedLabel}
                    </span>
                    {row.actions.map((action, index) => {
                      const Icon = actionIconMap[action.type];
                      const actionLabel = action.label ?? actionLabelMap[action.type];
                      const actionTooltip = `You ${actionLabel}`;

                      return (
                        <Tooltip key={`${row.id}-${action.type}-${index}`}>
                          <TooltipTrigger asChild>
                            <span
                              aria-label={actionTooltip}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground"
                            >
                              <Icon className="h-3 w-3" aria-hidden="true" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {actionTooltip}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
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
export type {
  PointsAwardAction,
  PointsAwardActionType,
  PointsAwardRow,
  PointsAwardsProps,
};
