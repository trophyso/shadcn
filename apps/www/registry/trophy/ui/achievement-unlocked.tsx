"use client";

import * as React from "react";
import { Share2, Trophy, X } from "lucide-react";

import { cn } from "@/lib/utils";

// Types (inlined)
interface Achievement {
  id: string;
  name: string;
  trigger: "metric" | "api" | "streak";
  description?: string | null;
  badgeUrl?: string | null;
  key?: string;
  metricId?: string;
  metricName?: string;
  metricValue?: number;
  streakLength?: number;
}

// Props
interface AchievementUnlockedProps {
  /** Achievement that was unlocked */
  achievement: Achievement;
  /** Control open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when share button clicked */
  onShare?: () => void;
  /** Custom class for the dialog */
  className?: string;
}

const AchievementUnlocked = React.forwardRef<
  HTMLDivElement,
  AchievementUnlockedProps
>(({ achievement, open, onOpenChange, onShare, className }, ref) => {
  // Handle escape key
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 motion-safe:animate-in motion-safe:fade-in-0"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-title"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md rounded-xl bg-card p-6 shadow-2xl",
          "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95",
          className,
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Celebration text */}
          <span className="mb-4 text-sm font-medium uppercase tracking-wider text-purple-500">
            Achievement Unlocked!
          </span>

          {/* Badge */}
          <div className="relative mb-6" aria-hidden="true">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl motion-safe:animate-pulse" />

            {achievement.badgeUrl ? (
              <img
                src={achievement.badgeUrl}
                alt=""
                className="relative h-32 w-32 rounded-full object-cover ring-4 ring-purple-500/50"
              />
            ) : (
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-purple-500 text-white ring-4 ring-purple-500/50">
                <Trophy className="h-16 w-16" />
              </div>
            )}
          </div>

          {/* Name */}
          <h2 id="achievement-title" className="mb-2 text-2xl font-bold">
            {achievement.name}
          </h2>

          {/* Description */}
          {achievement.description && (
            <p className="mb-6 text-muted-foreground">
              {achievement.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              autoFocus
              onClick={() => onOpenChange(false)}
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Awesome!
            </button>

            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-colors hover:bg-muted"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
AchievementUnlocked.displayName = "AchievementUnlocked";

export { AchievementUnlocked };
export type { AchievementUnlockedProps, Achievement };
