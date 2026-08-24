import { forwardRef } from 'react';
import { cn } from '@myapp/utils';

const variantClasses = {
  lead: 'text-lead',
  bodyLg: 'text-body-lg',
  body: 'text-body',
  bodySm: 'text-body-sm',
  caption: 'text-caption',
  inherit: 'text-inherit',
};

const toneClasses = {
  default: 'text-text',
  muted: 'text-text-muted',
  subtle: 'text-text-subtle',
  inverted: 'text-text-inverted',
  success: 'text-success-strong',
  warning: 'text-warning-strong',
  error: 'text-error-strong',
  inherit: 'text-inherit',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  inherit: '',
};

/**
 * Polymorphic body-text primitive with semantic size, tone, and weight
 * variants. Consumer classes are merged last so local overrides win.
 */
export const Text = forwardRef(function Text(
  {
    as: Component = 'p',
    variant = 'body',
    tone = 'default',
    weight = 'normal',
    className,
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        variantClasses[variant] || variantClasses.body,
        toneClasses[tone] || toneClasses.default,
        weightClasses[weight] || weightClasses.normal,
        className,
      )}
      {...props}
    />
  );
});

Text.displayName = 'Text';
