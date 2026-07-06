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
    <div className={cn('', className)}>
      {label && (
        <label className="text-sm font-medium text-text block mb-2">
          {label}
          {required ? <span className="ml-1 text-error">*</span> : null}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-error mt-2">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted mt-2">{hint}</p>
      ) : null}
    </div>
  );
}
