import { forwardRef } from 'react';
import { cn } from '@myapp/utils';
import { Spinner } from '../feedback/Spinner';

const variantClasses = {
  primary:
    'border border-primary bg-primary text-text-inverted shadow-control hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active',
  secondary:
    'border border-border-strong/25 bg-surface/50 text-text hover:border-border-strong/40 hover:bg-surface active:bg-surface-soft',
  ghost:
    'border border-transparent bg-transparent text-text hover:bg-surface active:bg-surface-soft',
  muted:
    'border border-transparent bg-surface-soft/70 text-text-muted hover:bg-surface-soft hover:text-text active:bg-border/60',
  danger:
    'border border-error bg-error text-text-inverted hover:border-error-strong hover:bg-error-strong active:border-error-strong active:bg-error-strong',
};

const sizeClasses = {
  sm: 'min-h-8 rounded-control px-4 py-1 text-xs font-medium',
  md: 'min-h-10 rounded-control px-5 py-2 text-sm font-medium',
  lg: 'min-h-11 rounded-control px-7 py-2 text-base font-medium',
};

/**
 * Shared action primitive with semantic variants and polymorphic rendering.
 * Consumer classes are merged last and override conflicting defaults.
 */
export const Button = forwardRef(function Button(
  {
    as,
    className,
    variant = 'primary',
    size = 'md',
    type = 'button',
    align = 'justify-center',
    href,
    loading = false,
    disabled = false,
    children,
    icon,
    ...props
  },
  ref,
) {
  const Component = as || (href ? 'a' : 'button');
  const isNativeButton = Component === 'button';
  const isDisabled = disabled || loading;
  const isExternal =
    Component === 'a' && typeof href === 'string' && href.startsWith('http');

  const componentProps = {
    ...(href ? { href } : {}),
    ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    ...props,
    ...(isNativeButton ? { type, disabled: isDisabled } : {}),
    ...(!isNativeButton && isDisabled
      ? { 'aria-disabled': true, tabIndex: -1 }
      : {}),
    'aria-busy': loading || undefined,
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex touch-manipulation select-none items-center gap-2 transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] active:duration-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:active:scale-100 motion-reduce:transform-none',
        align,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || size || sizeClasses.md,
        className,
      )}
      {...componentProps}
    >
      {loading ? <Spinner /> : null}
      {icon && !loading ? (
        <span className="text-[1.2em]" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </Component>
  );
});

Button.displayName = 'Button';
