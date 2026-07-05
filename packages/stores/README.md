# @myapp/stores

Shared Zustand stores and store helpers for application code.

Use this package for small app-shell state, UI state, and reusable store
factories. Application code should import shared stores from `@myapp/stores`
instead of creating duplicate local Zustand stores in feature folders.

## Client UI Store

```jsx
'use client';

import { useUiStore } from '@myapp/stores';

export function MenuButton() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <button type="button" onClick={toggleSidebar}>
      {sidebarOpen ? 'Close' : 'Open'}
    </button>
  );
}
```

The global `useUiStore` is intended for client-only UI state that is safe to
share for the lifetime of a browser tab.

## Scoped Stores

Use `createStoreContext` for stores that should be scoped to a provider instead
of living as a global singleton.

```jsx
'use client';

import { createStoreContext, createUiStore } from '@myapp/stores';

export const {
  StoreProvider: UiStoreProvider,
  useBoundStore: useScopedUiStore,
} = createStoreContext(createUiStore, 'UiStore');
```

This pattern is the safer default for request-, user-, route-, or tenant-scoped
state in Next.js.
