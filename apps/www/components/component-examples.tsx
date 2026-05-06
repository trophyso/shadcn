"use client"

import * as React from "react"

import { StreakBadge } from "@/registry/trophy/ui/streak-badge"
import { StreakCalendar } from "@/registry/trophy/ui/streak-calendar"
import { AchievementProgress } from "@/registry/trophy/ui/achievement-progress"
import { AchievementGrid } from "@/registry/trophy/ui/achievement-grid"
import { AchievementUnlocked } from "@/registry/trophy/ui/achievement-unlocked"
import { Leaderboard } from "@/registry/trophy/ui/leaderboard"
import { LeaderboardPodium } from "@/registry/trophy/ui/leaderboard-podium"
import { PointsDisplay } from "@/registry/trophy/ui/points-display"

function createStreakHistory() {
  const today = new Date()
  const history = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    history.push({
      periodStart: dateStr,
      periodEnd: dateStr,
      usedFreeze: i === 4,
    })
  }
  return history
}

export const componentExamples: Record<
  string,
  { component: React.ReactNode; code: string }
> = {
  "streak-badge": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <StreakBadge length={7} />
        <StreakBadge length={14} variant="outline" />
        <StreakBadge length={30} variant="ghost" />
      </div>
    ),
    code: `<StreakBadge length={7} />
<StreakBadge length={14} variant="outline" />
<StreakBadge length={30} variant="ghost" />`,
  },
  "streak-badge-basic": {
    component: <StreakBadge length={7} />,
    code: `<StreakBadge length={7} />`,
  },
  "streak-badge-variants": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <StreakBadge length={7} variant="default" />
        <StreakBadge length={7} variant="outline" />
        <StreakBadge length={7} variant="ghost" />
      </div>
    ),
    code: `<StreakBadge length={7} variant="default" />
<StreakBadge length={7} variant="outline" />
<StreakBadge length={7} variant="ghost" />`,
  },
  "streak-badge-sizes": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <StreakBadge length={7} size="sm" />
        <StreakBadge length={7} size="default" />
        <StreakBadge length={7} size="lg" />
      </div>
    ),
    code: `<StreakBadge length={7} size="sm" />
<StreakBadge length={7} size="default" />
<StreakBadge length={7} size="lg" />`,
  },
  "streak-badge-frequency": {
    component: <StreakBadge length={7} showFrequency />,
    code: `<StreakBadge length={7} showFrequency />`,
  },
  "streak-calendar": {
    component: (
      <StreakCalendar
        streak={{
          streakHistory: createStreakHistory(),
        }}
      />
    ),
    code: `<StreakCalendar
  streak={{
    streakHistory: [
      { periodStart: "2024-01-01", periodEnd: "2024-01-01" },
      // ... more dates
    ],
  }}
/>`,
  },
  "achievement-progress": {
    component: (
      <div className="w-full max-w-sm">
        <AchievementProgress
          achievement={{
            id: "1",
            name: "Task Master",
            metricValue: 100,
          }}
          currentValue={75}
        />
      </div>
    ),
    code: `<AchievementProgress
  achievement={{
    id: "1",
    name: "Task Master",
    metricValue: 100,
  }}
  currentValue={75}
/>`,
  },
  "achievement-grid": {
    component: (
      <div className="w-full max-w-3xl">
        <AchievementGrid
          achievements={[
            {
              id: "1",
              name: "Early Bird",
              trigger: "api",
              achievedAt: new Date().toISOString(),
            },
            {
              id: "2",
              name: "First Steps",
              trigger: "streak",
              achievedAt: null,
            },
            {
              id: "3",
              name: "Task Master",
              trigger: "metric",
              achievedAt: new Date().toISOString(),
            },
          ]}
          columns={3}
        />
      </div>
    ),
    code: `<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: null },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  columns={3}
/>`,
  },
  "achievement-unlocked": {
    component: (
      <AchievementUnlocked
        achievement={{
          id: "first-win",
          name: "First Win",
          description: "Complete your first challenge",
        }}
        open
        onOpenChange={() => {}}
      />
    ),
    code: `<AchievementUnlocked
  achievement={{
    id: "first-win",
    name: "First Win",
    description: "Complete your first challenge",
  }}
  open
  onOpenChange={() => {}}
/>`,
  },
  leaderboard: {
    component: (
      <div className="w-full max-w-2xl">
        <Leaderboard
          rankings={[
            { userId: "1", userName: "Alice", rank: 1, value: 1250 },
            { userId: "2", userName: "Bob", rank: 2, value: 1100 },
            { userId: "3", userName: "Charlie", rank: 3, value: 980 },
          ]}
        />
      </div>
    ),
    code: `<Leaderboard
  rankings={[
    { userId: "1", userName: "Alice", rank: 1, value: 1250 },
    { userId: "2", userName: "Bob", rank: 2, value: 1100 },
    { userId: "3", userName: "Charlie", rank: 3, value: 980 },
  ]}
/>`,
  },
  "leaderboard-podium": {
    component: (
      <LeaderboardPodium
        rankings={[
          { userId: "1", userName: "Alice", rank: 1, value: 1250 },
          { userId: "2", userName: "Bob", rank: 2, value: 1100 },
          { userId: "3", userName: "Charlie", rank: 3, value: 980 },
        ]}
      />
    ),
    code: `<LeaderboardPodium
  rankings={[
    { userId: "1", userName: "Alice", rank: 1, value: 1250 },
    { userId: "2", userName: "Bob", rank: 2, value: 1100 },
    { userId: "3", userName: "Charlie", rank: 3, value: 980 },
  ]}
/>`,
  },
  "points-display": {
    component: (
      <PointsDisplay
        points={{ name: "XP", total: 2500, badgeUrl: null, awards: [] }}
      />
    ),
    code: `<PointsDisplay
  points={{ name: "XP", total: 2500, badgeUrl: null, awards: [] }}
/>`,
  },
  "points-display-sizes": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <PointsDisplay
          points={{ name: "XP", total: 1250, badgeUrl: null, awards: [] }}
          size="sm"
        />
        <PointsDisplay
          points={{ name: "XP", total: 1250, badgeUrl: null, awards: [] }}
          size="default"
        />
        <PointsDisplay
          points={{ name: "XP", total: 1250, badgeUrl: null, awards: [] }}
          size="lg"
        />
      </div>
    ),
    code: `<PointsDisplay points={points} size="sm" />
<PointsDisplay points={points} size="default" />
<PointsDisplay points={points} size="lg" />`,
  },
  "points-display-variants": {
    component: (
      <div className="flex flex-wrap items-center gap-6">
        <PointsDisplay
          points={{ name: "XP", total: 1250, badgeUrl: null, awards: [] }}
          variant="default"
        />
        <PointsDisplay
          points={{ name: "XP", total: 1250, badgeUrl: null, awards: [] }}
          variant="minimal"
        />
        <PointsDisplay
          points={{ name: "XP", total: 1250, badgeUrl: null, awards: [] }}
          variant="inline"
        />
      </div>
    ),
    code: `<PointsDisplay points={points} variant="default" />
<PointsDisplay points={points} variant="minimal" />
<PointsDisplay points={points} variant="inline" />`,
  },
  "points-display-icons": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <PointsDisplay
          points={{ name: "XP", total: 500, badgeUrl: null, awards: [] }}
          iconType="xp"
          size="sm"
        />
        <PointsDisplay
          points={{ name: "Points", total: 500, badgeUrl: null, awards: [] }}
          iconType="points"
          size="sm"
        />
        <PointsDisplay
          points={{ name: "Credits", total: 500, badgeUrl: null, awards: [] }}
          iconType="credits"
          size="sm"
        />
      </div>
    ),
    code: `<PointsDisplay points={points} iconType="xp" />
<PointsDisplay points={points} iconType="points" />
<PointsDisplay points={points} iconType="credits" />`,
  },
}

export function ComponentExample({ name }: { name: string }) {
  const example = componentExamples[name]
  if (!example) {
    return (
      <div className="text-muted-foreground rounded-lg border p-4 text-sm">
        Example not found: {name}
      </div>
    )
  }
  return <>{example.component}</>
}

export function getExampleCode(name: string): string | undefined {
  return componentExamples[name]?.code
}
