# @myapp/styles

Shared styling entry point for the workspace. The package connects Tailwind
CSS 4, local fonts, semantic design tokens, global base styles, and the source
directories used by shared packages.

## Usage

Import the package once from the root layout of an application:

```js
import '@myapp/styles';
```

## Files

| Path                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `src/index.css`     | Tailwind entry point and global base styles |
| `src/variables.css` | Theme values exposed as semantic utilities  |
| `src/fonts.css`     | Local font-face definitions                 |
| `src/fonts/`        | Versioned font files                        |

## Customizing a cloned project

Treat `src/variables.css` as the primary customization surface. Change the
concrete values for color, typography, radii, and shadows while keeping
semantic token names stable. Shared components can then continue using roles
such as `bg-surface`, `text-text-muted`, and `text-success-strong`.

Keep status colors reserved for success, warning, and error feedback. Brand
colors should normally map to the primary action tokens instead of replacing
the meaning of status colors.

The boilerplate intentionally ships without a pretend dark theme. Add a second
theme only when the cloned product has defined and tested values for every
semantic role.

See [Design system](../../docs/DESIGN_SYSTEM.md) for the full component and
override conventions.

## Validation

```bash
npx nx lint styles
npx nx build styles
```
