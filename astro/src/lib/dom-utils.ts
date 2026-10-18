/**
 * Shared DOM utility functions.
 */

/**
 * Shared DOM ready helper to execute a callback when the DOM is interactive or complete.
 * If document is already loaded, executes callback immediately.
 * Otherwise, attaches a listener for DOMContentLoaded.
 */
export function onDOMReady(callback: () => void): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  }
}
