import { cn } from '@myapp/utils';

export function Stat({ label, value, helper, className }) {
  return (
    <div className={cn('rounded-lg border border-border bg-background p-4', className)}>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
      {helper ? <p className="mt-1 text-xs text-text-muted">{helper}</p> : null}
    </div>
  );
}
