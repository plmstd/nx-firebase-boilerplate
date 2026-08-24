'use client';

import { DialogTitle } from '@headlessui/react';
import { cn } from '@myapp/utils';
import { Button } from '../primitives/Button';
import { H6 } from '../typography/Heading';
import { Text } from '../typography/Text';
import { ModalIcon } from './ModalIcon';
import { useModalStore } from './modalStore';

/** Built-in confirmation modal content that resolves to true or false. */
export function ModalConfirm() {
  const modal = useModalStore((state) => state.modal);
  const resolve = useModalStore((state) => state.resolve);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <ModalIcon type={modal?.type} />
        <div className="min-w-0 space-y-2">
          <H6 as={DialogTitle} className={cn(!modal?.title && 'sr-only')}>
            {modal?.title || 'Confirm action'}
          </H6>
          {modal?.message ? (
            <Text variant="bodySm" tone="muted">
              {modal.message}
            </Text>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={() => resolve(false)}>
          {modal?.cancelText}
        </Button>
        <Button onClick={() => resolve(true)}>{modal?.confirmText}</Button>
      </div>
    </div>
  );
}
