"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Check, Snowflake } from "lucide-react";

import { cn } from "@/lib/utils";

// Types (inlined - only fields used by this component)
interface StreakPeriod {
  periodStart: string;
  periodEnd: string;
  usedFreeze?: boolean;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to check if a date falls within a streak period
function isDateInPeriod(date: Date, period: StreakPeriod): boolean {
  const d = formatDateKey(date);
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
  /** Streak periods */
  streak: StreakPeriod[];
  /** Calendar layout variant */
  view?: "week" | "month" | "year";
  /** Month to display (default: current month) */
  month?: Date;
  /** Date used for week view (default: today) */
  referenceDate?: Date;
  /** Show freeze indicators */
  showFreezes?: boolean;
  /** Start of week: 0 = Sunday, 1 = Monday */
  startOfWeek?: 0 | 1;
  /** Callback when a day is clicked */
  onDayClick?: (date: Date, wasActive: boolean) => void;
}

const WEEKDAYS_SUNDAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_MONDAY = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

function getDateKey(date: Date): string {
  return formatDateKey(date);
}

function getWeekStart(date: Date, startOfWeek: 0 | 1): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay();
  const offset = startOfWeek === 1 ? (day + 6) % 7 : day;
  next.setDate(next.getDate() - offset);
  return next;
}

function getWeekDates(reference: Date, startOfWeek: 0 | 1): Date[] {
  const start = getWeekStart(reference, startOfWeek);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function getWeekdayIndex(date: Date, startOfWeek: 0 | 1): number {
  const day = date.getDay();
  return startOfWeek === 1 ? (day + 6) % 7 : day;
}

function getGitDates(endDate: Date): Date[] {
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (364 - index));
    return date;
  });
}

function getGitCells(
  endDate: Date,
  startOfWeek: 0 | 1,
): {
  cells: (Date | null)[];
  dates: Date[];
} {
  const dates = getGitDates(endDate);
  const firstDate = dates[0];
  if (!firstDate) return { cells: [], dates: [] };

  const leadingEmptyCells = getWeekdayIndex(firstDate, startOfWeek);
  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingEmptyCells }, () => null),
    ...dates,
  ];

  return { cells, dates };
}

const StreakCalendar = React.forwardRef<HTMLDivElement, StreakCalendarProps>(
  (
    {
      className,
      streak,
      view = "week",
      month = new Date(),
      referenceDate = new Date(),
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

    const periods = streak ?? [];
    const weekDates = getWeekDates(referenceDate, startOfWeek);
    const { cells: gitCells, dates: gitDates } = getGitCells(today, startOfWeek);
    const gitColumnCount = Math.ceil(gitCells.length / 7);
    const gitGridTemplateColumns = `repeat(${gitColumnCount}, 1rem)`;
    const gitMonthLabels: Array<{ column: number; label: string }> = [];
    const seenGitMonths = new Set<string>();

    gitCells.forEach((date, cellIndex) => {
      if (!date) return;
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!seenGitMonths.has(monthKey) && date.getDate() === 1) {
        seenGitMonths.add(monthKey);
        gitMonthLabels.push({
          column: Math.floor(cellIndex / 7),
          label: date.toLocaleDateString("en-US", { month: "short" }),
        });
      }
    });

    const firstDate = gitDates[0];
    if (firstDate) {
      const firstMonthKey = `${firstDate.getFullYear()}-${firstDate.getMonth()}`;
      if (!seenGitMonths.has(firstMonthKey)) {
        gitMonthLabels.unshift({
          column: 0,
          label: firstDate.toLocaleDateString("en-US", { month: "short" }),
        });
      }
    }

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
    const gitEndMonthName = today.toLocaleDateString("en-US", {
      month: "long",
    });

    const freezeColorStyles = {
      "--freeze-color": "var(--info)",
      "--freeze-foreground-color": "var(--info-foreground)",
    } as React.CSSProperties;

    const getCellState = (date: Date) => {
      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;
      const isActive = wasDateActive(date, periods);
      const usedFreeze = showFreezes && didUseFreezeOnDate(date, periods);
      return { isToday, isFuture, isActive, usedFreeze };
    };

    return (
      <div
        ref={ref}
        role="grid"
        aria-label={`Streak calendar ${view} view`}
        className={cn("w-full", view === "month" ? "max-w-sm" : "max-w-3xl", className)}
        {...props}
      >
        {view === "month" && (
          <>
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold" id="streak-calendar-title">
                {monthName} {year}
              </h3>
            </div>
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
            <div role="rowgroup" className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }
                const date = new Date(year, monthIndex, day);
                const { isToday, isFuture, isActive, usedFreeze } = getCellState(date);
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
                return (
                  <button
                    key={day}
                    type="button"
                    role="gridcell"
                    aria-label={`${dateLabel}${isToday ? ", today" : ""}, ${statusLabel}`}
                    aria-current={isToday ? "date" : undefined}
                    onClick={() => onDayClick?.(date, isActive)}
                    disabled={isFuture}
                    className={cn(
                      "relative aspect-square flex items-center justify-center rounded-lg text-sm transition-colors",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring p-1",
                      isToday && "ring-2 ring-inset ring-primary !bg-primary-foreground !text-primary",
                      isFuture && "text-muted-foreground/50 cursor-not-allowed",
                      isActive &&
                      !usedFreeze &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      usedFreeze &&
                      "bg-[var(--freeze-color)] text-[var(--freeze-foreground-color)] hover:opacity-90",
                    )}
                    style={usedFreeze ? freezeColorStyles : undefined}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {view === "week" && (
          <div role="rowgroup" className="grid grid-cols-7 gap-2">
            {weekDates.map((date) => {
              const { isToday, isFuture, isActive, usedFreeze } = getCellState(date);
              const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
              return (
                <div key={getDateKey(date)} className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    role="gridcell"
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}, ${usedFreeze ? "freeze used" : isActive ? "streak active" : isFuture ? "future" : "no activity"}`}
                    onClick={() => onDayClick?.(date, isActive)}
                    disabled={isFuture}
                    className={cn(
                      "relative flex h-12 w-12 items-center justify-center rounded-full border border-2 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      !isFuture && "hover:opacity-90",
                      isToday && "!bg-primary-foreground !text-primary",
                      isFuture &&
                      "cursor-not-allowed border-border/40 bg-muted/20 text-muted-foreground/40",
                      isActive &&
                      !usedFreeze &&
                      "border-primary bg-primary text-primary-foreground",
                      usedFreeze &&
                      "border-[var(--freeze-color)] bg-[var(--freeze-color)] text-[var(--freeze-foreground-color)]",
                      !isActive && !usedFreeze && !isFuture && "border-border/60 bg-muted/30",
                    )}
                    style={usedFreeze ? freezeColorStyles : undefined}
                  >
                    {usedFreeze ? (
                      <Snowflake className={cn("h-5 w-5", isToday && "!text-muted-foreground/20")} />
                    ) : (
                      isActive && <Check className={cn("h-5 w-5", isToday && "!text-muted-foreground/20")} />
                    )}
                  </button>
                  <span
                    className={cn(
                      "text-sm",
                      isFuture ? "text-muted-foreground/50" : "text-foreground",
                    )}
                  >
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {view === "year" && (
          <>
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold" id="streak-calendar-title">
                Last 365 days
              </h3>
              <p className="text-xs text-muted-foreground">
                Ending {gitEndMonthName} {today.getDate()}
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block pr-16">
                <div
                  aria-hidden="true"
                  className="mb-2 grid gap-1"
                  style={{ gridTemplateColumns: gitGridTemplateColumns }}
                >
                  {gitMonthLabels.map((month) => (
                    <span
                      key={`${month.column}-${month.label}`}
                      className="text-xs text-muted-foreground whitespace-nowrap"
                      style={{ gridColumnStart: month.column + 1 }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>
                <TooltipProvider>
                  <div
                    role="rowgroup"
                    className="grid grid-flow-col grid-rows-7 gap-1"
                    style={{ gridTemplateColumns: gitGridTemplateColumns }}
                  >
                    {gitCells.map((date, index) => {
                      if (!date) {
                        return <div key={`git-empty-${index}`} className="h-4 w-4" />;
                      }
                      const { isToday, isActive, usedFreeze } = getCellState(date);
                      const dateLabel = date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                      return (
                        <Tooltip key={getDateKey(date)}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              role="gridcell"
                              aria-current={isToday ? "date" : undefined}
                              aria-label={`${dateLabel}, ${usedFreeze ? "freeze used" : isActive ? "streak active" : "no activity"}`}
                              onClick={() => onDayClick?.(date, isActive)}
                              className={cn(
                                "h-4 w-4 rounded-[0.4rem] border border-border/40 transition-colors",
                                "hover:ring-1 hover:ring-ring",
                                isToday && "!bg-primary-foreground !text-primary border-primary",
                                isActive && !usedFreeze && "bg-primary border-primary/80",
                                usedFreeze &&
                                "bg-[var(--freeze-color)] border-[var(--freeze-color)]",
                                !isActive && !usedFreeze && "bg-muted/40",
                              )}
                              style={usedFreeze ? freezeColorStyles : undefined}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top">{dateLabel}</TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);
StreakCalendar.displayName = "StreakCalendar";

export { StreakCalendar };
export type { StreakCalendarProps, StreakPeriod };
