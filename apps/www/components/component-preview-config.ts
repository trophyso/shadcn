export type ComponentPreviewConfig = {
  showCard?: boolean
}

const componentPreviewConfig: Record<string, ComponentPreviewConfig> = {
  "streak-badge": {
    showCard: false,
  },
  "streak-badge-basic": {
    showCard: false,
  },
  "streak-badge-sizes": {
    showCard: false,
  },
  "streak-card": {
    showCard: false,
  },
  "achievement-badge": {
    showCard: false,
  },
  "achievement-badge-sizes": {
    showCard: false,
  },
  "achievement-badge-locked-styles": {
    showCard: false,
  },
  "achievement-badge-series-progress": {
    showCard: false,
  },
  "achievement-badge-rarity": {
    showCard: false,
  },
  "achievement-badge-clickable": {
    showCard: false,
  },
  "achievement-grid": {
    showCard: false,
  },
  "achievement-grid-columns": {
    showCard: false,
  },
  "achievement-grid-gap": {
    showCard: false,
  },
  "achievement-grid-complete": {
    showCard: false,
  },
  "achievement-list": {
    showCard: false,
  },
  "achievement-unlocked": {
    showCard: false,
  },
  "achievement-card": {
    showCard: false,
  },
  "leaderboard-rankings": {
    showCard: false,
  },
  "leaderboard-rankings-rank-change": {
    showCard: false,
  },
  "leaderboard-rankings-pagination": {
    showCard: false,
  },
  "leaderboard-rankings-current-user-focus": {
    showCard: false,
  },
  "points-badge": {
    showCard: false,
  },
  "points-badge-sizes": {
    showCard: false,
  },
  "points-chart": {
    showCard: false,
  },
  "points-chart-levels": {
    showCard: false,
  },
  "points-chart-period-selector": {
    showCard: false,
  },
  "points-awards": {
    showCard: false,
  },
  "points-levels": {
    showCard: false,
  },
  "points-levels-simple": {
    showCard: false,
  },
  "points-levels-simple-current-level": {
    showCard: false,
  },
  "points-levels-simple-progress": {
    showCard: false,
  },
  "points-levels-sub-levels": {
    showCard: false,
  },
  "points-levels-progress-tracking": {
    showCard: false,
  },
  "points-boost": {
    showCard: false,
  },
  "points-boost-countdown": {
    showCard: false,
  },
  "leaderboard-card": {
    showCard: false,
  },
  "leaderboard-card-with-previous-runs": {
    showCard: false,
  },
}

export function getComponentPreviewConfig(name: string): ComponentPreviewConfig | undefined {
  return componentPreviewConfig[name]
}
