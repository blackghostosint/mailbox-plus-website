// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { showToast, copyToClipboard } from '../clipboard';
import * as announcer from '../announcer';

describe('clipboard module - persistent live announcer integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = `
      <div class="sr-only" aria-hidden="false">
        <div id="live-announcer-polite" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>
    `;
    announcer.resetAnnouncer();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('delegates announcement to announcePolite and attaches aria-hidden="true" to visual toast', () => {
    const announceSpy = vi.spyOn(announcer, 'announcePolite');
    showToast('Copied!');

    expect(announceSpy).toHaveBeenCalledWith('Copied!');

    const toast = document.querySelector<HTMLElement>('.copy-toast');
    expect(toast).not.toBeNull();
    expect(toast?.getAttribute('aria-hidden')).toBe('true');
    expect(toast?.hasAttribute('role')).toBe(false);
    expect(toast?.hasAttribute('aria-live')).toBe(false);
    expect(toast?.hasAttribute('aria-atomic')).toBe(false);
    expect(toast?.textContent).toBe('Copied!');

    vi.advanceTimersByTime(50);
    expect(announcer.getPoliteElement()?.textContent).toBe('Copied!');
  });

  it('removes existing toast, creates a new aria-hidden toast, and triggers announcePolite when called multiple times', () => {
    const announceSpy = vi.spyOn(announcer, 'announcePolite');
    showToast('First message');
    let toasts = document.querySelectorAll('.copy-toast');
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toBe('First message');
    expect(announceSpy).toHaveBeenCalledWith('First message');

    showToast('Second message');
    toasts = document.querySelectorAll('.copy-toast');
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toBe('Second message');
    expect(toasts[0].getAttribute('aria-hidden')).toBe('true');
    expect(toasts[0].hasAttribute('role')).toBe(false);
    expect(toasts[0].hasAttribute('aria-live')).toBe(false);
    expect(toasts[0].hasAttribute('aria-atomic')).toBe(false);
    expect(announceSpy).toHaveBeenCalledWith('Second message');

    vi.advanceTimersByTime(50);
    expect(announcer.getPoliteElement()?.textContent).toBe('Second message');
  });

  it('triggers showToast with announcePolite and aria-hidden visual toast when copyToClipboard succeeds', async () => {
    const announceSpy = vi.spyOn(announcer, 'announcePolite');
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    await copyToClipboard('https://example.com/test');

    expect(writeTextMock).toHaveBeenCalledWith('https://example.com/test');
    expect(announceSpy).toHaveBeenCalledWith('Copied!');

    const toast = document.querySelector<HTMLElement>('.copy-toast');
    expect(toast).not.toBeNull();
    expect(toast?.getAttribute('aria-hidden')).toBe('true');
    expect(toast?.hasAttribute('role')).toBe(false);
    expect(toast?.hasAttribute('aria-live')).toBe(false);
    expect(toast?.hasAttribute('aria-atomic')).toBe(false);
    expect(toast?.textContent).toBe('Copied!');

    vi.advanceTimersByTime(50);
    expect(announcer.getPoliteElement()?.textContent).toBe('Copied!');
  });
});
