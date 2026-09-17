// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import checkoutMod from '../../public/js/checkout-buttons.js';

describe('checkout-buttons.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button class="checkout-btn" data-tier="Gold">Select Gold Tier</button>
    `;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { href: '' };
  });

  it('posts tier to create-checkout endpoint and redirects on success', async () => {
    const btn = document.querySelector('.checkout-btn') as HTMLButtonElement;

    // Mock fetch response
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_123' }),
    });

    checkoutMod.initCheckoutButtons();

    btn.click();

    expect(btn.textContent).toBe('Opening secure checkout…');
    expect(btn.disabled).toBe(true);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/.netlify/functions/create-checkout',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'Gold' }),
      })
    );

    // Wait for promise resolution
    await vi.waitFor(() => {
      expect(window.location.href).toBe('https://checkout.stripe.com/c/pay/cs_test_123');
    });
  });

  it('resets button text on API error', async () => {
    const btn = document.querySelector('.checkout-btn') as HTMLButtonElement;
    window.alert = vi.fn();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Payment service unavailable' }),
    });

    checkoutMod.initCheckoutButtons();
    btn.click();

    await vi.waitFor(() => {
      expect(btn.disabled).toBe(false);
      expect(btn.textContent).toBe('Select Gold Tier');
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
