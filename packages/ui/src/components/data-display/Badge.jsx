import { cn } from '@myapp/utils';

const toneClasses = {
  default: 'bg-surface-elevated text-text',
  success: 'bg-success text-text-inverted',
  warning: 'bg-warning text-text',
  error: 'bg-error text-text-inverted',
};

export function Badge({ className, tone = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone] || toneClasses.default,
        className
      )}
      {...props}
    />
  );
}
