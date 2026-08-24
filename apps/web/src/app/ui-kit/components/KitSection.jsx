import { H2, Label, Text } from '@myapp/ui';

/**
 * Shared two-column frame for one group in the development UI kit.
 */
export function KitSection({ eyebrow, title, description, children }) {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <div>
          <Label as="p" tone="muted">
            {eyebrow}
          </Label>
          <H2 className="mt-3">{title}</H2>
          {description ? (
            <Text tone="muted" className="mt-4 max-w-md">
              {description}
            </Text>
          ) : null}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
