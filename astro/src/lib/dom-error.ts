// Shared DOM Error Utility for accessible form and UI error rendering.

export interface RenderErrorOptions {
  /**
   * Optional button to re-enable upon rendering the error message.
   */
  button?: HTMLButtonElement | null;
  /**
   * Alias for button (for form submit button).
   */
  submitBtn?: HTMLButtonElement | null;
  /**
   * Element before which the error alert should be inserted (e.g. submit button).
   * If omitted or parentNode is missing, appends error to target container.
   */
  insertBefore?: HTMLElement | null;
  /**
   * CSS class name(s) for the error alert element.
   */
  className?: string;
  /**
   * CSS selector used to find an existing error alert element to update.
   * Defaults to '[role="alert"]'.
   */
  selector?: string;
}

/**
 * Renders or updates an accessible DOM error alert element with role="alert", aria-live="assertive", and tabindex="-1".
 */
export function renderFormError(
  target: HTMLElement,
  message: string,
  options: RenderErrorOptions = {}
): HTMLElement {
  const btn = options.button || options.submitBtn;
  const selector = options.selector || '[role="alert"]';

  // Find existing error element in target or inside target's parent if target is a button
  let errorEl = target.querySelector<HTMLElement>(selector);
  if (!errorEl && target.parentElement && target.tagName === 'BUTTON') {
    errorEl = target.parentElement.querySelector<HTMLElement>(selector);
  }

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.focus();
    if (btn) btn.disabled = false;
    return errorEl;
  }

  const errorDiv = document.createElement('div');
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');
  errorDiv.setAttribute('tabindex', '-1');

  const defaultClassName =
    'p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-xl border border-red-200 focus:outline-none';
  errorDiv.className = options.className || defaultClassName;
  errorDiv.textContent = message;

  const insertBefore = options.insertBefore !== undefined ? options.insertBefore : btn;

  if (insertBefore && insertBefore.parentNode) {
    insertBefore.parentNode.insertBefore(errorDiv, insertBefore);
  } else if (target.parentElement && target.tagName === 'BUTTON') {
    target.parentElement.appendChild(errorDiv);
  } else {
    target.appendChild(errorDiv);
  }

  errorDiv.focus();
  if (btn) btn.disabled = false;

  return errorDiv;
}

/**
 * Removes existing DOM error alert elements matching the specified selector.
 */
export function clearFormError(target: HTMLElement, selector = '[role="alert"]'): void {
  const existingError = target.querySelector(selector);
  if (existingError) {
    existingError.remove();
  }
}
