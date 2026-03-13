'use client';

import { useState } from 'react';
import { cn } from '@myapp/utils';

export function Switch({ checked, defaultChecked = false, onCheckedChange, disabled = false, className }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const value = isControlled ? checked : internalChecked;

  function toggle() {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternalChecked(next);
    if (onCheckedChange) onCheckedChange(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        value ? 'bg-primary' : 'bg-border',
        className
      )}
    >
      <span className={cn('inline-block size-5 transform rounded-full bg-white transition-transform', value ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}
