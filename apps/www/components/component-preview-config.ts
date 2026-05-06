export type ComponentPreviewConfig = {
  showCard?: boolean
}

const componentPreviewConfig: Record<string, ComponentPreviewConfig> = {
  "streak-card": {
    showCard: false,
  },
}

export function getComponentPreviewConfig(name: string): ComponentPreviewConfig | undefined {
  return componentPreviewConfig[name]
}
