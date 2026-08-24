'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  CheckCircleIcon,
  CloseIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
} from '@myapp/icons';
import { cn } from '@myapp/utils';
import { Button } from '../../primitives/Button';
import { IconButton } from '../../primitives/IconButton';
import { Text } from '../../typography/Text';
import { Spinner } from '../Spinner';
import { useToastStore } from './toastStore';

const iconMap = {
  default: InfoIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const iconClasses = {
  default: 'text-text-muted',
  info: 'text-text-muted',
  success: 'text-success',
  warning: 'text-warning-strong',
  error: 'text-error',
  loading: 'text-text-muted',
};

const progressClasses = {
  default: 'bg-text-muted',
  info: 'bg-text-muted',
  success: 'bg-success',
  warning: 'bg-warning-strong',
  error: 'bg-error',
};

function shouldAutoDismiss(duration) {
  return duration !== null && duration !== false && duration !== Infinity;
}

/**
 * One measured toast in the animated stack. It owns the remaining auto-close
 * time so hovering or focusing pauses the timer instead of resetting it.
 */
export function ToastItem({
  toast,
  index,
  count,
  visible,
  expanded,
  paused,
  offset,
  scale,
  onHeightChange,
}) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef(null);
  const remainingTime = useRef(toast.duration);
  const dismiss = useToastStore((state) => state.dismiss);
  const remove = useToastStore((state) => state.remove);
  const isClosing = toast.status === 'closing';
  const dismissible = toast.dismissible !== false;
  const primaryText = toast.title || toast.message;
  const description = toast.title ? toast.message : null;
  const Icon = iconMap[toast.type] || iconMap.default;
  const showsProgress =
    toast.type !== 'loading' && shouldAutoDismiss(toast.duration);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    const node = contentRef.current;

    if (!node) {
      return undefined;
    }

    function reportHeight() {
      onHeightChange(toast.id, Math.ceil(node.getBoundingClientRect().height));
    }

    reportHeight();

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(reportHeight);
    observer?.observe(node);

    return () => {
      observer?.disconnect();
      onHeightChange(toast.id, null);
    };
  }, [onHeightChange, toast.id]);

  useEffect(() => {
    remainingTime.current = toast.duration;
  }, [toast.duration, toast.revision]);

  useEffect(() => {
    if (
      paused ||
      isClosing ||
      !shouldAutoDismiss(toast.duration) ||
      remainingTime.current <= 0
    ) {
      return undefined;
    }

    const startedAt = Date.now();
    const timeout = window.setTimeout(() => {
      toast.onAutoClose?.(toast);
      dismiss(toast.id);
    }, remainingTime.current);

    return () => {
      window.clearTimeout(timeout);
      remainingTime.current = Math.max(
        0,
        remainingTime.current - (Date.now() - startedAt),
      );
    };
  }, [dismiss, isClosing, paused, toast, toast.duration, toast.id]);

  useEffect(() => {
    if (!isClosing) {
      return undefined;
    }

    const timeout = window.setTimeout(() => remove(toast.id), 220);
    return () => window.clearTimeout(timeout);
  }, [isClosing, remove, toast.id]);

  function handleDismiss() {
    if (!dismissible || isClosing) {
      return;
    }

    toast.onDismiss?.(toast);
    dismiss(toast.id);
  }

  function handleAction(event) {
    toast.action?.onClick?.(event);

    if (!event.defaultPrevented && toast.action?.dismiss !== false) {
      handleDismiss();
    }
  }

  return (
    <li
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-hidden={!visible}
      inert={!visible}
      tabIndex={visible ? 0 : -1}
      data-toast-id={toast.id}
      data-toast-type={toast.type}
      data-expanded={expanded}
      data-front={index === 0}
      className={cn(
        'group absolute inset-x-0 top-0 origin-top list-none transition-[transform,opacity] duration-300 ease-out focus-visible:outline-none motion-reduce:transition-opacity motion-reduce:duration-150',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      style={{
        zIndex: count - index,
        transform: `translate3d(0, ${offset}px, 0) scale(${scale})`,
      }}
    >
      <div
        ref={contentRef}
        className={cn(
          'relative flex min-h-16 w-full items-center gap-3 rounded-surface border border-t-0 border-border bg-background p-4 text-text shadow-toast transition-[transform,opacity,box-shadow] duration-200 ease-out group-focus-visible:ring-2 group-focus-visible:ring-focus group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:transition-opacity motion-reduce:duration-150',
          !mounted
            ? 'translate-x-6 scale-[0.98] opacity-0'
            : isClosing
              ? 'translate-x-0 scale-100 opacity-0'
              : 'translate-x-0 scale-100 opacity-100',
          toast.className,
        )}
        style={toast.style}
      >
        {toast.icon !== undefined ? (
          toast.icon
        ) : (
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center',
              iconClasses[toast.type] || iconClasses.default,
            )}
            aria-hidden="true"
          >
            {toast.type === 'loading' ? (
              <Spinner size="1rem" />
            ) : (
              <Icon className="text-[1.05rem]" />
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          {primaryText ? (
            <Text variant="bodySm" weight="medium">
              {primaryText}
            </Text>
          ) : null}
          {description ? (
            <Text variant="caption" tone="muted" className="mt-0.5">
              {description}
            </Text>
          ) : null}
        </div>

        {toast.action?.label ? (
          <Button
            size="sm"
            variant={toast.action.variant || 'secondary'}
            className={cn(
              'min-h-7 shrink-0 px-2 text-xs shadow-none',
              toast.action.className,
            )}
            style={toast.action.style}
            onClick={handleAction}
          >
            {toast.action.label}
          </Button>
        ) : null}

        {dismissible && toast.type !== 'loading' ? (
          <IconButton
            label="Close notification"
            size="sm"
            variant="secondary"
            className="absolute -left-2 -top-2 z-10 size-6 min-h-6 rounded-full bg-background p-0 text-text-muted opacity-100 shadow-control transition-opacity hover:bg-surface sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            onClick={handleDismiss}
          >
            <CloseIcon className="text-xs" aria-hidden="true" />
          </IconButton>
        ) : null}

        {showsProgress ? (
          <span
            aria-hidden="true"
            data-toast-progress-track
            className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-surface bg-surface-soft"
          >
            <span
              key={toast.revision}
              data-toast-progress
              className={cn(
                'block size-full origin-left will-change-transform',
                progressClasses[toast.type] || progressClasses.default,
              )}
              style={{
                animationName: 'toast-progress',
                animationDuration: `${toast.duration}ms`,
                animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                animationFillMode: 'forwards',
                animationPlayState: paused || isClosing ? 'paused' : 'running',
              }}
            />
          </span>
        ) : null}
      </div>
    </li>
  );
}
