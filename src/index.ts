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

  yargs(hideBin(process.argv))
    .command(
      "$0",
      "Generate the ui.ts file",
      (yargs) => {
        return yargs
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
      },
      (argv) => {
        const inputPath = argv.input.trim()
        const outputPath = argv.output?.trim()

        if (!inputPath) {
          console.log("\ncanceled")
          return
        }

        generateUIFile(inputPath, outputPath, alias)
      }
    )
    .command(
      "check",
      "Check the configuration and detected paths",
      (yargs) => {
        return yargs
          .option("input", {
            alias: "i",
            type: "string",
            description: "Input directory for components",
            default: "components/ui",
          })
      },
      (argv) => {
        const inputPath = argv.input.trim()
        const fullInputPath = path.join(process.cwd(), inputPath)
        const outputPath = path.join(fullInputPath, "..", "ui.ts")

        console.log("\n> Configuration Check (Dry Run):\n")
        console.log(`  - Detected Alias:       '${alias}'`)
        console.log(`  - Component Directory:  '${inputPath}'`)
        console.log(`  - Generated File Would be: '${path.relative(process.cwd(), outputPath)}'`)
        
        if (!fs.existsSync(fullInputPath)) {
          console.log("\n! Warning: Component directory does not exist.")
        }
        console.log("\nRun without 'check' to generate the file.")
      }
    )
    .demandCommand(1, "You need at least one command before moving on")
    .help()
    .parse()
}

main()