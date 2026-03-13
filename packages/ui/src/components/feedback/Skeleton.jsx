import { cn } from '@myapp/utils';

export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-elevated', className)} {...props} />;
}
