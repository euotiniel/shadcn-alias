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
npx shadcn-alias
```

Or, if you prefer to install globally:

```bash
npm install -g shadcn-alias
```

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
