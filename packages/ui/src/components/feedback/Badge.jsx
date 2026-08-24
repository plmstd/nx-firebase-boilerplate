import { forwardRef } from 'react';
import { StatusDotIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';

const variantClasses = {
  neutral: 'border-border bg-surface text-text-muted',
  success: 'border-success/20 bg-success-soft text-success-strong',
  warning: 'border-warning/35 bg-warning-soft text-warning-strong',
  error: 'border-error/20 bg-error-soft text-error-strong',
};

const dotClasses = {
  neutral: 'text-text-subtle',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

/**
 * Compact, product-neutral semantic label for short states and metadata.
 */
export const Badge = forwardRef(function Badge(
  {
    as: Component = 'span',
    variant = 'neutral',
    dot = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex min-h-8 items-center gap-1.5 rounded-control border px-3 py-1 text-sm font-medium leading-none',
        variantClasses[variant] || variantClasses.neutral,
        className,
      )}
      {...props}
    >
      {dot ? (
        <StatusDotIcon
          className={cn('text-sm', dotClasses[variant] || dotClasses.neutral)}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </Component>
  );
});

Badge.displayName = 'Badge';
