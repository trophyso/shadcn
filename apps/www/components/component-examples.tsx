"use client"

import * as React from "react"

import { AchievementBadge } from "@/registry/trophy/ui/achievement-badge"
import { AchievementCard } from "@/registry/trophy/ui/achievement-card"
import { AchievementGrid } from "@/registry/trophy/ui/achievement-grid"
import { AchievementList } from "@/registry/trophy/ui/achievement-list"
import { AchievementUnlocked } from "@/registry/trophy/ui/achievement-unlocked"
import { LeaderboardCard } from "@/registry/trophy/ui/leaderboard-card"
import { LeaderboardPodium } from "@/registry/trophy/ui/leaderboard-podium"
import { LeaderboardRankings } from "@/registry/trophy/ui/leaderboard-rankings"
import { PointsAwards } from "@/registry/trophy/ui/points-awards"
import { PointsBadge } from "@/registry/trophy/ui/points-badge"
import { PointsBoost } from "@/registry/trophy/ui/points-boost"
import { PointsChart } from "@/registry/trophy/ui/points-chart"
import { PointsLevelsList } from "@/registry/trophy/ui/points-levels-list"
import { PointsLevelsTimeline } from "@/registry/trophy/ui/points-levels-timeline"
import { StreakBadge } from "@/registry/trophy/ui/streak-badge"
import { StreakCalendar } from "@/registry/trophy/ui/streak-calendar"
import { StreakCard } from "@/registry/trophy/ui/streak-card"

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
      usedFreeze: true,
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

type PointsChartPeriodId =
  | "last-7-days"
  | "last-4-weeks"
  | "last-3-months"
  | "last-6-months"
  | "last-12-months"
  | "year-to-date"
  | "all-time"

function formatPointsChartLabel(
  date: Date,
  granularity: "day" | "week" | "month"
) {
  if (granularity === "month") {
    return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

function buildPointsChartData(
  count: number,
  granularity: "day" | "week" | "month",
  startValue: number,
  stepValue: number
) {
  const now = new Date()
  let lastPoints = Math.max(0, Math.round(startValue))
  let previousTotal = 0

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    const offset = count - 1 - index

    if (granularity === "day") {
      date.setDate(date.getDate() - offset)
    } else if (granularity === "week") {
      date.setDate(date.getDate() - offset * 7)
    } else {
      date.setMonth(date.getMonth() - offset)
    }

    // Add deterministic variance so sample charts do not look perfectly linear.
    const wave = Math.sin(index * 1.35) * stepValue * 0.55
    const zigzag = ((index % 3) - 1) * stepValue * 0.25
    const variance = wave + zigzag
    const rawPoints = Math.max(
      0,
      Math.round(startValue + index * stepValue + variance)
    )
    const total = index === 0 ? rawPoints : Math.max(lastPoints, rawPoints)
    const change = total - previousTotal
    previousTotal = total
    lastPoints = total

    return {
      date: formatPointsChartLabel(date, granularity),
      total,
      change,
    }
  })
}

function PointsChartPeriodSelectorPreview() {
  const [period, setPeriod] = React.useState<PointsChartPeriodId>("last-7-days")

  const datasets = React.useMemo(() => {
    const ytdCount = new Date().getMonth() + 1

    return {
      "last-7-days": {
        label: "Last 7 days",
        data: buildPointsChartData(7, "day", 980, 35),
      },
      "last-4-weeks": {
        label: "Last 4 weeks",
        data: buildPointsChartData(28, "day", 520, 20),
      },
      "last-3-months": {
        label: "Last 3 months",
        data: buildPointsChartData(13, "week", 300, 55),
      },
      "last-6-months": {
        label: "Last 6 months",
        data: buildPointsChartData(6, "month", 220, 110),
      },
      "last-12-months": {
        label: "Last 12 months",
        data: buildPointsChartData(12, "month", 120, 70),
      },
      "year-to-date": {
        label: "Year to date",
        data: buildPointsChartData(ytdCount, "month", 150, 95),
      },
      "all-time": {
        label: "All time",
        data: buildPointsChartData(24, "month", 50, 45),
      },
    } satisfies Record<
      PointsChartPeriodId,
      {
        label: string
        data: Array<{ date: string; total: number; change: number }>
      }
    >
  }, [])

  const selected = datasets[period]

  return (
    <div className="w-full max-w-2xl">
      <PointsChart
        title={`Your points · ${selected.label}`}
        data={selected.data}
        headerRight={
          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as PointsChartPeriodId)
            }
            className="bg-background text-foreground rounded-md border px-2 py-1 text-xs"
            aria-label="Select points chart period"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-4-weeks">Last 4 weeks</option>
            <option value="last-3-months">Last 3 months</option>
            <option value="last-6-months">Last 6 months</option>
            <option value="last-12-months">Last 12 months</option>
            <option value="year-to-date">Year to date</option>
            <option value="all-time">All time</option>
          </select>
        }
      />
    </div>
  )
}

function AchievementUnlockedPreview() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-background text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
      >
        Unlock achievement
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
        onSecondaryActionClick={() => {}}
      />
    </div>
  )
}

function LeaderboardCardWithPreviousRunsPreview() {
  const [selectedRunId, setSelectedRunId] = React.useState("this-week")
  const runData = React.useMemo(() => {
    return {
      "this-week": {
        fromDate: "2026-05-01",
        toDate: "2026-05-07",
        podiumRankings: leaderboardPodiumPreviewRankings,
        rankings: leaderboardCardPreviewRankings,
      },
      "last-week": {
        fromDate: "2026-04-24",
        toDate: "2026-04-30",
        podiumRankings: [
          {
            userId: "2",
            userName: "Leo Harrison",
            rank: 1,
            value: 1320,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
          },
          {
            userId: "1",
            userName: "Ava Elizabeth Turner",
            rank: 2,
            value: 1260,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
          },
          {
            userId: "3",
            userName: "Rowan Elijah",
            rank: 3,
            value: 1010,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
          },
        ],
        rankings: [
          {
            userId: "u-2",
            rank: 1,
            userName: "Leo Harrison",
            byline: "Level 39 - Platinum",
            value: 292100,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
            displayed: true,
          },
          {
            userId: "u-1",
            rank: 2,
            userName: "Ava Elizabeth Turner",
            byline: "Level 42 - Diamond",
            value: 286900,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
            displayed: true,
          },
          {
            userId: "u-3",
            rank: 3,
            userName: "Rowan Elijah",
            byline: "Level 37 - Platinum",
            value: 241000,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
            displayed: true,
          },
          {
            userId: "u-4",
            rank: 4,
            userName: "Mia Sophia Bennett",
            byline: "Level 34 - Gold",
            value: 224100,
            avatarUrl: "https://i.pravatar.cc/96?img=47",
            displayed: false,
          },
          {
            userId: "u-5",
            rank: 5,
            userName: "Olivia Reed",
            byline: "Level 32 - Gold",
            value: 212400,
            avatarUrl: "https://i.pravatar.cc/96?img=5",
            displayed: true,
          },
          {
            userId: "u-6",
            rank: 6,
            userName: "William Turner",
            byline: "Level 31 - Gold",
            value: 201900,
            avatarUrl: "https://i.pravatar.cc/96?img=52",
            displayed: false,
          },
          {
            userId: "u-7",
            rank: 7,
            userName: "Ruby Claire",
            byline: "Level 29 - Silver",
            value: 197200,
            avatarUrl: "https://i.pravatar.cc/96?img=9",
            displayed: false,
          },
          {
            userId: "u-8",
            rank: 8,
            userName: "Ethan Brooks",
            byline: "Level 28 - Silver",
            value: 189000,
            avatarUrl: "https://i.pravatar.cc/96?img=60",
            displayed: true,
          },
          {
            userId: "u-9",
            rank: 9,
            userName: "Chloe Madison",
            byline: "Level 27 - Silver",
            value: 180300,
            avatarUrl: "https://i.pravatar.cc/96?img=29",
            displayed: true,
          },
          {
            userId: "u-10",
            rank: 10,
            userName: "Noah Bennett",
            byline: "Level 26 - Silver",
            value: 172200,
            avatarUrl: "https://i.pravatar.cc/96?img=36",
            displayed: false,
          },
        ],
      },
      "2026-04-20": {
        fromDate: "2026-04-17",
        toDate: "2026-04-23",
        podiumRankings: [
          {
            userId: "1",
            userName: "Ava Elizabeth Turner",
            rank: 1,
            value: 1210,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
          },
          {
            userId: "3",
            userName: "Rowan Elijah",
            rank: 2,
            value: 1140,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
          },
          {
            userId: "2",
            userName: "Leo Harrison",
            rank: 3,
            value: 1090,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
          },
        ],
        rankings: [
          {
            userId: "u-1",
            rank: 1,
            userName: "Ava Elizabeth Turner",
            byline: "Level 42 - Diamond",
            value: 281400,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
            displayed: true,
          },
          {
            userId: "u-3",
            rank: 2,
            userName: "Rowan Elijah",
            byline: "Level 37 - Platinum",
            value: 249300,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
            displayed: true,
          },
          {
            userId: "u-2",
            rank: 3,
            userName: "Leo Harrison",
            byline: "Level 39 - Platinum",
            value: 245700,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
            displayed: true,
          },
          {
            userId: "u-4",
            rank: 4,
            userName: "Mia Sophia Bennett",
            byline: "Level 34 - Gold",
            value: 226600,
            avatarUrl: "https://i.pravatar.cc/96?img=47",
            displayed: false,
          },
          {
            userId: "u-5",
            rank: 5,
            userName: "Olivia Reed",
            byline: "Level 32 - Gold",
            value: 214000,
            avatarUrl: "https://i.pravatar.cc/96?img=5",
            displayed: true,
          },
          {
            userId: "u-6",
            rank: 6,
            userName: "William Turner",
            byline: "Level 31 - Gold",
            value: 204500,
            avatarUrl: "https://i.pravatar.cc/96?img=52",
            displayed: false,
          },
          {
            userId: "u-7",
            rank: 7,
            userName: "Ruby Claire",
            byline: "Level 29 - Silver",
            value: 198900,
            avatarUrl: "https://i.pravatar.cc/96?img=9",
            displayed: false,
          },
          {
            userId: "u-8",
            rank: 8,
            userName: "Ethan Brooks",
            byline: "Level 28 - Silver",
            value: 191700,
            avatarUrl: "https://i.pravatar.cc/96?img=60",
            displayed: true,
          },
          {
            userId: "u-9",
            rank: 9,
            userName: "Chloe Madison",
            byline: "Level 27 - Silver",
            value: 182600,
            avatarUrl: "https://i.pravatar.cc/96?img=29",
            displayed: true,
          },
          {
            userId: "u-10",
            rank: 10,
            userName: "Noah Bennett",
            byline: "Level 26 - Silver",
            value: 174900,
            avatarUrl: "https://i.pravatar.cc/96?img=36",
            displayed: false,
          },
        ],
      },
      "2026-04-13": {
        fromDate: "2026-04-10",
        toDate: "2026-04-16",
        podiumRankings: [
          {
            userId: "3",
            userName: "Rowan Elijah",
            rank: 1,
            value: 1280,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
          },
          {
            userId: "1",
            userName: "Ava Elizabeth Turner",
            rank: 2,
            value: 1200,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
          },
          {
            userId: "2",
            userName: "Leo Harrison",
            rank: 3,
            value: 1080,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
          },
        ],
        rankings: [
          {
            userId: "u-3",
            rank: 1,
            userName: "Rowan Elijah",
            byline: "Level 37 - Platinum",
            value: 287700,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
            displayed: true,
          },
          {
            userId: "u-1",
            rank: 2,
            userName: "Ava Elizabeth Turner",
            byline: "Level 42 - Diamond",
            value: 283200,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
            displayed: true,
          },
          {
            userId: "u-2",
            rank: 3,
            userName: "Leo Harrison",
            byline: "Level 39 - Platinum",
            value: 246000,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
            displayed: true,
          },
          {
            userId: "u-4",
            rank: 4,
            userName: "Mia Sophia Bennett",
            byline: "Level 34 - Gold",
            value: 227900,
            avatarUrl: "https://i.pravatar.cc/96?img=47",
            displayed: false,
          },
          {
            userId: "u-5",
            rank: 5,
            userName: "Olivia Reed",
            byline: "Level 32 - Gold",
            value: 216400,
            avatarUrl: "https://i.pravatar.cc/96?img=5",
            displayed: true,
          },
          {
            userId: "u-6",
            rank: 6,
            userName: "William Turner",
            byline: "Level 31 - Gold",
            value: 206800,
            avatarUrl: "https://i.pravatar.cc/96?img=52",
            displayed: false,
          },
          {
            userId: "u-7",
            rank: 7,
            userName: "Ruby Claire",
            byline: "Level 29 - Silver",
            value: 200400,
            avatarUrl: "https://i.pravatar.cc/96?img=9",
            displayed: false,
          },
          {
            userId: "u-8",
            rank: 8,
            userName: "Ethan Brooks",
            byline: "Level 28 - Silver",
            value: 193300,
            avatarUrl: "https://i.pravatar.cc/96?img=60",
            displayed: true,
          },
          {
            userId: "u-9",
            rank: 9,
            userName: "Chloe Madison",
            byline: "Level 27 - Silver",
            value: 185500,
            avatarUrl: "https://i.pravatar.cc/96?img=29",
            displayed: true,
          },
          {
            userId: "u-10",
            rank: 10,
            userName: "Noah Bennett",
            byline: "Level 26 - Silver",
            value: 177000,
            avatarUrl: "https://i.pravatar.cc/96?img=36",
            displayed: false,
          },
        ],
      },
      "2026-04-06": {
        fromDate: "2026-04-03",
        toDate: "2026-04-09",
        podiumRankings: [
          {
            userId: "2",
            userName: "Leo Harrison",
            rank: 1,
            value: 1230,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
          },
          {
            userId: "3",
            userName: "Rowan Elijah",
            rank: 2,
            value: 1170,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
          },
          {
            userId: "1",
            userName: "Ava Elizabeth Turner",
            rank: 3,
            value: 1110,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
          },
        ],
        rankings: [
          {
            userId: "u-2",
            rank: 1,
            userName: "Leo Harrison",
            byline: "Level 39 - Platinum",
            value: 279900,
            avatarUrl: "https://i.pravatar.cc/96?img=12",
            displayed: true,
          },
          {
            userId: "u-3",
            rank: 2,
            userName: "Rowan Elijah",
            byline: "Level 37 - Platinum",
            value: 273100,
            avatarUrl: "https://i.pravatar.cc/96?img=15",
            displayed: true,
          },
          {
            userId: "u-1",
            rank: 3,
            userName: "Ava Elizabeth Turner",
            byline: "Level 42 - Diamond",
            value: 268400,
            avatarUrl: "https://i.pravatar.cc/96?img=32",
            displayed: true,
          },
          {
            userId: "u-4",
            rank: 4,
            userName: "Mia Sophia Bennett",
            byline: "Level 34 - Gold",
            value: 229800,
            avatarUrl: "https://i.pravatar.cc/96?img=47",
            displayed: false,
          },
          {
            userId: "u-5",
            rank: 5,
            userName: "Olivia Reed",
            byline: "Level 32 - Gold",
            value: 218700,
            avatarUrl: "https://i.pravatar.cc/96?img=5",
            displayed: true,
          },
          {
            userId: "u-6",
            rank: 6,
            userName: "William Turner",
            byline: "Level 31 - Gold",
            value: 208300,
            avatarUrl: "https://i.pravatar.cc/96?img=52",
            displayed: false,
          },
          {
            userId: "u-7",
            rank: 7,
            userName: "Ruby Claire",
            byline: "Level 29 - Silver",
            value: 202100,
            avatarUrl: "https://i.pravatar.cc/96?img=9",
            displayed: false,
          },
          {
            userId: "u-8",
            rank: 8,
            userName: "Ethan Brooks",
            byline: "Level 28 - Silver",
            value: 194700,
            avatarUrl: "https://i.pravatar.cc/96?img=60",
            displayed: true,
          },
          {
            userId: "u-9",
            rank: 9,
            userName: "Chloe Madison",
            byline: "Level 27 - Silver",
            value: 187600,
            avatarUrl: "https://i.pravatar.cc/96?img=29",
            displayed: true,
          },
          {
            userId: "u-10",
            rank: 10,
            userName: "Noah Bennett",
            byline: "Level 26 - Silver",
            value: 179900,
            avatarUrl: "https://i.pravatar.cc/96?img=36",
            displayed: false,
          },
        ],
      },
    }
  }, [])
  const selectedRun =
    runData[selectedRunId as keyof typeof runData] ?? runData["this-week"]

  return (
    <div className="w-full max-w-2xl">
      <LeaderboardCard
        title="Weekly Leaderboard"
        fromDate={selectedRun.fromDate}
        toDate={selectedRun.toDate}
        currentUserId="u-5"
        selectedRunId={selectedRunId}
        onRunChange={setSelectedRunId}
        runOptions={[
          { id: "this-week", label: "This week" },
          { id: "last-week", label: "Last week" },
          { id: "2026-04-20", label: "Apr 17 - Apr 23" },
          { id: "2026-04-13", label: "Apr 10 - Apr 16" },
          { id: "2026-04-06", label: "Apr 3 - Apr 9" },
        ]}
        podiumRankings={selectedRun.podiumRankings}
        rankings={selectedRun.rankings}
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

const achievementBadgeLockedPreviewItem = {
  id: "badge-locked-1",
  name: "Perfectionist",
  trigger: "metric" as const,
  achievedAt: null,
}

const achievementBadgePreviewItem = {
  id: "badge-1",
  name: "Consistency I",
  trigger: "streak" as const,
  achievedAt: new Date().toISOString(),
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

const leaderboardPodiumPreviewRankings = [
  {
    userId: "1",
    userName: "Ava Elizabeth Turner",
    rank: 1,
    value: 1250,
    avatarUrl: "https://i.pravatar.cc/96?img=32",
  },
  {
    userId: "2",
    userName: "Leo Harrison",
    rank: 2,
    value: 1100,
    avatarUrl: "https://i.pravatar.cc/96?img=12",
  },
  {
    userId: "3",
    userName: "Rowan Elijah",
    rank: 3,
    value: 980,
    avatarUrl: "https://i.pravatar.cc/96?img=15",
  },
]

const leaderboardCardPreviewRankings = [
  {
    userId: "u-1",
    rank: 1,
    userName: "Ava Elizabeth Turner",
    byline: "Level 42 - Diamond",
    value: 289400,
    avatarUrl: "https://i.pravatar.cc/96?img=32",
    displayed: true,
  },
  {
    userId: "u-2",
    rank: 2,
    userName: "Leo Harrison",
    byline: "Level 39 - Platinum",
    value: 251800,
    avatarUrl: "https://i.pravatar.cc/96?img=12",
    displayed: true,
  },
  {
    userId: "u-3",
    rank: 3,
    userName: "Rowan Elijah",
    byline: "Level 37 - Platinum",
    value: 238300,
    avatarUrl: "https://i.pravatar.cc/96?img=15",
    displayed: true,
  },
  {
    userId: "u-4",
    rank: 4,
    userName: "Mia Sophia Bennett",
    byline: "Level 34 - Gold",
    value: 221700,
    avatarUrl: "https://i.pravatar.cc/96?img=47",
    displayed: false,
  },
  {
    userId: "u-5",
    rank: 5,
    userName: "Olivia Reed",
    byline: "Level 32 - Gold",
    value: 210900,
    avatarUrl: "https://i.pravatar.cc/96?img=5",
    displayed: true,
  },
  {
    userId: "u-6",
    rank: 6,
    userName: "William Turner",
    byline: "Level 31 - Gold",
    value: 199500,
    avatarUrl: "https://i.pravatar.cc/96?img=52",
    displayed: false,
  },
  {
    userId: "u-7",
    rank: 7,
    userName: "Ruby Claire",
    byline: "Level 29 - Silver",
    value: 198300,
    avatarUrl: "https://i.pravatar.cc/96?img=9",
    displayed: false,
  },
  {
    userId: "u-8",
    rank: 8,
    userName: "Ethan Brooks",
    byline: "Level 28 - Silver",
    value: 187200,
    avatarUrl: "https://i.pravatar.cc/96?img=60",
    displayed: true,
  },
  {
    userId: "u-9",
    rank: 9,
    userName: "Chloe Madison",
    byline: "Level 27 - Silver",
    value: 176800,
    avatarUrl: "https://i.pravatar.cc/96?img=29",
    displayed: true,
  },
  {
    userId: "u-10",
    rank: 10,
    userName: "Noah Bennett",
    byline: "Level 26 - Silver",
    value: 169300,
    avatarUrl: "https://i.pravatar.cc/96?img=36",
    displayed: false,
  },
]

type ComponentExampleConfig = {
  component: React.ReactNode
  code: string
}

export const componentExamples: Record<string, ComponentExampleConfig> = {
  "streak-badge": {
    component: <StreakBadge length={7} frequency="daily" />,
    code: `<StreakBadge length={7} frequency="daily" />`,
  },
  "streak-badge-basic": {
    component: <StreakBadge length={7} frequency="daily" />,
    code: `<StreakBadge length={7} frequency="daily" />`,
  },
  "streak-badge-sizes": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <StreakBadge length={7} frequency="daily" size="sm" />
        <StreakBadge length={7} frequency="daily" size="default" />
        <StreakBadge length={7} frequency="daily" size="lg" />
      </div>
    ),
    code: `<StreakBadge length={7} frequency="daily" size="sm" />
<StreakBadge length={7} frequency="daily" size="default" />
<StreakBadge length={7} frequency="daily" size="lg" />`,
  },
  "streak-calendar": {
    component: <StreakCalendar streak={createStreakHistory()} />,
    code: `<StreakCalendar
  streak={[
    { periodStart: "2024-01-01", periodEnd: "2024-01-01" },
    // ... more dates
  ]}
/>`,
  },
  "streak-calendar-monday": {
    component: (
      <StreakCalendar startOfWeek={1} streak={createStreakHistory()} />
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
      <StreakCalendar view="year" streak={createYearStyleStreakHistory()} />
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
              achievedAt: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(),
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
        <AchievementGrid
          achievements={achievementGridUnlockedPreviewItems}
          columns={2}
        />
        <AchievementGrid
          achievements={achievementGridUnlockedPreviewItems}
          columns={3}
        />
        <AchievementGrid
          achievements={achievementGridUnlockedPreviewItems}
          columns={4}
        />
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
        <AchievementGrid
          achievements={achievementGridUnlockedPreviewItems}
          gap="sm"
        />
        <AchievementGrid
          achievements={achievementGridUnlockedPreviewItems}
          gap="default"
        />
        <AchievementGrid
          achievements={achievementGridUnlockedPreviewItems}
          gap="lg"
        />
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
    component: <AchievementBadge achievement={achievementBadgePreviewItem} />,
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
  "achievement-badge-locked-state": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <AchievementBadge achievement={achievementBadgePreviewItem} />
        <AchievementBadge achievement={achievementBadgeLockedPreviewItem} />
      </div>
    ),
    code: `<AchievementBadge
  achievement={{
    id: "badge-1",
    name: "Consistency I",
    trigger: "streak",
    achievedAt: "2024-01-01T00:00:00Z",
  }}
/>
<AchievementBadge
  achievement={{
    id: "badge-locked-1",
    name: "Perfectionist",
    trigger: "metric",
    achievedAt: null,
  }}
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
        onAchievementClick={() => {}}
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
          onAchievementClick={() => {}}
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
  Unlock achievement
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
              userName: "Ava Elizabeth Turner",
              byline: "Level 42 - Diamond",
              value: 289400,
              avatarUrl: "https://i.pravatar.cc/96?img=32",
            },
            {
              userId: "u-2",
              rank: 2,
              userName: "Leo Harrison",
              byline: "Level 39 - Platinum",
              value: 251800,
              avatarUrl: "https://i.pravatar.cc/96?img=12",
            },
            {
              userId: "u-3",
              rank: 3,
              userName: "Rowan Elijah",
              byline: "Level 37 - Platinum",
              value: 238300,
              avatarUrl: "https://i.pravatar.cc/96?img=15",
            },
            {
              userId: "u-4",
              rank: 4,
              userName: "Mia Sophia Bennett",
              byline: "Level 34 - Gold",
              value: 221700,
              avatarUrl: "https://i.pravatar.cc/96?img=47",
            },
            {
              userId: "u-5",
              rank: 5,
              userName: "William Turner",
              byline: "Level 33 - Gold",
              value: 199500,
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
      userName: "Ava Elizabeth Turner",
      byline: "Level 42 - Diamond",
      value: 289400,
      avatarUrl: "https://i.pravatar.cc/96?img=32",
    },
    {
      userId: "u-2",
      rank: 2,
      userName: "Leo Harrison",
      byline: "Level 39 - Platinum",
      value: 251800,
      avatarUrl: "https://i.pravatar.cc/96?img=12",
    },
    {
      userId: "u-3",
      rank: 3,
      userName: "Rowan Elijah",
      byline: "Level 37 - Platinum",
      value: 238300,
      avatarUrl: "https://i.pravatar.cc/96?img=15",
    },
    {
      userId: "u-4",
      rank: 4,
      userName: "Mia Sophia Bennett",
      byline: "Level 34 - Gold",
      value: 221700,
      avatarUrl: "https://i.pravatar.cc/96?img=47",
    },
    {
      userId: "u-5",
      rank: 5,
      userName: "William Turner",
      byline: "Level 33 - Gold",
      value: 199500,
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
              userName: "Ava Elizabeth Turner",
              byline: "Level 42 - Diamond",
              value: 289400,
              avatarUrl: "https://i.pravatar.cc/96?img=32",
              rankChange: 2,
            },
            {
              userId: "u-2",
              rank: 2,
              userName: "Leo Harrison",
              byline: "Level 39 - Platinum",
              value: 251800,
              avatarUrl: "https://i.pravatar.cc/96?img=12",
              rankChange: -1,
            },
            {
              userId: "u-3",
              rank: 3,
              userName: "Rowan Elijah",
              byline: "Level 37 - Platinum",
              value: 238300,
              avatarUrl: "https://i.pravatar.cc/96?img=15",
              rankChange: -2,
            },
            {
              userId: "u-4",
              rank: 4,
              userName: "Mia Sophia Bennett",
              byline: "Level 34 - Gold",
              value: 221700,
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
      userName: "Ava Elizabeth Turner",
      byline: "Level 42 - Diamond",
      value: 289400,
      avatarUrl: "https://i.pravatar.cc/96?img=32",
      rankChange: 2,
    },
    {
      userId: "u-2",
      rank: 2,
      userName: "Leo Harrison",
      byline: "Level 39 - Platinum",
      value: 251800,
      avatarUrl: "https://i.pravatar.cc/96?img=12",
      rankChange: -1,
    },
    {
      userId: "u-3",
      rank: 3,
      userName: "Rowan Elijah",
      byline: "Level 37 - Platinum",
      value: 238300,
      avatarUrl: "https://i.pravatar.cc/96?img=15",
      rankChange: -2,
    },
    {
      userId: "u-4",
      rank: 4,
      userName: "Mia Sophia Bennett",
      byline: "Level 34 - Gold",
      value: 221700,
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
            {
              userId: "u-1",
              rank: 1,
              userName: "Ava Elizabeth Turner",
              byline: "Level 42 - Diamond",
              value: 289400,
              avatarUrl: "https://i.pravatar.cc/96?img=32",
            },
            {
              userId: "u-2",
              rank: 2,
              userName: "Leo Harrison",
              byline: "Level 39 - Platinum",
              value: 251800,
              avatarUrl: "https://i.pravatar.cc/96?img=12",
            },
            {
              userId: "u-3",
              rank: 3,
              userName: "Rowan Elijah",
              byline: "Level 37 - Platinum",
              value: 238300,
              avatarUrl: "https://i.pravatar.cc/96?img=15",
            },
            {
              userId: "u-4",
              rank: 4,
              userName: "Mia Sophia Bennett",
              byline: "Level 34 - Gold",
              value: 221700,
              avatarUrl: "https://i.pravatar.cc/96?img=47",
            },
            {
              userId: "u-5",
              rank: 5,
              userName: "William Turner",
              byline: "Level 33 - Gold",
              value: 199500,
              avatarUrl: "https://i.pravatar.cc/96?img=52",
            },
            {
              userId: "u-6",
              rank: 6,
              userName: "Ruby Claire",
              byline: "Level 31 - Gold",
              value: 198300,
              avatarUrl: "https://i.pravatar.cc/96?img=9",
            },
            {
              userId: "u-7",
              rank: 7,
              userName: "Ethan Brooks",
              byline: "Level 29 - Silver",
              value: 187200,
              avatarUrl: "https://i.pravatar.cc/96?img=60",
            },
            {
              userId: "u-8",
              rank: 8,
              userName: "Chloe Madison",
              byline: "Level 28 - Silver",
              value: 176800,
              avatarUrl: "https://i.pravatar.cc/96?img=29",
            },
            {
              userId: "u-9",
              rank: 9,
              userName: "Noah Bennett",
              byline: "Level 27 - Silver",
              value: 169300,
              avatarUrl: "https://i.pravatar.cc/96?img=36",
            },
            {
              userId: "u-10",
              rank: 10,
              userName: "Isla Monroe",
              byline: "Level 26 - Silver",
              value: 161900,
              avatarUrl: "https://i.pravatar.cc/96?img=33",
            },
            {
              userId: "u-11",
              rank: 11,
              userName: "Mason Carter",
              byline: "Level 25 - Bronze",
              value: 154600,
              avatarUrl: "https://i.pravatar.cc/96?img=61",
            },
            {
              userId: "u-12",
              rank: 12,
              userName: "Ella Foster",
              byline: "Level 24 - Bronze",
              value: 148200,
              avatarUrl: "https://i.pravatar.cc/96?img=26",
            },
          ]}
        />
      </div>
    ),
    code: `<LeaderboardRankings
  showPagination
  rankings={[
    { userId: "u-1", rank: 1, userName: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", value: 289400, avatarUrl: "https://i.pravatar.cc/96?img=32" },
    { userId: "u-2", rank: 2, userName: "Leo Harrison", byline: "Level 39 - Platinum", value: 251800, avatarUrl: "https://i.pravatar.cc/96?img=12" },
    { userId: "u-3", rank: 3, userName: "Rowan Elijah", byline: "Level 37 - Platinum", value: 238300, avatarUrl: "https://i.pravatar.cc/96?img=15" },
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
            {
              userId: "u-1",
              rank: 1,
              userName: "Ava Elizabeth Turner",
              byline: "Level 42 - Diamond",
              value: 289400,
              avatarUrl: "https://i.pravatar.cc/96?img=32",
              displayed: true,
            },
            {
              userId: "u-2",
              rank: 2,
              userName: "Leo Harrison",
              byline: "Level 39 - Platinum",
              value: 251800,
              avatarUrl: "https://i.pravatar.cc/96?img=12",
              displayed: true,
            },
            {
              userId: "u-3",
              rank: 3,
              userName: "Rowan Elijah",
              byline: "Level 37 - Platinum",
              value: 238300,
              avatarUrl: "https://i.pravatar.cc/96?img=15",
              displayed: true,
            },
            {
              userId: "u-4",
              rank: 4,
              userName: "Mia Sophia Bennett",
              byline: "Level 34 - Gold",
              value: 221700,
              avatarUrl: "https://i.pravatar.cc/96?img=47",
              displayed: false,
            },
            {
              userId: "u-5",
              rank: 5,
              userName: "William Turner",
              byline: "Level 33 - Gold",
              value: 199500,
              avatarUrl: "https://i.pravatar.cc/96?img=52",
              displayed: false,
            },
            {
              userId: "u-6",
              rank: 6,
              userName: "Ruby Claire",
              byline: "Level 31 - Gold",
              value: 198300,
              avatarUrl: "https://i.pravatar.cc/96?img=9",
              displayed: false,
            },
            {
              userId: "u-19",
              rank: 19,
              userName: "Grace Coleman",
              byline: "Level 22 - Bronze",
              value: 130600,
              avatarUrl: "https://i.pravatar.cc/96?img=41",
              displayed: true,
            },
            {
              userId: "u-20",
              rank: 20,
              userName: "Olivia Reed",
              byline: "Level 22 - Bronze",
              value: 129900,
              avatarUrl: "https://i.pravatar.cc/96?img=5",
              displayed: true,
            },
            {
              userId: "u-21",
              rank: 21,
              userName: "Evan Knight",
              byline: "Level 21 - Bronze",
              value: 129300,
              avatarUrl: "https://i.pravatar.cc/96?img=8",
              displayed: true,
            },
            {
              userId: "u-22",
              rank: 22,
              userName: "Ivy Brooks",
              byline: "Level 20 - Bronze",
              value: 128700,
              avatarUrl: "https://i.pravatar.cc/96?img=24",
              displayed: false,
            },
            {
              userId: "u-23",
              rank: 23,
              userName: "Jack Porter",
              byline: "Level 20 - Bronze",
              value: 128100,
              avatarUrl: "https://i.pravatar.cc/96?img=62",
              displayed: false,
            },
            {
              userId: "u-24",
              rank: 24,
              userName: "Lily Morgan",
              byline: "Level 19 - Bronze",
              value: 127500,
              avatarUrl: "https://i.pravatar.cc/96?img=48",
              displayed: false,
            },
            {
              userId: "u-40",
              rank: 40,
              userName: "Nora Ellis",
              byline: "Level 14 - Rookie",
              value: 110300,
              avatarUrl: "https://i.pravatar.cc/96?img=27",
              displayed: true,
            },
            {
              userId: "u-41",
              rank: 41,
              userName: "Owen Ward",
              byline: "Level 14 - Rookie",
              value: 109800,
              avatarUrl: "https://i.pravatar.cc/96?img=17",
              displayed: true,
            },
            {
              userId: "u-42",
              rank: 42,
              userName: "Paige Hudson",
              byline: "Level 13 - Rookie",
              value: 109200,
              avatarUrl: "https://i.pravatar.cc/96?img=44",
              displayed: true,
            },
            {
              userId: "u-43",
              rank: 43,
              userName: "Quinn Tate",
              byline: "Level 13 - Rookie",
              value: 108600,
              avatarUrl: "https://i.pravatar.cc/96?img=23",
              displayed: true,
            },
            {
              userId: "u-44",
              rank: 44,
              userName: "Riley James",
              byline: "Level 12 - Rookie",
              value: 107900,
              avatarUrl: "https://i.pravatar.cc/96?img=58",
              displayed: true,
            },
          ]}
        />
      </div>
    ),
    code: `<LeaderboardRankings
  currentUserId="u-20"
  rankings={[
    { userId: "u-1", rank: 1, userName: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", value: 289400, displayed: true },
    { userId: "u-2", rank: 2, userName: "Leo Harrison", byline: "Level 39 - Platinum", value: 251800, displayed: true },
    { userId: "u-3", rank: 3, userName: "Rowan Elijah", byline: "Level 37 - Platinum", value: 238300, displayed: true },
    { userId: "u-4", rank: 4, userName: "Mia Sophia Bennett", byline: "Level 34 - Gold", value: 221700, displayed: false },
    // ... hidden rows collapse into "..."
    { userId: "u-19", rank: 19, userName: "Grace Coleman", byline: "Level 22 - Bronze", value: 130600, displayed: true },
    { userId: "u-20", rank: 20, userName: "Olivia Reed", byline: "Level 22 - Bronze", value: 129900, displayed: true },
    { userId: "u-21", rank: 21, userName: "Evan Knight", byline: "Level 21 - Bronze", value: 129300, displayed: true },
    { userId: "u-22", rank: 22, userName: "Ivy Brooks", byline: "Level 20 - Bronze", value: 128700, displayed: false },
    // ... another collapsed block
    { userId: "u-40", rank: 40, userName: "Nora Ellis", byline: "Level 14 - Rookie", value: 110300, displayed: true },
    { userId: "u-41", rank: 41, userName: "Owen Ward", byline: "Level 14 - Rookie", value: 109800, displayed: true },
    { userId: "u-42", rank: 42, userName: "Paige Hudson", byline: "Level 13 - Rookie", value: 109200, displayed: true },
    { userId: "u-43", rank: 43, userName: "Quinn Tate", byline: "Level 13 - Rookie", value: 108600, displayed: true },
    { userId: "u-44", rank: 44, userName: "Riley James", byline: "Level 12 - Rookie", value: 107900, displayed: true },
  ]}
/>`,
  },
  "leaderboard-podium": {
    component: (
      <LeaderboardPodium rankings={leaderboardPodiumPreviewRankings} />
    ),
    code: `<LeaderboardPodium
  rankings={[
    { userId: "1", userName: "Ava Elizabeth Turner", rank: 1, value: 1250, avatarUrl: "https://i.pravatar.cc/96?img=32" },
    { userId: "2", userName: "Leo Harrison", rank: 2, value: 1100, avatarUrl: "https://i.pravatar.cc/96?img=12" },
    { userId: "3", userName: "Rowan Elijah", rank: 3, value: 980, avatarUrl: "https://i.pravatar.cc/96?img=15" },
  ]}
/>`,
  },
  "leaderboard-podium-sizes": {
    component: (
      <div className="flex w-full flex-col items-center gap-8">
        <LeaderboardPodium
          rankings={leaderboardPodiumPreviewRankings}
          size="sm"
        />
        <LeaderboardPodium
          rankings={leaderboardPodiumPreviewRankings}
          size="default"
        />
        <LeaderboardPodium
          rankings={leaderboardPodiumPreviewRankings}
          size="lg"
        />
      </div>
    ),
    code: `<LeaderboardPodium rankings={rankings} size="sm" />
<LeaderboardPodium rankings={rankings} size="default" />
<LeaderboardPodium rankings={rankings} size="lg" />`,
  },
  "leaderboard-podium-partial": {
    component: (
      <LeaderboardPodium
        rankings={[
          {
            userId: "1",
            userName: "Alice",
            rank: 1,
            value: 2500,
            avatarUrl: "https://i.pravatar.cc/96?img=34",
          },
          {
            userId: "2",
            userName: "Bob",
            rank: 2,
            value: 2200,
            avatarUrl: "https://i.pravatar.cc/96?img=19",
          },
        ]}
      />
    ),
    code: `<LeaderboardPodium
  rankings={[
    { userId: "1", userName: "Alice", rank: 1, value: 2500 },
    { userId: "2", userName: "Bob", rank: 2, value: 2200 },
  ]}
/>`,
  },
  "leaderboard-card": {
    component: (
      <div className="w-full max-w-2xl">
        <LeaderboardCard
          title="Weekly Leaderboard"
          fromDate="2026-05-01"
          toDate="2026-05-07"
          currentUserId="u-5"
          podiumRankings={leaderboardPodiumPreviewRankings}
          rankings={leaderboardCardPreviewRankings}
        />
      </div>
    ),
    code: `<LeaderboardCard
  title="Weekly Leaderboard"
  fromDate="2026-05-01"
  toDate="2026-05-07"
  currentUserId="u-5"
  podiumRankings={[
    { userId: "u-1", userName: "Ava Elizabeth Turner", rank: 1, value: 289400, avatarUrl: "https://i.pravatar.cc/96?img=32" },
    { userId: "u-2", userName: "Leo Harrison", rank: 2, value: 251800, avatarUrl: "https://i.pravatar.cc/96?img=12" },
    { userId: "u-3", userName: "Rowan Elijah", rank: 3, value: 238300, avatarUrl: "https://i.pravatar.cc/96?img=15" },
  ]}
  rankings={[
    { userId: "u-1", rank: 1, userName: "Ava Elizabeth Turner", byline: "Level 42 - Diamond", value: 289400, displayed: true },
    { userId: "u-2", rank: 2, userName: "Leo Harrison", byline: "Level 39 - Platinum", value: 251800, displayed: true },
    { userId: "u-3", rank: 3, userName: "Rowan Elijah", byline: "Level 37 - Platinum", value: 238300, displayed: true },
    { userId: "u-4", rank: 4, userName: "Mia Sophia Bennett", byline: "Level 34 - Gold", value: 221700, displayed: false },
    { userId: "u-5", rank: 5, userName: "Olivia Reed", byline: "Level 32 - Gold", value: 210900, displayed: true },
    { userId: "u-6", rank: 6, userName: "William Turner", byline: "Level 31 - Gold", value: 199500, displayed: false },
    { userId: "u-7", rank: 7, userName: "Ruby Claire", byline: "Level 29 - Silver", value: 198300, displayed: false },
    { userId: "u-8", rank: 8, userName: "Ethan Brooks", byline: "Level 28 - Silver", value: 187200, displayed: true },
    { userId: "u-9", rank: 9, userName: "Chloe Madison", byline: "Level 27 - Silver", value: 176800, displayed: true },
    { userId: "u-10", rank: 10, userName: "Noah Bennett", byline: "Level 26 - Silver", value: 169300, displayed: false },
  ]}
/>`,
  },
  "leaderboard-card-with-previous-runs": {
    component: <LeaderboardCardWithPreviousRunsPreview />,
    code: `const [selectedRunId, setSelectedRunId] = useState("this-week")
const runs = {
  "this-week": {
    fromDate: "2026-05-01",
    toDate: "2026-05-07",
    podiumRankings,
    rankings,
  },
  "last-week": {
    fromDate: "2026-04-24",
    toDate: "2026-04-30",
    podiumRankings: lastWeekPodiumRankings,
    rankings: lastWeekRankings,
  },
  // ...older runs
}
const selectedRun = runs[selectedRunId] ?? runs["this-week"]

<LeaderboardCard
  title="Weekly Leaderboard"
  fromDate={selectedRun.fromDate}
  toDate={selectedRun.toDate}
  currentUserId="u-5"
  selectedRunId={selectedRunId}
  onRunChange={setSelectedRunId}
  runOptions={[
    { id: "this-week", label: "This week" },
    { id: "last-week", label: "Last week" },
    { id: "2026-04-20", label: "Apr 17 - Apr 23" },
    { id: "2026-04-13", label: "Apr 10 - Apr 16" },
    { id: "2026-04-06", label: "Apr 3 - Apr 9" },
  ]}
  podiumRankings={selectedRun.podiumRankings}
  rankings={selectedRun.rankings}
/>`,
  },
  "points-badge": {
    component: <PointsBadge name="XP" total={2500} />,
    code: `<PointsBadge name="XP" total={2500} />`,
  },
  "points-badge-sizes": {
    component: (
      <div className="flex flex-wrap items-center gap-4">
        <PointsBadge name="XP" total={1250} size="sm" />
        <PointsBadge name="XP" total={1250} size="default" />
        <PointsBadge name="XP" total={1250} size="lg" />
      </div>
    ),
    code: `<PointsBadge name="XP" total={1250} size="sm" />
<PointsBadge name="XP" total={1250} size="default" />
<PointsBadge name="XP" total={1250} size="lg" />`,
  },
  "points-chart": {
    component: (
      <div className="w-full max-w-2xl">
        <PointsChart
          data={[
            { date: "Fri", total: 0, change: 0 },
            { date: "Sat", total: 160, change: 160 },
            { date: "Sun", total: 240, change: 80 },
            { date: "Mon", total: 430, change: 190 },
            { date: "Tue", total: 590, change: 160 },
            { date: "Wed", total: 910, change: 320 },
            { date: "Thu", total: 1180, change: 270 },
          ]}
        />
      </div>
    ),
    code: `<PointsChart
  data={[
    { date: "Fri", total: 0, change: 0 },
    { date: "Sat", total: 160, change: 160 },
    { date: "Sun", total: 240, change: 80 },
    { date: "Mon", total: 430, change: 190 },
    { date: "Tue", total: 590, change: 160 },
    { date: "Wed", total: 910, change: 320 },
    { date: "Thu", total: 1180, change: 270 },
  ]}
/>`,
  },
  "points-chart-levels": {
    component: (
      <div className="w-full max-w-2xl">
        <PointsChart
          data={[
            { date: "Fri", total: 120, change: 120 },
            { date: "Sat", total: 240, change: 120 },
            { date: "Sun", total: 480, change: 240 },
            { date: "Mon", total: 620, change: 140 },
            { date: "Tue", total: 860, change: 240 },
            { date: "Wed", total: 1010, change: 150 },
            { date: "Thu", total: 1290, change: 280 },
          ]}
          levels={[
            { value: 250, color: "#CD7F32" },
            { value: 500, color: "#C0C0C0" },
            { value: 1000, color: "#D4AF37" },
          ]}
        />
      </div>
    ),
    code: `<PointsChart
  data={[
    { date: "Fri", total: 120, change: 120 },
    { date: "Sat", total: 240, change: 120 },
    { date: "Sun", total: 480, change: 240 },
    { date: "Mon", total: 620, change: 140 },
    { date: "Tue", total: 860, change: 240 },
    { date: "Wed", total: 1010, change: 150 },
    { date: "Thu", total: 1290, change: 280 },
  ]}
  levels={[
    { value: 250, color: "#CD7F32" },
    { value: 500, color: "#C0C0C0" },
    { value: 1000, color: "#D4AF37" },
  ]}
/>`,
  },
  "points-chart-period-selector": {
    component: <PointsChartPeriodSelectorPreview />,
    code: `const [period, setPeriod] = useState("last-7-days")

const datasets = {
  "last-7-days": buildPointsChartData(7, "day", 980, 35),
  "last-4-weeks": buildPointsChartData(28, "day", 520, 20),
  "last-3-months": buildPointsChartData(13, "week", 300, 55),
  "last-6-months": buildPointsChartData(6, "month", 220, 110),
  "last-12-months": buildPointsChartData(12, "month", 120, 70),
  "year-to-date": buildPointsChartData(new Date().getMonth() + 1, "month", 150, 95),
  "all-time": buildPointsChartData(24, "month", 50, 45),
}

<PointsChart
  title={\`Your points · \${periodLabel}\`}
  data={datasets[period]}
  headerRight={
    <select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-md border bg-background px-2 py-1 text-xs text-foreground">
      <option value="last-7-days">Last 7 days</option>
      <option value="last-4-weeks">Last 4 weeks</option>
      <option value="last-3-months">Last 3 months</option>
      <option value="last-6-months">Last 6 months</option>
      <option value="last-12-months">Last 12 months</option>
      <option value="year-to-date">Year to date</option>
      <option value="all-time">All time</option>
    </select>
  }
/>`,
  },
  "points-awards": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsAwards
          awards={[
            {
              id: "row-1",
              awarded: 13,
              date: "2026-05-08T18:22:00.000Z",
              total: 20176,
              trigger: {
                id: "tr-m-1",
                type: "metric",
                points: 13,
                metricName: "words written",
                metricThreshold: 1000,
              },
            },
            {
              id: "row-2",
              awarded: 15,
              date: "2026-05-07T16:40:00.000Z",
              total: 20163,
              trigger: {
                id: "tr-a-1",
                type: "achievement",
                points: 15,
                achievementName: "Week warrior",
              },
            },
            {
              id: "row-3",
              awarded: 12,
              date: "2026-05-07T09:15:00.000Z",
              total: 20148,
              trigger: {
                id: "tr-s-1",
                type: "streak",
                points: 12,
                streakLengthThreshold: 14,
              },
            },
            {
              id: "row-4",
              awarded: 20,
              date: "2026-05-06T11:00:00.000Z",
              total: 20136,
              trigger: {
                id: "tr-t-1",
                type: "time",
                points: 20,
                timeUnit: "day",
                timeInterval: 1,
              },
            },
            {
              id: "row-5",
              awarded: 8,
              date: "2026-05-05T20:00:00.000Z",
              total: 20116,
              trigger: {
                id: "tr-uc-1",
                type: "user_creation",
                points: 8,
              },
            },
            {
              id: "row-6",
              awarded: 10,
              date: "2026-05-04T08:30:00.000Z",
              total: 20108,
              trigger: {
                id: "tr-m-2",
                type: "metric",
                points: 10,
                metricName: "lessons completed",
                metricThreshold: 5,
              },
            },
          ]}
        />
      </div>
    ),
    code: `<PointsAwards
  awards={[
    {
      id: "0040fe51-6bce-4b44-b0ad-bddc4e123534",
      awarded: 10,
      date: "2021-01-01T00:00:00Z",
      total: 100,
      trigger: {
        id: "0040fe51-6bce-4b44-b0ad-bddc4e123534",
        type: "metric",
        points: 10,
        metricName: "words written",
        metricThreshold: 1000,
      },
    },
  ]}
/>`,
  },
  "points-levels-list": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsLevelsList
          levels={[
            {
              id: "beginner",
              points: 0,
              name: "Beginner",
              iconType: "beginner",
            },
            { id: "novice", points: 500, name: "Novice", iconType: "novice" },
            {
              id: "intermediate",
              points: 2500,
              name: "Intermediate",
              iconType: "intermediate",
            },
            {
              id: "professional",
              points: 5000,
              name: "Professional",
              iconType: "professional",
            },
            { id: "expert", points: 7500, name: "Expert", iconType: "expert" },
            { id: "master", points: 10000, name: "Master", iconType: "master" },
            {
              id: "grand-master",
              points: 20000,
              name: "Grand Master",
              iconType: "grand-master",
            },
            {
              id: "enlightened",
              points: 50000,
              name: "Enlightened",
              iconType: "enlightened",
            },
          ]}
        />
      </div>
    ),
    code: `<PointsLevelsList
  levels={[
    { id: "beginner", points: 0, name: "Beginner", iconType: "beginner" },
    { id: "novice", points: 500, name: "Novice", iconType: "novice" },
    { id: "intermediate", points: 2500, name: "Intermediate", iconType: "intermediate" },
    { id: "professional", points: 5000, name: "Professional", iconType: "professional" },
    { id: "expert", points: 7500, name: "Expert", iconType: "expert" },
    { id: "master", points: 10000, name: "Master", iconType: "master" },
    { id: "grand-master", points: 20000, name: "Grand Master", iconType: "grand-master" },
    { id: "enlightened", points: 50000, name: "Enlightened", iconType: "enlightened" },
  ]}
/>`,
  },
  "points-levels-list-current-level": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsLevelsList
          currentPoints={6200}
          levels={[
            {
              id: "beginner",
              points: 0,
              name: "Beginner",
              iconType: "beginner",
            },
            { id: "novice", points: 500, name: "Novice", iconType: "novice" },
            {
              id: "intermediate",
              points: 2500,
              name: "Intermediate",
              iconType: "intermediate",
            },
            {
              id: "professional",
              points: 5000,
              name: "Professional",
              iconType: "professional",
            },
            { id: "expert", points: 7500, name: "Expert", iconType: "expert" },
            { id: "master", points: 10000, name: "Master", iconType: "master" },
            {
              id: "grand-master",
              points: 20000,
              name: "Grand Master",
              iconType: "grand-master",
            },
            {
              id: "enlightened",
              points: 50000,
              name: "Enlightened",
              iconType: "enlightened",
            },
          ]}
        />
      </div>
    ),
    code: `<PointsLevelsList
  currentPoints={6200}
  levels={[
    { id: "beginner", points: 0, name: "Beginner", iconType: "beginner" },
    { id: "novice", points: 500, name: "Novice", iconType: "novice" },
    { id: "intermediate", points: 2500, name: "Intermediate", iconType: "intermediate" },
    { id: "professional", points: 5000, name: "Professional", iconType: "professional" },
    { id: "expert", points: 7500, name: "Expert", iconType: "expert" },
    { id: "master", points: 10000, name: "Master", iconType: "master" },
    { id: "grand-master", points: 20000, name: "Grand Master", iconType: "grand-master" },
    { id: "enlightened", points: 50000, name: "Enlightened", iconType: "enlightened" },
  ]}
/>`,
  },
  "points-levels-list-progress": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsLevelsList
          currentPoints={6200}
          showProgressBar
          levels={[
            {
              id: "beginner",
              points: 0,
              name: "Beginner",
              iconType: "beginner",
            },
            { id: "novice", points: 500, name: "Novice", iconType: "novice" },
            {
              id: "intermediate",
              points: 2500,
              name: "Intermediate",
              iconType: "intermediate",
            },
            {
              id: "professional",
              points: 5000,
              name: "Professional",
              iconType: "professional",
            },
            { id: "expert", points: 7500, name: "Expert", iconType: "expert" },
            { id: "master", points: 10000, name: "Master", iconType: "master" },
            {
              id: "grand-master",
              points: 20000,
              name: "Grand Master",
              iconType: "grand-master",
            },
            {
              id: "enlightened",
              points: 50000,
              name: "Enlightened",
              iconType: "enlightened",
            },
          ]}
        />
      </div>
    ),
    code: `<PointsLevelsList
  currentPoints={6200}
  showProgressBar
  levels={[
    { id: "beginner", points: 0, name: "Beginner", iconType: "beginner" },
    { id: "novice", points: 500, name: "Novice", iconType: "novice" },
    { id: "intermediate", points: 2500, name: "Intermediate", iconType: "intermediate" },
    { id: "professional", points: 5000, name: "Professional", iconType: "professional" },
    { id: "expert", points: 7500, name: "Expert", iconType: "expert" },
    { id: "master", points: 10000, name: "Master", iconType: "master" },
    { id: "grand-master", points: 20000, name: "Grand Master", iconType: "grand-master" },
    { id: "enlightened", points: 50000, name: "Enlightened", iconType: "enlightened" },
  ]}
/>`,
  },
  "points-levels-timeline": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsLevelsTimeline
          levels={[
            { id: "bronze", name: "Bronze", points: 75 },
            { id: "silver", name: "Silver", points: 150 },
            { id: "gold", name: "Gold", points: 275 },
          ]}
        />
      </div>
    ),
    code: `<PointsLevelsTimeline
  levels={[
    { id: "bronze", name: "Bronze", points: 75 },
    { id: "silver", name: "Silver", points: 150 },
    { id: "gold", name: "Gold", points: 275 },
  ]}
/>`,
  },
  "points-levels-timeline-sub-levels": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsLevelsTimeline
          levels={[
            {
              id: "bronze",
              name: "Bronze",
              points: 75,
              subLevels: [
                { name: "Bronze III", points: 75 },
                { name: "Bronze II", points: 100 },
                { name: "Bronze I", points: 125 },
              ],
            },
            {
              id: "silver",
              name: "Silver",
              points: 150,
              subLevels: [
                { name: "Silver III", points: 150 },
                { name: "Silver II", points: 190 },
                { name: "Silver I", points: 230 },
              ],
            },
          ]}
        />
      </div>
    ),
    code: `<PointsLevelsTimeline
  levels={[
    {
      id: "bronze",
      name: "Bronze",
      points: 75,
      subLevels: [
        { name: "Bronze III", points: 75 },
        { name: "Bronze II", points: 100 },
        { name: "Bronze I", points: 125 },
      ],
    },
    {
      id: "silver",
      name: "Silver",
      points: 150,
      subLevels: [
        { name: "Silver III", points: 150 },
        { name: "Silver II", points: 190 },
        { name: "Silver I", points: 230 },
      ],
    },
  ]}
/>`,
  },
  "points-levels-timeline-progress-tracking": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsLevelsTimeline
          currentPoints={136}
          levels={[
            {
              id: "bronze",
              name: "Bronze",
              points: 75,
              subLevels: [
                { name: "Bronze III", points: 75 },
                { name: "Bronze II", points: 100 },
                { name: "Bronze I", points: 125 },
              ],
            },
            {
              id: "silver",
              name: "Silver",
              points: 150,
              subLevels: [
                { name: "Silver III", points: 150 },
                { name: "Silver II", points: 190 },
                { name: "Silver I", points: 230 },
              ],
            },
            { id: "gold", name: "Gold", points: 275 },
          ]}
        />
      </div>
    ),
    code: `<PointsLevelsTimeline
  currentPoints={136}
  levels={[
    {
      id: "bronze",
      name: "Bronze",
      points: 75,
      subLevels: [
        { name: "Bronze III", points: 75 },
        { name: "Bronze II", points: 100 },
        { name: "Bronze I", points: 125 },
      ],
    },
    {
      id: "silver",
      name: "Silver",
      points: 150,
      subLevels: [
        { name: "Silver III", points: 150 },
        { name: "Silver II", points: 190 },
        { name: "Silver I", points: 230 },
      ],
    },
    { id: "gold", name: "Gold", points: 275 },
  ]}
/>`,
  },
  "points-boost": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsBoost
          boost={{
            name: "Double Points Weekend",
            status: "active",
            description: "Earn extra points for all tracked actions",
            multiplier: 2,
          }}
          cta={{
            link: "#",
            text: "Activate boost",
          }}
        />
      </div>
    ),
    code: `<PointsBoost
  boost={{
    name: "Double Points Weekend",
    status: "active",
    description: "Earn extra points for all tracked actions",
    multiplier: 2,
  }}
  cta={{
    link: "#",
    text: "Activate boost",
  }}
/>`,
  },
  "points-boost-countdown": {
    component: (
      <div className="w-full max-w-6xl">
        <PointsBoost
          boost={{
            name: "Limited-Time Points Boost",
            status: "active",
            description:
              "Boost expires soon, activate now to maximize your points",
            multiplier: 3,
            endDate: new Date(
              Date.now() + 1000 * 60 * 60 * 11 + 1000 * 60 * 29 + 1000 * 36
            ).toISOString(),
          }}
          cta={{
            link: "#",
            text: "Activate now",
          }}
        />
      </div>
    ),
    code: `<PointsBoost
  boost={{
    name: "Limited-Time Points Boost",
    status: "active",
    description: "Boost expires soon, activate now to maximize your points",
    multiplier: 3,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 11 + 1000 * 60 * 29 + 1000 * 36).toISOString(),
  }}
  cta={{
    link: "#",
    text: "Activate now",
  }}
/>`,
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
