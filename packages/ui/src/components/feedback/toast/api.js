'use client';

import { useToastStore } from './toastStore';

function push(options, type) {
  return useToastStore.getState().push(options, type);
}

function resolvePreset(preset, value, fallbackTitle) {
  const resolved = typeof preset === 'function' ? preset(value) : preset;

  if (resolved === undefined) {
    return { title: fallbackTitle };
  }

  if (typeof resolved === 'string') {
    return { title: resolved };
  }

  return resolved || {};
}

/**
 * Shows a neutral toast. A string is rendered as the primary text; objects may
 * include title, message, duration, action, icon, dismissible, and callbacks.
 */
export function show(options) {
  return push(options, 'default');
}

/** Shows an informational toast. */
export function info(options) {
  return push(options, 'info');
}

/** Shows a success toast. */
export function success(options) {
  return push(options, 'success');
}

/** Shows a warning toast. */
export function warning(options) {
  return push(options, 'warning');
}

/** Shows an error toast. */
export function error(options) {
  return push(options, 'error');
}

/** Shows a persistent loading toast that can later be updated by id. */
export function loading(options = 'Loading…') {
  return push(options, 'loading');
}

/**
 * Updates an active toast without changing its position in the stack.
 *
 * @param {string} id Stable toast id returned by another toast call.
 * @param {string | Object} options Properties to merge into the toast.
 * @returns {string} The supplied toast id.
 */
export function update(id, options) {
  useToastStore.getState().update(id, options);
  return id;
}

/**
 * Tracks a Promise with one toast that transitions from loading to success or
 * error. Presets accept a string, an options object, or a result callback.
 *
 * @param {Promise | Function} operation Promise or function returning one.
 * @param {Object} states Loading, success, and error toast presets.
 * @returns {Promise} A Promise with the toast id exposed as `toastId`.
 */
export function promise(operation, states = {}) {
  const operationPromise =
    typeof operation === 'function' ? operation() : operation;
  const loadingOptions = resolvePreset(states.loading, undefined, 'Loading…');
  const id = loading({ ...loadingOptions, id: states.id });

  const trackedPromise = Promise.resolve(operationPromise).then(
    (value) => {
      success({
        message: null,
        ...resolvePreset(states.success, value, 'Completed'),
        id,
      });
      return value;
    },
    (reason) => {
      error({
        message: null,
        ...resolvePreset(states.error, reason, 'Something went wrong'),
        id,
      });
      throw reason;
    },
  );

  trackedPromise.toastId = id;
  return trackedPromise;
}

/** Starts the dismiss animation for one toast or all toasts. */
export function dismiss(id) {
  useToastStore.getState().dismiss(id);
}

/** Starts the dismiss animation for all current toasts. */
export function clear() {
  useToastStore.getState().clear();
}

export const toast = {
  show,
  info,
  success,
  warning,
  error,
  loading,
  update,
  promise,
  dismiss,
  clear,
};
