import { ChevronLeftIcon } from '@myapp/icons';
import { Button, H1, Label, Text } from '@myapp/ui';
import { ActionsSection } from './sections/ActionsSection';
import { CompositionSection } from './sections/CompositionSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { FormsSection } from './sections/FormsSection';
import { FoundationSection } from './sections/FoundationSection';
import { TypographySection } from './sections/TypographySection';

/**
 * Living, product-neutral gallery for the boilerplate's design tokens and
 * shared UI primitives.
 */
export function UiKitScreen() {
  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-8 py-12 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <Label as="p" tone="muted">
              My App · design-system starter
            </Label>
            <H1 className="mt-4">UI kit</H1>
            <Text variant="lead" tone="muted" className="mt-5 max-w-3xl">
              A product-neutral reference for the semantic tokens, primitives,
              states, and composition rules included with the boilerplate.
            </Text>
          </div>
          <Button href="/" variant="secondary" icon={<ChevronLeftIcon />}>
            Back to demo
          </Button>
        </header>

        <FoundationSection />
        <TypographySection />
        <ActionsSection />
        <FeedbackSection />
        <FormsSection />
        <CompositionSection />

        <footer className="border-t border-border py-10">
          <Text variant="bodySm" tone="muted">
            This gallery is a development reference. Adapt the semantic values
            in packages/styles/src/variables.css after cloning.
          </Text>
        </footer>
      </div>
    </main>
  );
}
