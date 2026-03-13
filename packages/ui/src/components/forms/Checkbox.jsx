import { cn } from '@myapp/utils';

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn('size-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary', className)}
      {...props}
    />
  );
}
