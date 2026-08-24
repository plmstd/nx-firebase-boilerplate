import { forwardRef } from 'react';
import { cn } from '@myapp/utils';
import { InfoIcon, CheckIcon, WarningIcon, ErrorIcon } from '@myapp/icons';

const variantClasses = {
  default: 'border-border bg-surface-elevated text-text',
  success: 'border-success/20 bg-success-soft text-success-strong',
  warning: 'border-warning/30 bg-warning-soft text-warning-strong',
  error: 'border-error/20 bg-error-soft text-error-strong',
};

const iconMap = {
  default: InfoIcon,
  success: CheckIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

/**
 * Shared inline feedback surface with semantic status variants. Pass
 * `icon={null}` to omit the default icon or supply another icon component.
 */
export const Alert = forwardRef(function Alert(
  { className, variant = 'default', children, icon, ...props },
  ref,
) {
  const IconToRender =
    icon === undefined
      ? iconMap[variant] || iconMap.default
      : icon === null
        ? null
        : typeof icon === 'string'
          ? iconMap[icon] || iconMap.default
          : icon;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex items-center gap-2 rounded-surface border p-3 text-sm',
        variantClasses[variant] || variantClasses.default,
        className,
      )}
      {...props}
    >
      {IconToRender ? (
        <IconToRender className="text-[1.5em]" aria-hidden="true" />
      ) : null}
      {children}
    </div>
  );
});

Alert.displayName = 'Alert';
