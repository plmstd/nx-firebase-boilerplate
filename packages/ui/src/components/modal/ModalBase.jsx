'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { cn } from '@myapp/utils';
import { useModalStore } from './modalStore';

/** Shared Headless UI dialog frame used by all modal variants. */
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
        className="fixed inset-0 bg-text/50 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in motion-reduce:data-enter:duration-150 motion-reduce:data-leave:duration-100"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto overscroll-contain">
        <div className="flex min-h-full items-center justify-center p-4 text-left">
          <DialogPanel
            transition
            onTransitionEnd={handlePanelTransitionEnd}
            className={cn(
              'w-full max-w-md origin-center transform overflow-hidden rounded-surface border border-border bg-background p-5 text-text shadow-overlay transition-[opacity,transform] data-closed:translate-y-2 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in motion-reduce:data-closed:translate-y-0 motion-reduce:data-closed:scale-100 motion-reduce:data-enter:duration-150 motion-reduce:data-leave:duration-100',
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
