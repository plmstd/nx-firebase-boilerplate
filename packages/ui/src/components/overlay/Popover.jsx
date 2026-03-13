'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function Popover({ trigger, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex">
        {trigger}
      </button>
      {open ? (
        <div className={cn('absolute left-0 z-40 mt-2 min-w-52 rounded-lg border border-border bg-background p-3 shadow-md', className)}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
