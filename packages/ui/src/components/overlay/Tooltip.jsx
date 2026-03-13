'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function Tooltip({ content, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open ? (
        <span className={cn('absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 rounded-md bg-text px-2 py-1 text-xs text-text-inverted', className)}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
