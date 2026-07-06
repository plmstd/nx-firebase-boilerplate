import { create } from 'zustand';

const closedState = { isOpen: false, modal: null };

function getCancelValue(modal) {
  if (!modal || !Object.hasOwn(modal, 'cancelValue')) {
    return null;
  }

  return modal.cancelValue;
}

function settle(modal, value) {
  modal?.resolve?.(value);
  return { isOpen: false, modal };
}

export const useModalStore = create((set) => ({
  isOpen: false,
  modal: null,
  open: (modal) => set({ isOpen: true, modal }),
  resolve: (value) => set((state) => settle(state.modal, value)),
  dismiss: () =>
    set((state) => settle(state.modal, getCancelValue(state.modal))),
  clear: () => set((state) => (state.isOpen ? state : closedState)),
}));
