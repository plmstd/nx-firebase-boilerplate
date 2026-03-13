import { cn } from '@myapp/utils';

export function Timeline({ items = [], className }) {
  return (
    <ol className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="relative pl-6">
          <span className="absolute left-0 top-2 size-2 rounded-full bg-primary" />
          <p className="text-sm font-medium text-text">{item.title}</p>
          {item.description ? <div className="text-sm text-text-muted">{item.description}</div> : null}
        </li>
      ))}
    </ol>
  );
}
