"use client";

import * as React from "react";
import { Snowflake } from "lucide-react";

import { cn } from "@/lib/utils";

// Types (inlined - only fields used by this component)
interface StreakPeriod {
  periodStart: string;
  periodEnd: string;
  usedFreeze?: boolean;
}

interface StreakResponse {
  streakHistory: StreakPeriod[];
}

// Helper to check if a date falls within a streak period
function isDateInPeriod(date: Date, period: StreakPeriod): boolean {
  const d = date.toISOString().split("T")[0];
  return d >= period.periodStart && d <= period.periodEnd;
}

// Helper to check if date used a freeze
function didUseFreezeOnDate(date: Date, periods: StreakPeriod[]): boolean {
  for (const period of periods) {
    if (isDateInPeriod(date, period) && period.usedFreeze) {
      return true;
    }
  }
  return false;
}

// Helper to check if date was active in streak
function wasDateActive(date: Date, periods: StreakPeriod[]): boolean {
  for (const period of periods) {
    if (isDateInPeriod(date, period)) {
      return true;
    }
  }
  return false;
}

// Get days in month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get day of week for first day of month (0 = Sunday)
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// Props
interface StreakCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trophy API streak response (must include streakHistory) */
  streak: StreakResponse;
  /** Month to display (default: current month) */
  month?: Date;
  /** Show freeze indicators */
  showFreezes?: boolean;
  /** Start of week: 0 = Sunday, 1 = Monday */
  startOfWeek?: 0 | 1;
  /** Callback when a day is clicked */
  onDayClick?: (date: Date, wasActive: boolean) => void;
}

const WEEKDAYS_SUNDAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_MONDAY = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const StreakCalendar = React.forwardRef<HTMLDivElement, StreakCalendarProps>(
  (
    {
      className,
      streak,
      month = new Date(),
      showFreezes = true,
      startOfWeek = 0,
      onDayClick,
      ...props
    },
    ref,
  ) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const firstDayOfMonth = getFirstDayOfMonth(year, monthIndex);

    // Adjust first day based on start of week preference
    const adjustedFirstDay =
      startOfWeek === 1
        ? (firstDayOfMonth + 6) % 7 // Monday start
        : firstDayOfMonth; // Sunday start

    const weekdays = startOfWeek === 1 ? WEEKDAYS_MONDAY : WEEKDAYS_SUNDAY;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const periods = streak.streakHistory ?? [];

    // Generate calendar days
    const days: (number | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const monthName = month.toLocaleDateString("en-US", { month: "long" });

    return (
      <div
        ref={ref}
        role="grid"
        aria-label={`Streak calendar for ${monthName} ${year}`}
        className={cn("w-full max-w-sm", className)}
        {...props}
      >
        {/* Header */}
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold" id="streak-calendar-title">
            {monthName} {year}
          </h3>
        </div>

        {/* Weekday headers */}
        <div role="row" className="mb-2 grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div
              key={day}
              role="columnheader"
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div role="rowgroup" className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const date = new Date(year, monthIndex, day);
            const isToday = date.getTime() === today.getTime();
            const isFuture = date > today;
            const isActive = wasDateActive(date, periods);
            const usedFreeze = showFreezes && didUseFreezeOnDate(date, periods);

            // Build accessible label
            const dateLabel = date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
            const statusLabel = usedFreeze
              ? "freeze used"
              : isActive
                ? "streak active"
                : isFuture
                  ? "future"
                  : "no activity";
            const ariaLabel = `${dateLabel}${isToday ? ", today" : ""}, ${statusLabel}`;

            return (
              <button
                key={day}
                type="button"
                role="gridcell"
                aria-label={ariaLabel}
                aria-current={isToday ? "date" : undefined}
                onClick={() => onDayClick?.(date, isActive)}
                disabled={isFuture}
                className={cn(
                  "relative aspect-square flex items-center justify-center rounded-md text-sm transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isToday && "ring-2 ring-primary",
                  isFuture && "text-muted-foreground/50 cursor-not-allowed",
                  isActive &&
                    !usedFreeze &&
                    "bg-orange-500 text-white hover:bg-orange-600",
                  usedFreeze && "bg-blue-500 text-white hover:bg-blue-600",
                )}
              >
                {day}
                {usedFreeze && (
                  <Snowflake className="absolute -top-1 -right-1 h-3 w-3 text-blue-200" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          role="legend"
          aria-label="Calendar legend"
          className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-orange-500" aria-hidden="true" />
            <span>Active</span>
          </div>
          {showFreezes && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-blue-500" aria-hidden="true" />
              <span>Freeze used</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);
StreakCalendar.displayName = "StreakCalendar";

export { StreakCalendar };
export type { StreakCalendarProps, StreakResponse, StreakPeriod };
