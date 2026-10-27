import { renderFormError, clearFormError } from './dom-error';
import { ApiClientError } from './api-client';
import { announcePolite, announceAssertive } from './announcer';

export interface ActionConfig {
  /**
   * Target button associated with this action (for disabling and pending text restoration).
   */
  button?: HTMLButtonElement | null;
  /**
   * Pending text to display on the button while executing (e.g. "Sending message...").
   */
  pendingText?: string;
  /**
   * Parent container or form element for clearing and rendering errors.
   */
  container?: HTMLElement | null;
  /**
   * CSS selector for error elements. Defaults to '[role="alert"]'.
   */
  errorSelector?: string;
  /**
   * Custom CSS class name for rendered error alert element.
   */
  errorClassName?: string;
  /**
   * Element before which error alert should be inserted.
   */
  insertBefore?: HTMLElement | null;
  /**
   * Custom function to extract formatted error message string from thrown error.
   */
  // eslint-disable-next-line no-unused-vars
  getErrorMessage?: (error: unknown) => string;
}

export class ActionController {
  private config: ActionConfig;

  constructor(config: ActionConfig = {}) {
    this.config = config;
  }

  /**
   * Executes an async action with automated pending button state and error handling.
   */
  async run<T>(action: () => Promise<T>, overrides: ActionConfig = {}): Promise<T> {
    const button = overrides.button !== undefined ? overrides.button : this.config.button;
    const pendingText =
      overrides.pendingText !== undefined ? overrides.pendingText : this.config.pendingText;
    const container =
      overrides.container !== undefined
        ? overrides.container
        : this.config.container || (button ? button.form || button.parentElement : null);
    const errorSelector =
      overrides.errorSelector !== undefined
        ? overrides.errorSelector
        : this.config.errorSelector || '[role="alert"]';
    const errorClassName =
      overrides.errorClassName !== undefined
        ? overrides.errorClassName
        : this.config.errorClassName;
    const insertBefore =
      overrides.insertBefore !== undefined
        ? overrides.insertBefore
        : this.config.insertBefore || button;
    const getErrorMessage = overrides.getErrorMessage || this.config.getErrorMessage;

    if (container) {
      clearFormError(container, errorSelector);
    }

    let originalText = '';
    if (button) {
      originalText = button.textContent || '';
      if (pendingText) {
        button.textContent = pendingText;
        announcePolite(pendingText);
      }
      button.disabled = true;
    }

    try {
      const result = await action();
      return result;
    } catch (err: unknown) {
      let message = '';
      if (getErrorMessage) {
        message = getErrorMessage(err);
      } else if (err instanceof ApiClientError) {
        if (err.isTimeout) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message || 'Request failed. Please try again.';
        }
      } else if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err) || 'An error occurred. Please try again.';
      }

      const targetContainer = container || (button ? button.parentElement || button : null);

      if (targetContainer) {
        renderFormError(targetContainer, message, {
          button,
          className: errorClassName,
          selector: errorSelector,
          insertBefore: insertBefore || undefined,
        });
      }

      announceAssertive(message);

      throw err;
    } finally {
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }
    }
  }
}

/**
 * Functional helper to execute an action with ActionController.
 */
export async function executeAction<T>(
  action: () => Promise<T>,
  config: ActionConfig = {}
): Promise<T> {
  const controller = new ActionController(config);
  return controller.run(action);
}
