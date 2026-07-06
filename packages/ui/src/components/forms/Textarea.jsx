import { cn } from '@myapp/utils';

/**
 * Shared textarea primitive.
 *
 * Use `height` for a fixed-size textarea, or provide both `minHeight` and
 * `maxHeight` to opt into native CSS content-based autosizing. Autosizing uses
 * `field-sizing: content`, so older browsers gracefully fall back to normal
 * textarea scrolling without JavaScript measurement.
 */
export function Textarea({
  className,
  height,
  minHeight,
  maxHeight,
  style,
  ...props
}) {
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
      className={cn(
        'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        !hasCustomSizing && 'min-h-24',
        autoSize && 'overflow-y-auto',
        className,
      )}
      style={{ ...style, ...sizingStyle }}
      {...props}
    />
  );
}
