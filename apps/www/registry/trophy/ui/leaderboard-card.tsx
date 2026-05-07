"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  LeaderboardPodium,
  type LeaderboardRanking as LeaderboardPodiumRanking,
} from "@/registry/trophy/ui/leaderboard-podium";
import {
  LeaderboardRankings,
  type LeaderboardRankingItem,
} from "@/registry/trophy/ui/leaderboard-rankings";

interface LeaderboardRunOption {
  id: string;
  label: string;
}

interface LeaderboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  fromDate: string | Date;
  toDate: string | Date;
  podiumRankings: LeaderboardPodiumRanking[];
  rankings: LeaderboardRankingItem[];
  currentUserId?: string;
  runOptions?: LeaderboardRunOption[];
  selectedRunId?: string;
  onRunChange?: (runId: string) => void;
}

function formatRangeDate(date: string | Date) {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const LeaderboardCard = React.forwardRef<HTMLDivElement, LeaderboardCardProps>(
  (
    {
      className,
      title = "Leaderboard",
      fromDate,
      toDate,
      podiumRankings,
      rankings,
      currentUserId,
      runOptions,
      selectedRunId,
      onRunChange,
      ...props
    },
    ref
  ) => {
    const fromLabel = formatRangeDate(fromDate);
    const toLabel = formatRangeDate(toDate);
    const activeRunId = selectedRunId ?? runOptions?.[0]?.id ?? "";

    return (
      <div ref={ref} className={cn("rounded-2xl border bg-card p-6 shadow-sm", className)} {...props}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {fromLabel} - {toLabel}
            </p>
          </div>

          {runOptions && runOptions.length > 0 ? (
            <select
              aria-label="Select leaderboard run"
              value={activeRunId}
              onChange={(e) => onRunChange?.(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {runOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <LeaderboardPodium rankings={podiumRankings} className="mb-6" />

        <LeaderboardRankings
          rankings={rankings}
          currentUserId={currentUserId}
          showPagination
          defaultPageSize={10}
        />
      </div>
    );
  }
);

LeaderboardCard.displayName = "LeaderboardCard";

export { LeaderboardCard };
export type { LeaderboardCardProps, LeaderboardRunOption };
