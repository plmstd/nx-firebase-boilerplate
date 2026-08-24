import { forwardRef } from 'react';
import { cn } from '@myapp/utils';

/**
 * Shared textarea. Use `height` for fixed sizing, or provide `minHeight` and
 * `maxHeight` together to opt into native CSS content-based autosizing.
 */
export const Textarea = forwardRef(function Textarea(
  { className, height, minHeight, maxHeight, style, ...props },
  ref,
) {
  const hasHeight = height != null;
  const hasMinHeight = minHeight != null;
  const hasMaxHeight = maxHeight != null;
  const hasCustomSizing = hasHeight || hasMinHeight || hasMaxHeight;
  const autoSize = !hasHeight && hasMinHeight && hasMaxHeight;

  const sizingStyle = {
    ...(!hasHeight && hasMinHeight ? { minHeight } : {}),
    ...(!hasHeight && hasMaxHeight ? { maxHeight } : {}),
    ...(hasHeight ? { height } : {}),
    ...(autoSize ? { fieldSizing: 'content' } : {}),
  };

  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-control border border-border-strong bg-surface-elevated px-3 py-2 text-sm text-text shadow-control outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-out placeholder:text-text-subtle hover:border-text-subtle focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        !hasCustomSizing && 'min-h-24',
        autoSize && 'overflow-y-auto',
        className,
      )}
      style={{ ...sizingStyle, ...style }}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
