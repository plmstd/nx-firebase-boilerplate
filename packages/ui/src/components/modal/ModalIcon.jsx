import { CheckIcon, ErrorIcon, InfoIcon, WarningIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';

const iconMap = {
  default: InfoIcon,
  success: CheckIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const toneClasses = {
  default: 'bg-surface-elevated text-text-muted p-1 rounded-full text-3xl',
  success: 'bg-success/20 p-1 rounded-full text-success text-2xl',
  warning: 'text-warning p-1 text-3xl',
  error: 'text-error bg-error/10 p-1 rounded-full text-3xl',
};

/**
 * Renders the status icon used by built-in modal variants.
 */
export function ModalIcon({ type = 'default', className }) {
  const Icon = iconMap[type] || iconMap.default;

  return (
    <span
      className={cn('', toneClasses[type] || toneClasses.default, className)}
    >
      <Icon className="" aria-hidden="true" />
    </span>
  );
}
