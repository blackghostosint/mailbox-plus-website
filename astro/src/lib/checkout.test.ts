// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initCheckoutButtons } from './checkout';

describe('checkout module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('triggers checkout API call and displays error on failure', async () => {
    document.body.innerHTML = `
      <div>
        <button class="checkout-btn" data-tier="business">Subscribe Business</button>
      </div>
    `;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Payment provider unavailable' }),
      })
    );

    initCheckoutButtons();

    const btn = document.querySelector<HTMLButtonElement>('.checkout-btn')!;
    btn.click();

    // Allow pending promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledWith(
      '/.netlify/functions/create-checkout',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ tier: 'business' }),
      })
    );

    const errorEl = document.querySelector('[role="alert"].checkout-error');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toContain('Sorry, we couldn’t open checkout');
    expect(btn.disabled).toBe(false);
  });
});
