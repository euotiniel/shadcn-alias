#!/usr/bin/env node
import prompts from "prompts"
import { checkIfShadcnUsed } from "./utils/check-shadcn.js"
import { generateUIFile } from "./utils/generate-ui.js"

async function main() {
  const usesShadcn = checkIfShadcnUsed()

  if (!usesShadcn) {
    console.log("\n! shadcn/ui not detected")
    return 
  }

  const response = await prompts({
    type: "text",
    name: "uiPath",
    message: "components directory (default: components/ui)",
    initial: "components/ui",
  })

  const uiPath = response.uiPath?.trim()

  if (!uiPath) {
    console.log("\ncanceled")
    return
  }

  generateUIFile(uiPath)
}

main()
