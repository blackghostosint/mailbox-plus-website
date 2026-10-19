// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initCheckoutButtons } from '../checkout';
import { siteConfig } from '../../config/siteConfig';

describe('checkout module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('marks checkout buttons with data-checkout-initialized and avoids duplicate handlers', () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="personal">Select Personal</button>
      </div>
    `;

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    expect(btn.hasAttribute('data-checkout-initialized')).toBe(false);

    initCheckoutButtons();
    expect(btn.getAttribute('data-checkout-initialized')).toBe('true');

    initCheckoutButtons();
    expect(btn.getAttribute('data-checkout-initialized')).toBe('true');
  });

  it('does nothing if button lacks data-tier attribute', () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn">No Tier Button</button>
      </div>
    `;

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toBe('No Tier Button');
  });

  it('handles successful checkout button click and redirects window.location', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="business">Subscribe Business</button>
      </div>
    `;

    const checkoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_12345';
    const mockLocation = { href: 'http://localhost:3000/' };
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
      configurable: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: checkoutUrl }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    expect(btn.textContent).toBe('Opening secure checkout…');
    expect(btn.disabled).toBe(true);

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(mockLocation.href).toBe(checkoutUrl);
    });

    expect(fetchMock).toHaveBeenCalledWith('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'business' }),
      signal: expect.any(AbortSignal),
    });
  });

  it('handles API failure and renders checkout error message with hotline number', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="premium">Subscribe Premium</button>
      </div>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid tier specified' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
    });

    expect(btn.textContent).toBe('Subscribe Premium');

    const errorEl = btn.parentElement?.querySelector('[role="alert"].checkout-error');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe(
      `Sorry, we couldn’t open checkout. Please call us at ${siteConfig.contact.phone}.`
    );

    consoleErrorSpy.mockRestore();
  });

  it('updates existing checkout error element when called multiple times', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="enterprise">Enterprise</button>
        <div role="alert" class="checkout-error">Previous error message</div>
      </div>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
    });

    const errorEls = btn.parentElement?.querySelectorAll('[role="alert"].checkout-error');
    expect(errorEls?.length).toBe(1);
    expect(errorEls?.[0].textContent).toBe(
      `Sorry, we couldn’t open checkout. Please call us at ${siteConfig.contact.phone}.`
    );

    consoleErrorSpy.mockRestore();
  });

  it('handles network error / timeout abort gracefully and restores button state', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="starter">Starter Plan</button>
      </div>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'));
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
    });

    expect(btn.textContent).toBe('Starter Plan');

    const errorEl = btn.parentElement?.querySelector('[role="alert"].checkout-error');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe(
      `Sorry, we couldn’t open checkout. Please call us at ${siteConfig.contact.phone}.`
    );

    consoleErrorSpy.mockRestore();
  });

  it('fetches reCAPTCHA token using executeRecaptcha and includes it in request when site key is present', async () => {
    vi.stubEnv('VITE_RECAPTCHA_SITE_KEY', 'test_site_key_123');

    (window as unknown as Record<string, unknown>).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: vi.fn().mockResolvedValue('mocked_checkout_recaptcha_token'),
    };

    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="small_mail_only">Subscribe</button>
      </div>
    `;

    const checkoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_999';
    const mockLocation = { href: 'http://localhost:3000/' };
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
      configurable: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: checkoutUrl }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': 'mocked_checkout_recaptcha_token',
      },
      body: JSON.stringify({
        tier: 'small_mail_only',
        recaptchaToken: 'mocked_checkout_recaptcha_token',
      }),
      signal: expect.any(AbortSignal),
    });

    vi.unstubAllEnvs();
  });

  it('blocks redirect, logs security error, and displays user alert when response contains an unapproved external origin', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="business_small">Subscribe</button>
      </div>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const maliciousUrl = 'https://attacker.com/phishing-checkout';
    const initialHref = 'http://localhost:3000/';
    const mockLocation = { href: initialHref };
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
      set: (val: string) => {
        mockLocation.href = val;
      },
      configurable: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: maliciousUrl }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
    });

    // Navigation must be cancelled and window.location.href unchanged
    expect(mockLocation.href).toBe(initialHref);

    // Localized user error alert must be displayed
    const errorEl = btn.parentElement?.querySelector('[role="alert"].checkout-error');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe(
      `Sorry, we couldn’t open checkout. Please call us at ${siteConfig.contact.phone}.`
    );

    consoleErrorSpy.mockRestore();
  });

  it('blocks redirect when URL uses non-HTTPS scheme such as javascript: or data:', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="business_large">Subscribe</button>
      </div>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dangerousUrl = 'javascript:alert("xss")';
    const initialHref = 'http://localhost:3000/';
    const mockLocation = { href: initialHref };
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
      set: (val: string) => {
        mockLocation.href = val;
      },
      configurable: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: dangerousUrl }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
    });

    expect(mockLocation.href).toBe(initialHref);
    const errorEl = btn.parentElement?.querySelector('[role="alert"].checkout-error');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toContain('Sorry, we couldn’t open checkout.');

    consoleErrorSpy.mockRestore();
  });

  it('blocks redirect when hostname attempts host spoofing (e.g. checkout.stripe.com.evil.com)', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="small_packages10">Subscribe</button>
      </div>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const spoofedUrl = 'https://checkout.stripe.com.evil.com/c/pay/cs_test_123';
    const initialHref = 'http://localhost:3000/';
    const mockLocation = { href: initialHref };
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
      set: (val: string) => {
        mockLocation.href = val;
      },
      configurable: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: spoofedUrl }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
    });

    expect(mockLocation.href).toBe(initialHref);
    const errorEl = btn.parentElement?.querySelector('[role="alert"].checkout-error');
    expect(errorEl).not.toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
