import { cn } from '@myapp/utils';

const variantClasses = {
  primary:
    'bg-primary text-text-inverted hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-surface text-text border border-border hover:bg-surface-elevated',
  ghost: 'bg-transparent text-text hover:bg-surface-elevated',
  danger: 'bg-error text-text-inverted hover:opacity-90',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      {...props}
    />
  );
}
