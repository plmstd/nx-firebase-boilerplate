import { Button, H3, Label, Surface, Text } from '@myapp/ui';
import { KitSection } from '../components/KitSection';

/** Demonstrates polymorphism and deliberate local class overrides. */
export function CompositionSection() {
  return (
    <KitSection
      eyebrow="Composition"
      title="Surfaces and local overrides"
      description="Components own their default appearance. Consumer classes remain available for deliberate, one-off exceptions."
    >
      <Surface as="article" className="flex flex-col items-start gap-5">
        <Label as="p" tone="subtle">
          Surface · standard
        </Label>
        <H3 as="h2" className="text-warning-strong">
          H3 styling rendered as a semantic h2
        </H3>
        <Text className="max-w-2xl text-body-lg text-text">
          Size and tone can be overridden locally without creating a new
          stylesheet or component variant.
        </Text>
        <Button className="rounded-full">Local radius override</Button>
      </Surface>
    </KitSection>
  );
}
