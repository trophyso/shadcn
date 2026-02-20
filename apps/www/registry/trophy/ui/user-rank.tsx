"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, Minus, Crown, Medal } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined)
interface LeaderboardRanking {
  userId: string;
  userName: string | null;
  rank: number;
  value: number;
}

type RankTrend = "up" | "down" | "same" | "new";

// Variants
const userRankVariants = cva(
  "flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors",
  {
    variants: {
      variant: {
        default: "",
        highlight: "border-primary/50 bg-primary/5",
        minimal: "border-transparent bg-transparent p-0",
      },
      size: {
        sm: "p-3 gap-3 text-sm",
        default: "p-4 gap-4",
        lg: "p-5 gap-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Helper to get rank badge
function getRankBadge(rank: number) {
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

// Helper to get trend display
function getTrendDisplay(trend: RankTrend, change?: number) {
  switch (trend) {
    case "up":
      return {
        icon: TrendingUp,
        color: "text-green-500",
        label: change ? `+${change}` : "↑",
      };
    case "down":
      return {
        icon: TrendingDown,
        color: "text-red-500",
        label: change ? `-${Math.abs(change)}` : "↓",
      };
    case "new":
      return {
        icon: null,
        color: "text-blue-500",
        label: "NEW",
      };
    case "same":
    default:
      return {
        icon: Minus,
        color: "text-muted-foreground",
        label: "—",
      };
  }
}

// Props
interface UserRankProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userRankVariants> {
  /** User ranking data */
  ranking: LeaderboardRanking;
  /** Trend direction */
  trend?: RankTrend;
  /** Rank change amount (positive = improved) */
  rankChange?: number;
  /** Total participants */
  totalParticipants?: number;
  /** Label for the metric */
  metricLabel?: string;
  /** Show avatar */
  showAvatar?: boolean;
  /** Custom avatar URL */
  avatarUrl?: string;
  /** Show percentile */
  showPercentile?: boolean;
}

const UserRank = React.forwardRef<HTMLDivElement, UserRankProps>(
  (
    {
      className,
      variant,
      size,
      ranking,
      trend = "same",
      rankChange,
      totalParticipants,
      metricLabel,
      showAvatar = true,
      avatarUrl,
      showPercentile = false,
      ...props
    },
    ref,
  ) => {
    const displayName =
      ranking.userName || `User ${ranking.userId.slice(0, 6)}`;
    const rankBadge = getRankBadge(ranking.rank);
    const trendDisplay = getTrendDisplay(trend, rankChange);

    const percentile =
      totalParticipants && totalParticipants > 0
        ? Math.round(
            ((totalParticipants - ranking.rank + 1) / totalParticipants) * 100,
          )
        : null;

    const avatarSize = {
      sm: "h-8 w-8 text-sm",
      default: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
    }[size ?? "default"];

    const badgeSize = {
      sm: "h-6 w-6",
      default: "h-8 w-8",
      lg: "h-10 w-10",
    }[size ?? "default"];

    const iconSize = {
      sm: "h-3 w-3",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    }[size ?? "default"];

    return (
      <div
        ref={ref}
        className={cn(userRankVariants({ variant, size }), className)}
        {...props}
      >
        {/* Avatar */}
        {showAvatar && (
          <div className="shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className={cn("rounded-full object-cover", avatarSize)}
              />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground",
                  avatarSize,
                )}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0">
          <span className="font-medium truncate">{displayName}</span>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="tabular-nums">
              {ranking.value.toLocaleString()}
            </span>
            {metricLabel && <span>{metricLabel}</span>}
          </div>
        </div>

        {/* Rank display */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-2">
            {/* Rank badge or number */}
            {rankBadge ? (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full",
                  badgeSize,
                  rankBadge.bg,
                )}
              >
                <rankBadge.icon className={cn(iconSize, rankBadge.color)} />
              </div>
            ) : (
              <span className="text-2xl font-bold tabular-nums">
                #{ranking.rank}
              </span>
            )}
          </div>

          {/* Trend indicator */}
          <div className={cn("flex items-center gap-1 text-xs", trendDisplay.color)}>
            {trendDisplay.icon && (
              <trendDisplay.icon className="h-3 w-3" />
            )}
            <span className="font-medium">{trendDisplay.label}</span>
          </div>
        </div>

        {/* Percentile or total (optional) */}
        {(showPercentile || totalParticipants) && (
          <div className="text-right text-sm text-muted-foreground shrink-0 hidden sm:block">
            {showPercentile && percentile !== null ? (
              <div>
                <span className="font-medium text-foreground">
                  Top {100 - percentile + 1}%
                </span>
              </div>
            ) : null}
            {totalParticipants && (
              <div className="text-xs">
                of {totalParticipants.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
UserRank.displayName = "UserRank";

export { UserRank, userRankVariants };
export type { UserRankProps, LeaderboardRanking, RankTrend };
