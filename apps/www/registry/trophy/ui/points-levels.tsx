"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PointsSubLevel {
  name: string;
  points: number;
}

export interface PointsLevel {
  id: string;
  key?: string;
  name: string;
  description?: string;
  badgeUrl?: string | null;
  points: number;
  subLevels?: PointsSubLevel[];
}

interface PointsLevelsProps extends React.HTMLAttributes<HTMLDivElement> {
  levels: PointsLevel[];
  currentPoints?: number;
  currentLevelLabel?: string;
  formatPoints?: (value: number) => string;
}

function formatRangeLabel(
  points: number,
  nextLevelPoints: number | null | undefined,
  formatPoints?: (value: number) => string
) {
  const format = formatPoints ?? ((value: number) => value.toLocaleString());
  if (typeof nextLevelPoints === "number") {
    return `${format(points)} - ${format(nextLevelPoints - 1)} XP`;
  }
  return `${format(points)}+ XP`;
}

const PointsLevels = React.forwardRef<HTMLDivElement, PointsLevelsProps>(
  (
    {
      className,
      levels,
      currentPoints,
      currentLevelLabel = "Current",
      formatPoints,
      ...props
    },
    ref
  ) => {
    const hasTracking = typeof currentPoints === "number";
    const safeTotalPoints = hasTracking ? Math.max(0, currentPoints) : null;

    const currentLevelIndex = React.useMemo(() => {
      if (!hasTracking || safeTotalPoints === null || levels.length === 0) return -1;
      for (let i = levels.length - 1; i >= 0; i -= 1) {
        if (safeTotalPoints >= levels[i].points) return i;
      }
      return -1;
    }, [hasTracking, levels, safeTotalPoints]);

    const clampedCurrentProgress = React.useMemo(() => {
      if (currentLevelIndex < 0 || safeTotalPoints === null) return 0;
      if (levels.length <= 1 || currentLevelIndex >= levels.length - 1) return 100;

      const currentPointsThreshold = levels[currentLevelIndex].points;
      const nextPointsThreshold = levels[currentLevelIndex + 1].points;
      const segmentSize = Math.max(1, nextPointsThreshold - currentPointsThreshold);
      const progressInSegment = safeTotalPoints - currentPointsThreshold;
      return Math.max(0, Math.min((progressInSegment / segmentSize) * 100, 100));
    }, [currentLevelIndex, levels, safeTotalPoints]);

    const progressHeightPercent = React.useMemo(() => {
      if (currentLevelIndex < 0) return 0;
      if (levels.length <= 1) return 100;
      const segmentCount = levels.length - 1;
      if (currentLevelIndex >= levels.length - 1) return 100;
      const completedSegments = Math.max(0, currentLevelIndex);
      const currentSegmentFraction = clampedCurrentProgress / 100;
      return Math.max(
        0,
        Math.min(((completedSegments + currentSegmentFraction) / segmentCount) * 100, 100)
      );
    }, [clampedCurrentProgress, currentLevelIndex, levels.length]);

    return (
      <div ref={ref} className={cn("w-full rounded-xl border bg-card p-4", className)} {...props}>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-[17px] top-8 w-1 rounded-full bg-muted"
          />
          {hasTracking && currentLevelIndex >= 0 ? (
            <div
              aria-hidden="true"
              className="absolute left-[17px] top-8 w-1 rounded-full bg-primary transition-all duration-300"
              style={{ height: `calc((100% - 4rem) * ${progressHeightPercent / 100})` }}
            />
          ) : null}

          <div role="list" aria-label="Points levels" className="space-y-6">
            {levels.map((level, index) => {
              const isCurrent = currentLevelIndex === index;
              const isUnlocked = currentLevelIndex >= 0 && index <= currentLevelIndex;

              return (
                <div key={level.id} role="listitem" className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4">
                  <div className="relative flex justify-center">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border-2",
                        isUnlocked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      <Star className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{level.name}</h3>
                      {isCurrent ? (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {currentLevelLabel}
                        </span>
                      ) : null}
                    </div>
                    {level.description ? (
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    ) : null}
                    {level.subLevels && level.subLevels.length > 0 ? (
                      <div className="space-y-1 pt-1">
                        {level.subLevels.map((subLevel, subIndex) => {
                          const nextSubLevelPoints =
                            subIndex < level.subLevels!.length - 1
                              ? level.subLevels![subIndex + 1].points
                              : index < levels.length - 1
                                ? levels[index + 1].points
                                : null;
                          return (
                            <p key={`${level.id}-${subLevel.name}`} className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{subLevel.name}</span>{" "}
                              {formatRangeLabel(subLevel.points, nextSubLevelPoints, formatPoints)}
                            </p>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <p className="whitespace-nowrap pt-1 text-lg font-semibold text-muted-foreground">
                    {formatRangeLabel(
                      level.points,
                      index < levels.length - 1 ? levels[index + 1].points : null,
                      formatPoints
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

PointsLevels.displayName = "PointsLevels";

export { PointsLevels };
export type { PointsLevelsProps };
