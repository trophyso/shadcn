"use client";

import * as React from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Flame, RefreshCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { StreakCalendar, type StreakPeriod } from "@/registry/trophy/ui/streak-calendar";

interface StreakCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Streak periods passed through to StreakCalendar */
  streak: StreakPeriod[];
  /** Current streak value in days */
  currentStreak: number;
  /** Longest streak value in days */
  longestStreak: number;
  /** Secondary total metric value */
  total: number;
  /** Optional heading text */
  title?: string;
  /** Label for the action button */
  actionLabel?: string;
  /** Callback for action click */
  onActionClick?: () => void;
  /** Show "How streaks work" dropdown section */
  showHowItWorks?: boolean;
  /** Title for the dropdown trigger */
  howItWorksTitle?: string;
  /** Content rows shown when the dropdown is expanded */
  howItWorksItems?: string[];
  /** Initial expanded state for dropdown */
  defaultHowItWorksOpen?: boolean;
}

const StreakCard = React.forwardRef<HTMLDivElement, StreakCardProps>(
  (
    {
      className,
      streak,
      currentStreak,
      longestStreak,
      total,
      title = "Streak",
      actionLabel = "View Details",
      onActionClick,
      showHowItWorks = true,
      howItWorksTitle = "How do streaks work?",
      howItWorksItems = [
        "Complete at least one activity each day to build your streak.",
        "Each day you do an activity, your streak increases.",
        "Missing a day will reset your streak to 0.",
      ],
      defaultHowItWorksOpen = false,
      ...props
    },
    ref,
  ) => {
    const [isHowItWorksOpen, setIsHowItWorksOpen] = React.useState(defaultHowItWorksOpen);
    const howItWorksContentId = React.useId();

    return (
      <section
        ref={ref}
        aria-label="Streak summary card"
        className={cn("rounded-2xl border bg-card p-6 shadow-sm", className)}
        {...props}
      >
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="text-2xl font-semibold leading-none">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onActionClick}
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors",
              "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-label={actionLabel}
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" />
          </button>
        </header>

        <p className="mb-4 text-5xl font-semibold leading-none tracking-tight">
          {currentStreak}
          <span className="ml-2 text-2xl font-medium text-muted-foreground">days</span>
        </p>

        <StreakCalendar
          streak={streak}
          view="week"
          startOfWeek={1}
          className="max-w-none"
        />

        <div
          className="mt-4 grid grid-cols-2 gap-4 border-t border-dashed pt-4"
          aria-label="Streak stats"
        >
          <div>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
            <p className="text-3xl font-semibold leading-tight">
              {longestStreak}
              <span className="ml-1 text-2xl font-medium">days</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-semibold leading-tight">{total}</p>
          </div>
        </div>

        {showHowItWorks && (
          <div className="mt-4 border-t pt-4">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3 text-left"
              onClick={() => setIsHowItWorksOpen((prev) => !prev)}
              aria-expanded={isHowItWorksOpen}
              aria-controls={howItWorksContentId}
            >
              <span className="text-lg font-semibold">{howItWorksTitle}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isHowItWorksOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {isHowItWorksOpen && (
              <div id={howItWorksContentId} className="space-y-4 px-2 pt-4">
                {howItWorksItems.map((item, index) => {
                  const Icon = index === 0 ? CheckCircle2 : index === 1 ? Flame : RefreshCcw;
                  return (
                    <div key={`${item}-${index}`} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <p className="text-lg leading-snug text-muted-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    );
  },
);
StreakCard.displayName = "StreakCard";

export { StreakCard };
export type { StreakCardProps };
