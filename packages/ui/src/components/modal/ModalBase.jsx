'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { cn } from '@myapp/utils';
import { useModalStore } from './modalStore';

/**
 * Shared Headless UI dialog frame used by all modal variants.
 */
export function ModalBase({ children, panelClassName }) {
  const isOpen = useModalStore((state) => state.isOpen);
  const dismiss = useModalStore((state) => state.dismiss);
  const clear = useModalStore((state) => state.clear);

  function handlePanelTransitionEnd(event) {
    if (event.currentTarget !== event.target) {
      return;
    }

    if (!useModalStore.getState().isOpen) {
      clear();
    }
  }

  return (
    <Dialog open={isOpen} onClose={dismiss} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-text/50 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-left">
          <DialogPanel
            transition
            onTransitionEnd={handlePanelTransitionEnd}
            className={cn(
              'w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-background p-4 text-text shadow-xl transition-all data-closed:translate-y-2 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in',
              panelClassName,
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
