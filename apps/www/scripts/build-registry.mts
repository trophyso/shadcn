import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REGISTRY_PATH = path.join(__dirname, "../registry/trophy/ui")
const OUTPUT_PATH = path.join(__dirname, "../public/r")
const REGISTRY_JSON_PATH = path.join(__dirname, "../registry.json")

interface RegistryItem {
  name: string
  type: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: { path: string; type: string }[]
  cssVars?: Record<string, unknown>
}

interface Registry {
  name: string
  homepage: string
  items: RegistryItem[]
}

async function buildRegistry() {
  console.log("Building registry...")

  // Read the registry.json to get component metadata
  const registry: Registry = JSON.parse(
    fs.readFileSync(REGISTRY_JSON_PATH, "utf-8")
  )

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true })
  }

  // Get all component files
  const componentFiles = fs.existsSync(REGISTRY_PATH)
    ? fs.readdirSync(REGISTRY_PATH).filter((f) => f.endsWith(".tsx"))
    : []

  const allItems: { name: string; type: string }[] = []

  for (const file of componentFiles) {
    const componentName = path.basename(file, ".tsx")
    const componentPath = path.join(REGISTRY_PATH, file)
    const content = fs.readFileSync(componentPath, "utf-8")

    // Find matching metadata in registry.json
    const metadata = registry.items.find((item) => item.name === componentName)

    // Build the registry item JSON
    const registryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: componentName,
      type: "registry:ui",
      dependencies: metadata?.dependencies || [],
      registryDependencies: metadata?.registryDependencies || [],
      files: [
        {
          path: `components/ui/${componentName}.tsx`,
          content: content,
          type: "registry:ui",
        },
      ],
    }

    // Write individual component JSON
    const outputFile = path.join(OUTPUT_PATH, `${componentName}.json`)
    fs.writeFileSync(outputFile, JSON.stringify(registryItem, null, 2))
    console.log(`  ✓ ${componentName}.json`)

    allItems.push({ name: componentName, type: "registry:ui" })
  }

  // Write index.json with all components
  const indexJson = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "trophy",
    homepage: "https://ui.trophy.so",
    items: allItems,
  }
  fs.writeFileSync(
    path.join(OUTPUT_PATH, "index.json"),
    JSON.stringify(indexJson, null, 2)
  )
  console.log(`  ✓ index.json`)

  // Write all.json for bulk install
  const allComponents = componentFiles.map((file) => {
    const componentName = path.basename(file, ".tsx")
    const outputFile = path.join(OUTPUT_PATH, `${componentName}.json`)
    return JSON.parse(fs.readFileSync(outputFile, "utf-8"))
  })

  if (allComponents.length > 0) {
    fs.writeFileSync(
      path.join(OUTPUT_PATH, "all.json"),
      JSON.stringify(allComponents, null, 2)
    )
    console.log(`  ✓ all.json`)
  }

  console.log(`\nRegistry built: ${componentFiles.length} components`)
}

buildRegistry().catch(console.error)
