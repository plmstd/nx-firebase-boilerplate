'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function Accordion({ title, children, defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('rounded-lg border border-border', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text"
      >
        <span>{title}</span>
        <span>{open ? '-' : '+'}</span>
      </button>
      {open ? <div className="border-t border-border px-4 py-3 text-sm text-text-muted">{children}</div> : null}
    </div>
  );
}
