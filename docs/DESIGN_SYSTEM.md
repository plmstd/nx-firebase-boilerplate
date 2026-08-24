# Design-system starter

## Goal

The boilerplate provides a neutral, adaptable foundation instead of a finished
product identity. A cloned project should be able to establish its own visual
language by changing a small set of semantic values rather than rewriting every
component.

The starter follows four principles:

1. **Semantic tokens:** Components consume roles such as background, primary,
   and error instead of hard-coded product colors.
2. **Controlled reuse:** Domain-neutral primitives live in `@myapp/ui`.
   Product-aware compositions live in `@myapp/modules`.
3. **Component-owned defaults:** A shared component owns its regular visual and
   interaction states. Call sites primarily control layout and composition.
4. **Accessible interaction:** Focus, disabled, loading, press, and
   reduced-motion behavior are part of the primitive contract.

## Ownership

| Location                            | Responsibility                                  |
| ----------------------------------- | ----------------------------------------------- |
| `packages/styles/src/variables.css` | Theme values and semantic token names           |
| `packages/styles/src/index.css`     | Tailwind sources, base styles, shared keyframes |
| `packages/ui`                       | Product-neutral components and interaction APIs |
| `packages/icons`                    | Stable, project-owned icon exports              |
| `packages/modules`                  | Reusable product workflows and compositions     |
| `apps/web`                          | Routing, app shell, and page composition        |
| `apps/web/src/app/ui-kit`           | Living development gallery                      |

## Token layers

The central definitions in `packages/styles/src/variables.css` are exposed by
Tailwind CSS 4 as semantic utilities.

| Layer     | Examples                                                     |
| --------- | ------------------------------------------------------------ |
| Surfaces  | `background`, `surface`, `surface-soft`, `surface-elevated`  |
| Lines     | `border`, `border-strong`                                    |
| Content   | `text`, `text-muted`, `text-subtle`, `text-inverted`         |
| Actions   | `primary`, `primary-hover`, `primary-active`, `focus`        |
| Status    | `success`, `warning`, `error`, plus `*-soft` and `*-strong`  |
| Shape     | `radius-control`, `radius-surface`                           |
| Elevation | `shadow-control`, `shadow-toast`, `shadow-overlay`           |
| Type      | `font-body`, `font-heading`, `text-heading-*`, `text-body-*` |

Component code should use the semantic layer, for example `bg-surface` or
`text-error-strong`. Repeated hex values and recurring arbitrary values are a
signal that a missing token or component variant should be introduced.

## Customizing after cloning

1. Run `node setup.mjs` to replace the workspace namespace and app identity.
2. Change the concrete theme values in `packages/styles/src/variables.css`.
3. Review every token and component state at `/ui-kit`.
4. Add product-level components to `packages/modules`, composed from primitives.
5. Add a UI variant only when it represents a recurring visual or behavioral
   contract; keep one-off layout changes at the call site.

The neutral starter theme maps primary actions to graphite. A cloned product
can remap the primary action values to its brand. Success, warning, and error
should remain semantically recognizable and meet the required contrast.

The starter does not claim dark-mode support. A product should add an alternate
theme only after defining and checking every semantic role and component state.

## Styling rules

- Put reusable color, type, radius, shadow, and similar decisions in tokens.
- Put the standard appearance of a reusable element in its component.
- Use call-site utilities for layout, responsive arrangement, and spacing
  between components.
- Treat visual `className` overrides as deliberate local exceptions.
- Turn repeated overrides into a token, prop, or named component variant.
- Reserve inline `style` for runtime-dependent values such as measured
  positions, dynamic dimensions, or controlled tenant values.
- Merge internal classes first and consumer `className` last with `cn`.
- Forward native props and refs where technically appropriate.

`cn` extends `tailwind-merge` with the custom type, radius, and shadow scales.
This ensures a local text color does not accidentally remove a typography token
and lets consumer utilities override conflicting defaults predictably.

## Typography and polymorphism

`Heading`, `Text`, and `Label` separate visual style from HTML semantics. `H1`
through `H6` select a visual heading level and render the matching element by
default. Use `as` when the correct document outline requires another element.

```jsx
<H1 as="h2">Visually prominent, semantically nested</H1>
<Text as="span" variant="caption" tone="muted">Updated just now</Text>
```

The same polymorphic convention is available on other suitable primitives such
as `Button`, `Badge`, and `Surface`.

## Interaction and motion

Controls provide immediate, restrained press feedback and a consistent visible
focus ring. Motion should explain state changes and should favor `transform`
and `opacity` over layout animation.

`prefers-reduced-motion` is part of the component contract. Spatial effects
fall back to short fades or static state changes; important feedback must not
disappear entirely. Strong elevation is reserved for real overlays such as
dialogs and toasts, while regular `Surface` containers remain flat.

The toast provider supports stacked notifications, interaction-paused timers,
stable IDs, progress, actions, loading states, updates, and Promise tracking.
These behaviors are generic infrastructure and should not contain product copy.

## Extending the system

Before adding a new shared component, confirm that it is domain-neutral and has
a real reuse case. A shared component should:

- use semantic tokens;
- expose meaningful variants instead of styling flags;
- forward native accessibility props and refs where appropriate;
- define focus, disabled, loading, and reduced-motion behavior when relevant;
- merge consumer classes last;
- appear with its important states on `/ui-kit`;
- be documented in the relevant package README.

Product-specific data access, routing logic, roles, and workflows do not belong
in `@myapp/ui` even if their presentation is reusable inside one product.
