// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';

describe('analytics.js', () => {
  beforeEach(() => {
    // Reset dataLayer without removing function definitions
    // @ts-ignore
    window.dataLayer = [];

    document.head.innerHTML = '';
    document.body.innerHTML = `
      <a id="test-btn" class="btn checkout-btn" data-tier="Gold" href="/checkout/">Buy Now</a>
      <a id="provider-link" href="https://ipostal1.com/signup">iPostal1</a>
    `;
  });

  it('initializes window.gtag and window.fbq and tracks element clicks', async () => {
    await import('../../public/js/analytics.js');

    // @ts-ignore
    expect(window.gtag).toBeDefined();
    // @ts-ignore
    expect(window.fbq).toBeDefined();

    // Trigger click on CTA
    const btn = document.getElementById('test-btn') as HTMLAnchorElement;
    btn.click();

    // Check dataLayer event pushes
    // @ts-ignore
    const dataLayer = window.dataLayer;
    expect(dataLayer.length).toBeGreaterThan(0);
  });

  it('tracks provider signup link clicks', async () => {
    await import('../../public/js/analytics.js');

    const providerLink = document.getElementById('provider-link') as HTMLAnchorElement;
    providerLink.click();

    // @ts-ignore
    const dataLayer = window.dataLayer;
    const providerEvent = dataLayer.find(
      (item: Record<number, unknown>) => item[0] === 'event' && item[1] === 'provider_signup_click'
    );
    expect(providerEvent).toBeDefined();
    expect(providerEvent[2].provider).toBe('ipostal1');
  });
});
