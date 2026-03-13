import { cn } from '@myapp/utils';

export function EmptyState({ title, description, action, className }) {
  return (
    <div className={cn('rounded-xl border border-dashed border-border bg-surface p-8 text-center', className)}>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description ? <div className="mt-2 text-sm text-text-muted">{description}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
