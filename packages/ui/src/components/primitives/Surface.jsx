import { forwardRef } from 'react';
import { cn } from '@myapp/utils';

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-5 sm:p-7',
  lg: 'p-7 sm:p-9',
};

/**
 * Neutral container for grouping related content on product and marketing
 * surfaces. It owns background, border, radius, and optional internal spacing
 * while intentionally avoiding decorative elevation.
 */
export const Surface = forwardRef(function Surface(
  { as: Component = 'div', padding = 'md', className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'rounded-surface border border-border bg-surface-elevated',
        paddingClasses[padding] || paddingClasses.md,
        className,
      )}
      {...props}
    />
  );
});

Surface.displayName = 'Surface';
