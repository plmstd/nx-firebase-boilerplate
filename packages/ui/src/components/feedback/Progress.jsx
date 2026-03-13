import { cn } from '@myapp/utils';

export function Progress({ className, value = 0, ...props }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-elevated', className)} {...props}>
      <div className="h-full bg-primary transition-[width]" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
