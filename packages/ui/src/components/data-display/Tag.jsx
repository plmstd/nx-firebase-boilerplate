import { cn } from '@myapp/utils';

export function Tag({ className, ...props }) {
  return <span className={cn('inline-flex items-center rounded-md border border-border bg-surface px-2 py-1 text-xs text-text', className)} {...props} />;
}
