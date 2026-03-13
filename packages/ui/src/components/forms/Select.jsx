import { cn } from '@myapp/utils';

export function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  );
}
