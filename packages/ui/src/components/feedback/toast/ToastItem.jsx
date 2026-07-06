'use client';

import { useEffect, useState } from 'react';
import {
  CheckIcon,
  CloseIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
} from '@myapp/icons';
import { cn } from '@myapp/utils';
import { useToastStore } from './toastStore';

const iconMap = {
  default: InfoIcon,
  success: CheckIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const iconClasses = {
  default: 'bg-surface-elevated text-text-muted',
  success: 'bg-success text-text-inverted',
  warning: 'bg-warning text-text',
  error: 'bg-error text-text-inverted',
};

const borderClasses = {
  default: 'border-border',
  success: 'border-success/30',
  warning: 'border-warning/40',
  error: 'border-error/30',
};

function shouldAutoDismiss(duration) {
  return duration !== null && duration !== false && duration !== Infinity;
}

/**
 * Individual toast notification with enter, close, and timed dismiss behavior.
 */
export function ToastItem({ toast }) {
  const [isVisible, setIsVisible] = useState(false);
  const dismiss = useToastStore((state) => state.dismiss);
  const remove = useToastStore((state) => state.remove);
  const Icon = iconMap[toast.type] || iconMap.default;
  const isClosing = toast.status === 'closing';

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isClosing || !shouldAutoDismiss(toast.duration)) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      dismiss(toast.id);
    }, toast.duration);

    return () => window.clearTimeout(timeout);
  }, [dismiss, isClosing, toast.duration, toast.id]);

  useEffect(() => {
    if (!isClosing) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      remove(toast.id);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [isClosing, remove, toast.id]);

  function handleTransitionEnd(event) {
    if (event.currentTarget !== event.target || !isClosing) {
      return;
    }

    remove(toast.id);
  }

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        'pointer-events-auto flex w-full gap-3 rounded-lg border bg-background p-4 text-text shadow-lg transition-all duration-200 ease-out',
        borderClasses[toast.type] || borderClasses.default,
        isVisible && !isClosing
          ? 'translate-x-0 opacity-100'
          : 'translate-x-4 opacity-0',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
          iconClasses[toast.type] || iconClasses.default,
        )}
      >
        <Icon className="text-lg" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className="text-sm font-semibold leading-5">{toast.title}</p>
        )}
        {toast.message && (
          <p
            className={cn(
              'text-sm leading-5 text-text-muted',
              toast.title && 'mt-1',
            )}
          >
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        onClick={() => dismiss(toast.id)}
      >
        <CloseIcon aria-hidden="true" />
        <span className="sr-only">Close notification</span>
      </button>
    </div>
  );
}
