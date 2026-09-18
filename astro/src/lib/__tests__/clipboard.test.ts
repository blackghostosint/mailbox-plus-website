// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { copyToClipboard, showToast } from '../clipboard';

describe('clipboard module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('showToast', () => {
    it('creates a toast notification and removes it after 2000ms', () => {
      showToast('Copied to clipboard!');
      const toast = document.querySelector('.copy-toast');
      expect(toast).not.toBeNull();
      expect(toast?.textContent).toBe('Copied to clipboard!');

      vi.advanceTimersByTime(2000);
      expect(document.querySelector('.copy-toast')).toBeNull();
    });

    it('replaces an existing toast notification if called again', () => {
      showToast('First toast');
      showToast('Second toast');

      const toasts = document.querySelectorAll('.copy-toast');
      expect(toasts.length).toBe(1);
      expect(toasts[0].textContent).toBe('Second toast');
    });
  });

  describe('copyToClipboard', () => {
    it('copies text using navigator.clipboard when available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      await copyToClipboard('Hello World');

      expect(writeTextMock).toHaveBeenCalledWith('Hello World');
      expect(document.querySelector('.copy-toast')?.textContent).toBe('Copied!');
    });

    it('falls back to execCommand when navigator.clipboard fails', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
        },
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      await copyToClipboard('Fallback Text');

      expect(execCommandMock).toHaveBeenCalledWith('copy');
      expect(document.querySelector('.copy-toast')?.textContent).toBe('Copied!');
    });

    it('handles execCommand failure gracefully', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      document.execCommand = vi.fn().mockImplementation(() => {
        throw new Error('execCommand unsupported');
      });

      await copyToClipboard('Failed Copy Text');

      expect(document.querySelector('.copy-toast')?.textContent).toBe('Failed to copy');
    });
  });
});
