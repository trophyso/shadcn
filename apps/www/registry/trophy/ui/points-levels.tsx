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

type PointsLevelIconType =
  | "beginner"
  | "novice"
  | "intermediate"
  | "professional"
  | "expert"
  | "master"
  | "grand-master"
  | "enlightened";

interface PointsLevel {
  id: string;
  minPoints: number;
  maxPoints: number | null;
  name: string;
  iconType?: PointsLevelIconType;
}

interface PointsLevelsProps extends React.HTMLAttributes<HTMLDivElement> {
  levels: PointsLevel[];
  currentLevelId?: string;
  currentPoints?: number;
  currentLevelLabel?: string;
  formatPoints?: (value: number) => string;
}

const pointsLevelIconMap: Record<PointsLevelIconType, LucideIcon> = {
  beginner: Shield,
  novice: ShieldHalf,
  intermediate: BadgeCheck,
  professional: ShieldCheck,
  expert: Medal,
  master: Trophy,
  "grand-master": Trophy,
  enlightened: Sparkles,
};

function formatRange(level: PointsLevel, formatPoints?: (value: number) => string) {
  const format = formatPoints ?? ((value: number) => value.toLocaleString());
  if (level.maxPoints === null) {
    return `${format(level.minPoints)}+`;
  }
  return `${format(level.minPoints)}-${format(level.maxPoints)}`;
}

const PointsLevels = React.forwardRef<HTMLDivElement, PointsLevelsProps>(
  (
    {
      className,
      levels,
      currentLevelId,
      currentPoints,
      currentLevelLabel = "Your current level",
      formatPoints,
      ...props
    },
    ref
  ) => {
    const currentLevelIndex = currentLevelId
      ? levels.findIndex((level) => level.id === currentLevelId)
      : -1;
    const currentLevel = currentLevelIndex >= 0 ? levels[currentLevelIndex] : undefined;
    const nextLevel =
      currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1
        ? levels[currentLevelIndex + 1]
        : undefined;
    const showProgressBar =
      typeof currentPoints === "number" && Boolean(currentLevel && nextLevel);

    let progressPercent = 0;
    let pointsUntilNextLevel = 0;
    if (showProgressBar && currentLevel && nextLevel) {
      const start = currentLevel.minPoints;
      const end = nextLevel.minPoints;
      const ratio = end > start ? (currentPoints - start) / (end - start) : 1;
      progressPercent = Math.max(0, Math.min(ratio * 100, 100));
      pointsUntilNextLevel = Math.max(0, end - currentPoints);
    }

    const format = formatPoints ?? ((value: number) => value.toLocaleString());

    return (
      <div ref={ref} className={cn("w-full rounded-xl border bg-card", className)} {...props}>
        {showProgressBar && currentLevel && nextLevel ? (
          <div className="space-y-3 border-b px-4 py-4">
            <p className="text-lg text-foreground">
              <span className="font-semibold">{format(currentPoints)}</span> points.{" "}
              <span className="font-semibold">{format(pointsUntilNextLevel)}</span> until{" "}
              <span className="font-semibold">{nextLevel.name}</span>
            </p>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
              >
                {React.createElement(pointsLevelIconMap[currentLevel.iconType ?? "beginner"], {
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
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
              >
                {React.createElement(pointsLevelIconMap[nextLevel.iconType ?? "beginner"], {
                  className: "h-4 w-4",
                })}
              </span>
            </div>
          </div>
        ) : null}
        <div role="list" aria-label="Points levels" className="divide-y divide-border">
          {levels.map((level) => {
            const Icon = pointsLevelIconMap[level.iconType ?? "beginner"];
            const isCompletedOrInProgress = currentPoints && currentPoints >= level.minPoints;

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
                      !currentLevelId || isCompletedOrInProgress ? "bg-primary text-background" : "bg-muted text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatRange(level, formatPoints)}
                  </span>
                </div>

                <span className="font-semibold text-foreground">{level.name}</span>

                <span className="text-sm text-muted-foreground">
                  {currentLevelId === level.id ? currentLevelLabel : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

PointsLevels.displayName = "PointsLevels";

export { PointsLevels };
export type { PointsLevel, PointsLevelIconType, PointsLevelsProps };
