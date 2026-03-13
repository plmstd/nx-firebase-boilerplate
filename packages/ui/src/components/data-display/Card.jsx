import { cn } from '@myapp/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background p-4 shadow-lg shadow-surface-elevated',
        className
      )}
      {...props}
    />
  );
}
