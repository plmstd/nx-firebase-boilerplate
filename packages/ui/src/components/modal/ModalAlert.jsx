'use client';

import { DialogTitle } from '@headlessui/react';
import { cn } from '@myapp/utils';
import { Button } from '../primitives/Button';
import { H6 } from '../typography/Heading';
import { Text } from '../typography/Text';
import { ModalIcon } from './ModalIcon';
import { useModalStore } from './modalStore';

/** Built-in alert modal content for one-action status messages. */
export function ModalAlert() {
  const modal = useModalStore((state) => state.modal);
  const resolve = useModalStore((state) => state.resolve);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <ModalIcon type={modal?.type} />
        <div className="min-w-0 space-y-2">
          <H6 as={DialogTitle} className={cn(!modal?.title && 'sr-only')}>
            {modal?.title || 'Alert'}
          </H6>
          {modal?.message ? (
            <Text variant="bodySm" tone="muted">
              {modal.message}
            </Text>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => resolve()}>{modal?.confirmText}</Button>
      </div>
    </div>
  );
}
