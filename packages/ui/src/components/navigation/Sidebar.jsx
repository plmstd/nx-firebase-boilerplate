import { cn } from '@myapp/utils';

export function Sidebar({ className, ...props }) {
  return <aside className={cn('h-full w-72 border-r border-border bg-surface p-4', className)} {...props} />;
}
