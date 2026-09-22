import { initAnalyticsStubs } from '../utils/hydration-helpers';

export interface PurchaseParams {
  transactionId?: string;
  transaction_id?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  content_name?: string;
  contentType?: string;
  content_type?: string;
  tier?: string;
  items?: Array<{ item_name?: string; item_id?: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

/**
 * Dispatches a Google Analytics 4 event via window.gtag.
 * Initializes queue stubs synchronously before pushing to dataLayer.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  initAnalyticsStubs(window);
  if (params) {
    window.gtag?.('event', eventName, params);
  } else {
    window.gtag?.('event', eventName);
  }
}

/**
 * Dispatches a Meta Pixel event via window.fbq.
 * Initializes queue stubs synchronously before queuing in fbq.queue.
 */
export function trackPixelEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  initAnalyticsStubs(window);
  if (params) {
    window.fbq?.('track', eventName, params);
  } else {
    window.fbq?.('track', eventName);
  }
}

/**
 * Dispatches formatted purchase conversions to both GA4 (gtag) and Meta Pixel (fbq) simultaneously.
 */
export function trackPurchase(params: PurchaseParams = {}): void {
  if (typeof window === 'undefined') return;

  const transactionId = params.transactionId || params.transaction_id;
  const value = typeof params.value === 'number' ? params.value : 0;
  const currency = params.currency || 'USD';
  const contentName = params.contentName || params.content_name || 'Mailbox Rental';
  const contentType = params.contentType || params.content_type || 'product';
  const tier = params.tier;

  const items = params.items || [
    {
      item_name: contentName,
      item_id: tier || contentName,
    },
  ];

  trackPixelEvent('Purchase', {
    value,
    currency,
    content_name: contentName,
    content_type: contentType,
  });

  const gtagPayload: Record<string, unknown> = {
    value,
    currency,
    items,
  };

  if (transactionId) {
    gtagPayload.transaction_id = transactionId;
  }

  trackEvent('purchase', gtagPayload);
}

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Initialize GA4 dataLayer, gtag & Meta Pixel stubs
  initAnalyticsStubs(window);
  window.gtag?.('js', new Date());

  // Timezone-gated GA4 page_view filter
  const tz =
    typeof Intl !== 'undefined' && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : null;
  const isNA = tz ? tz.startsWith('America/') || tz === 'Pacific/Honolulu' : false;
  window.gtag?.('config', 'G-W2J1KV96YJ', { send_page_view: isNA });

  if (typeof window.fbq === 'function') {
    window.fbq('init', '1684128789653811');
    trackPixelEvent('PageView');
  }

  // Lazy-load function
  let trackingSDKsLoaded = false;
  function loadTrackingSDKs(): void {
    if (trackingSDKsLoaded) return;
    trackingSDKsLoaded = true;

    const events = ['click', 'scroll', 'touchstart', 'mousemove', 'keydown'];
    events.forEach((e) => {
      window.removeEventListener(e, loadTrackingSDKs);
    });

    // Load GA4 SDK
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-W2J1KV96YJ';
    document.head.appendChild(gaScript);

    // Load Meta Pixel SDK
    const fbScript = document.createElement('script');
    fbScript.async = true;
    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(fbScript);
  }

  // Attach interaction listeners
  const interactionEvents = ['click', 'scroll', 'touchstart', 'mousemove', 'keydown'];
  interactionEvents.forEach((e) => {
    window.addEventListener(e, loadTrackingSDKs, { passive: true, once: true });
  });

  // Setup idle trigger
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(
      () => {
        loadTrackingSDKs();
      },
      { timeout: 2000 }
    );
  } else {
    window.setTimeout(loadTrackingSDKs, 2000);
  }

  // --- 1. Element click tracking ---
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest ? (target.closest('a[href], button') as HTMLElement | null) : null;
      if (!el || el.id === 'main-content') return;
      const href = el.getAttribute('href') || '';
      if (href.indexOf('#') === 0) return;
      const label = (
        el.getAttribute('data-cta') ||
        el.getAttribute('aria-label') ||
        el.textContent ||
        ''
      )
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 60);
      const page = window.location.pathname;
      const isExternal =
        href.indexOf('http') === 0 &&
        href.indexOf(window.location.hostname) === -1 &&
        href.indexOf('maps.google') === -1 &&
        href.indexOf('google.com/maps') === -1;

      trackEvent('element_click', {
        element_type: el.tagName.toLowerCase(),
        element_label: label,
        element_destination: href.slice(0, 120),
        is_external: isExternal,
        page_path: page,
      });

      if (el.matches('a.btn, .checkout-btn, a[href^="tel:"], a[href^="mailto:"]')) {
        trackEvent('cta_click', {
          cta_label: label,
          cta_tier: el.getAttribute('data-tier') || null,
          cta_destination: href.indexOf('#') === 0 ? 'pricing_section' : href,
          page_path: page,
        });
      }

      if (el.classList.contains('checkout-btn')) {
        trackPixelEvent('InitiateCheckout', {
          content_name: el.getAttribute('data-tier') || label,
        });
      }
    },
    false
  );

  // --- 2. Scroll depth ---
  const scrollThresholds: Record<number, boolean> = { 25: false, 50: false, 75: false, 90: false };
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        const doc = document.documentElement;
        const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
        const pct = Math.min(Math.round((window.scrollY / max) * 100), 100);
        for (const key in scrollThresholds) {
          const t = Number(key);
          if (!scrollThresholds[t] && pct >= t) {
            scrollThresholds[t] = true;
            trackEvent('scroll_depth', {
              percent_scrolled: t,
              page_path: window.location.pathname,
            });
          }
        }
      }, 250);
    },
    { passive: true }
  );

  // --- 3. Pricing section visibility ---
  let pricingSeen = false;
  function watchPricing(): void {
    const el = document.querySelector('#pricing');
    if (!el || pricingSeen || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !pricingSeen) {
            pricingSeen = true;
            obs.disconnect();
            trackEvent('pricing_view', { page_path: window.location.pathname });
          }
        });
      },
      { threshold: 0.3 }
    ).observe(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchPricing);
  } else {
    watchPricing();
  }

  // --- 4. Outbound provider sign-up clicks ---
  const PROVIDER_HOSTS = ['ipostal1.com', 'anytimemailbox.com', 'postscanmail.com'];
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest ? (target.closest('a[href]') as HTMLAnchorElement | null) : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.indexOf('http') !== 0) return;
      let host = '';
      try {
        host = new URL(href).hostname.replace(/^www\./, '');
      } catch {
        return;
      }
      let isProvider = false;
      for (let i = 0; i < PROVIDER_HOSTS.length; i++) {
        if (
          host === PROVIDER_HOSTS[i] ||
          host.indexOf('.' + PROVIDER_HOSTS[i]) === host.length - PROVIDER_HOSTS[i].length - 1
        ) {
          isProvider = true;
          break;
        }
      }
      if (!isProvider) return;
      const label = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      trackEvent('provider_signup_click', {
        provider:
          host.indexOf('ipostal1') !== -1
            ? 'ipostal1'
            : host.indexOf('anytimemailbox') !== -1
              ? 'anytime_mailbox'
              : 'postscan_mail',
        provider_url: href.slice(0, 120),
        link_label: label,
        page_path: window.location.pathname,
      });
    },
    false
  );
}
