import { execSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const outputDir = path.join(root, "public/r")
const registryFile = path.join(root, "registry.json")

function main() {
  console.log("Cleaning public/r...")
  fs.rmSync(outputDir, { recursive: true, force: true })
  fs.mkdirSync(outputDir, { recursive: true })

  console.log("Running shadcn build...")
  execSync("pnpm exec shadcn build", { cwd: root, stdio: "inherit" })

  const registry = JSON.parse(fs.readFileSync(registryFile, "utf-8"))
  const gamificationItems = registry.items.filter(
    (item) => item.type === "registry:ui"
  )

  const allComponents = gamificationItems.map((item) => {
    const file = path.join(outputDir, `${item.name}.json`)
    return JSON.parse(fs.readFileSync(file, "utf-8"))
  })

  if (allComponents.length > 0) {
    fs.writeFileSync(
      path.join(outputDir, "all.json"),
      JSON.stringify(allComponents, null, 2)
    )
    console.log(`  ✓ all.json (${allComponents.length} components)`)
  }

  console.log("\nRegistry built successfully.")
}

main()
