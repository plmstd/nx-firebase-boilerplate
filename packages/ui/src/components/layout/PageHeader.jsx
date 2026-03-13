import { cn } from '@myapp/utils';

export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <header className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h1 className="text-2xl font-semibold text-text">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
