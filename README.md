<h1 align="center">
  shadcn-alias
</h1>

<p align="center">A CLI tool to automatically generate a file to centralize your shadcn/ui component imports.</p>

<br>

This CLI tool scans your yours folder and creates a `ui.ts` file that re-exports everything in an organized way. With this, you get:

* Fewer repetitive imports
* Better code readability
* Cleaner DX experience


#### Before

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
```

#### After

```tsx
import { ui } from "@/components/ui"

ui.Button
```

Or, if you prefer named imports:

```tsx
import { Button, Dialog, useToast } from "@/components/ui"
```

No more remembering long paths like `@/components/ui/alert-dialog`. One file to rule them all.


## Usage

Run the command in the root of your project:

```bash
npx shadcn-alias [options]
```

Or, if you prefer to install globally:

```bash
npm install -g shadcn-alias
shadcn-alias [options]
```

### Commands

**`generate` (default)**

This is the default command. It scans the input directory and generates the `ui.ts` file.

```bash
npx shadcn-alias [options]
```

**`check`**

Performs a dry run. It analyzes your project, detects the component directory and path alias, and prints a summary of what it found and what it would generate, without writing or modifying any files. This is useful for verifying your configuration.

```bash
npx shadcn-alias check [options]
```

### Options

| Option     | Alias | Description                                                                  | Default         |
| :--------- | :---- | :--------------------------------------------------------------------------- | :-------------- |
| `--input`  | `-i`  | The directory where your `shadcn/ui` components are located.                 | `components/ui` |
| `--output` | `-o`  | The path for the generated `ui.ts` file.                                     | `components/ui.ts` |

The tool will automatically detect your path alias (e.g., `@/*`, `~/lib/*`) from your `tsconfig.json` or `jsconfig.json`.

## Example structure

```
components/
├── ui/
│   ├── button.tsx
│   ├── alert-dialog.tsx
│   └── use-toast.ts
└── ui.ts
```

## License

MIT License. See [LICENSE](LICENSE) for details.