import { cn } from '@myapp/utils';

export function Breadcrumb({ items = [], separator = '/', className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.href ? <a href={item.href} className="hover:text-text">{item.label}</a> : <span className="text-text">{item.label}</span>}
            {index < items.length - 1 ? <span aria-hidden>{separator}</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
