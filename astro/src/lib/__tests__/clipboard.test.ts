// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { showToast, copyToClipboard } from '../clipboard';

describe('clipboard module - ARIA live region decoration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('decorates newly created toast element with role="status", aria-live="polite", and aria-atomic="true"', () => {
    showToast('Copied!');

    const toast = document.querySelector<HTMLElement>('.copy-toast');
    expect(toast).not.toBeNull();
    expect(toast?.getAttribute('role')).toBe('status');
    expect(toast?.getAttribute('aria-live')).toBe('polite');
    expect(toast?.getAttribute('aria-atomic')).toBe('true');
    expect(toast?.textContent).toBe('Copied!');
  });

  it('removes existing toast and creates a new decorated toast when called multiple times', () => {
    showToast('First message');
    let toasts = document.querySelectorAll('.copy-toast');
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toBe('First message');

    showToast('Second message');
    toasts = document.querySelectorAll('.copy-toast');
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toBe('Second message');
    expect(toasts[0].getAttribute('role')).toBe('status');
    expect(toasts[0].getAttribute('aria-live')).toBe('polite');
    expect(toasts[0].getAttribute('aria-atomic')).toBe('true');
  });

  it('triggers showToast with ARIA live attributes when copyToClipboard succeeds', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    await copyToClipboard('https://example.com/test');

    expect(writeTextMock).toHaveBeenCalledWith('https://example.com/test');
    const toast = document.querySelector<HTMLElement>('.copy-toast');
    expect(toast).not.toBeNull();
    expect(toast?.getAttribute('role')).toBe('status');
    expect(toast?.getAttribute('aria-live')).toBe('polite');
    expect(toast?.getAttribute('aria-atomic')).toBe('true');
    expect(toast?.textContent).toBe('Copied!');
  });
});
