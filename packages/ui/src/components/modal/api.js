'use client';

import { useModalStore } from './modalStore';

/**
 * Opens a one-action alert modal.
 *
 * @param {Object} options Alert modal options.
 * @param {string} [options.title] Visible modal title.
 * @param {string} [options.message] Visible modal message.
 * @param {'default' | 'success' | 'warning' | 'error'} [options.type='default'] Visual status.
 * @param {string} [options.confirmText='Okay'] Confirm button label.
 * @param {string} [options.panelClassName] Optional class for the dialog panel.
 * @returns {Promise<void>} Resolves after the alert is confirmed or dismissed.
 */
export function alert({
  title,
  message,
  type = 'default',
  confirmText = 'Okay',
  panelClassName,
} = {}) {
  return new Promise((resolve) => {
    useModalStore.getState().open({
      window: 'alert',
      title,
      message,
      type,
      confirmText,
      panelClassName,
      cancelValue: undefined,
      resolve,
    });
  });
}

/**
 * Opens a confirmation modal.
 *
 * @param {Object} options Confirmation modal options.
 * @param {string} [options.title] Visible modal title.
 * @param {string} [options.message] Visible modal message.
 * @param {'default' | 'success' | 'warning' | 'error'} [options.type='warning'] Visual status.
 * @param {string} [options.confirmText='Confirm'] Confirm button label.
 * @param {string} [options.cancelText='Cancel'] Cancel button label.
 * @param {string} [options.panelClassName] Optional class for the dialog panel.
 * @returns {Promise<boolean>} Resolves with true on confirm and false on cancel or dismiss.
 */
export function confirm({
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  panelClassName,
} = {}) {
  return new Promise((resolve) => {
    useModalStore.getState().open({
      window: 'confirm',
      title,
      message,
      type,
      confirmText,
      cancelText,
      panelClassName,
      cancelValue: false,
      resolve,
    });
  });
}

/**
 * Opens a custom modal and resolves with whatever value the custom UI returns.
 *
 * @param {React.ReactNode | Function} content React content or a render function.
 * Render functions receive { resolve, dismiss, close } and may call resolve(value)
 * to return any custom value to the caller.
 * @param {Object | boolean} [options] Custom modal options, or a boolean showClose value.
 * @param {boolean} [options.showClose=true] Whether to show the default close button.
 * @param {string} [options.className] Optional class for the custom content wrapper.
 * @param {string} [options.panelClassName] Optional class for the dialog panel.
 * @param {*} [options.cancelValue=null] Value returned when dismissed without resolving.
 * @returns {Promise<*>} Resolves with the custom value or the cancel value.
 */
export function custom(content, options = {}) {
  const normalizedOptions =
    typeof options === 'boolean' ? { showClose: options } : options;

  return new Promise((resolve) => {
    useModalStore.getState().open({
      window: 'custom',
      content,
      showClose: normalizedOptions.showClose ?? true,
      className: normalizedOptions.className,
      panelClassName: normalizedOptions.panelClassName,
      cancelValue: normalizedOptions.cancelValue ?? null,
      resolve,
    });
  });
}

/**
 * Resolves and closes the current modal.
 *
 * @param {*} [value] Value returned to the active modal Promise.
 */
export function close(value) {
  useModalStore.getState().resolve(value);
}

export const modal = {
  alert,
  confirm,
  custom,
  close,
};
