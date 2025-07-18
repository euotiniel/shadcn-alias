import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import mock from "mock-fs"
import fs from "fs"
import path from "path"
import { generateUIFile } from "./generate-ui"

// Mock prompts to automatically confirm overwrites in tests
vi.mock("prompts", () => ({
  default: vi.fn().mockResolvedValue({ overwrite: true }),
}))

describe("generateUIFile", () => {
  beforeEach(() => {
    mock({
      "tsconfig.json": JSON.stringify({
        compilerOptions: {
          paths: {
            "@/*": ["./src/*"],
          },
        },
      }),
      "src/components/ui": {
        "button.tsx": "export const Button = () => {};",
        "dialog.ts": "export const Dialog = {};",
        "internal-helper.ts": "// This should be ignored",
      },
      // Empty dir for output
      "src/components": {},
    })
  })

  afterEach(() => {
    mock.restore()
  })

  it("should generate a ui.ts file with correct exports and imports", async () => {
    const inputPath = "src/components/ui"
    const outputPath = "src/components/ui.ts"
    const alias = "@"

    // Suppress console.log during test execution
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await generateUIFile(inputPath, outputPath, alias)

    // Restore console.log
    consoleSpy.mockRestore();

    const outputExists = fs.existsSync(outputPath)
    expect(outputExists).toBe(true)

    const content = fs.readFileSync(outputPath, "utf-8")

    // Check for auto-generation comment
    expect(content).toContain("// This file is auto-generated. Do not edit.")

    // Check for correct export statements
    expect(content).toContain('export * from "@/src/components/ui/button"')
    expect(content).toContain('export * from "@/src/components/ui/dialog"')

    // Check for correct namespace import statements
    expect(content).toContain('import * as Button from "@/src/components/ui/button"')
    expect(content).toContain('import * as Dialog from "@/src/components/ui/dialog"')

    // Check for correct ui object structure
    expect(content).toContain("export const ui = {")
    expect(content).toContain("  ...Button,")
    expect(content).toContain("  ...Dialog,")
    expect(content).toContain("}")
  })
})
