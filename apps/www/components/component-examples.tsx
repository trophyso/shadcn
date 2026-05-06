"use client"

import * as React from "react"

import { StreakBadge } from "@/registry/trophy/ui/streak-badge"
import { StreakCalendar } from "@/registry/trophy/ui/streak-calendar"
import { StreakCard } from "@/registry/trophy/ui/streak-card"
import { AchievementBadge } from "@/registry/trophy/ui/achievement-badge"
import { AchievementCard } from "@/registry/trophy/ui/achievement-card"
import { AchievementGrid } from "@/registry/trophy/ui/achievement-grid"
import { AchievementList } from "@/registry/trophy/ui/achievement-list"
import { AchievementUnlocked } from "@/registry/trophy/ui/achievement-unlocked"
import { Leaderboard } from "@/registry/trophy/ui/leaderboard"
import { LeaderboardPodium } from "@/registry/trophy/ui/leaderboard-podium"
import { PointsDisplay } from "@/registry/trophy/ui/points-display"

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function createStreakHistory(options?: { withFreezes?: boolean }) {
  const { withFreezes = false } = options ?? {}
  const today = new Date()
  const history = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = formatDateKey(date)
    history.push({
      periodStart: dateStr,
      periodEnd: dateStr,
      usedFreeze: withFreezes ? i === 4 : false,
    })
  }
  return history
}

function createStreakHistoryWithVisibleFreeze() {
  const today = new Date()
  const history = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = formatDateKey(date)
    history.push({
      periodStart: dateStr,
      periodEnd: dateStr,
      usedFreeze: i === 0,
    })
  }
  return history
}

function createYearStyleStreakHistory() {
  const today = new Date()
  const history = []

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    if (Math.random() < 0.45) {
      const dateStr = formatDateKey(date)
      history.push({
        periodStart: dateStr,
        periodEnd: dateStr,
      })
    }
  }

  // Ensure year view always has at least one active day.
  if (history.length === 0) {
    const todayKey = formatDateKey(today)
    history.push({ periodStart: todayKey, periodEnd: todayKey })
  }

  return history
}

const achievementGridUnlockedPreviewItems = [
  {
    id: "1",
    name: "Early Bird",
    trigger: "api" as const,
    achievedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "First Steps",
    trigger: "streak" as const,
    achievedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Task Master",
    trigger: "metric" as const,
    achievedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Marathon",
    trigger: "streak" as const,
    achievedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "API Explorer",
    trigger: "api" as const,
    achievedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const achievementGridLockedPreviewItems = [
  ...achievementGridUnlockedPreviewItems,
  {
    id: "6",
    name: "Perfectionist",
    trigger: "metric" as const,
    achievedAt: null,
  },
  {
    id: "7",
    name: "Night Owl",
    trigger: "streak" as const,
    achievedAt: null,
  },
]

const achievementGridSeriesPreviewItems = [
  {
    id: "series-1",
    name: "Consistency I",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 28,
  },
  {
    id: "series-2",
    name: "Consistency II",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 62,
  },
  {
    id: "series-3",
    name: "Consistency III",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 84,
  },
  {
    id: "series-4",
    name: "Consistency IV",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 100,
  },
]

const achievementGridRarityPreviewItems = [
  {
    id: "rarity-1",
    name: "Daily Legend",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    rarity: 3,
  },
  {
    id: "rarity-2",
    name: "Power User",
    trigger: "metric" as const,
    achievedAt: new Date().toISOString(),
    rarity: 12,
  },
  {
    id: "rarity-3",
    name: "Finisher",
    trigger: "api" as const,
    achievedAt: new Date().toISOString(),
    rarity: 41,
  },
  {
    id: "rarity-4",
    name: "First Win",
    trigger: "api" as const,
    achievedAt: new Date().toISOString(),
    rarity: 78,
  },
]

const achievementGridCompletePreviewItems = [
  {
    id: "complete-1",
    name: "Consistency I",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 28,
  },
  {
    id: "complete-2",
    name: "Daily Legend",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    rarity: 3,
  },
  {
    id: "complete-3",
    name: "Power User",
    trigger: "metric" as const,
    achievedAt: new Date().toISOString(),
    rarity: 12,
  },
  {
    id: "complete-4",
    name: "Consistency II",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 62,
  },
]

const achievementBadgePreviewItem = {
  id: "badge-1",
  name: "Consistency I",
  trigger: "streak" as const,
  achievedAt: new Date().toISOString()
}

const achievementListPreviewItems = [
  {
    id: "list-1",
    name: "10 Day Streak",
    description: "Open app for 10 days",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 60,
  },
  {
    id: "list-2",
    name: "5,000 Calorie Burn",
    description: "Burn 5K calories total",
    trigger: "metric" as const,
    achievedAt: new Date().toISOString(),
    progress: 32,
  },
  {
    id: "list-3",
    name: "Weekend Warrior",
    description: "Complete challenges on weekends",
    trigger: "api" as const,
    achievedAt: null,
  },
]

const achievementCardPreviewItems = [
  {
    id: "card-1",
    name: "Wellness God",
    description: "Meditate for 30 days",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    rarity: 8,
  },
  {
    id: "card-2",
    name: "10 day streak",
    description: "Open app for 10 days",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    progress: 60,
    rarity: 24,
  },
  {
    id: "card-3",
    name: "Chatbot King",
    description: "Chat with AI 500 times",
    trigger: "api" as const,
    achievedAt: new Date().toISOString(),
    rarity: 5,
  },
  {
    id: "card-4",
    name: "Fully Hydrated Bro",
    description: "Drink 5,000L of water total",
    trigger: "metric" as const,
    achievedAt: new Date().toISOString(),
    progress: 32,
  },
]

const achievementCardHighlightedPreviewItems = [
  {
    id: "highlight-1",
    name: "Wellness God",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    rarity: 8,
  },
  {
    id: "highlight-2",
    name: "10 day streak",
    trigger: "streak" as const,
    achievedAt: new Date().toISOString(),
    rarity: 24,
  },
  {
    id: "highlight-3",
    name: "Chatbot King",
    trigger: "api" as const,
    achievedAt: new Date().toISOString(),
    rarity: 5,
  },
]

type ComponentExampleConfig = {
  component: React.ReactNode
  code: string
}

export const componentExamples: Record<string, ComponentExampleConfig> = {
  "streak-badge": {
    component: <StreakBadge length={7} />,
    code: `<StreakBadge length={7} />`,
  },
  "streak-badge-basic": {
    component: <StreakBadge length={7} />,
    code: `<StreakBadge length={7} />`,
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
  "streak-calendar": {
    component: (
      <StreakCalendar streak={createStreakHistory()} />
    ),
    code: `<StreakCalendar
  streak={[
    { periodStart: "2024-01-01", periodEnd: "2024-01-01" },
    // ... more dates
  ]}
/>`,
  },
  "streak-calendar-monday": {
    component: (
      <StreakCalendar
        startOfWeek={1}
        streak={createStreakHistory()}
      />
    ),
    code: `<StreakCalendar
  streak={createStreakHistory()}
  startOfWeek={1}
/>`,
  },
  "streak-calendar-month": {
    component: (
      <StreakCalendar
        view="month"
        month={new Date()}
        streak={createStreakHistory()}
      />
    ),
    code: `<StreakCalendar
  streak={createStreakHistory()}
  view="month"
  month={new Date()}
/>`,
  },
  "streak-calendar-year": {
    component: (
      <StreakCalendar
        view="year"
        streak={createYearStyleStreakHistory()}
      />
    ),
    code: `<StreakCalendar
  streak={createYearStyleStreakHistory()}
  view="year"
/>`,
  },
  "streak-calendar-with-freezes": {
    component: (
      <StreakCalendar streak={createStreakHistoryWithVisibleFreeze()} />
    ),
    code: `<StreakCalendar
  streak={createStreakHistoryWithVisibleFreeze()}
/>`,
  },
  "streak-card": {
    component: (
      <div className="w-full max-w-xl">
        <StreakCard
          streak={createStreakHistory()}
          currentStreak={16}
          longestStreak={100}
          total={131}
          defaultHowItWorksOpen
        />
      </div>
    ),
    code: `<StreakCard
  streak={createStreakHistory()}
  currentStreak={16}
  longestStreak={100}
  total={131}
  defaultHowItWorksOpen
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
              achievedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
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
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  columns={3}
/>`,
  },
  "achievement-grid-columns": {
    component: (
      <div className="w-full max-w-5xl space-y-6">
        <AchievementGrid achievements={achievementGridUnlockedPreviewItems} columns={2} />
        <AchievementGrid achievements={achievementGridUnlockedPreviewItems} columns={3} />
        <AchievementGrid achievements={achievementGridUnlockedPreviewItems} columns={4} />
      </div>
    ),
    code: `<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  columns={2}
/>
<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  columns={3}
/>
<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  columns={4}
/>`,
  },
  "achievement-grid-gap": {
    component: (
      <div className="w-full max-w-5xl space-y-6">
        <AchievementGrid achievements={achievementGridUnlockedPreviewItems} gap="sm" />
        <AchievementGrid achievements={achievementGridUnlockedPreviewItems} gap="default" />
        <AchievementGrid achievements={achievementGridUnlockedPreviewItems} gap="lg" />
      </div>
    ),
    code: `<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  gap="sm"
/>
<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  gap="default"
/>
<AchievementGrid
  achievements={[
    { id: "1", name: "Early Bird", trigger: "api", achievedAt: "2024-01-01T00:00:00Z" },
    { id: "2", name: "First Steps", trigger: "streak", achievedAt: "2024-01-03T00:00:00Z" },
    { id: "3", name: "Task Master", trigger: "metric", achievedAt: "2024-01-02T00:00:00Z" },
  ]}
  gap="lg"
/>`,
  },
  "achievement-badge": {
    component: (
      <AchievementBadge achievement={achievementBadgePreviewItem} />
    ),
    code: `<AchievementBadge
  achievement={{
    id: "1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
/>`,
  },
  "achievement-badge-sizes": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <AchievementBadge
          achievement={achievementGridUnlockedPreviewItems[0]}
          badgeSize="sm"
        />
        <AchievementBadge
          achievement={achievementGridUnlockedPreviewItems[0]}
          badgeSize="default"
        />
        <AchievementBadge
          achievement={achievementGridUnlockedPreviewItems[0]}
          badgeSize="lg"
        />
      </div>
    ),
    code: `<AchievementBadge
  achievement={{
    id: "1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
  badgeSize="sm"
/>
<AchievementBadge
  achievement={{
    id: "1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
  badgeSize="default"
/>
<AchievementBadge
  achievement={{
    id: "1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
  badgeSize="lg"
/>`,
  },
  "achievement-badge-locked-styles": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <AchievementBadge
          achievement={achievementGridLockedPreviewItems[5]}
          lockedStyle="grayscale"
        />
        <AchievementBadge
          achievement={achievementGridLockedPreviewItems[5]}
          lockedStyle="silhouette"
        />
        <AchievementBadge
          achievement={achievementGridLockedPreviewItems[5]}
          lockedStyle="hidden"
        />
      </div>
    ),
    code: `<AchievementBadge
  achievement={{
    id: "2",
    name: "Perfectionist",
    trigger: "metric",
    achievedAt: null,
  }}
  lockedStyle="grayscale"
/>
<AchievementBadge
  achievement={{
    id: "2",
    name: "Perfectionist",
    trigger: "metric",
    achievedAt: null,
  }}
  lockedStyle="silhouette"
/>
<AchievementBadge
  achievement={{
    id: "2",
    name: "Perfectionist",
    trigger: "metric",
    achievedAt: null,
  }}
  lockedStyle="hidden"
/>`,
  },
  "achievement-badge-series-progress": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        {achievementGridSeriesPreviewItems.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    ),
    code: `<AchievementBadge
  achievement={{
    id: "series-1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
/>`,
  },
  "achievement-badge-rarity": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        {achievementGridRarityPreviewItems.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    ),
    code: `<AchievementBadge
  achievement={{
    id: "rarity-1",
    name: "Daily Legend",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    rarity: 3,
  }}
/>`,
  },
  "achievement-badge-clickable": {
    component: (
      <AchievementBadge
        achievement={achievementBadgePreviewItem}
        onAchievementClick={() => { }}
      />
    ),
    code: `<AchievementBadge
  achievement={{
    id: "1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
  onAchievementClick={(achievement) => {
    openDetailModal(achievement)
  }}
/>`,
  },
  "achievement-grid-complete": {
    component: (
      <div className="w-full max-w-5xl">
        <AchievementGrid
          achievements={achievementGridCompletePreviewItems}
          columns={4}
          onAchievementClick={() => { }}
        />
      </div>
    ),
    code: `<AchievementGrid
  achievements={[
    { id: "complete-1", name: "Consistency I", trigger: "streak", achievedAt: "2024-01-01T00:00:00Z", progress: 28 },
    { id: "complete-2", name: "Daily Legend", trigger: "streak", achievedAt: "2024-01-01T00:00:00Z", rarity: 3 },
    { id: "complete-3", name: "Power User", trigger: "metric", achievedAt: "2024-01-01T00:00:00Z", rarity: 12 },
    { id: "complete-4", name: "Consistency II", trigger: "streak", achievedAt: "2024-01-01T00:00:00Z", progress: 62 },
  ]}
  columns={4}
  onAchievementClick={handleClick}
/>`,
  },
  "achievement-list": {
    component: (
      <div className="w-full max-w-2xl">
        <AchievementList achievements={achievementListPreviewItems} />
      </div>
    ),
    code: `<AchievementList
  achievements={[
    {
      id: "list-1",
      name: "10 Day Streak",
      description: "Open app for 10 days",
      trigger: "streak",
      achievedAt: "2024-01-01T00:00:00Z",
      progress: 60,
    },
    {
      id: "list-2",
      name: "5,000 Calorie Burn",
      description: "Burn 5K calories total",
      trigger: "metric",
      achievedAt: "2024-01-01T00:00:00Z",
      progress: 32,
    },
  ]}
/>`,
  },
  "achievement-card": {
    component: (
      <div className="w-full max-w-md">
        <AchievementCard
          achievements={achievementCardPreviewItems}
          highlightedAchievements={achievementCardHighlightedPreviewItems}
        />
      </div>
    ),
    code: `<AchievementCard
  highlightedAchievements={[
    {
      id: "highlight-1",
      name: "Wellness God",
      trigger: "streak",
      achievedAt: "2024-01-01T00:00:00Z",
      rarity: 8,
    },
    {
      id: "highlight-2",
      name: "10 day streak",
      trigger: "streak",
      achievedAt: "2024-01-01T00:00:00Z",
      rarity: 24,
    },
    {
      id: "highlight-3",
      name: "Chatbot King",
      trigger: "api",
      achievedAt: "2024-01-01T00:00:00Z",
      rarity: 5,
    },
  ]}
  achievements={[
    {
      id: "list-1",
      name: "10 day streak",
      description: "Open app for 10 days",
      trigger: "streak",
      achievedAt: "2024-01-01T00:00:00Z",
      progress: 60,
    },
    {
      id: "list-2",
      name: "Fully Hydrated Bro",
      description: "Drink 5,000L of water total",
      trigger: "metric",
      achievedAt: "2024-01-01T00:00:00Z",
      progress: 32,
    },
  ]}
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
        onOpenChange={() => { }}
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
