// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderFormError, clearFormError } from '../dom-error';

describe('dom-error module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders an accessible error alert element with required ARIA attributes', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <button type="submit">Submit</button>
      </form>
    `;

    const form = document.getElementById('test-form') as HTMLFormElement;
    const submitBtn = form.querySelector<HTMLButtonElement>('button')!;
    submitBtn.disabled = true;

    const alertEl = renderFormError(form, 'Please enter a valid email address.', {
      submitBtn,
      insertBefore: submitBtn,
    });

    expect(alertEl).not.toBeNull();
    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(alertEl.getAttribute('aria-live')).toBe('assertive');
    expect(alertEl.getAttribute('tabindex')).toBe('-1');
    expect(alertEl.textContent).toBe('Please enter a valid email address.');
    expect(submitBtn.disabled).toBe(false);
  });

  it('updates existing error element rather than creating a duplicate', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <div role="alert">First error message</div>
        <button type="submit">Submit</button>
      </form>
    `;

    const form = document.getElementById('test-form') as HTMLFormElement;

    const alertEl = renderFormError(form, 'Updated error message');

    const alerts = form.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(1);
    expect(alertEl.textContent).toBe('Updated error message');
  });

  it('supports custom selector and className options for checkout styling', () => {
    document.body.innerHTML = `
      <div id="checkout-container">
        <button class="checkout-btn" disabled>Checkout</button>
      </div>
    `;

    const container = document.getElementById('checkout-container') as HTMLElement;
    const btn = container.querySelector<HTMLButtonElement>('.checkout-btn')!;

    const alertEl = renderFormError(container, 'Checkout failed. Please try again.', {
      button: btn,
      className: 'checkout-error mt-2 p-3 text-xs text-red-800 bg-red-50 rounded-lg',
      selector: '[role="alert"].checkout-error',
    });

    expect(alertEl.classList.contains('checkout-error')).toBe(true);
    expect(alertEl.textContent).toBe('Checkout failed. Please try again.');
    expect(btn.disabled).toBe(false);
  });

  it('clearFormError removes existing error element from container', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <div role="alert">Existing error</div>
        <button type="submit">Submit</button>
      </form>
    `;

    const form = document.getElementById('test-form') as HTMLFormElement;
    expect(form.querySelector('[role="alert"]')).not.toBeNull();

    clearFormError(form);

    expect(form.querySelector('[role="alert"]')).toBeNull();
  });
});
