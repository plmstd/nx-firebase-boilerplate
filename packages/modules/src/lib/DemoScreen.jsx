'use client';

import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  FormField,
  H1,
  H2,
  Input,
  Select,
  Surface,
  Text,
  Textarea,
  modal,
  toast,
} from '@myapp/ui';

/**
 * Product-neutral starter screen that verifies the shared UI providers and
 * demonstrates how app-level modules compose design-system primitives.
 */
export function DemoScreen() {
  const [city, setCity] = useState('new-york');

  async function openModal() {
    const confirmed = await modal.confirm({
      title: 'Continue with this example?',
      message: 'The modal is provided by the shared UI package.',
      type: 'default',
      confirmText: 'Continue',
    });

    if (confirmed) {
      toast.success('Example confirmed');
    }
  }

  function showToasts() {
    toast.info({
      title: 'Design-system starter',
      message: 'Tokens and primitives are ready to customize.',
      action: {
        label: 'View kit',
        onClick: () => {
          window.location.href = '/ui-kit';
        },
      },
    });
  }

  return (
    <div className="space-y-5">
      <Alert>
        Customize the semantic theme in{' '}
        <code className="font-medium">packages/styles/src/variables.css</code>.
      </Alert>

      <Surface className="space-y-8">
        <header className="space-y-4">
          <Badge dot>Boilerplate</Badge>
          <div className="space-y-3">
            <H1>My App</H1>
            <Text variant="lead" tone="muted" className="max-w-2xl">
              Start with a semantic theme and a focused set of accessible UI
              primitives, then shape them around the product you are building.
            </Text>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Get started</Button>
            <Button href="/ui-kit" variant="secondary">
              Explore the UI kit
            </Button>
          </div>
        </header>

        <section className="border-t border-border pt-7">
          <H2 className="mb-5">Form example</H2>
          <form className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Name"
              labelFor="demo-name"
              hint="Enter a display name."
            >
              <Input id="demo-name" placeholder="Ada Lovelace" />
            </FormField>
            <FormField label="City" labelFor="demo-city">
              <Select
                id="demo-city"
                options={[
                  { value: 'new-york', label: 'New York' },
                  { value: 'los-angeles', label: 'Los Angeles' },
                  { value: 'chicago', label: 'Chicago' },
                  { value: 'houston', label: 'Houston' },
                  { value: 'miami', label: 'Miami' },
                ]}
                value={city}
                onChange={setCity}
              />
            </FormField>
            <FormField
              label="Message"
              labelFor="demo-message"
              className="sm:col-span-2"
            >
              <Textarea
                id="demo-message"
                minHeight="7rem"
                maxHeight="14rem"
                placeholder="Add a short message…"
              />
            </FormField>
          </form>
        </section>

        <section className="flex flex-wrap gap-3 border-t border-border pt-7">
          <Button variant="secondary" onClick={openModal}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={showToasts}>
            Show toast
          </Button>
        </section>
      </Surface>
    </div>
  );
}
