'use client';

import { ToastItem } from './ToastItem';
import { ToastViewport } from './ToastViewport';
import { useToastStore } from './toastStore';

/**
 * Mounts the global toast surface used by the imperative toast API.
 */
export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </ToastViewport>
  );
}
