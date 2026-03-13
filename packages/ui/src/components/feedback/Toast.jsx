import { cn } from '@myapp/utils';

export function Toast({ className, ...props }) {
  return <div className={cn('rounded-lg border border-border bg-background p-3 text-sm text-text shadow-sm', className)} {...props} />;
}
