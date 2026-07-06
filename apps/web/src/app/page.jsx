'use client';

import { useState } from 'react';
import { Button, Alert, Input, Select, Textarea, FormField } from '@myapp/ui';

export default function Index() {
  const [city, setCity] = useState({ value: '1', label: 'New York' });

  return (
    <div className="min-h-screen bg-background p-8 text-text">
      <div className="mx-auto max-w-4xl ">
        <Alert className="mb-4">This is an alert</Alert>
        <div className="flex flex-col gap-4 rounded-xl bg-surface p-6">
          <h1 className="text-2xl font-semibold">My App</h1>
          <p className="text-text-muted">
            Start building with the shared styles and minimal UI primitives.
          </p>
          <div>
            <Button>Get Started</Button>
          </div>
          <form className="space-y-4">
            <FormField label="Name" hint="Enter your name">
              <Input />
            </FormField>
            <FormField label="City">
              <Select
                options={[
                  { value: '1', label: 'New York' },
                  { value: '2', label: 'Los Angeles' },
                  { value: '3', label: 'Chicago' },
                  { value: '4', label: 'Houston' },
                  { value: '5', label: 'Miami' },
                ]}
                value={city}
                onChange={(value) => setCity(value)}
              />
            </FormField>
            <FormField label="Message">
              <Textarea minHeight="7rem" maxHeight="14rem" />
            </FormField>
          </form>
        </div>
      </div>
    </div>
  );
}
