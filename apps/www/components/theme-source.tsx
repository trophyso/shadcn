import * as React from "react"
import { promises as fs } from "node:fs"
import path from "node:path"

import { CodeBlock } from "@/components/code-block"

export async function ThemeSource({
  name,
  className,
}: React.ComponentProps<"div"> & {
  name: string
}) {
  const filePath = path.join(process.cwd(), "content", "themes", `${name}.css`)
  const source = await fs.readFile(filePath, "utf8")

  return (
    <div className={className}>
      <CodeBlock code={source} language="css" data-language="css" />
    </div>
  )
}
