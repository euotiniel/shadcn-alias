#!/usr/bin/env node
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import fs from "fs"
import path from "path"
import { checkIfShadcnUsed } from "./utils/check-shadcn.js"
import { generateUIFile } from "./utils/generate-ui.js"

function getAlias() {
  const tsConfigPath = path.join(process.cwd(), "tsconfig.json")
  const jsConfigPath = path.join(process.cwd(), "jsconfig.json")

  let configPath = ""
  if (fs.existsSync(tsConfigPath)) {
    configPath = tsConfigPath
  } else if (fs.existsSync(jsConfigPath)) {
    configPath = jsConfigPath
  } else {
    return null
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf-8")
    const config = JSON.parse(configContent)
    const paths = config.compilerOptions?.paths
    if (paths) {
      for (const key in paths) {
        if (key.endsWith("/*")) {
          return key.slice(0, -2)
        }
      }
    }
  } catch (error) {
    console.error("! failed to parse tsconfig.json or jsconfig.json")
  }

  return null
}

async function main() {
  const usesShadcn = checkIfShadcnUsed()

  if (!usesShadcn) {
    console.log("\n! shadcn/ui not detected")
    return
  }

  const alias = getAlias()
  if (!alias) {
    console.log("\n! could not detect path alias in tsconfig.json or jsconfig.json")
    return
  }

  const argv = await yargs(hideBin(process.argv))
    .option("input", {
      alias: "i",
      type: "string",
      description: "Input directory for components",
      default: "components/ui",
    })
    .option("output", {
      alias: "o",
      type: "string",
      description: "Output file path",
    })
    .parse()

  const inputPath = argv.input.trim()
  const outputPath = argv.output?.trim()

  if (!inputPath) {
    console.log("\ncanceled")
    return
  }

  generateUIFile(inputPath, outputPath, alias)
}

main()