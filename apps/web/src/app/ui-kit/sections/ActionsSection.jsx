import { AddIcon, DeleteIcon, SettingsIcon } from '@myapp/icons';
import { Button, IconButton, Surface } from '@myapp/ui';
import { KitSection } from '../components/KitSection';

/** Displays shared action variants, sizes, and states. */
export function ActionsSection() {
  return (
    <KitSection
      eyebrow="Actions"
      title="Buttons and states"
      description="Variants communicate intent while shared focus, disabled, loading, and press behavior remains consistent."
    >
      <div className="space-y-5">
        <Surface className="flex flex-wrap items-center gap-3">
          <Button icon={<AddIcon />}>Create item</Button>
          <Button variant="secondary">Edit</Button>
          <Button variant="ghost">View details</Button>
          <Button variant="muted">Later</Button>
          <Button variant="danger" icon={<DeleteIcon />}>
            Delete
          </Button>
        </Surface>
        <Surface className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <IconButton label="Settings" variant="secondary">
            <SettingsIcon />
          </IconButton>
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
        </Surface>
      </div>
    </KitSection>
  );
}
