export type ComponentPreviewConfig = {
  showCard?: boolean
}

const componentPreviewConfig: Record<string, ComponentPreviewConfig> = {
  "streak-card": {
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
  "achievement-grid-complete": {
    showCard: false,
  },
  "achievement-list": {
    showCard: false,
  },
  "achievement-card": {
    showCard: false,
  },
  "achievement-unlocked": {
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
}

export function getComponentPreviewConfig(name: string): ComponentPreviewConfig | undefined {
  return componentPreviewConfig[name]
}
