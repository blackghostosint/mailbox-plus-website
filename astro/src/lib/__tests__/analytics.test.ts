// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAnalytics } from '../analytics';

// eslint-disable-next-line no-unused-vars
type ObserverCb = (...args: unknown[]) => void;
// eslint-disable-next-line no-unused-vars
type EventListenerFn = (...args: unknown[]) => void;

let lastMockIntersectionObserver: MockIntersectionObserver | null = null;

class MockIntersectionObserver {
  callback: ObserverCb;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(callback: ObserverCb) {
    this.callback = callback;
    lastMockIntersectionObserver = this;
  }

  trigger(entries: unknown[]) {
    this.callback(entries, this);
  }
}

describe('analytics module', () => {
  let activeEventListeners: Array<{
    target: EventTarget;
    type: string;
    listener: EventListenerFn;
    options?: boolean | unknown;
  }> = [];

  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Clear global window analytics properties
    delete (window as unknown as { dataLayer?: unknown }).dataLayer;
    delete (window as unknown as { gtag?: unknown }).gtag;
    delete (window as unknown as { fbq?: unknown }).fbq;
    delete (window as unknown as { _fbq?: unknown })._fbq;

    vi.useFakeTimers();
    vi.restoreAllMocks();

    lastMockIntersectionObserver = null;
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    // Track event listeners attached to document/window to clean them up between tests
    const originalDocAdd = document.addEventListener.bind(document);
    const originalWinAdd = window.addEventListener.bind(window);

    vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
      activeEventListeners.push({
        target: document,
        type,
        listener: listener as EventListenerFn,
        options,
      });
      originalDocAdd(type, listener, options);
    });

    vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
      activeEventListeners.push({
        target: window,
        type,
        listener: listener as EventListenerFn,
        options,
      });
      originalWinAdd(type, listener, options);
    });

    // Suppress happy-dom external script loading errors
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
  });

  afterEach(() => {
    activeEventListeners.forEach(({ target, type, listener, options }) => {
      target.removeEventListener(type, listener as unknown as () => void, options as boolean);
    });
    activeEventListeners = [];

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes dataLayer, gtag, and fbq stubs and tracks page view', () => {
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: 'America/New_York' }),
        }) as unknown as Intl.DateTimeFormat
    );

    initAnalytics();

    expect(window.dataLayer).toBeDefined();
    expect(typeof window.gtag).toBe('function');
    expect(typeof window.fbq).toBe('function');

    // Verify config call with send_page_view: true for America/New_York
    const gtagCalls = window.dataLayer as unknown[][];
    expect(gtagCalls.some((call) => call[0] === 'js')).toBe(true);
    expect(
      gtagCalls.some(
        (call) =>
          call[0] === 'config' &&
          call[1] === 'G-W2J1KV96YJ' &&
          (call[2] as { send_page_view?: boolean })?.send_page_view === true
      )
    ).toBe(true);

    // Verify fbq init & track PageView
    const fbqQueue = (window.fbq as unknown as { queue?: unknown[][] }).queue;
    expect(fbqQueue).toBeDefined();
    expect(fbqQueue?.some((call) => call[0] === 'init' && call[1] === '1684128789653811')).toBe(
      true
    );
    expect(fbqQueue?.some((call) => call[0] === 'track' && call[1] === 'PageView')).toBe(true);
  });

  it('sets send_page_view to false for non-North America timezones', () => {
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: 'Europe/London' }),
        }) as unknown as Intl.DateTimeFormat
    );

    initAnalytics();

    const gtagCalls = window.dataLayer as unknown[][];
    expect(
      gtagCalls.some(
        (call) =>
          call[0] === 'config' &&
          call[1] === 'G-W2J1KV96YJ' &&
          (call[2] as { send_page_view?: boolean })?.send_page_view === false
      )
    ).toBe(true);
  });

  it('lazy loads GA4 and Meta Pixel SDK scripts on user interaction or timer', () => {
    initAnalytics();

    expect(document.querySelector('script[data-src*="googletagmanager.com"]')).toBeNull();
    expect(document.querySelector('script[data-src*="connect.facebook.net"]')).toBeNull();

    // Trigger timer or requestIdleCallback fallback
    vi.advanceTimersByTime(2000);

    const gaScript = document.querySelector('script[data-src*="googletagmanager.com"]');
    const fbScript = document.querySelector('script[data-src*="connect.facebook.net"]');

    expect(gaScript).not.toBeNull();
    expect(fbScript).not.toBeNull();
  });

  it('tracks element clicks and CTA clicks', () => {
    initAnalytics();

    document.body.innerHTML = `
      <main id="main-content">
        <a id="btn-regular" href="/services/" data-cta="View Services">Our Services</a>
        <a id="btn-cta" class="btn" href="/contact-us/" data-cta="Contact Us Now">Get Started</a>
        <button id="btn-checkout" class="checkout-btn" data-tier="premium">Buy Premium</button>
      </main>
    `;

    const regularBtn = document.getElementById('btn-regular')!;
    const ctaBtn = document.getElementById('btn-cta')!;
    const checkoutBtn = document.getElementById('btn-checkout')!;

    // Click regular link
    regularBtn.click();

    let gtagCalls = window.dataLayer as unknown[][];
    expect(
      gtagCalls.some(
        (call) =>
          call[0] === 'event' &&
          call[1] === 'element_click' &&
          (call[2] as { element_label?: string })?.element_label === 'View Services'
      )
    ).toBe(true);

    // Click CTA link
    ctaBtn.click();

    gtagCalls = window.dataLayer as unknown[][];
    expect(
      gtagCalls.some(
        (call) =>
          call[0] === 'event' &&
          call[1] === 'cta_click' &&
          (call[2] as { cta_label?: string })?.cta_label === 'Contact Us Now'
      )
    ).toBe(true);

    // Click checkout button
    checkoutBtn.click();

    const fbqQueue = (window.fbq as unknown as { queue?: unknown[][] }).queue;
    expect(
      fbqQueue?.some(
        (call) =>
          call[0] === 'track' &&
          call[1] === 'InitiateCheckout' &&
          (call[2] as { content_name?: string })?.content_name === 'premium'
      )
    ).toBe(true);
  });

  it('ignores clicks on hash links and main-content element', () => {
    initAnalytics();

    document.body.innerHTML = `
      <a id="hash-link" href="#section">Jump</a>
      <a id="main-content" href="/services/">Main Content</a>
    `;

    const initialDataLayerLength = (window.dataLayer as unknown[]).length;

    document.getElementById('hash-link')?.click();
    document.getElementById('main-content')?.click();

    expect((window.dataLayer as unknown[]).length).toBe(initialDataLayerLength);
  });

  it('tracks scroll depth thresholds (25%, 50%, 75%, 90%)', () => {
    initAnalytics();

    // Mock document dimensions for scroll calculation
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });

    // Scroll to 50% (scrollY = 250 of max 500)
    Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    vi.advanceTimersByTime(300);

    const gtagCalls = window.dataLayer as unknown[][];
    expect(
      gtagCalls.some(
        (call) =>
          call[0] === 'event' &&
          call[1] === 'scroll_depth' &&
          (call[2] as { percent_scrolled?: number })?.percent_scrolled === 25
      )
    ).toBe(true);
    expect(
      gtagCalls.some(
        (call) =>
          call[0] === 'event' &&
          call[1] === 'scroll_depth' &&
          (call[2] as { percent_scrolled?: number })?.percent_scrolled === 50
      )
    ).toBe(true);
  });

  it('observes pricing section and dispatches pricing_view event when visible', () => {
    document.body.innerHTML = '<div id="pricing">Pricing Section</div>';

    initAnalytics();

    expect(lastMockIntersectionObserver).not.toBeNull();
    expect(lastMockIntersectionObserver?.observe).toHaveBeenCalledWith(
      document.querySelector('#pricing')
    );

    // Simulate element entering viewport
    lastMockIntersectionObserver?.trigger([{ isIntersecting: true } as IntersectionObserverEntry]);

    const gtagCalls = window.dataLayer as unknown[][];
    expect(gtagCalls.some((call) => call[0] === 'event' && call[1] === 'pricing_view')).toBe(true);
  });

  it('tracks outbound provider sign-up clicks', () => {
    initAnalytics();

    document.body.innerHTML = `
      <a id="provider-ipostal" href="https://ipostal1.com/signup.php">iPostal1 Sign Up</a>
      <a id="provider-anytime" href="https://www.anytimemailbox.com/pricing">Anytime Mailbox</a>
      <a id="provider-postscan" href="https://postscanmail.com/register">PostScan Mail</a>
      <a id="other-link" href="https://example.com/other">Other Site</a>
    `;

    document.getElementById('provider-ipostal')?.click();
    document.getElementById('provider-anytime')?.click();
    document.getElementById('provider-postscan')?.click();
    document.getElementById('other-link')?.click();

    const gtagCalls = window.dataLayer as unknown[][];
    const providerEvents = gtagCalls.filter(
      (call) => call[0] === 'event' && call[1] === 'provider_signup_click'
    );

    expect(providerEvents.length).toBe(3);
    expect((providerEvents[0][2] as { provider?: string }).provider).toBe('ipostal1');
    expect((providerEvents[1][2] as { provider?: string }).provider).toBe('anytime_mailbox');
    expect((providerEvents[2][2] as { provider?: string }).provider).toBe('postscan_mail');
  });
});
