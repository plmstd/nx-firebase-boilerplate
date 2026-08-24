# @myapp/utils

Small, shared utilities that are safe to use across workspace packages.

## `cn`

`cn` combines conditional class values with `clsx`, resolves conflicting
Tailwind utilities, and understands the custom typography, radius, and shadow
scales defined by the design system.

```jsx
import { cn } from '@myapp/utils';

export function Example({ active, className }) {
  return (
    <div
      className={cn(
        'rounded-surface text-body',
        active && 'bg-surface',
        className,
      )}
    />
  );
}
```

Consumer classes should be passed last so deliberate local overrides win.

## Firebase client configuration

The package also owns the browser Firebase initialization used by the starter
app. Firebase web configuration values are not Admin SDK secrets, but service
accounts and privileged backend credentials must never be added here.
