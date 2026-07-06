'use client';

import { DialogTitle } from '@headlessui/react';
import { cn } from '@myapp/utils';
import { Button } from '../primitives/Button';
import { ModalIcon } from './ModalIcon';
import { useModalStore } from './modalStore';

/**
 * Built-in alert modal content for one-action status messages.
 */
export function ModalAlert() {
  const modal = useModalStore((state) => state.modal);
  const resolve = useModalStore((state) => state.resolve);

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-start">
        <ModalIcon type={modal?.type} />
        <div className="min-w-0 space-y-2">
          <DialogTitle
            className={cn(
              'text-base font-semibold text-text',
              !modal?.title && 'sr-only',
            )}
          >
            {modal?.title || 'Alert'}
          </DialogTitle>
          {modal?.message && (
            <p className="text-sm leading-6 text-text-muted">{modal.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => resolve()}>{modal?.confirmText}</Button>
      </div>
    </div>
  );
}
