import { forwardRef } from 'react';
import { cn } from '@myapp/utils';
import { Button } from './Button';

const squareSizeClasses = {
  sm: 'size-8 min-h-8 p-0',
  md: 'size-10 min-h-10 p-0',
  lg: 'size-12 min-h-12 p-0',
};

const iconSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

/**
 * Accessible square button for icon-only actions.
 *
 * @param {Object} props Component props.
 * @param {string} props.label Accessible action label.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] Control size.
 * @param {React.ReactNode} props.children Icon element rendered inside.
 * @returns {React.ReactElement} A shared icon-only button.
 */
export const IconButton = forwardRef(function IconButton(
  { label, size = 'md', className, children, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      size={size}
      className={cn(squareSizeClasses[size], className)}
      {...props}
    >
      <span
        className={cn(
          'flex items-center justify-center',
          iconSizeClasses[size],
        )}
        aria-hidden="true"
      >
        {children}
      </span>
    </Button>
  );
});

IconButton.displayName = 'IconButton';
