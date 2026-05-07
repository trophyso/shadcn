import { promises as fs } from "node:fs"
import path from "node:path"

import {
  ComponentExample,
} from "@/components/component-examples"
import { getComponentPreviewConfig } from "@/components/component-preview-config"
import { ComponentPreview } from "@/components/component-preview"

async function getComponentSource(name: string): Promise<string | undefined> {
  const segments = name.split("-")

  for (let i = segments.length; i > 0; i--) {
    const candidate = segments.slice(0, i).join("-")
    const filePath = path.join(process.cwd(), "registry", "trophy", "ui", `${candidate}.tsx`)

    try {
      return await fs.readFile(filePath, "utf8")
    } catch {
      // Try a less specific component name, e.g. `points-badge-sizes` -> `points-badge`.
    }
  }

  return undefined
}

export async function ComponentPreviewWrapper({ name }: { name: string }) {
  const code = await getComponentSource(name)
  const previewOptions = getComponentPreviewConfig(name)

  return (
    <ComponentPreview
      name={name}
      code={code}
      showPreviewCard={previewOptions?.showCard ?? true}
    >
      <ComponentExample name={name} />
    </ComponentPreview>
  )
}
