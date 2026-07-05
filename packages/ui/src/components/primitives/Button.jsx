import { cn } from '@myapp/utils';
import { Spinner } from '../feedback/Spinner';

const variantClasses = {
  primary:
    'bg-primary text-text-inverted hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-surface text-text border border-border hover:bg-surface-elevated',
  ghost: 'bg-transparent text-text hover:bg-surface-elevated',
  muted: 'bg-surface-elevated text-text-muted hover:bg-surface-soft',
};

const sizeClasses = {
  sm: 'py-1 min-h-8 px-3 text-xs rounded-lg font-medium',
  md: 'py-2 min-h-10 px-4 text-sm rounded-lg font-medium',
  lg: 'py-3 min-h-12 px-6 text-base rounded-lg font-medium',
};

export function Button({
  as: Component,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  align = 'justify-center',
  href,
  loading = false,
  children,
  icon,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:cursor-pointer',
    align,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || size || sizeClasses.md,
    className,
  );

  if (Component) {
    return (
      <Component href={href} className={classes} {...props}>
        {loading && <Spinner />}
        {icon && !loading && <span className="text-[1.2em]">{icon}</span>}
        {children}
      </Component>
    );
  }

  if (href) {
    const isExternal = href.startsWith('http');

    // use next / react-router link component for internal links
    if (!isExternal) {
      return (
        <a href={href} className={classes} {...props}>
          {loading && <Spinner />}
          {icon && !loading && <span className="text-[1.2em]">{icon}</span>}
          {children}
        </a>
      );
    }

    // use anchor tag for external links
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...props}
      >
        {loading && <Spinner />}
        {icon && !loading && <span className="text-[1.2em]">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={loading} {...props}>
      {loading && <Spinner />}
      {icon && !loading && <span className="text-[1.2em]">{icon}</span>}
      {children}
    </button>
  );
}
