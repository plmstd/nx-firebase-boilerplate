'use client';

import { useState } from 'react';
import { FormField, Input, Select, Surface, Textarea } from '@myapp/ui';
import { KitSection } from '../components/KitSection';

/** Displays shared form controls and their composition pattern. */
export function FormsSection() {
  const [view, setView] = useState('overview');

  return (
    <KitSection
      eyebrow="Forms"
      title="Inputs and labels"
      description="FormField connects a label, control, hint, and validation message while keeping the input interchangeable."
    >
      <Surface>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Project name"
            labelFor="kit-project-name"
            hint="Use a short, recognizable name."
            required
          >
            <Input id="kit-project-name" placeholder="My new product" />
          </FormField>
          <FormField label="Default view" labelFor="kit-view">
            <Select
              id="kit-view"
              value={view}
              onChange={setView}
              options={[
                { value: 'overview', label: 'Overview' },
                { value: 'details', label: 'Details' },
              ]}
            />
          </FormField>
          <FormField
            label="Notes"
            labelFor="kit-notes"
            className="sm:col-span-2"
          >
            <Textarea
              id="kit-notes"
              minHeight="7rem"
              maxHeight="12rem"
              placeholder="Add context for your team…"
            />
          </FormField>
          <FormField
            label="Example with error"
            labelFor="kit-error"
            error="Enter at least three characters."
            className="sm:col-span-2"
          >
            <Input id="kit-error" aria-invalid="true" defaultValue="A" />
          </FormField>
        </div>
      </Surface>
    </KitSection>
  );
}
