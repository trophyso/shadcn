"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface PointsSubLevel {
  name: string;
  threshold: number;
}

interface PointsLevel {
  id: string;
  name: string;
  threshold: number;
  summary?: string;
  subLevels?: PointsSubLevel[];
}

interface PointsLevelsProps extends React.HTMLAttributes<HTMLDivElement> {
  levels: PointsLevel[];
  currentPoints?: number;
  currentLevelLabel?: string;
  formatPoints?: (value: number) => string;
}

function formatRangeLabel(
  threshold: number,
  nextThreshold: number | null | undefined,
  formatPoints?: (value: number) => string
) {
  const format = formatPoints ?? ((value: number) => value.toLocaleString());
  if (typeof nextThreshold === "number") {
    return `${format(threshold)} - ${format(nextThreshold - 1)} XP`;
  }
  return `${format(threshold)}+ XP`;
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
        if (safeTotalPoints >= levels[i].threshold) return i;
      }
      return -1;
    }, [hasTracking, levels, safeTotalPoints]);

    const clampedCurrentProgress = React.useMemo(() => {
      if (currentLevelIndex < 0 || safeTotalPoints === null) return 0;
      if (levels.length <= 1 || currentLevelIndex >= levels.length - 1) return 100;

      const currentThreshold = levels[currentLevelIndex].threshold;
      const nextThreshold = levels[currentLevelIndex + 1].threshold;
      const segmentSize = Math.max(1, nextThreshold - currentThreshold);
      const progressInSegment = safeTotalPoints - currentThreshold;
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
                    {level.summary ? (
                      <p className="text-sm text-muted-foreground">{level.summary}</p>
                    ) : null}
                    {level.subLevels && level.subLevels.length > 0 ? (
                      <div className="space-y-1 pt-1">
                        {level.subLevels.map((subLevel, subIndex) => {
                          const nextSubLevelThreshold =
                            subIndex < level.subLevels!.length - 1
                              ? level.subLevels![subIndex + 1].threshold
                              : index < levels.length - 1
                                ? levels[index + 1].threshold
                                : null;
                          return (
                          <p key={`${level.id}-${subLevel.name}`} className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{subLevel.name}</span>{" "}
                            {formatRangeLabel(subLevel.threshold, nextSubLevelThreshold, formatPoints)}
                          </p>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <p className="whitespace-nowrap pt-1 text-lg font-semibold text-muted-foreground">
                    {formatRangeLabel(
                      level.threshold,
                      index < levels.length - 1 ? levels[index + 1].threshold : null,
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
export type { PointsLevel, PointsSubLevel, PointsLevelsProps };
