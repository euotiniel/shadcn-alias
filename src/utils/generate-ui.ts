import fs from "fs"
import path from "path"
import prompts from "prompts"

export async function generateUIFile(uiPath: string) {
  console.log(`\n> 📁 scanning ${uiPath}`)

  const fullPath = path.join(process.cwd(), uiPath)

  if (!fs.existsSync(fullPath)) {
    console.log(`\n! directory not found: ${fullPath}`)
    return
  }

  const files = fs.readdirSync(fullPath)
  const validFiles = files
    .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
    .filter((file) => file !== "index.ts")

  if (validFiles.length === 0) {
    console.log("\n(no components found)")
    return
  }

  console.log("\n> found:")
  for (const file of validFiles) {
    console.log(`- ${file}`)
  }

  const outputPath = path.join(fullPath, "..", "ui.ts")

  if (fs.existsSync(outputPath)) {
    const response = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "\nui.ts exists. overwrite?",
      initial: false,
    })

    if (!response.overwrite) {
      console.log("\ncanceled")
      return
    }
  }

  const exportLines: string[] = []
  const importLines: string[] = []
  const uiSpreads: string[] = []

  for (const file of validFiles) {
    const fileName = file.replace(/\.tsx?$/, "")
    const importPath = `${uiPath}/${fileName}`.replace(/\\/g, "/")
    const namespaceName = pascalCase(fileName)

    exportLines.push(`export * from "@/${importPath}"`)
    importLines.push(`import * as ${namespaceName} from "@/${importPath}"`)
    uiSpreads.push(`  ...${namespaceName},`)
  }

  const output = [
    ...exportLines,
    "",
    ...importLines,
    "",
    "export const ui = {",
    ...uiSpreads,
    "}",
    "",
  ].join("\n")

  fs.writeFileSync(outputPath, output)

  const relative = path.relative(process.cwd(), outputPath)
  console.log(`\n✓ ui.ts generated: ${relative}\n`)

  // How to use
  console.log("> how to use:\n")
  console.log('import { Button, AlertDialog } from "@/components/ui"')
  console.log("// or")
  console.log('import { ui } from "@/components/ui"')
  console.log("→ ui.Button")
}

// Eg. alert-dialog → AlertDialog, use-toast → UseToast
function pascalCase(str: string): string {
  return str
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
