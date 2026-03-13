import { cn } from '@myapp/utils';

export function Spinner({ className, ...props }) {
  return <div className={cn('size-5 animate-spin rounded-full border-2 border-border border-t-primary', className)} {...props} />;
}
