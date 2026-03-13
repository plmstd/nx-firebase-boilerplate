import { cn } from '@myapp/utils';

export function Banner({ className, ...props }) {
  return (
    <div
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text',
        className
      )}
      {...props}
    />
  );
}
