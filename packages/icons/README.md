# @myapp/icons

Shared icon set for application code.

This package exposes project-owned React icon components that wrap `react-icons`.
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

Add new icons in `src/icons/common.jsx` using `createIcon`:

```jsx
import { LuSettings } from 'react-icons/lu';

export const SettingsIcon = createIcon(LuSettings, 'SettingsIcon');
```

Prefer imports from a specific `react-icons` family path, such as
`react-icons/lu`, and avoid imports from the package root.
