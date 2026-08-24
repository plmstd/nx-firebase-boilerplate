import { forwardRef } from 'react';
import { cn } from '@myapp/utils';

const headingVariantClasses = {
  display: 'text-display',
  h1: 'text-heading-1',
  h2: 'text-heading-2',
  h3: 'text-heading-3',
  h4: 'text-heading-4',
  h5: 'text-heading-5',
  h6: 'text-heading-6',
};

const defaultElements = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

/**
 * Polymorphic heading primitive that separates visual hierarchy from the
 * rendered HTML element. Consumer classes are merged last and override
 * conflicting utilities from the selected visual variant.
 */
export const Heading = forwardRef(function Heading(
  { as, variant = 'h2', className, ...props },
  ref,
) {
  const Component = as || defaultElements[variant] || 'h2';

  return (
    <Component
      ref={ref}
      className={cn(
        'font-heading font-semibold text-text',
        headingVariantClasses[variant] || headingVariantClasses.h2,
        className,
      )}
      {...props}
    />
  );
});

Heading.displayName = 'Heading';

function createHeadingComponent(variant, defaultElement, displayName) {
  const Component = forwardRef(function HeadingLevel(
    { as = defaultElement, className, ...props },
    ref,
  ) {
    return (
      <Heading
        ref={ref}
        as={as}
        variant={variant}
        className={className}
        {...props}
      />
    );
  });

  Component.displayName = displayName;
  return Component;
}

/** Visual H1 style, rendered as `h1` unless `as` is provided. */
export const H1 = createHeadingComponent('h1', 'h1', 'H1');

/** Visual H2 style, rendered as `h2` unless `as` is provided. */
export const H2 = createHeadingComponent('h2', 'h2', 'H2');

/** Visual H3 style, rendered as `h3` unless `as` is provided. */
export const H3 = createHeadingComponent('h3', 'h3', 'H3');

/** Visual H4 style, rendered as `h4` unless `as` is provided. */
export const H4 = createHeadingComponent('h4', 'h4', 'H4');

/** Visual H5 style, rendered as `h5` unless `as` is provided. */
export const H5 = createHeadingComponent('h5', 'h5', 'H5');

/** Visual H6 style, rendered as `h6` unless `as` is provided. */
export const H6 = createHeadingComponent('h6', 'h6', 'H6');
