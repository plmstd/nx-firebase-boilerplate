'use client';

import { useToastStore } from './toastStore';

/**
 * Shows a toast notification.
 *
 * @param {string | Object} options Toast message string or options object.
 * @param {string} [options.id] Optional stable id for caller-managed toasts.
 * @param {string} [options.title] Optional toast title.
 * @param {string} [options.message] Toast body copy.
 * @param {'default' | 'success' | 'warning' | 'error'} [options.type='default'] Visual status.
 * @param {number | null | false} [options.duration=5000] Auto-dismiss delay in ms. Use null or false to keep it open.
 * @returns {string} Toast id.
 */
export function show(options) {
  return useToastStore.getState().push(options, 'default');
}

/**
 * Shows an informational toast notification.
 *
 * @param {string | Object} options Toast message string or options object.
 * @returns {string} Toast id.
 */
export function info(options) {
  return useToastStore.getState().push(options, 'default');
}

/**
 * Shows a success toast notification.
 *
 * @param {string | Object} options Toast message string or options object.
 * @returns {string} Toast id.
 */
export function success(options) {
  return useToastStore.getState().push(options, 'success');
}

/**
 * Shows a warning toast notification.
 *
 * @param {string | Object} options Toast message string or options object.
 * @returns {string} Toast id.
 */
export function warning(options) {
  return useToastStore.getState().push(options, 'warning');
}

/**
 * Shows an error toast notification.
 *
 * @param {string | Object} options Toast message string or options object.
 * @returns {string} Toast id.
 */
export function error(options) {
  return useToastStore.getState().push(options, 'error');
}

/**
 * Starts the dismiss animation for a toast, or for all toasts when no id is passed.
 *
 * @param {string} [id] Toast id.
 */
export function dismiss(id) {
  useToastStore.getState().dismiss(id);
}

/**
 * Starts the dismiss animation for all current toasts.
 */
export function clear() {
  useToastStore.getState().clear();
}

export const toast = {
  show,
  info,
  success,
  warning,
  error,
  dismiss,
  clear,
};
