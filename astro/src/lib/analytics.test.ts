// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initAnalytics } from './analytics';

describe('analytics module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete (window as unknown as { gtag?: unknown }).gtag;
    delete (window as unknown as { fbq?: unknown }).fbq;
    delete (window as unknown as { dataLayer?: unknown }).dataLayer;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes window.gtag and configures GA4 / Meta Pixel', () => {
    initAnalytics();

    expect(window.gtag).toBeDefined();
    expect(window.dataLayer).toBeDefined();
  });

  it('tracks CTA button click events', () => {
    initAnalytics();

    const cta = document.createElement('a');
    cta.className = 'btn checkout-btn';
    cta.href = '/checkout';
    cta.setAttribute('data-cta', 'Rent Mailbox');
    cta.setAttribute('data-tier', 'personal');
    cta.textContent = 'Rent Mailbox Now';
    document.body.appendChild(cta);

    const gtagSpy = vi.spyOn(window, 'gtag');

    cta.click();

    expect(gtagSpy).toHaveBeenCalledWith(
      'event',
      'element_click',
      expect.objectContaining({
        element_type: 'a',
        element_label: 'Rent Mailbox',
      })
    );

    expect(gtagSpy).toHaveBeenCalledWith(
      'event',
      'cta_click',
      expect.objectContaining({
        cta_label: 'Rent Mailbox',
        cta_tier: 'personal',
      })
    );
  });

  it('tracks provider signup outbound link clicks', () => {
    initAnalytics();

    const link = document.createElement('a');
    link.href = 'https://ipostal1.com/signup.php';
    link.textContent = 'Sign up on iPostal1';
    document.body.appendChild(link);

    const gtagSpy = vi.spyOn(window, 'gtag');

    link.click();

    expect(gtagSpy).toHaveBeenCalledWith(
      'event',
      'provider_signup_click',
      expect.objectContaining({
        provider: 'ipostal1',
        provider_url: 'https://ipostal1.com/signup.php',
      })
    );
  });
});
