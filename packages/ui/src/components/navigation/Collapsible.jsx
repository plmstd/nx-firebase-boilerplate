'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function Collapsible({ trigger, children, defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn(className)}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="text-sm text-primary hover:underline">
        {trigger}
      </button>
      {open ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}
