import { promises as fs } from "node:fs"
import path from "node:path"
import * as React from "react"

import { CodeBlock } from "@/components/code-block"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"

export async function ComponentSource({
  name,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name: string
  collapsible?: boolean
}) {
  const filePath = path.join(
    process.cwd(),
    "registry",
    "trophy",
    "ui",
    `${name}.tsx`
  )
  const source = await fs.readFile(filePath, "utf8")

  if (!collapsible) {
    return (
      <div className={className}>
        <CodeBlock code={source} language="tsx" data-language="tsx" />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <CodeBlock code={source} language="tsx" data-language="tsx" />
    </CodeCollapsibleWrapper>
  )
}
