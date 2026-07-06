'use client';

import { cn } from '@myapp/utils';

/**
 * Fixed screen area where toast notifications stack.
 */
export function ToastViewport({ children, className }) {
  return (
    <section
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6',
        className,
      )}
    >
      {children}
    </section>
  );
}
