# @myapp/ui

Minimal shared UI primitives for the application.

## Components

The package intentionally starts small:

- `Button`
- `IconButton`
- `Input`
- `Textarea`
- `Select`
- `FormField`
- `Alert`
- `Spinner`
- `ModalProvider`

Add larger or more interactive components only when a real product flow needs
them.

## Modal API

Mount `ModalProvider` once in the app shell. `apps/web` already does this in
the root layout.

```jsx
'use client';

import { modal } from '@myapp/ui';

await modal.alert({
  title: 'Saved',
  message: 'Your changes were saved.',
  type: 'success',
});

const confirmed = await modal.confirm({
  title: 'Delete item?',
  message: 'This action cannot be undone.',
  confirmText: 'Delete',
});

const value = await modal.custom(({ resolve, dismiss }) => (
  <div className="space-y-4 pr-10">
    <h2 className="text-base font-semibold">Choose a value</h2>
    <button type="button" onClick={() => resolve({ id: 'basic' })}>
      Basic
    </button>
    <button type="button" onClick={dismiss}>
      Cancel
    </button>
  </div>
));
```
