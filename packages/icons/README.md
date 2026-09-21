# @myapp/icons

Shared icon set for application code.

This package exposes project-owned React icon components that wrap the original
`react-icons` SVGs through its unchanged renderer and `IconContext`.
Application code should import icons from `@myapp/icons` instead of importing
from `react-icons` directly. This keeps the visible icon API stable while the
underlying icon family can change later.

## Usage

```jsx
import { SettingsIcon } from '@myapp/icons';

export function SettingsButton() {
  return (
    <button type="button" aria-label="Settings">
      <SettingsIcon />
    </button>
  );
}
```

Icons are decorative by default. Pass `aria-label`, `aria-labelledby`, or
`title` when an icon itself needs an accessible name.

Status and feedback primitives use the generic `CheckCircleIcon` and
`StatusDotIcon` exports. Product-specific icons should only be added when a
real product flow requires them; they are not part of the boilerplate starter
by default.

## Adding Icons

Add new icons in `src/icons/common.jsx` using `createIcon` and an individual
generated glyph path:

```jsx
import { LuSettings } from '../glyphs/lu/LuSettings.js';

export const SettingsIcon = createIcon(LuSettings, 'SettingsIcon');
```

Then run from the repository root:

```sh
npm run icons:generate
npm run test:performance
```

The generator reads only the imports in `common.jsx` and the installed
`react-icons` sources. It creates the referenced glyphs in `src/glyphs/`, keeping
the original SVG data, renderer, version and source hashes. Include these files
in Git; normal builds need no generation step or network access. After updating
`react-icons`, regenerate and run the same checks.

Do not import `react-icons/lu`, `/fi`, `/go` or another complete family into
application code: they force development compilers to process large set files.
The small package-root import for `GenIcon`/`IconContext` remains appropriate.

Keep the upstream family license in `LICENSE.<family>.txt` when adding a new
family. The current files come from the official [Lucide](https://github.com/lucide-icons/lucide/blob/main/LICENSE),
[Feather](https://github.com/feathericons/feather/blob/main/LICENSE), and
[Octicons](https://github.com/primer/octicons/blob/main/LICENSE) repositories.
The generator also preserves the installed React Icons license and notices.

`npm run icons:check` detects missing, outdated and obsolete generated files.
It does not modify them. `manifest.json` is an inventory, deliberately not a
nested `package.json`: Nx must continue to see a single icons project.
