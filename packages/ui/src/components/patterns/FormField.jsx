import { cn } from '@myapp/utils';

export function FormField({
  label,
  hint,
  error,
  required,
  children,
  className,
}) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {label && (
        <label className="text-sm font-medium text-text block">
          {label}
          {required ? <span className="ml-1 text-error">*</span> : null}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
