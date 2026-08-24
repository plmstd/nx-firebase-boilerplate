import { forwardRef } from 'react';
import { cn } from '@myapp/utils';

const sizeClasses = {
  sm: 'text-caption',
  md: 'text-label',
  lg: 'text-body',
};

const toneClasses = {
  default: 'text-text',
  muted: 'text-text-muted',
  subtle: 'text-text-subtle',
  success: 'text-success-strong',
  warning: 'text-warning-strong',
  error: 'text-error-strong',
  inherit: 'text-inherit',
};

/**
 * Compact label primitive for form labels, metadata, and UI annotations. It
 * renders a native `label` by default and accepts another element via `as`.
 */
export const Label = forwardRef(function Label(
  {
    as: Component = 'label',
    size = 'md',
    tone = 'default',
    className,
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        sizeClasses[size] || sizeClasses.md,
        toneClasses[tone] || toneClasses.default,
        className,
      )}
      {...props}
    />
  );
});

Label.displayName = 'Label';
