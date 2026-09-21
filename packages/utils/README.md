# @myapp/utils

Shared helpers with explicit entry points for UI and Firebase code.

## `cn`

`cn` combines conditional class values with `clsx`, resolves conflicting
Tailwind utilities, and understands the custom typography, radius, and shadow
scales defined by the design system.

```jsx
import { cn } from '@myapp/utils/cn';

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

Always use `@myapp/utils/cn` in UI primitives, shared components and server
components. This entry point does not load or initialize Firebase. The root
`@myapp/utils` export remains compatible with earlier consumers, but also
re-exports Firebase and should not be used for a standalone class-name helper.

## Firebase client configuration

The package also owns the browser Firebase initialization used by the starter
app. Firebase web configuration values are not Admin SDK secrets, but service
accounts and privileged backend credentials must never be added here.

```js
import { auth, db } from '@myapp/utils/firebase';
```

The Auth store needs both Auth and Firestore for the current user's realtime
profile document. They are intentionally retained. Configure the same
`src/lib/firebase-config.js` file as before; `setup.mjs` still targets it.
