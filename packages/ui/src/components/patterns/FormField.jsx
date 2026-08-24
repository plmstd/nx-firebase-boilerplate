import { cn } from '@myapp/utils';
import { Label, Text } from '../typography';

/**
 * Composes a label, control, hint, and validation message without owning the
 * input component itself.
 */
export function FormField({
  label,
  labelFor,
  hint,
  error,
  required,
  children,
  className,
  labelClassName,
  hintClassName,
  errorClassName,
  ...props
}) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label ? (
        <Label htmlFor={labelFor} className={labelClassName}>
          {label}
          {required ? <span className="ml-1 text-error">*</span> : null}
        </Label>
      ) : null}
      {children}
      {error ? (
        <Text variant="caption" tone="error" className={errorClassName}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted" className={hintClassName}>
          {hint}
        </Text>
      ) : null}
    </div>
  );
}
