import fs from "fs"
import path from "path"

const root = process.cwd()

function findComponentsJsonFiles(dir: string, found: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (["node_modules", ".git", ".next"].includes(entry.name)) continue
      findComponentsJsonFiles(fullPath, found)
    } else if (entry.isFile() && entry.name === "components.json") {
      found.push(fullPath)
    }
  }
  return found
}

function isValidShadcnJson(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const json = JSON.parse(content)
    return (
      typeof json === "object" &&
      json.$schema === "https://ui.shadcn.com/schema.json"
    )
  } catch {
    return false
  }
}

export function checkIfShadcnUsed(): boolean {
  const foundJsons = findComponentsJsonFiles(root)
  const validJsons = foundJsons.filter(isValidShadcnJson)

  if (validJsons.length > 0) {
    console.log("> shadcn/ui detected\n")
    // validJsons.forEach(file => console.log(`  ${file}`))
    return true
  }
  return false
}

