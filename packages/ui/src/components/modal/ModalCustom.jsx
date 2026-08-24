'use client';

import { CloseIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';
import { IconButton } from '../primitives/IconButton';
import { useModalStore } from './modalStore';

/**
 * Renders caller-owned modal content and exposes Promise controls to render
 * functions.
 */
export function ModalCustom() {
  const modal = useModalStore((state) => state.modal);
  const resolve = useModalStore((state) => state.resolve);
  const dismiss = useModalStore((state) => state.dismiss);

  const content =
    typeof modal?.content === 'function'
      ? modal.content({ resolve, dismiss, close: resolve })
      : modal?.content;

  return (
    <div className={cn('relative', modal?.className)}>
      {modal?.showClose ? (
        <IconButton
          label="Close dialog"
          size="sm"
          variant="ghost"
          className="absolute right-0 top-0 text-text-muted hover:text-text"
          onClick={dismiss}
        >
          <CloseIcon aria-hidden="true" />
        </IconButton>
      ) : null}
      {content}
    </div>
  );
}
