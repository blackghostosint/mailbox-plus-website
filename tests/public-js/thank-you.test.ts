// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import thankYouMod from '../../public/js/thank-you.js';

describe('thank-you.js', () => {
  beforeEach(() => {
    sessionStorage.clear();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { search: '?session_id=cs_test_abc123' };

    // @ts-ignore
    window.gtag = vi.fn();
    // @ts-ignore
    window.fbq = vi.fn();
  });

  it('verifies session via API and fires purchase events once', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        amount: 29.99,
        currency: 'USD',
        product: 'Gold Tier Mailbox',
        tier: 'Gold',
      }),
    });

    thankYouMod.initThankYou();

    await vi.waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/.netlify/functions/verify-session?session_id=cs_test_abc123'
      );
      expect(sessionStorage.getItem('purchase_fired_cs_test_abc123')).toBe('1');
      expect(window.fbq).toHaveBeenCalledWith('track', 'Purchase', {
        value: 29.99,
        currency: 'USD',
        content_name: 'Gold Tier Mailbox',
        content_type: 'product',
      });
      expect(window.gtag).toHaveBeenCalledWith('event', 'purchase', {
        transaction_id: 'cs_test_abc123',
        value: 29.99,
        currency: 'USD',
        items: [{ item_name: 'Gold Tier Mailbox', item_id: 'Gold' }],
      });
    });
  });

  it('prevents double-firing if flag is already set in sessionStorage', () => {
    sessionStorage.setItem('purchase_fired_cs_test_abc123', '1');
    globalThis.fetch = vi.fn();

    thankYouMod.initThankYou();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
