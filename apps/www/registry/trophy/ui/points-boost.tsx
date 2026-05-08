"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PointsBoostCta {
  link: string;
  text: string;
}

interface PointsBoostData {
  name: string;
  description: string;
  multiplier: number;
  cta: PointsBoostCta;
  endDate?: string | Date;
}

interface PointsBoostProps extends React.HTMLAttributes<HTMLDivElement> {
  boost: PointsBoostData;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `Ends in ${hours}h ${minutes}m ${seconds}s`;
}

const PointsBoost = React.forwardRef<HTMLDivElement, PointsBoostProps>(
  ({ className, boost, ...props }, ref) => {
    const endTimestamp = React.useMemo(() => {
      if (!boost.endDate) return null;
      const date = boost.endDate instanceof Date ? boost.endDate : new Date(boost.endDate);
      const timestamp = date.getTime();
      return Number.isNaN(timestamp) ? null : timestamp;
    }, [boost.endDate]);

    const [now, setNow] = React.useState(Date.now());

    React.useEffect(() => {
      if (!endTimestamp) return;
      const timer = window.setInterval(() => setNow(Date.now()), 1000);
      return () => window.clearInterval(timer);
    }, [endTimestamp]);

    const countdownLabel = React.useMemo(() => {
      if (!endTimestamp) return null;
      const remaining = endTimestamp - now;
      if (remaining <= 0) return "Ended";
      return formatCountdown(remaining);
    }, [endTimestamp, now]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-foreground shadow-sm",
          className
        )}
        {...props}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {boost.name}{" "}
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              x{boost.multiplier}
            </span>
          </p>
          <p className="truncate text-xs text-muted-foreground">{boost.description}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {countdownLabel ? (
            <span className="text-xs font-medium text-muted-foreground">{countdownLabel}</span>
          ) : null}
          <a
            href={boost.cta.link}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {boost.cta.text}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }
);

PointsBoost.displayName = "PointsBoost";

export { PointsBoost };
export type { PointsBoostCta, PointsBoostData, PointsBoostProps };
