'use client';

import { cn } from '@myapp/utils';

export function Drawer({ open, onClose, side = 'right', children, className }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30" aria-modal="true" role="dialog">
      <button type="button" aria-label="Close drawer" className="absolute inset-0 h-full w-full" onClick={onClose} />
      <aside
        className={cn(
          'absolute top-0 h-full w-full max-w-sm border-border bg-background p-5 shadow-xl',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className
        )}
      >
        {children}
      </aside>
    </div>
  );
}
