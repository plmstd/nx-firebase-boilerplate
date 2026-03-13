import { cn } from '@myapp/utils';

export function FilterBar({ className, ...props }) {
  return <div className={cn('flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3', className)} {...props} />;
}
