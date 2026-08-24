'use client';

import { cn } from '@myapp/utils';

/**
 * Fixed, accessible screen region that owns the interactive toast stack.
 */
export function ToastViewport({
  children,
  className,
  height,
  expanded,
  onMouseEnter,
  onMouseLeave,
  onFocusCapture,
  onBlurCapture,
  viewportRef,
}) {
  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      className={cn(
        'pointer-events-none fixed right-4 top-4 z-[60] w-[calc(100vw-2rem)] max-w-[22.25rem] sm:right-6 sm:top-6',
        className,
      )}
    >
      <ol
        ref={viewportRef}
        tabIndex={-1}
        data-expanded={expanded}
        className="pointer-events-auto relative m-0 w-full list-none p-0 transition-[height] duration-300 ease-out motion-reduce:transition-none"
        style={{ height }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
      >
        {children}
      </ol>
    </section>
  );
}
