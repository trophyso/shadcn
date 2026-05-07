"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Crown, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface LeaderboardRankingItem {
  userId: string;
  rank: number;
  name: string;
  byline: string;
  total: number;
  avatarUrl?: string | null;
  rankChange?: number;
  displayed?: boolean;
}

interface LeaderboardRankingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: LeaderboardRankingItem[];
  onUserClick?: (ranking: LeaderboardRankingItem) => void;
  currentUserId?: string;
  showPagination?: boolean;
  defaultPageSize?: 10 | 25 | 50 | 100;
}

const crownColorMap = {
  1: "text-rank-1",
  2: "text-rank-2",
  3: "text-rank-3",
} as const;

const pageSizeOptions = [10, 25, 50, 100] as const;

type LeaderboardRow = { type: "ranking"; ranking: LeaderboardRankingItem } | { type: "ellipsis"; key: string };

function formatTotal(total: number) {
  if (total >= 1000000) return `${(total / 1000000).toFixed(1)}m`;
  if (total >= 1000) return `${(total / 1000).toFixed(1)}k`;
  return total.toLocaleString();
}

const LeaderboardRankings = React.forwardRef<HTMLDivElement, LeaderboardRankingsProps>(
  (
    {
      className,
      rankings,
      onUserClick,
      currentUserId,
      showPagination = false,
      defaultPageSize = 10,
      ...props
    },
    ref
  ) => {
    const [pageSize, setPageSize] = React.useState<10 | 25 | 50 | 100>(defaultPageSize);
    const [currentPage, setCurrentPage] = React.useState(1);

    const totalPages = Math.max(1, Math.ceil(rankings.length / pageSize));

    React.useEffect(() => {
      setCurrentPage(1);
    }, [pageSize]);

    React.useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [currentPage, totalPages]);

    const pagedRankings = showPagination
      ? rankings.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : rankings;

    const rows = React.useMemo<LeaderboardRow[]>(() => {
      const nextRows: LeaderboardRow[] = [];
      let hiddenRunCount = 0;

      pagedRankings.forEach((ranking, index) => {
        const isDisplayed = ranking.displayed !== false;
        if (!isDisplayed) {
          hiddenRunCount += 1;
          return;
        }

        if (hiddenRunCount > 0) {
          nextRows.push({ type: "ellipsis", key: `ellipsis-${index}` });
          hiddenRunCount = 0;
        }

        nextRows.push({ type: "ranking", ranking });
      });

      if (hiddenRunCount > 0) {
        nextRows.push({ type: "ellipsis", key: "ellipsis-tail" });
      }

      return nextRows;
    }, [pagedRankings]);

    return (
      <div
        ref={ref}
        className={cn("w-full rounded-xl border bg-card", className)}
        {...props}
      >
        <div role="list" aria-label="Leaderboard rankings" className="divide-y divide-border">
          {rows.map((row) => {
            if (row.type === "ellipsis") {
              return (
                <div
                  key={row.key}
                  role="listitem"
                  aria-label="Collapsed leaderboard rows"
                  className="px-4 py-2 text-center text-muted-foreground text-md"
                >
                  ...
                </div>
              );
            }

            const ranking = row.ranking;
            const showCrown = ranking.rank <= 3;
            const crownColor = crownColorMap[ranking.rank as 1 | 2 | 3];
            const isCurrentUser = currentUserId === ranking.userId;

            return (
              <div
                key={ranking.userId}
                role="listitem"
                tabIndex={onUserClick ? 0 : undefined}
                onClick={() => onUserClick?.(ranking)}
                onKeyDown={
                  onUserClick
                    ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onUserClick(ranking);
                      }
                    }
                    : undefined
                }
                className={cn(
                  "flex items-center gap-2 px-4 py-3",
                  isCurrentUser && "rounded-md border-2 border-primary/70 bg-primary/10",
                  onUserClick && "cursor-pointer transition-colors hover:bg-muted/40"
                )}
              >
                <div className="flex w-12 items-center gap-1">
                  <span className="w-4 text-sm font-semibold tabular-nums">{ranking.rank}</span>
                  {showCrown ? (
                    <Crown className={cn("h-5 w-5", crownColor)} aria-hidden="true" />
                  ) : null}
                </div>

                {ranking.avatarUrl ? (
                  <img
                    src={ranking.avatarUrl}
                    alt={`${ranking.name} avatar`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                    {ranking.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-foreground font-medium">{ranking.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{ranking.byline}</p>
                </div>

                <div className="flex items-center gap-2 text-right">
                  {typeof ranking.rankChange === "number" && ranking.rankChange !== 0 ? (
                    <p
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        ranking.rankChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {ranking.rankChange > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {Math.abs(ranking.rankChange)}
                    </p>
                  ) : null}
                  <p className="text-xl font-semibold tabular-nums leading-none">
                    {formatTotal(ranking.total)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {showPagination ? (
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <label htmlFor="leaderboard-page-size" className="text-sm text-muted-foreground">
                Show
              </label>
              <select
                id="leaderboard-page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value) as 10 | 25 | 50 | 100)}
                className="rounded-md border bg-background px-2 py-1 text-sm text-muted-foreground"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md border p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                aria-label="Next page"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

LeaderboardRankings.displayName = "LeaderboardRankings";

export { LeaderboardRankings };
export type { LeaderboardRankingItem, LeaderboardRankingsProps };
