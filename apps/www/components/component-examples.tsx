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
import { LeaderboardRankings } from "@/registry/trophy/ui/leaderboard-rankings"
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

function AchievementUnlockedPreview() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Show achievement unlocked
      </button>

      <AchievementUnlocked
        achievement={{
          id: "task-champion",
          name: "Task Champion",
          description: "Complete a task 30 days in a row. Congratulations!!",
          unlockedAt: new Date().toISOString(),
        }}
        open={open}
        onOpenChange={setOpen}
        secondaryActionLabel="Share"
        onSecondaryActionClick={() => { }}
      />
    </div>
  )
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
    description: "Meditate 30 days in a row",
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
        <AchievementBadge
          achievement={achievementGridUnlockedPreviewItems[0]}
          badgeSize="xl"
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
/>
<AchievementBadge
  achievement={{
    id: "1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
    progress: 28,
  }}
  badgeSize="xl"
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
    component: <AchievementUnlockedPreview />,
    code: `const [open, setOpen] = useState(false)

<button
  type="button"
  onClick={() => setOpen(true)}
  className="rounded-lg border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
>
  Show achievement unlocked
</button>

<AchievementUnlocked
  achievement={{
    id: "task-champion",
    name: "Task Champion",
    description: "Complete a task 30 days in a row. Congratulations!!",
    unlockedAt: new Date().toISOString(),
  }}
  open={open}
  onOpenChange={setOpen}
  secondaryActionLabel="Share"
  onSecondaryActionClick={() => {
    navigator.share?.({
      title: "I unlocked Task Champion!",
      text: "Complete a task 30 days in a row. Congratulations!!",
      url: window.location.href,
    })
  }}
/>`,
  },
  "leaderboard-rankings": {
    component: (
      <div className="w-full max-w-2xl">
        <LeaderboardRankings
          currentUserId="u-20"
          rankings={[
            {
              userId: "u-1",
              rank: 1,
              name: "Ava Elizabeth Turner",
              byline: "Level 42 - Diamond",
              total: 289400,
              avatarUrl: "https://i.pravatar.cc/96?img=32",
            },
            {
              userId: "u-2",
              rank: 2,
              name: "Leo Harrison",
              byline: "Level 39 - Platinum",
              total: 251800,
              avatarUrl: "https://i.pravatar.cc/96?img=12",
            },
            {
              userId: "u-3",
              rank: 3,
              name: "Rowan Elijah",
              byline: "Level 37 - Platinum",
              total: 238300,
              avatarUrl: "https://i.pravatar.cc/96?img=15",
            },
            {
              userId: "u-4",
              rank: 4,
              name: "Mia Sophia Bennett",
              byline: "Level 34 - Gold",
              total: 221700,
              avatarUrl: "https://i.pravatar.cc/96?img=47",
            },
            {
              userId: "u-5",
              rank: 5,
              name: "William Turner",
              byline: "Level 33 - Gold",
              total: 199500,
              avatarUrl: "https://i.pravatar.cc/96?img=52",
            },
          ]}
        />
      </div>
    ),
    code: `<LeaderboardRankings
  rankings={[
    {
      userId: "u-1",
      rank: 1,
      name: "Ava Elizabeth Turner",
      byline: "Level 42 - Diamond",
      total: 289400,
      avatarUrl: "https://i.pravatar.cc/96?img=32",
    },
    {
      userId: "u-2",
      rank: 2,
      name: "Leo Harrison",
      byline: "Level 39 - Platinum",
      total: 251800,
      avatarUrl: "https://i.pravatar.cc/96?img=12",
    },
    {
      userId: "u-3",
      rank: 3,
      name: "Rowan Elijah",
      byline: "Level 37 - Platinum",
      total: 238300,
      avatarUrl: "https://i.pravatar.cc/96?img=15",
    },
    {
      userId: "u-4",
      rank: 4,
      name: "Mia Sophia Bennett",
      byline: "Level 34 - Gold",
      total: 221700,
      avatarUrl: "https://i.pravatar.cc/96?img=47",
    },
    {
      userId: "u-5",
      rank: 5,
      name: "William Turner",
      byline: "Level 33 - Gold",
      total: 199500,
      avatarUrl: "https://i.pravatar.cc/96?img=52",
    },
  ]}
/>`,
  },
  "leaderboard-rankings-rank-change": {
    component: (
      <div className="w-full max-w-2xl">
        <LeaderboardRankings
          currentUserId="u-20"
          rankings={[
            {
              userId: "u-1",
              rank: 1,
              name: "Ava Elizabeth Turner",
              byline: "Level 42 - Diamond",
              total: 289400,
              avatarUrl: "https://i.pravatar.cc/96?img=32",
              rankChange: 2,
            },
            {
              userId: "u-2",
              rank: 2,
              name: "Leo Harrison",
              byline: "Level 39 - Platinum",
              total: 251800,
              avatarUrl: "https://i.pravatar.cc/96?img=12",
              rankChange: -1,
            },
            {
              userId: "u-3",
              rank: 3,
              name: "Rowan Elijah",
              byline: "Level 37 - Platinum",
              total: 238300,
              avatarUrl: "https://i.pravatar.cc/96?img=15",
              rankChange: -2,
            },
            {
              userId: "u-4",
              rank: 4,
              name: "Mia Sophia Bennett",
              byline: "Level 34 - Gold",
              total: 221700,
              avatarUrl: "https://i.pravatar.cc/96?img=47",
              rankChange: 1,
            },
          ]}
        />
      </div>
    ),
    code: `<LeaderboardRankings
  rankings={[
    {
      userId: "u-1",
      rank: 1,
      name: "Ava Elizabeth Turner",
      byline: "Level 42 - Diamond",
      total: 289400,
      avatarUrl: "https://i.pravatar.cc/96?img=32",
      rankChange: 2,
    },
    {
      userId: "u-2",
      rank: 2,
      name: "Leo Harrison",
      byline: "Level 39 - Platinum",
      total: 251800,
      avatarUrl: "https://i.pravatar.cc/96?img=12",
      rankChange: -1,
    },
    {
      userId: "u-3",
      rank: 3,
      name: "Rowan Elijah",
      byline: "Level 37 - Platinum",
      total: 238300,
      avatarUrl: "https://i.pravatar.cc/96?img=15",
      rankChange: -2,
    },
    {
      userId: "u-4",
      rank: 4,
      name: "Mia Sophia Bennett",
      byline: "Level 34 - Gold",
      total: 221700,
      avatarUrl: "https://i.pravatar.cc/96?img=47",
      rankChange: 1,
    },
  ]}
/>`,
  },
  "leaderboard-rankings-pagination": {
    component: (
      <div className="w-full max-w-2xl">
        <LeaderboardRankings
          showPagination
          rankings={[
            { userId: "u-1", rank: 1, name: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", total: 289400, avatarUrl: "https://i.pravatar.cc/96?img=32" },
            { userId: "u-2", rank: 2, name: "Leo Harrison", byline: "Level 39 - Platinum", total: 251800, avatarUrl: "https://i.pravatar.cc/96?img=12" },
            { userId: "u-3", rank: 3, name: "Rowan Elijah", byline: "Level 37 - Platinum", total: 238300, avatarUrl: "https://i.pravatar.cc/96?img=15" },
            { userId: "u-4", rank: 4, name: "Mia Sophia Bennett", byline: "Level 34 - Gold", total: 221700, avatarUrl: "https://i.pravatar.cc/96?img=47" },
            { userId: "u-5", rank: 5, name: "William Turner", byline: "Level 33 - Gold", total: 199500, avatarUrl: "https://i.pravatar.cc/96?img=52" },
            { userId: "u-6", rank: 6, name: "Ruby Claire", byline: "Level 31 - Gold", total: 198300, avatarUrl: "https://i.pravatar.cc/96?img=9" },
            { userId: "u-7", rank: 7, name: "Ethan Brooks", byline: "Level 29 - Silver", total: 187200, avatarUrl: "https://i.pravatar.cc/96?img=60" },
            { userId: "u-8", rank: 8, name: "Chloe Madison", byline: "Level 28 - Silver", total: 176800, avatarUrl: "https://i.pravatar.cc/96?img=29" },
            { userId: "u-9", rank: 9, name: "Noah Bennett", byline: "Level 27 - Silver", total: 169300, avatarUrl: "https://i.pravatar.cc/96?img=36" },
            { userId: "u-10", rank: 10, name: "Isla Monroe", byline: "Level 26 - Silver", total: 161900, avatarUrl: "https://i.pravatar.cc/96?img=33" },
            { userId: "u-11", rank: 11, name: "Mason Carter", byline: "Level 25 - Bronze", total: 154600, avatarUrl: "https://i.pravatar.cc/96?img=61" },
            { userId: "u-12", rank: 12, name: "Ella Foster", byline: "Level 24 - Bronze", total: 148200, avatarUrl: "https://i.pravatar.cc/96?img=26" },
          ]}
        />
      </div>
    ),
    code: `<LeaderboardRankings
  showPagination
  rankings={[
    { userId: "u-1", rank: 1, name: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", total: 289400, avatarUrl: "https://i.pravatar.cc/96?img=32" },
    { userId: "u-2", rank: 2, name: "Leo Harrison", byline: "Level 39 - Platinum", total: 251800, avatarUrl: "https://i.pravatar.cc/96?img=12" },
    { userId: "u-3", rank: 3, name: "Rowan Elijah", byline: "Level 37 - Platinum", total: 238300, avatarUrl: "https://i.pravatar.cc/96?img=15" },
    // ...more rows
  ]}
/>`,
  },
  "leaderboard-rankings-current-user-focus": {
    component: (
      <div className="w-full max-w-2xl">
        <LeaderboardRankings
          currentUserId="u-20"
          rankings={[
            { userId: "u-1", rank: 1, name: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", total: 289400, avatarUrl: "https://i.pravatar.cc/96?img=32", displayed: true },
            { userId: "u-2", rank: 2, name: "Leo Harrison", byline: "Level 39 - Platinum", total: 251800, avatarUrl: "https://i.pravatar.cc/96?img=12", displayed: true },
            { userId: "u-3", rank: 3, name: "Rowan Elijah", byline: "Level 37 - Platinum", total: 238300, avatarUrl: "https://i.pravatar.cc/96?img=15", displayed: true },
            { userId: "u-4", rank: 4, name: "Mia Sophia Bennett", byline: "Level 34 - Gold", total: 221700, avatarUrl: "https://i.pravatar.cc/96?img=47", displayed: false },
            { userId: "u-5", rank: 5, name: "William Turner", byline: "Level 33 - Gold", total: 199500, avatarUrl: "https://i.pravatar.cc/96?img=52", displayed: false },
            { userId: "u-6", rank: 6, name: "Ruby Claire", byline: "Level 31 - Gold", total: 198300, avatarUrl: "https://i.pravatar.cc/96?img=9", displayed: false },
            { userId: "u-19", rank: 19, name: "Grace Coleman", byline: "Level 22 - Bronze", total: 130600, avatarUrl: "https://i.pravatar.cc/96?img=41", displayed: true },
            { userId: "u-20", rank: 20, name: "Olivia Reed", byline: "Level 22 - Bronze", total: 129900, avatarUrl: "https://i.pravatar.cc/96?img=5", displayed: true },
            { userId: "u-21", rank: 21, name: "Evan Knight", byline: "Level 21 - Bronze", total: 129300, avatarUrl: "https://i.pravatar.cc/96?img=8", displayed: true },
            { userId: "u-22", rank: 22, name: "Ivy Brooks", byline: "Level 20 - Bronze", total: 128700, avatarUrl: "https://i.pravatar.cc/96?img=24", displayed: false },
            { userId: "u-23", rank: 23, name: "Jack Porter", byline: "Level 20 - Bronze", total: 128100, avatarUrl: "https://i.pravatar.cc/96?img=62", displayed: false },
            { userId: "u-24", rank: 24, name: "Lily Morgan", byline: "Level 19 - Bronze", total: 127500, avatarUrl: "https://i.pravatar.cc/96?img=48", displayed: false },
            { userId: "u-40", rank: 40, name: "Nora Ellis", byline: "Level 14 - Rookie", total: 110300, avatarUrl: "https://i.pravatar.cc/96?img=27", displayed: true },
            { userId: "u-41", rank: 41, name: "Owen Ward", byline: "Level 14 - Rookie", total: 109800, avatarUrl: "https://i.pravatar.cc/96?img=17", displayed: true },
            { userId: "u-42", rank: 42, name: "Paige Hudson", byline: "Level 13 - Rookie", total: 109200, avatarUrl: "https://i.pravatar.cc/96?img=44", displayed: true },
            { userId: "u-43", rank: 43, name: "Quinn Tate", byline: "Level 13 - Rookie", total: 108600, avatarUrl: "https://i.pravatar.cc/96?img=23", displayed: true },
            { userId: "u-44", rank: 44, name: "Riley James", byline: "Level 12 - Rookie", total: 107900, avatarUrl: "https://i.pravatar.cc/96?img=58", displayed: true },
          ]}
        />
      </div>
    ),
    code: `<LeaderboardRankings
  currentUserId="u-20"
  rankings={[
    { userId: "u-1", rank: 1, name: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", total: 289400, displayed: true },
    { userId: "u-2", rank: 2, name: "Leo Harrison", byline: "Level 39 - Platinum", total: 251800, displayed: true },
    { userId: "u-3", rank: 3, name: "Rowan Elijah", byline: "Level 37 - Platinum", total: 238300, displayed: true },
    { userId: "u-4", rank: 4, name: "Mia Sophia Bennett", byline: "Level 34 - Gold", total: 221700, displayed: false },
    // ... hidden rows collapse into "..."
    { userId: "u-19", rank: 19, name: "Grace Coleman", byline: "Level 22 - Bronze", total: 130600, displayed: true },
    { userId: "u-20", rank: 20, name: "Olivia Reed", byline: "Level 22 - Bronze", total: 129900, displayed: true },
    { userId: "u-21", rank: 21, name: "Evan Knight", byline: "Level 21 - Bronze", total: 129300, displayed: true },
    { userId: "u-22", rank: 22, name: "Ivy Brooks", byline: "Level 20 - Bronze", total: 128700, displayed: false },
    // ... another collapsed block
    { userId: "u-40", rank: 40, name: "Nora Ellis", byline: "Level 14 - Rookie", total: 110300, displayed: true },
    { userId: "u-41", rank: 41, name: "Owen Ward", byline: "Level 14 - Rookie", total: 109800, displayed: true },
    { userId: "u-42", rank: 42, name: "Paige Hudson", byline: "Level 13 - Rookie", total: 109200, displayed: true },
    { userId: "u-43", rank: 43, name: "Quinn Tate", byline: "Level 13 - Rookie", total: 108600, displayed: true },
    { userId: "u-44", rank: 44, name: "Riley James", byline: "Level 12 - Rookie", total: 107900, displayed: true },
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
