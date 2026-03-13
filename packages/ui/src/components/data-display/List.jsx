import { cn } from '@myapp/utils';

export function List({ className, ...props }) {
  return <ul className={cn('space-y-2 text-sm text-text', className)} {...props} />;
}
