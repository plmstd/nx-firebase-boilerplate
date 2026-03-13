'use client';

import { cn } from '@myapp/utils';

export function Modal({ open, onClose, title, children, className }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className={cn('w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-lg', className)}>
        {title ? <h3 className="mb-3 text-lg font-semibold text-text">{title}</h3> : null}
        <div className="text-sm text-text">{children}</div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text hover:bg-surface-elevated"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
