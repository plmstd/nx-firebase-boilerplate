'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function MenuDropdown({ label, items = [], className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-11 min-w-40 rounded-lg border border-border bg-background p-1 shadow-md">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-text hover:bg-surface"
              onClick={() => {
                if (item.onSelect) item.onSelect();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
