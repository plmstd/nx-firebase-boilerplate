import { create } from 'zustand';

const DEFAULT_DURATION = 5000;

let toastCounter = 0;

function createToastId() {
  toastCounter += 1;
  return `toast-${Date.now().toString(36)}-${toastCounter}`;
}

function normalizeToast(input, variant) {
  const options = typeof input === 'string' ? { message: input } : input || {};

  return {
    id: options.id || createToastId(),
    title: options.title,
    message: options.message,
    type: options.type || variant || 'default',
    duration:
      options.duration === undefined ? DEFAULT_DURATION : options.duration,
    status: 'open',
  };
}

export const useToastStore = create((set) => ({
  toasts: [],
  push: (input, variant) => {
    const toast = normalizeToast(input, variant);

    set((state) => ({
      toasts: [
        toast,
        ...state.toasts.filter((existingToast) => existingToast.id !== toast.id),
      ],
    }));

    return toast.id;
  },
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
