import { create } from 'zustand';

export const DEFAULT_TOAST_DURATION = 4500;

let toastCounter = 0;

function createToastId() {
  toastCounter += 1;
  return `toast-${Date.now().toString(36)}-${toastCounter}`;
}

function toOptions(input) {
  return typeof input === 'string' ? { message: input } : input || {};
}

function normalizeToast(input, variant, id, existingToast) {
  const options = toOptions(input);
  const type = options.type || variant || existingToast?.type || 'default';
  const durationWasProvided = options.duration !== undefined;

  const duration = durationWasProvided
    ? options.duration
    : type === 'loading'
      ? Infinity
      : existingToast?.type === 'loading'
        ? DEFAULT_TOAST_DURATION
        : (existingToast?.duration ?? DEFAULT_TOAST_DURATION);

  return {
    ...existingToast,
    id,
    title: options.title !== undefined ? options.title : existingToast?.title,
    message:
      options.message !== undefined ? options.message : existingToast?.message,
    type,
    duration,
    dismissible:
      options.dismissible !== undefined
        ? options.dismissible
        : (existingToast?.dismissible ?? true),
    action:
      options.action !== undefined ? options.action : existingToast?.action,
    icon: options.icon !== undefined ? options.icon : existingToast?.icon,
    className:
      options.className !== undefined
        ? options.className
        : existingToast?.className,
    style: options.style !== undefined ? options.style : existingToast?.style,
    onDismiss:
      options.onDismiss !== undefined
        ? options.onDismiss
        : existingToast?.onDismiss,
    onAutoClose:
      options.onAutoClose !== undefined
        ? options.onAutoClose
        : existingToast?.onAutoClose,
    status: 'open',
    revision: (existingToast?.revision || 0) + 1,
    updatedAt: Date.now(),
  };
}

function getToastId(input) {
  return toOptions(input).id || createToastId();
}

function upsertToast(toasts, input, variant, id) {
  const existingIndex = toasts.findIndex((toast) => toast.id === id);
  const existingToast = existingIndex >= 0 ? toasts[existingIndex] : undefined;
  const toast = normalizeToast(input, variant, id, existingToast);

  if (existingIndex >= 0) {
    return toasts.map((item, index) =>
      index === existingIndex ? toast : item,
    );
  }

  return [toast, ...toasts];
}

/** Shared toast state used by the imperative API and mounted provider. */
export const useToastStore = create((set) => ({
  toasts: [],
  push: (input, variant) => {
    const id = getToastId(input);

    set((state) => ({
      toasts: upsertToast(state.toasts, input, variant, id),
    }));

    return id;
  },
  update: (id, input) =>
    set((state) => {
      if (!state.toasts.some((toast) => toast.id === id)) {
        return state;
      }

      return {
        toasts: upsertToast(
          state.toasts,
          { ...toOptions(input), id },
          undefined,
          id,
        ),
      };
    }),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.map((toast) => {
        if (id && toast.id !== id) {
          return toast;
        }

        return { ...toast, status: 'closing' };
      }),
    })),
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clear: () =>
    set((state) => ({
      toasts: state.toasts.map((toast) => ({
        ...toast,
        status: 'closing',
      })),
    })),
}));
