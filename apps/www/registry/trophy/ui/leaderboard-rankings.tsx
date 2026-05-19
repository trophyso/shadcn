"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  CircleEllipsisIcon,
  Crown,
  EllipsisIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LeaderboardRankingItem {
  userId: string
  userName: string | null
  rank: number
  value: number
  byline?: string | null
  avatarUrl?: string | null
  rankChange?: number
  displayed?: boolean
}

interface LeaderboardRankingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: LeaderboardRankingItem[]
  onUserClick?: (ranking: LeaderboardRankingItem) => void
  currentUserId?: string
  showPagination?: boolean
  defaultPageSize?: 10 | 25 | 50 | 100
}

const crownColorMap = {
  1: "text-rank-1",
  2: "text-rank-2",
  3: "text-rank-3",
} as const

const pageSizeOptions = [10, 25, 50, 100] as const

type LeaderboardRow =
  | { type: "ranking"; ranking: LeaderboardRankingItem }
  | { type: "ellipsis"; key: string }

function formatLeaderboardValue(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value.toLocaleString()
}

const LeaderboardRankings = React.forwardRef<
  HTMLDivElement,
  LeaderboardRankingsProps
>(
  (
    {
      className,
      rankings,
      onUserClick,
      currentUserId,
      showPagination = false,
      defaultPageSize = 10,
      ...props
    },
    ref
  ) => {
    const [pageSize, setPageSize] = React.useState<10 | 25 | 50 | 100>(
      defaultPageSize
    )
    const [currentPage, setCurrentPage] = React.useState(1)

    const totalPages = Math.max(1, Math.ceil(rankings.length / pageSize))

    React.useEffect(() => {
      setCurrentPage(1)
    }, [pageSize])

    React.useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages)
      }
    }, [currentPage, totalPages])

    const pagedRankings = showPagination
      ? rankings.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : rankings

    const rows = React.useMemo<LeaderboardRow[]>(() => {
      const nextRows: LeaderboardRow[] = []
      let hiddenRunCount = 0

      pagedRankings.forEach((ranking, index) => {
        const isDisplayed = ranking.displayed !== false
        if (!isDisplayed) {
          hiddenRunCount += 1
          return
        }

        if (hiddenRunCount > 0) {
          nextRows.push({ type: "ellipsis", key: `ellipsis-${index}` })
          hiddenRunCount = 0
        }

        nextRows.push({ type: "ranking", ranking })
      })

      if (hiddenRunCount > 0) {
        nextRows.push({ type: "ellipsis", key: "ellipsis-tail" })
      }

      return nextRows
    }, [pagedRankings])

    return (
      <div
        ref={ref}
        className={cn("bg-card w-full rounded-xl border", className)}
        {...props}
      >
        <div
          role="list"
          aria-label="Leaderboard rankings"
          className="divide-border divide-y"
        >
          {rows.map((row) => {
            if (row.type === "ellipsis") {
              return (
                <div
                  key={row.key}
                  role="listitem"
                  aria-label="Collapsed leaderboard rows"
                  className="text-muted-foreground flex items-center justify-center px-4 py-2"
                >
                  <EllipsisIcon className="h-5 w-5" />
                </div>
              )
            }

            const ranking = row.ranking
            const displayName =
              ranking.userName || `User ${ranking.userId.slice(0, 6)}`
            const showCrown = ranking.rank <= 3
            const crownColor = crownColorMap[ranking.rank as 1 | 2 | 3]
            const isCurrentUser = currentUserId === ranking.userId

            return (
              <div
                key={ranking.userId}
                role="listitem"
                tabIndex={onUserClick ? 0 : undefined}
                onClick={() => onUserClick?.(ranking)}
                onKeyDown={
                  onUserClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onUserClick(ranking)
                        }
                      }
                    : undefined
                }
                className={cn(
                  "flex items-center gap-2 px-4 py-2",
                  isCurrentUser &&
                    "border-primary bg-muted rounded-md border-2",
                  onUserClick &&
                    "hover:bg-muted/40 cursor-pointer transition-colors"
                )}
              >
                <div className="flex w-12 items-center gap-1">
                  <span className="w-4 text-sm font-semibold tabular-nums">
                    {ranking.rank}
                  </span>
                  {showCrown ? (
                    <Crown
                      className={cn("h-5 w-5", crownColor)}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>

                {ranking.avatarUrl ? (
                  <img
                    src={ranking.avatarUrl}
                    alt={`${displayName} avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                    {(ranking.userName ?? ranking.userId)
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate font-medium">
                    {displayName}
                  </p>
                  {ranking.byline ? (
                    <p className="text-muted-foreground truncate text-sm">
                      {ranking.byline}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 text-right">
                  {typeof ranking.rankChange === "number" &&
                  ranking.rankChange !== 0 ? (
                    <p
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        ranking.rankChange > 0
                          ? "text-success-600"
                          : "text-red-600"
                      )}
                    >
                      {ranking.rankChange > 0 ? (
                        <TrendingUp
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      ) : (
                        <TrendingDown
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      )}
                      {Math.abs(ranking.rankChange)}
                    </p>
                  ) : null}
                  <p className="leading-none font-semibold tabular-nums">
                    {formatLeaderboardValue(ranking.value)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {showPagination ? (
          <div className="flex items-center justify-between gap-3 border-t px-4 py-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="leaderboard-page-size"
                className="text-muted-foreground text-sm"
              >
                Show
              </label>
              <select
                id="leaderboard-page-size"
                value={pageSize}
                onChange={(e) =>
                  setPageSize(Number(e.target.value) as 10 | 25 | 50 | 100)
                }
                className="bg-background text-muted-foreground rounded-md border px-2 py-1 text-sm"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="hover:bg-muted rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-muted-foreground text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next page"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="hover:bg-muted rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
)

LeaderboardRankings.displayName = "LeaderboardRankings"

export { LeaderboardRankings }
export type { LeaderboardRankingItem, LeaderboardRankingsProps }
