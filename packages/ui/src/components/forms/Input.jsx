import { forwardRef } from 'react';
import { cn } from '@myapp/utils';

/** Shared text input with forwarded native input props and ref. */
export const Input = forwardRef(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-10 w-full rounded-control border border-border-strong bg-surface-elevated px-3 text-sm text-text shadow-control outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-out placeholder:text-text-subtle hover:border-text-subtle focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
