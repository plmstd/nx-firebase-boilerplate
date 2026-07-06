'use client';

import { useState } from 'react';
import {
  Button,
  Alert,
  Input,
  Select,
  Textarea,
  FormField,
  modal,
  toast,
} from '@myapp/ui';

export const DemoScreen = () => {
  const [city, setCity] = useState({ value: '1', label: 'New York' });

  const openModal = () => {
    modal.alert({
      title: 'Modal',
      message: 'This is a modal',
      type: 'default',
    });
  };

  const showToasts = () => {
    // get random number between 0 and 3
    const randomNumber = Math.floor(Math.random() * 4);
    switch (randomNumber) {
      case 0:
        toast.success('Success');
        break;
      case 1:
        toast.info('Info');
        break;
      case 2:
        toast.warning('Warning');
        break;
      case 3:
        toast.error('Error');
        break;
    }
  };

  return (
    <div>
      {' '}
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
        <div>
          <h2 className="text-lg font-semibold mb-2">Modal</h2>
          <Button onClick={openModal}>Open Modal</Button>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Toast</h2>
          <Button onClick={showToasts}>Show Toasts</Button>
        </div>
      </div>
    </div>
  );
};
