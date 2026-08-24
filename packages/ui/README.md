# @myapp/ui

Focused, product-neutral UI primitives for applications in the workspace.

## Components

- `Heading` and `H1` through `H6`
- `Text`
- `Label`
- `Button`
- `IconButton`
- `Surface`
- `Badge`
- `Input`
- `Textarea`
- `Select` and `HeadlessSelect`
- `FormField`
- `Alert`
- `Spinner`
- `ToastProvider`
- `ModalProvider`

Larger components coupled to real product data or workflows belong in
`@myapp/modules`. Add new UI primitives only when they express a reusable,
domain-neutral contract.

## Component contract

Shared components follow the same conventions:

- `className` is merged after internal classes, so intentional consumer
  overrides win.
- Native DOM props, events, `aria-*`, `data-*`, and `style` are forwarded where
  appropriate.
- DOM-facing components forward their ref.
- Suitable components accept `as` so appearance and HTML semantics can differ.
- Focus, disabled, loading, press, and reduced-motion behavior belong to the
  component instead of being rebuilt at each call site.
- Visual values use semantic tokens from `@myapp/styles`.

```jsx
import { Button, H1, Text } from '@myapp/ui';

// Looks like an H1 while remaining an H2 in the document outline.
<H1 as="h2">A clear product heading</H1>;

// The local utility wins against the default muted tone.
<Text tone="muted" className="text-warning-strong">
  Needs attention
</Text>;

<Button className="rounded-full">Local exception</Button>;
```

`Surface` owns a neutral background, border, radius, and configurable padding
without decorative elevation. Use it to group related content before creating
product-specific container components.

## Modal API

Mount `ModalProvider` once in the app shell. `apps/web` already does this in
the root layout.

```jsx
'use client';

import { H6, modal } from '@myapp/ui';

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
    <H6 as="h2">Choose a value</H6>
    <button type="button" onClick={() => resolve({ id: 'basic' })}>
      Basic
    </button>
    <button type="button" onClick={dismiss}>
      Cancel
    </button>
  </div>
));
```

## Toast API

Mount `ToastProvider` once in the app shell. The provider displays up to three
compact stacked toasts and expands them on hover or keyboard focus. Timers and
progress pause during interaction or while the document is hidden.

```jsx
'use client';

import { toast } from '@myapp/ui';

toast.success({
  title: 'Saved',
  message: 'Your changes were saved.',
});

const id = toast.info({
  title: 'Upload running',
  duration: 8000,
  action: {
    label: 'Undo',
    onClick: restoreUpload,
  },
});

toast.update(id, {
  type: 'success',
  title: 'Upload complete',
});

await toast.promise(saveChanges(), {
  loading: 'Saving…',
  success: 'Saved',
  error: (reason) => ({
    title: 'Save failed',
    message: reason.message,
  }),
});

toast.dismiss(id);
toast.clear();
```

Toast options also support `dismissible`, `icon`, `className`, `style`,
`onDismiss`, and `onAutoClose`. Loading toasts are persistent until updated or
dismissed.

Review all tokens, components, states, and override behavior at `/ui-kit`.
See [Design system](../../docs/DESIGN_SYSTEM.md) for architecture and extension
rules.
