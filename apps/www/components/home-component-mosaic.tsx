"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AchievementGrid } from "@/registry/trophy/ui/achievement-grid"
import { AchievementUnlocked } from "@/registry/trophy/ui/achievement-unlocked"
import { LeaderboardPodium } from "@/registry/trophy/ui/leaderboard-podium"
import { LeaderboardRankings } from "@/registry/trophy/ui/leaderboard-rankings"
import { PointsAwards } from "@/registry/trophy/ui/points-awards"
import { PointsBadge } from "@/registry/trophy/ui/points-badge"
import { PointsBoost } from "@/registry/trophy/ui/points-boost"
import { PointsChart } from "@/registry/trophy/ui/points-chart"
import { PointsLevelsSimple } from "@/registry/trophy/ui/points-levels-simple"
import { StreakBadge } from "@/registry/trophy/ui/streak-badge"
import { useState } from "react"
import { Button } from "@/registry/trophy/ui/button"
import { AchievementList } from "@/registry/trophy/ui/achievement-list"

const chartData7Days = (() => {
  // 1 data point per day for previous 7 days, always increasing by highly variable random increments
  const days = 7;
  const data = [];
  let base = 50;
  let prevTotal = base;
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const label = date.toLocaleDateString(undefined, { weekday: "short" });

    // MUCH WIDER VARIANCE: highly volatile day-to-day; can be nearly flat or explosive
    let increment;
    const rand = Math.random();
    if (rand < 0.09) {
      // Very rare, massive gain
      increment = Math.floor(200 + Math.random() * 551); // 200-750
    } else if (rand < 0.22) {
      // Rare big jump
      increment = Math.floor(60 + Math.random() * 241); // 60-300
    } else if (rand < 0.38) {
      // Mild/plateau/very small
      increment = Math.floor(0 + Math.random() * 7); // 0-6
    } else if (rand < 0.68) {
      // Normal random day, moderate
      increment = Math.floor(17 + Math.random() * 80); // 17-96
    } else {
      // Medium/large
      increment = Math.floor(35 + Math.random() * 175); // 35-209
    }
    base += increment;
    const change = base - prevTotal;
    prevTotal = base;
    data.push({ date: label, total: base, change });
  }
  return data;
})()

const chartData4Weeks = (() => {
  // 1 data point per day for previous 4 weeks (28 days), always increasing by random increments, with more variance
  const days = 28;
  const data = [];
  let base = 180;
  let prevTotal = base;
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    // On weekends, allow bigger jumps; weekdays smaller or even skip (smaller increase)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    let increment;
    if (isWeekend) {
      // Weekend: large jump, 40-120
      increment = Math.floor(40 + Math.random() * 81);
    } else if (Math.random() < 0.18) {
      // ~18% chance for a very small gain (simulate "plateau")
      increment = Math.floor(1 + Math.random() * 6);
    } else if (Math.random() < 0.12) {
      // ~12% chance for a big midweek jump
      increment = Math.floor(50 + Math.random() * 51);
    } else {
      // Normal weekday: moderate jump
      increment = Math.floor(10 + Math.random() * 31);
    }

    base += increment;
    const change = base - prevTotal;
    prevTotal = base;
    data.push({ date: label, total: base, change });
  }
  return data;
})()

const chartData3Months = (() => {
  // 1 data point per week for previous 12 weeks (about 3 months), always increasing
  const weeks = 12;
  const data = [];
  let base = 300;
  let prevTotal = base;
  const today = new Date();
  // Start with the oldest week
  for (let i = weeks - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i * 7);
    const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    // Increase base by a random value, e.g. 70~180 per week
    base += Math.floor(10 + Math.random() * 220);
    const change = base - prevTotal;
    prevTotal = base;
    data.push({ date: label, total: base, change });
  }
  return data;
})()

const chartData6Months = (() => {
  // 1 data point per month for the previous 6 months, always increasing
  const months = 6;
  const data = [];
  let base = 220;
  let prevTotal = base;
  const today = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    // Format as short month & year, e.g. "Jan '24"
    const label = date.toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
    // Increase base by 70~220 per month
    base += Math.floor(70 + Math.random() * 150);
    const change = base - prevTotal;
    prevTotal = base;
    data.push({ date: label, total: base, change });
  }
  return data;
})()

const chartData12Months = (() => {
  // 1 data point per month for the previous 12 months, always increasing
  const months = 12;
  const data = [];
  let base = 220;
  let prevTotal = base;
  const today = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    // Format as short month & year, e.g. "Jan '24"
    const label = date.toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
    // Increase base by 70~220 per month (same as 6 months logic)
    base += Math.floor(70 + Math.random() * 150);
    const change = base - prevTotal;
    prevTotal = base;
    data.push({ date: label, total: base, change });
  }
  return data;
})()

const chartData = {
  last7Days: chartData7Days,
  last4Weeks: chartData4Weeks,
  last3Months: chartData3Months,
  last6Months: chartData6Months,
  last12Months: chartData12Months
}

const chartLevels = [
  { value: 350, color: "var(--rank-3)" },
  { value: 1000, color: "var(--rank-2)" },
  { value: 1750, color: "var(--rank-1)" },
]

const rankings = [
  {
    userId: "u-1",
    rank: 1,
    userName: "Ava Turner",
    byline: "Diamond",
    value: 286900,
    avatarUrl: "https://i.pravatar.cc/96?img=32",
  },
  {
    userId: "u-2",
    rank: 2,
    userName: "Leo Harrison",
    byline: "Platinum",
    value: 281400,
    avatarUrl: "https://i.pravatar.cc/96?img=12",
  },
  {
    userId: "u-3",
    rank: 3,
    userName: "Rowan Elijah",
    byline: "Platinum",
    value: 274500,
    avatarUrl: "https://i.pravatar.cc/96?img=15",
  },
  {
    userId: "u-4",
    rank: 4,
    userName: "Mia Bennett",
    byline: "Gold",
    value: 223100,
    avatarUrl: "https://i.pravatar.cc/96?img=47",
    displayed: false,
  },
  {
    userId: "u-5",
    rank: 5,
    userName: "Emma Johnson",
    byline: "Gold",
    value: 216700,
    avatarUrl: "https://i.pravatar.cc/96?img=29",
  },
  {
    userId: "u-6",
    rank: 6,
    userName: "William Smith",
    byline: "Gold",
    value: 209300,
    avatarUrl: "https://i.pravatar.cc/96?img=18",
    displayed: false
  },
  {
    userId: "u-7",
    rank: 7,
    userName: "Olivia Davis",
    byline: "Gold",
    value: 201900,
    avatarUrl: "https://i.pravatar.cc/96?img=36",
    displayed: false
  },
  {
    userId: "u-8",
    rank: 8,
    userName: "James Wilson",
    byline: "Gold",
    value: 194500,
    avatarUrl: "https://i.pravatar.cc/96?img=24",
    displayed: false
  },
  {
    userId: "u-9",
    rank: 9,
    userName: "Sophia Miller",
    byline: "Gold",
    value: 187100,
    avatarUrl: "https://i.pravatar.cc/96?img=10",
  },
  {
    userId: "u-10",
    rank: 10,
    userName: "Daniel Brown",
    byline: "Gold",
    value: 179700,
    avatarUrl: "https://i.pravatar.cc/96?img=22",
  }
]

const achievements = [
  { id: "a-1", name: "250 tasks", trigger: "streak" as const, achievedAt: "2026-04-01T00:00:00Z", progress: 23, description: "Complete 250 tasks" },
  { id: "a-2", name: "1,000 tasks", trigger: "metric" as const, achievedAt: "2026-04-08T00:00:00Z", rarity: 11, description: "Complete 1,000 tasks" },
]

const levels = [
  { id: "l-1", threshold: 0, name: "Beginner", iconType: "beginner" as const },
  { id: "l-2", threshold: 500, name: "Novice", iconType: "novice" as const },
  { id: "l-3", threshold: 1000, name: "Intermediate", iconType: "intermediate" as const },
  { id: "l-4", threshold: 1500, name: "Professional", iconType: "professional" as const },
  { id: "l-5", threshold: 2000, name: "Expert", iconType: "expert" as const },
  { id: "l-6", threshold: 2500, name: "Master", iconType: "master" as const },
  { id: "l-7", threshold: 3000, name: "Grand Master", iconType: "grand-master" as const },
  { id: "l-8", threshold: 3500, name: "Enlightened", iconType: "enlightened" as const }
]

// Mock `points.awards`-shaped rows (Trophy GET user points). One `trigger` per row; recent first, totals descending.
const awardsRows = (() => {
  const dateOffsets = [0, 1, 7, 28, 90, 150, 210, 260];
  const dateIso = (days: number) =>
    new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let seed = 654321;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const increments = dateOffsets.map(() => 70 + Math.floor(random() * 70));
  const totals: number[] = [];
  let base = 1100 + Math.floor(random() * 40);
  let running = base;
  for (let i = increments.length - 1; i >= 0; i--) {
    running += increments[i];
    totals[i] = running;
  }

  const metricNames = [
    "words written",
    "lessons completed",
    "quiz questions",
    "study minutes",
    "assignments submitted",
  ];
  const achievementNames = ["Early bird", "Week warrior", "Perfect week"];

  const kindForRow = (row: number) => {
    const cycle = ["metric", "metric", "achievement", "streak", "time", "user_creation"] as const;
    return cycle[row % cycle.length];
  };

  return dateOffsets.map((offset, i) => {
    const total = totals[i];
    const prevTotal = i === 0 ? 0 : totals[i - 1];
    const awarded = total - prevTotal;
    const triggerId = `trigger-${i}`;
    const kind = kindForRow(i);

    if (kind === "metric") {
      return {
        id: `award-${i + 1}`,
        awarded,
        date: dateIso(offset),
        total,
        trigger: {
          id: triggerId,
          type: "metric",
          points: awarded,
          metricName: metricNames[i % metricNames.length],
          metricThreshold: 500 + Math.floor(random() * 2000),
        },
      };
    }
    if (kind === "achievement") {
      return {
        id: `award-${i + 1}`,
        awarded,
        date: dateIso(offset),
        total,
        trigger: {
          id: triggerId,
          type: "achievement",
          points: awarded,
          achievementName: achievementNames[i % achievementNames.length],
        },
      };
    }
    if (kind === "streak") {
      return {
        id: `award-${i + 1}`,
        awarded,
        date: dateIso(offset),
        total,
        trigger: {
          id: triggerId,
          type: "streak",
          points: awarded,
          streakLengthThreshold: 7 + (i % 5),
        },
      };
    }
    if (kind === "time") {
      return {
        id: `award-${i + 1}`,
        awarded,
        date: dateIso(offset),
        total,
        trigger: {
          id: triggerId,
          type: "time",
          points: awarded,
          timeUnit: "day" as const,
          timeInterval: 1 + (i % 3),
        },
      };
    }
    return {
      id: `award-${i + 1}`,
      awarded,
      date: dateIso(offset),
      total,
      trigger: {
        id: triggerId,
        type: "user_creation",
        points: awarded,
      },
    };
  });
})();

export function HomeComponentMosaic() {
  const [period, setPeriod] = useState("last7Days" as const)
  const [achievementModalOpen, setAchievementModalOpen] = useState(false)
  return (
    <section className="container-wrapper relative z-10 mt-2 pb-10 md:pb-16">
      <div className="container">
        <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="flex h-full flex-col gap-4">
              <PointsBadge name="XP" total={19845} />
              <StreakBadge
                size="sm"
                length={12}
                frequency="daily"
                className="w-full rounded-xl border-border"
              />
              <AchievementGrid
                achievements={achievements}
                columns={2}
                gap="sm"
                badgeSize="sm"
                className="h-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card/60 p-4 backdrop-blur md:col-span-6">
            <PointsChart
              data={chartData[period as keyof typeof chartData]}
              levels={chartLevels}
              headerRight={(
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value as typeof period)}
                  className="rounded-md border bg-background px-2 py-1 text-xs text-foreground"
                  aria-label="Select points chart period"
                >
                  <option value="last7Days">Last 7 days</option>
                  <option value="last4Weeks">Last 4 weeks</option>
                  <option value="last3Months">Last 3 months</option>
                  <option value="last6Months">Last 6 months</option>
                  <option value="last12Months">Last 12 months</option>
                </select>
              )}
              title="Your points progress"
              height={300}
              className="h-full border-0 bg-transparent p-0"
            />
          </div>

          <div className="overflow-hidden md:col-span-3">
            <PointsLevelsSimple
              levels={levels}
              className="py-2 [&_[role=listitem]]:grid-cols-[8rem_1fr_auto] [&_[role=listitem]]:px-3 [&_[role=listitem]]:pr-0 [&_[role=listitem]]:py-2.5"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card/60 p-4 backdrop-blur md:col-span-4">
            <LeaderboardRankings
              rankings={rankings}
              className="h-full border-0 bg-transparent"
              currentUserId="u-5"
              defaultPageSize={10}
              showPagination
            />
          </div>

          <div className="overflow-hidden md:col-span-8 flex h-full flex-col gap-4">
            <PointsBoost
              boost={{
                name: "Double XP Weekend",
                description: "Enjoy double XP on all activity this weekend.",
                multiplier: 2,
                cta: { link: "#", text: "Do something" },
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
              }}
            />
            <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-12">
              <div className="rounded-2xl border bg-card/60 p-4 backdrop-blur md:col-span-7">
                <PointsAwards awards={awardsRows} className="h-full border-0 bg-transparent" />
              </div>
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="overflow-hidden rounded-2xl border bg-card/60 p-4 backdrop-blur flex justify-center">
                  <Button variant="outline" onClick={() => setAchievementModalOpen(true)} className="w-full">
                    Unlock achievement
                  </Button>
                </div>
                <div className="overflow-hidden rounded-2xl border bg-card/60 p-4 backdrop-blur flex justify-center">
                  <LeaderboardPodium
                    rankings={[
                      { userId: "u-1", userName: "Ava Turner", rank: 1, value: 2869, avatarUrl: "https://i.pravatar.cc/96?img=32" },
                      { userId: "u-2", userName: "Leo Harrison", rank: 2, value: 2814, avatarUrl: "https://i.pravatar.cc/96?img=12" },
                      { userId: "u-3", userName: "Rowan Elijah", rank: 3, value: 2745, avatarUrl: "https://i.pravatar.cc/96?img=15" },
                    ]}
                    size="sm"
                    className="h-full"
                  />
                </div>
                <div className="overflow-hidden">
                  <AchievementList
                    achievements={[achievements[0]!]}
                    columns={2}
                    gap="sm"
                    badgeSize="sm"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for achievement unlocked */}
      <AchievementUnlocked
        achievement={achievements[0]!}
        open={achievementModalOpen}
        onOpenChange={setAchievementModalOpen}
      />
    </section>
  )
}
