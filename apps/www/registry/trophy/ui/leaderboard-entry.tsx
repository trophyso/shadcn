"use client";

import * as React from "react";
import { Crown, Medal } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Types (inlined)
interface LeaderboardRanking {
  userId: string;
  userName: string | null;
  rank: number;
  value: number;
}

// Variants
const leaderboardEntryVariants = cva(
  "flex items-center gap-4 px-4 py-3 transition-colors",
  {
    variants: {
      variant: {
        default: "border-b last:border-b-0",
        card: "rounded-lg border bg-card shadow-sm",
        minimal: "",
      },
      size: {
        sm: "py-2 gap-3 text-sm",
        default: "py-3 gap-4",
        lg: "py-4 gap-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Helper to get rank display
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
interface LeaderboardEntryProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof leaderboardEntryVariants> {
  /** Ranking data */
  ranking: LeaderboardRanking;
  /** Is this the current user */
  isCurrentUser?: boolean;
  /** Force top-3 styling */
  isTopThree?: boolean;
  /** Show avatar */
  showAvatar?: boolean;
  /** Show value */
  showValue?: boolean;
  /** Label for value */
  valueLabel?: string;
  /** Custom avatar URL */
  avatarUrl?: string;
}

const LeaderboardEntry = React.forwardRef<
  HTMLDivElement,
  LeaderboardEntryProps
>(
  (
    {
      className,
      variant,
      size,
      ranking,
      isCurrentUser = false,
      isTopThree,
      showAvatar = true,
      showValue = true,
      valueLabel,
      avatarUrl,
      onClick,
      ...props
    },
    ref,
  ) => {
    const displayName =
      ranking.userName || `User ${ranking.userId.slice(0, 6)}`;
    const showMedal = isTopThree ?? ranking.rank <= 3;
    const rankDisplay = showMedal ? getRankDisplay(ranking.rank) : null;

    const avatarSize = {
      sm: "h-6 w-6 text-xs",
      default: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
    }[size ?? "default"];

    const rankSize = {
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
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={cn(
          leaderboardEntryVariants({ variant, size }),
          onClick && "cursor-pointer hover:bg-muted/50",
          isCurrentUser && "bg-primary/5",
          className,
        )}
        {...props}
      >
        {/* Rank */}
        <div className="w-12 flex justify-center shrink-0">
          {rankDisplay ? (
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                rankSize,
                rankDisplay.bg,
              )}
            >
              <rankDisplay.icon className={cn(iconSize, rankDisplay.color)} />
            </div>
          ) : (
            <span className="text-muted-foreground font-medium">
              #{ranking.rank}
            </span>
          )}
        </div>

        {/* Avatar + Name */}
        <div className="flex flex-1 items-center gap-3 min-w-0">
          {showAvatar &&
            (avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className={cn("rounded-full object-cover shrink-0", avatarSize)}
              />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full font-medium shrink-0",
                  avatarSize,
                  isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            ))}
          <span className={cn("truncate", isCurrentUser && "font-medium")}>
            {displayName}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                (you)
              </span>
            )}
          </span>
        </div>

        {/* Value */}
        {showValue && (
          <div className="text-right shrink-0">
            <span className="tabular-nums font-medium">
              {ranking.value.toLocaleString()}
            </span>
            {valueLabel && (
              <span className="ml-1 text-xs text-muted-foreground">
                {valueLabel}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
LeaderboardEntry.displayName = "LeaderboardEntry";

export { LeaderboardEntry, leaderboardEntryVariants };
export type { LeaderboardEntryProps, LeaderboardRanking };
