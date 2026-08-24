import { H1, H2, H3, H4, H5, H6, Label, Surface, Text } from '@myapp/ui';
import { KitSection } from '../components/KitSection';

/** Displays the heading and body-text scales without polluting page semantics. */
export function TypographySection() {
  return (
    <KitSection
      eyebrow="Typography"
      title="Visual hierarchy with semantic control"
      description="Heading levels define visual styles. The `as` prop keeps document structure independent from appearance."
    >
      <Surface className="space-y-8">
        <div>
          <Label as="p" tone="subtle">
            H1 visual style · rendered as p in this gallery
          </Label>
          <H1 as="p" className="mt-2">
            Build from a strong foundation.
          </H1>
        </div>
        <div>
          <Label as="p" tone="subtle">
            H2
          </Label>
          <H2 as="p" className="mt-2">
            Clear interfaces scale better
          </H2>
        </div>
        <div>
          <Label as="p" tone="subtle">
            H3
          </Label>
          <H3 as="p" className="mt-2">
            Reusable by default
          </H3>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <Label as="p" tone="subtle">
              H4
            </Label>
            <H4 as="p" className="mt-2">
              Sections
            </H4>
          </div>
          <div>
            <Label as="p" tone="subtle">
              H5
            </Label>
            <H5 as="p" className="mt-2">
              Groups
            </H5>
          </div>
          <div>
            <Label as="p" tone="subtle">
              H6
            </Label>
            <H6 as="p" className="mt-2">
              Details
            </H6>
          </div>
        </div>
        <div className="grid gap-4 border-t border-border pt-7 sm:grid-cols-2">
          <Text variant="lead">
            Lead text introduces longer sections with a calm rhythm.
          </Text>
          <div className="space-y-3">
            <Text>Body text covers regular content and descriptions.</Text>
            <Text variant="bodySm" tone="muted">
              Body small supports secondary information.
            </Text>
            <Text variant="caption" tone="subtle">
              Captions work for metadata and concise hints.
            </Text>
          </div>
        </div>
      </Surface>
    </KitSection>
  );
}
