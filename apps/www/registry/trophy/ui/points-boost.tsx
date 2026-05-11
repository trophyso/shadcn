"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

export type PointsBoostStatus = "active" | "scheduled" | "finished";

interface PointsBoostCta {
  link: string;
  text: string;
}

interface PointsBoostData {
  name: string;
  status: PointsBoostStatus;
  /** Optional subtitle below the title row. */
  description?: string;
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
          "flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 text-foreground",
          className
        )}
        {...props}
      >
        <div className="min-w-0 flex-1 flex flex-col gap-.5">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            <span className="min-w-0 truncate">{boost.name}</span>
            <span className="shrink-0 rounded-full bg-muted-foreground/10 px-2 py-0.5 text-primary">
              x{boost.multiplier}
            </span>
          </p>
          {boost.description ? (
            <p className="text-sm leading-snug text-muted-foreground">{boost.description}</p>
          ) : null}
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-3 self-center">
          {countdownLabel ? (
            <span className="text-xs font-medium text-muted-foreground">{countdownLabel}</span>
          ) : null}
          <Button asChild size="sm">
            <a href={boost.cta.link}>
              {boost.cta.text}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    );
  }
);

PointsBoost.displayName = "PointsBoost";

export { PointsBoost };
export type { PointsBoostCta, PointsBoostData, PointsBoostProps };
