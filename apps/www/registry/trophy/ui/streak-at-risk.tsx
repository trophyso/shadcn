"use client";

import * as React from "react";
import { AlertTriangle, Flame, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined - only fields used by this component)
interface StreakResponse {
  length: number;
  frequency: "daily" | "weekly" | "monthly";
  expires: string | null;
}

// Helper to calculate time remaining until end of day
function getTimeRemainingMs(expiresDate: string | null): number | null {
  if (!expiresDate) return null;

  // expires is a date string (YYYY-MM-DD), assume end of day (23:59:59)
  const expireDateTime = new Date(expiresDate + "T23:59:59");
  const now = new Date();
  const remaining = expireDateTime.getTime() - now.getTime();

  return remaining > 0 ? remaining : 0;
}

// Format time remaining
function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Variants
const streakAtRiskVariants = cva(
  "flex items-center gap-3 rounded-lg border p-4 transition-colors",
  {
    variants: {
      variant: {
        banner: "w-full",
        toast: "w-auto max-w-sm shadow-lg",
        inline: "w-auto",
      },
      severity: {
        warning:
          "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        critical:
          "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "banner",
      severity: "warning",
    },
  },
);

// Props
interface StreakAtRiskProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof streakAtRiskVariants>, "severity"> {
  /** Trophy API streak response */
  streak: StreakResponse;
  /** Hours threshold for warning state (default: 6) */
  warningHours?: number;
  /** Hours threshold for critical state (default: 2) */
  criticalHours?: number;
  /** Show countdown timer */
  showCountdown?: boolean;
  /** Allow dismissing the alert */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Callback when action button clicked */
  onAction?: () => void;
  /** Label for action button */
  actionLabel?: string;
}

const StreakAtRisk = React.forwardRef<HTMLDivElement, StreakAtRiskProps>(
  (
    {
      className,
      variant,
      streak,
      warningHours = 6,
      criticalHours = 2,
      showCountdown = true,
      dismissible = false,
      onDismiss,
      onAction,
      actionLabel = "Keep streak alive",
      ...props
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = React.useState(false);
    const [timeRemaining, setTimeRemaining] = React.useState<number | null>(
      () => getTimeRemainingMs(streak.expires),
    );

    // Update countdown
    React.useEffect(() => {
      if (!showCountdown || !streak.expires) return;

      const interval = setInterval(() => {
        setTimeRemaining(getTimeRemainingMs(streak.expires));
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }, [showCountdown, streak.expires]);

    // Don't render if dismissed
    if (dismissed) return null;

    // Don't render if no expiration or already expired
    if (timeRemaining === null || timeRemaining <= 0) return null;

    const hoursRemaining = timeRemaining / (1000 * 60 * 60);

    // Don't render if not at risk yet
    if (hoursRemaining > warningHours) return null;

    const isCritical = hoursRemaining <= criticalHours;
    const severity = isCritical ? "critical" : "warning";

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    const Icon = isCritical ? AlertTriangle : Flame;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(streakAtRiskVariants({ variant, severity }), className)}
        {...props}
      >
        <Icon className="h-5 w-5 shrink-0" />

        <div className="flex-1 space-y-1">
          <p className="font-medium">
            {isCritical ? "Streak expires soon!" : "Your streak is at risk"}
          </p>
          {showCountdown && (
            <p className="text-sm opacity-80">
              {formatTimeRemaining(timeRemaining)} remaining to extend your{" "}
              {streak.length}-{streak.frequency.replace("ly", "")} streak
            </p>
          )}
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isCritical
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-yellow-500 text-white hover:bg-yellow-600",
            )}
          >
            {actionLabel}
          </button>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
StreakAtRisk.displayName = "StreakAtRisk";

export { StreakAtRisk, streakAtRiskVariants };
export type { StreakAtRiskProps, StreakResponse };
