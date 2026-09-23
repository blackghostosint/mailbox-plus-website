// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadRecaptchaScript, executeRecaptcha, resetRecaptchaLoader } from '../recaptcha-loader';

describe('recaptcha-loader module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    delete (window as unknown as { grecaptcha?: unknown }).grecaptcha;
    resetRecaptchaLoader();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetRecaptchaLoader();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('loadRecaptchaScript', () => {
    it('returns immediately if siteKey is empty', async () => {
      await loadRecaptchaScript('');
      expect(document.getElementById('recaptcha-v3-script')).toBeNull();
    });

    it('returns immediately if window.grecaptcha is already loaded', async () => {
      window.grecaptcha = {
        ready: (cb) => cb(),
        execute: vi.fn().mockResolvedValue('token'),
      };

      await loadRecaptchaScript('test-site-key');
      expect(document.getElementById('recaptcha-v3-script')).toBeNull();
    });

    it('creates script element and appends it to document head', async () => {
      const originalAppendChild = document.head.appendChild.bind(document.head);
      vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
        if (node instanceof HTMLElement && node.tagName === 'SCRIPT') {
          const script = node as HTMLScriptElement;
          if (script.src) {
            script.dataset.src = script.src;
            script.removeAttribute('src');
          }
        }
        return originalAppendChild(node);
      });

      const promise = loadRecaptchaScript('my-site-key');
      const script = document.getElementById('recaptcha-v3-script') as HTMLScriptElement | null;

      expect(script).not.toBeNull();
      expect(script?.dataset.src || script?.src).toContain('render=my-site-key');
      expect(script?.async).toBe(true);

      // Simulate script onload
      script?.dispatchEvent(new Event('load'));
      await promise;
    });

    it('handles script onerror event when loading new script', async () => {
      const promise = loadRecaptchaScript('my-site-key');
      const script = document.getElementById('recaptcha-v3-script') as HTMLScriptElement | null;

      script?.onerror?.(new Event('error'));
      await promise;
    });

    it('resolves immediately if window.grecaptcha exists right after script append', async () => {
      vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
        window.grecaptcha = {
          ready: (cb) => cb(),
          execute: vi.fn(),
        };
        return node;
      });

      await loadRecaptchaScript('my-site-key');
      expect(window.grecaptcha).toBeDefined();
    });

    it('deduplicates script loading for concurrent and sequential calls', async () => {
      const appendSpy = vi.spyOn(document.head, 'appendChild');

      const p1 = loadRecaptchaScript('site-key-1');
      const p2 = loadRecaptchaScript('site-key-1');

      expect(appendSpy).toHaveBeenCalledTimes(1);
      expect(document.querySelectorAll('#recaptcha-v3-script').length).toBe(1);

      const script = document.getElementById('recaptcha-v3-script');
      script?.dispatchEvent(new Event('load'));

      await Promise.all([p1, p2]);

      // Call again after load
      await loadRecaptchaScript('site-key-1');
      expect(document.querySelectorAll('#recaptcha-v3-script').length).toBe(1);
    });

    it('handles existingScript load event when window.grecaptcha is initially unset', async () => {
      const script = document.createElement('script');
      script.id = 'recaptcha-v3-script';
      document.head.appendChild(script);

      const promise = loadRecaptchaScript('my-site-key');
      script.dispatchEvent(new Event('load'));

      await promise;
    });

    it('handles existingScript error event when window.grecaptcha is initially unset', async () => {
      const script = document.createElement('script');
      script.id = 'recaptcha-v3-script';
      document.head.appendChild(script);

      const promise = loadRecaptchaScript('my-site-key');
      script.dispatchEvent(new Event('error'));

      await promise;
    });

    it('handles existingScript timeout fallback after 2000ms', async () => {
      vi.useFakeTimers();
      const script = document.createElement('script');
      script.id = 'recaptcha-v3-script';
      document.head.appendChild(script);

      const promise = loadRecaptchaScript('my-site-key');
      vi.advanceTimersByTime(2000);

      await promise;
    });
  });

  describe('executeRecaptcha', () => {
    it('returns empty string if siteKey is empty', async () => {
      const token = await executeRecaptcha('');
      expect(token).toBe('');
    });

    it('executes grecaptcha and resolves with token, using default action contact_us', async () => {
      const executeMock = vi.fn().mockResolvedValue('valid-token-123');
      window.grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: executeMock,
      };

      const token = await executeRecaptcha('my-site-key');
      expect(executeMock).toHaveBeenCalledWith('my-site-key', { action: 'contact_us' });
      expect(token).toBe('valid-token-123');
    });

    it('executes grecaptcha and resolves with token for explicit action', async () => {
      const executeMock = vi.fn().mockResolvedValue('valid-token-123');
      window.grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: executeMock,
      };

      const token = await executeRecaptcha('my-site-key', 'contact_form');
      expect(executeMock).toHaveBeenCalledWith('my-site-key', { action: 'contact_form' });
      expect(token).toBe('valid-token-123');
    });

    it('returns empty string when execute returns falsy token', async () => {
      window.grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: vi.fn().mockResolvedValue(''),
      };

      const token = await executeRecaptcha('my-site-key');
      expect(token).toBe('');
    });

    it('returns empty string when grecaptcha is missing execute function', async () => {
      window.grecaptcha = {
        ready: (cb: () => void) => cb(),
      } as unknown as typeof window.grecaptcha;

      const token = await executeRecaptcha('my-site-key');
      expect(token).toBe('');
    });

    it('returns empty string when grecaptcha.ready throws synchronously', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      window.grecaptcha = {
        ready: () => {
          throw new Error('Sync ready error');
        },
      } as unknown as typeof window.grecaptcha;

      const token = await executeRecaptcha('my-site-key');
      expect(token).toBe('');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('returns empty string when grecaptcha execution rejects', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      window.grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: vi.fn().mockRejectedValue(new Error('reCAPTCHA network error')),
      };

      const token = await executeRecaptcha('my-site-key');
      expect(token).toBe('');
      consoleSpy.mockRestore();
    });

    it('returns empty string when grecaptcha is missing after loading script', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Simulate script load with no window.grecaptcha set
      const executePromise = executeRecaptcha('my-site-key');
      const script = document.getElementById('recaptcha-v3-script');
      script?.dispatchEvent(new Event('load'));

      const token = await executePromise;
      expect(token).toBe('');
      consoleSpy.mockRestore();
    });

    it('returns empty string when loadRecaptchaScript throws error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.spyOn(document.head, 'appendChild').mockImplementationOnce(() => {
        throw new Error('Append failed');
      });

      const token = await executeRecaptcha('my-site-key');
      expect(token).toBe('');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
