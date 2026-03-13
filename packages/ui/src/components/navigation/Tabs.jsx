'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function Tabs({ items, defaultValue, className }) {
  const [active, setActive] = useState(
    defaultValue || (items && items[0] ? items[0].value : undefined)
  );
  const current =
    (items || []).find((item) => item.value === active) || (items && items[0]);

  if (!current) return null;

  return (
    <div className={cn('w-full', className)}>
      <div className="inline-flex rounded-lg border border-border bg-surface-elevated p-0.5">
        {(items || []).map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setActive(item.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              item.value === current.value
                ? 'bg-background text-text'
                : 'text-text-muted hover:text-text'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-3">{current.content}</div>
    </div>
  );
}
