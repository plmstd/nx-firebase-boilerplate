'use client';

import { CloseIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';
import { useModalStore } from './modalStore';

/**
 * Renders caller-owned modal content and exposes Promise controls to render functions.
 */
export function ModalCustom() {
  const modal = useModalStore((state) => state.modal);
  const resolve = useModalStore((state) => state.resolve);
  const dismiss = useModalStore((state) => state.dismiss);

  const content =
    typeof modal?.content === 'function'
      ? modal.content({
          resolve,
          dismiss,
          close: resolve,
        })
      : modal?.content;

  return (
    <div className={cn('relative', modal?.className)}>
      {modal?.showClose && (
        <button
          type="button"
          className="absolute right-0 top-0 inline-flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={dismiss}
        >
          <CloseIcon aria-hidden="true" />
          <span className="sr-only">Close modal</span>
        </button>
      )}
      {content}
    </div>
  );
}
