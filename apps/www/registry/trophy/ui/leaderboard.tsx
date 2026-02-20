"use client";

import * as React from "react";
import { Crown, Medal, Trophy, TrendingDown, TrendingUp } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined)
interface LeaderboardRanking {
  userId: string;
  userName: string | null;
  rank: number;
  value: number;
}

interface LeaderboardResponse {
  id: string;
  name: string;
  key: string;
  rankBy: "points" | "streak" | "metric";
  status: string;
  description: string | null;
  rankings: LeaderboardRanking[];
  start: string;
  end: string | null;
  maxParticipants: number;
}

// Variants
const leaderboardVariants = cva("w-full", {
  variants: {
    variant: {
      table: "divide-y divide-border",
      cards: "space-y-2",
      compact: "divide-y divide-border text-sm",
    },
  },
  defaultVariants: {
    variant: "table",
  },
});

// Helper to get rank icon/medal
function getRankDisplay(rank: number) {
  switch (rank) {
    case 1:
      return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    case 2:
      return { icon: Medal, color: "text-gray-400", bg: "bg-gray-400/10" };
    case 3:
      return { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10" };
    default:
      return null;
  }
}

// Props
interface LeaderboardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof leaderboardVariants> {
  /** Full leaderboard response from Trophy API */
  leaderboard?: LeaderboardResponse;
  /** Or just provide rankings directly */
  rankings?: LeaderboardRanking[];
  /** Highlight current user */
  currentUserId?: string;
  /** Max entries to show */
  limit?: number;
  /** Show value column */
  showValue?: boolean;
  /** Label for value column */
  valueLabel?: string;
  /** Show avatar placeholder */
  showAvatar?: boolean;
  /** Custom empty state */
  emptyState?: React.ReactNode;
  /** Callback when user row clicked */
  onUserClick?: (ranking: LeaderboardRanking) => void;
}

const Leaderboard = React.forwardRef<HTMLDivElement, LeaderboardProps>(
  (
    {
      className,
      variant,
      leaderboard,
      rankings: rankingsProp,
      currentUserId,
      limit,
      showValue = true,
      valueLabel = "Score",
      showAvatar = true,
      emptyState,
      onUserClick,
      ...props
    },
    ref,
  ) => {
    const rankings = leaderboard?.rankings ?? rankingsProp ?? [];
    const displayRankings = limit ? rankings.slice(0, limit) : rankings;

    if (displayRankings.length === 0) {
      if (emptyState) return <>{emptyState}</>;
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">No rankings yet</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(leaderboardVariants({ variant }), className)}
        role="list"
        aria-label="Leaderboard rankings"
        {...props}
      >
        {/* Header for table variant */}
        {variant === "table" && (
          <div className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
            <span className="w-12 text-center">Rank</span>
            <span className="flex-1">User</span>
            {showValue && <span className="w-20 text-right">{valueLabel}</span>}
          </div>
        )}

        {displayRankings.map((ranking) => {
          const isCurrentUser = ranking.userId === currentUserId;
          const rankDisplay = getRankDisplay(ranking.rank);
          const displayName =
            ranking.userName || `User ${ranking.userId.slice(0, 6)}`;

          return (
            <div
              key={ranking.userId}
              role="listitem"
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
              tabIndex={onUserClick ? 0 : undefined}
              className={cn(
                "flex items-center gap-4 px-4 py-3 transition-colors",
                variant === "cards" && "rounded-lg border bg-card",
                onUserClick && "cursor-pointer hover:bg-muted/50",
                isCurrentUser && "bg-primary/5 font-medium",
              )}
            >
              {/* Rank */}
              <div className="w-12 flex justify-center">
                {rankDisplay ? (
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      rankDisplay.bg,
                    )}
                  >
                    <rankDisplay.icon
                      className={cn("h-4 w-4", rankDisplay.color)}
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">#{ranking.rank}</span>
                )}
              </div>

              {/* Avatar + Name */}
              <div className="flex flex-1 items-center gap-3 min-w-0">
                {showAvatar && (
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="truncate">
                  {displayName}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (you)
                    </span>
                  )}
                </span>
              </div>

              {/* Value */}
              {showValue && (
                <span className="w-20 text-right tabular-nums font-medium">
                  {ranking.value.toLocaleString()}
                </span>
              )}
            </div>
          );
        })}

        {/* Show more indicator */}
        {limit && rankings.length > limit && (
          <div className="px-4 py-2 text-center text-sm text-muted-foreground">
            +{rankings.length - limit} more
          </div>
        )}
      </div>
    );
  },
);
Leaderboard.displayName = "Leaderboard";

export { Leaderboard, leaderboardVariants };
export type { LeaderboardProps, LeaderboardRanking, LeaderboardResponse };
