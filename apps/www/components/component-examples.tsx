"use client"

import * as React from "react"

import { StreakBadge } from "@/registry/trophy/ui/streak-badge"
import { StreakCalendar } from "@/registry/trophy/ui/streak-calendar"
import { StreakFreezeIndicator } from "@/registry/trophy/ui/streak-freeze-indicator"
import { StreakAtRisk } from "@/registry/trophy/ui/streak-at-risk"
import { AchievementBadge } from "@/registry/trophy/ui/achievement-badge"
import { AchievementProgress } from "@/registry/trophy/ui/achievement-progress"
import { LeaderboardEntry } from "@/registry/trophy/ui/leaderboard-entry"
import { UserRank } from "@/registry/trophy/ui/user-rank"
import { PointsDisplay } from "@/registry/trophy/ui/points-display"
import { PointsAnimation } from "@/registry/trophy/ui/points-animation"

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
  "streak-badge-no-animation": {
    component: <StreakBadge length={7} animate={false} />,
    code: `<StreakBadge length={7} animate={false} />`,
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
  "streak-freeze-indicator": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <StreakFreezeIndicator freezes={2} maxFreezes={3} />
        <StreakFreezeIndicator freezes={3} maxFreezes={3} />
      </div>
    ),
    code: `<StreakFreezeIndicator freezes={2} maxFreezes={3} />`,
  },
  "streak-at-risk": {
    component: (
      <StreakAtRisk
        streak={{
          length: 14,
          frequency: "daily",
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        }}
      />
    ),
    code: `<StreakAtRisk
  streak={{
    length: 14,
    frequency: "daily",
    expires: "2024-01-15T23:59:59Z",
  }}
/>`,
  },
  "achievement-badge": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <AchievementBadge
          achievement={{
            id: "1",
            name: "Early Bird",
            trigger: "api",
            description: "Complete a task before 9am",
            achievedAt: new Date().toISOString(),
          }}
        />
        <AchievementBadge
          achievement={{
            id: "2",
            name: "First Steps",
            trigger: "api",
            description: "Complete your first task",
            achievedAt: null,
          }}
        />
      </div>
    ),
    code: `<AchievementBadge
  achievement={{
    id: "1",
    name: "Early Bird",
    trigger: "api",
    description: "Complete a task before 9am",
    achievedAt: new Date().toISOString(),
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
  "leaderboard-entry": {
    component: (
      <div className="flex w-full max-w-md flex-col gap-2">
        <LeaderboardEntry
          ranking={{ userId: "1", userName: "Alice", rank: 1, value: 1250 }}
        />
        <LeaderboardEntry
          ranking={{ userId: "2", userName: "Bob", rank: 2, value: 1100 }}
        />
        <LeaderboardEntry
          ranking={{ userId: "3", userName: "Charlie", rank: 3, value: 980 }}
        />
      </div>
    ),
    code: `<LeaderboardEntry
  ranking={{ userId: "1", userName: "Alice", rank: 1, value: 1250 }}
/>
<LeaderboardEntry
  ranking={{ userId: "2", userName: "Bob", rank: 2, value: 1100 }}
/>
<LeaderboardEntry
  ranking={{ userId: "3", userName: "Charlie", rank: 3, value: 980 }}
/>`,
  },
  "leaderboard-entry-current-user": {
    component: (
      <div className="flex w-full max-w-md flex-col gap-2">
        <LeaderboardEntry
          ranking={{ userId: "1", userName: "You", rank: 5, value: 850 }}
          isCurrentUser
        />
      </div>
    ),
    code: `<LeaderboardEntry
  ranking={ranking}
  isCurrentUser
/>`,
  },
  "user-rank": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <UserRank
          ranking={{ userId: "1", userName: "Alice", rank: 1, value: 1250 }}
        />
        <UserRank
          ranking={{ userId: "2", userName: "Bob", rank: 2, value: 1100 }}
        />
        <UserRank
          ranking={{ userId: "3", userName: "Charlie", rank: 3, value: 980 }}
        />
      </div>
    ),
    code: `<UserRank
  ranking={{ userId: "1", userName: "Alice", rank: 1, value: 1250 }}
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
  "points-animation": {
    component: <PointsAnimation value={100} prefix="+" suffix=" XP" />,
    code: `<PointsAnimation value={100} prefix="+" suffix=" XP" />`,
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
