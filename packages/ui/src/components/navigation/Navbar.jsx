import { cn } from '@myapp/utils';

export function Navbar({ className, ...props }) {
  return (
    <header
      className={cn(
        'w-full border-b border-border bg-background px-4 py-3',
        className
      )}
      {...props}
    />
  );
}
