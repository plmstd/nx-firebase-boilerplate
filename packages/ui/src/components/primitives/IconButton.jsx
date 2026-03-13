import { cn } from '@myapp/utils';

export function IconButton({ className, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-text transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}
