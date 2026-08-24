import { Label, Surface, Text } from '@myapp/ui';
import { cn } from '@myapp/utils';
import { colorTokenGroups } from '../color-token-groups';
import { KitSection } from '../components/KitSection';

/** Displays the customizable semantic color roles. */
export function FoundationSection() {
  return (
    <KitSection
      eyebrow="Foundation"
      title="Semantic tokens"
      description="Components refer to roles such as surface, content, action, and status instead of product-specific color values."
    >
      <div className="space-y-7">
        {colorTokenGroups.map((group) => (
          <div key={group.label}>
            <Label as="p" tone="muted" className="mb-3">
              {group.label}
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.tokens.map((token) => (
                <Surface key={token.token} padding="sm">
                  <div
                    className={cn(
                      'h-16 rounded-control border border-border',
                      token.className,
                    )}
                  />
                  <Label as="p" className="mt-3">
                    {token.label}
                  </Label>
                  <Text variant="caption" tone="subtle" className="mt-1">
                    {token.token}
                  </Text>
                </Surface>
              ))}
            </div>
          </div>
        ))}
      </div>
    </KitSection>
  );
}
