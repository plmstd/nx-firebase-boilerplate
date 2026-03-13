import { cn } from '@myapp/utils';

const toneClasses = {
  default: 'border-border bg-surface text-text',
  success: 'border-success-accent bg-success text-text-inverted',
  warning: 'border-warning-accent bg-warning text-text',
  error: 'border-error-accent bg-error text-text-inverted',
};

export function Alert({ className, tone = 'default', ...props }) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-2 text-sm',
        toneClasses[tone] || toneClasses.default,
        className
      )}
      {...props}
    />
  );
}
