"use client";

import * as React from "react";
import {
  BadgeCheck,
  Medal,
  Shield,
  ShieldCheck,
  ShieldHalf,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type PointsLevelSimpleIconType =
  | "beginner"
  | "novice"
  | "intermediate"
  | "professional"
  | "expert"
  | "master"
  | "grand-master"
  | "enlightened";

/** Optional sub-tier row; Trophy does not return these — use `[]` when integrating. */
export interface PointsSubLevelSimple {
  name: string;
  points: number;
}

/**
 * Level row for the simple table. Aligns with Trophy `PointsLevel` (`points`, `description`, …)
 * plus optional **`iconType`** for which Lucide icon to show.
 */
export interface PointsLevelSimple {
  id: string;
  key?: string;
  name: string;
  description?: string;
  badgeUrl?: string | null;
  /** Points required to reach this level (Trophy `points`). */
  points: number;
  iconType?: PointsLevelSimpleIconType;
  /** Not returned by Trophy; omit or pass `[]` for API-driven data. */
  subLevels?: PointsSubLevelSimple[];
}

interface PointsLevelsSimpleProps extends React.HTMLAttributes<HTMLDivElement> {
  levels: PointsLevelSimple[];
  currentPoints?: number;
  showProgressBar?: boolean;
  currentLevelLabel?: string;
  formatPoints?: (value: number) => string;
}

const pointsLevelSimpleIconMap: Record<PointsLevelSimpleIconType, LucideIcon> = {
  beginner: Shield,
  novice: ShieldHalf,
  intermediate: BadgeCheck,
  professional: ShieldCheck,
  expert: Medal,
  master: Trophy,
  "grand-master": Trophy,
  enlightened: Sparkles,
};

function formatRange(
  points: number,
  nextLevelPoints: number | null | undefined,
  formatPoints?: (value: number) => string
) {
  const format = formatPoints ?? ((value: number) => value.toLocaleString());
  if (typeof nextLevelPoints === "number") {
    return `${format(points)}-${format(nextLevelPoints - 1)}`;
  }
  return `${format(points)}+`;
}

const PointsLevelsSimple = React.forwardRef<HTMLDivElement, PointsLevelsSimpleProps>(
  (
    {
      className,
      levels,
      currentPoints,
      showProgressBar = false,
      currentLevelLabel = "Your current level",
      formatPoints,
      ...props
    },
    ref
  ) => {
    const currentLevelIndex =
      typeof currentPoints === "number"
        ? levels.reduce((matchedIndex, level, index) => {
          if (currentPoints >= level.points) {
            return index;
          }
          return matchedIndex;
        }, -1)
        : -1;
    const currentLevel = currentLevelIndex >= 0 ? levels[currentLevelIndex] : undefined;
    const nextLevel =
      currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1
        ? levels[currentLevelIndex + 1]
        : undefined;
    const shouldShowProgressBar =
      showProgressBar && typeof currentPoints === "number" && Boolean(currentLevel && nextLevel);

    let progressPercent = 0;
    let pointsUntilNextLevel = 0;
    if (shouldShowProgressBar && currentLevel && nextLevel) {
      const start = currentLevel.points;
      const end = nextLevel.points;
      const ratio = end > start ? (currentPoints - start) / (end - start) : 1;
      progressPercent = Math.max(0, Math.min(ratio * 100, 100));
      pointsUntilNextLevel = Math.max(0, end - currentPoints);
    }

    const format = formatPoints ?? ((value: number) => value.toLocaleString());

    return (
      <div ref={ref} className={cn("w-full rounded-xl border bg-card", className)} {...props}>
        {shouldShowProgressBar && currentLevel && nextLevel ? (
          <div className="space-y-3 border-b px-4 py-4">
            <p className="text-foreground">
              <span className="font-semibold">{format(currentPoints)}</span> points.{" "}
              <span className="font-semibold">{format(pointsUntilNextLevel)}</span> until{" "}
              <span className="font-semibold">{nextLevel.name}</span>
            </p>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
              >
                {React.createElement(pointsLevelSimpleIconMap[currentLevel.iconType ?? "beginner"], {
                  className: "h-4 w-4",
                })}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`Progress from ${currentLevel.name} to ${nextLevel.name}`}
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
              >
                {React.createElement(pointsLevelSimpleIconMap[nextLevel.iconType ?? "beginner"], {
                  className: "h-4 w-4",
                })}
              </span>
            </div>
          </div>
        ) : null}
        <div role="list" aria-label="Points levels" className="divide-y divide-border">
          {levels.map((level, index) => {
            const Icon = pointsLevelSimpleIconMap[level.iconType ?? "beginner"];
            const nextLevelPoints = index < levels.length - 1 ? levels[index + 1].points : null;

            return (
              <div
                key={level.id}
                role="listitem"
                className="grid grid-cols-[14rem_1fr_12rem] items-center gap-4 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full",
                      !currentPoints || (currentPoints && currentPoints >= level.points)
                        ? "bg-primary text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="tabular-nums text-foreground text-sm">
                    {formatRange(level.points, nextLevelPoints, formatPoints)}
                  </span>
                </div>

                <span className="truncate whitespace-nowrap font-semibold text-foreground text-sm">
                  {level.name}
                </span>

                <span className="text-sm text-muted-foreground">
                  {currentLevelIndex >= 0 && levels[currentLevelIndex]?.id === level.id ? currentLevelLabel : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

PointsLevelsSimple.displayName = "PointsLevelsSimple";

export { PointsLevelsSimple };
export type { PointsLevelsSimpleProps };
