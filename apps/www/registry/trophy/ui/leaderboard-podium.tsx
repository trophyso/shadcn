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
const podiumVariants = cva("flex items-end justify-center gap-2", {
  variants: {
    size: {
      sm: "gap-1",
      default: "gap-2",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Medal styles for each position
const PODIUM_CONFIG = {
  1: {
    icon: Crown,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    ringColor: "ring-yellow-500/50",
    height: "h-32",
    heightSm: "h-24",
    heightLg: "h-40",
  },
  2: {
    icon: Medal,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    ringColor: "ring-gray-400/50",
    height: "h-24",
    heightSm: "h-20",
    heightLg: "h-32",
  },
  3: {
    icon: Medal,
    color: "text-amber-600",
    bg: "bg-amber-600/10",
    ringColor: "ring-amber-600/50",
    height: "h-20",
    heightSm: "h-16",
    heightLg: "h-28",
  },
} as const;

// Props
interface LeaderboardPodiumProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof podiumVariants> {
  /** Top 3 rankings (expects at least 1, ideally 3) */
  rankings: LeaderboardRanking[];
  /** Show value below name */
  showValue?: boolean;
  /** Show avatar */
  showAvatar?: boolean;
  /** Animate entrance */
  animated?: boolean;
  /** Medal style variant */
  medalStyle?: "classic" | "modern" | "minimal";
}

const LeaderboardPodium = React.forwardRef<
  HTMLDivElement,
  LeaderboardPodiumProps
>(
  (
    {
      className,
      size,
      rankings,
      showValue = true,
      showAvatar = true,
      animated = true,
      medalStyle = "classic",
      ...props
    },
    ref,
  ) => {
    // Get top 3, reorder for podium display: 2nd, 1st, 3rd
    const top3 = rankings.slice(0, 3);
    const podiumOrder = [
      top3.find((r) => r.rank === 2),
      top3.find((r) => r.rank === 1),
      top3.find((r) => r.rank === 3),
    ].filter(Boolean) as LeaderboardRanking[];

    if (podiumOrder.length === 0) {
      return null;
    }

    const avatarSize = {
      sm: "h-10 w-10 text-sm",
      default: "h-14 w-14 text-lg",
      lg: "h-20 w-20 text-2xl",
    }[size ?? "default"];

    const iconSize = {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
    }[size ?? "default"];

    const textSize = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    }[size ?? "default"];

    return (
      <div
        ref={ref}
        className={cn(podiumVariants({ size }), className)}
        role="list"
        aria-label="Top 3 rankings"
        {...props}
      >
        {podiumOrder.map((ranking, index) => {
          const config = PODIUM_CONFIG[ranking.rank as 1 | 2 | 3];
          if (!config) return null;

          const displayName =
            ranking.userName || `User ${ranking.userId.slice(0, 6)}`;
          const podiumHeight = {
            sm: config.heightSm,
            default: config.height,
            lg: config.heightLg,
          }[size ?? "default"];

          const itemLabel = `Rank ${ranking.rank}: ${displayName}${showValue ? `, ${ranking.value.toLocaleString()}` : ""}`;

          return (
            <div
              key={ranking.userId}
              role="listitem"
              aria-label={itemLabel}
              className={cn(
                "flex flex-col items-center",
                animated &&
                  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4",
                animated && index === 0 && "motion-safe:delay-100",
                animated && index === 1 && "motion-safe:delay-0",
                animated && index === 2 && "motion-safe:delay-200",
              )}
            >
              {/* Avatar with medal */}
              <div className="relative mb-2" aria-hidden="true">
                {showAvatar ? (
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full font-bold ring-4",
                      avatarSize,
                      config.bg,
                      config.ringColor,
                    )}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full",
                      avatarSize,
                      config.bg,
                    )}
                  >
                    <config.icon className={cn(iconSize, config.color)} />
                  </div>
                )}

                {/* Medal badge */}
                {medalStyle !== "minimal" && (
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-background shadow-sm",
                      size === "sm"
                        ? "h-5 w-5"
                        : size === "lg"
                          ? "h-8 w-8"
                          : "h-6 w-6",
                    )}
                  >
                    <config.icon
                      className={cn(
                        config.color,
                        size === "sm"
                          ? "h-3 w-3"
                          : size === "lg"
                            ? "h-5 w-5"
                            : "h-4 w-4",
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <span
                className={cn(
                  "font-medium text-center max-w-20 truncate",
                  textSize,
                )}
                title={displayName}
              >
                {displayName}
              </span>

              {/* Value */}
              {showValue && (
                <span
                  className={cn(
                    "text-muted-foreground tabular-nums",
                    size === "sm" ? "text-xs" : "text-sm",
                  )}
                >
                  {ranking.value.toLocaleString()}
                </span>
              )}

              {/* Podium block */}
              <div
                aria-hidden="true"
                className={cn(
                  "mt-2 w-16 rounded-t-lg",
                  size === "sm" && "w-12",
                  size === "lg" && "w-24",
                  podiumHeight,
                  config.bg,
                  medalStyle === "modern" && "rounded-t-xl",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 items-center justify-center font-bold",
                    config.color,
                  )}
                >
                  {ranking.rank}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
LeaderboardPodium.displayName = "LeaderboardPodium";

export { LeaderboardPodium, podiumVariants };
export type { LeaderboardPodiumProps, LeaderboardRanking };
