import { cn } from '@myapp/utils';
import { InfoIcon, CheckIcon, WarningIcon, ErrorIcon } from '@myapp/icons';

const variantClasses = {
  default: 'bg-surface-elevated text-text',
  success: 'bg-success text-text-inverted',
  warning: 'bg-warning text-text',
  error: 'bg-error text-text-inverted',
};

const iconMap = {
  default: InfoIcon,
  success: CheckIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export function Alert({
  className,
  variant = 'default',
  children,
  icon,
  ...props
}) {
  let IconToRender = null;
  if (typeof icon === 'string') {
    IconToRender = iconMap[icon] || iconMap.default;
  }
  if (icon === undefined) {
    IconToRender = iconMap[variant] || iconMap.default;
  } else if (icon === null) {
    IconToRender = null;
  } else {
    IconToRender = icon;
  }

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg p-3 text-sm flex items-center gap-2',
        variantClasses[variant] || variantClasses.default,
        className,
      )}
      {...props}
    >
      {IconToRender && <IconToRender className={cn('text-[1.5em]')} />}
      {children}
    </div>
  );
}
