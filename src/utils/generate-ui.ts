import fs from "fs"
import path from "path"
import prompts from "prompts"

export async function generateUIFile(
  inputPath: string,
  outputPath: string | undefined,
  alias: string
) {
  console.log(`\n> 📁 scanning ${inputPath}`)

  const fullPath = path.join(process.cwd(), inputPath)

  if (!fs.existsSync(fullPath)) {
    console.log(`\n! directory not found: ${fullPath}`)
    return
  }

  const files = fs.readdirSync(fullPath)
  const validFiles = files
    .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
    .filter((file) => file !== "index.ts" && file !== "ui.ts")

  if (validFiles.length === 0) {
    console.log("\n(no components found)")
    return
  }

  console.log("\n> found:")
  for (const file of validFiles) {
    console.log(`- ${file}`)
  }

  const finalOutputPath =
    outputPath || path.join(fullPath, "..", "ui.ts")

  if (fs.existsSync(finalOutputPath)) {
    const response = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `\n'${path.relative(
        process.cwd(),
        finalOutputPath
      )}' exists. overwrite?`,
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
    const importPath = `${alias}/${inputPath}/${fileName}`.replace(/\\/g, "/")
    const namespaceName = pascalCase(fileName)

    exportLines.push(`export * from "${importPath}"`)
    importLines.push(`import * as ${namespaceName} from "${importPath}"`)
    uiSpreads.push(`  ...${namespaceName},`)
  }

  const outputContent = [
    "// This file is auto-generated. Do not edit.",
    ...exportLines,
    "",
    ...importLines,
    "",
    "export const ui = {",
    ...uiSpreads,
    "}",
    "",
  ].join("\n")

  fs.writeFileSync(finalOutputPath, outputContent)

  const relative = path.relative(process.cwd(), finalOutputPath)
  console.log(`\n✓ ui.ts generated: ${relative}\n`)

  const finalAlias = path.dirname(relative)

  // How to use
  console.log("> how to use:\n")
  console.log(`import { Button, AlertDialog } from "${alias}/${finalAlias}"`)
  console.log("// or")
  console.log(`import { ui } from "${alias}/${finalAlias}"`)
  console.log("→ ui.Button")
}

// Eg. alert-dialog → AlertDialog, use-toast → UseToast
function pascalCase(str: string): string {
  return str
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}