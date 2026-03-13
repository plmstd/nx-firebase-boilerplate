import { cn } from '@myapp/utils';

export function Radio({ className, ...props }) {
  return (
    <input
      type="radio"
      className={cn('size-4 border-border text-primary focus-visible:ring-2 focus-visible:ring-primary', className)}
      {...props}
    />
  );
}
