/* global module */
(function () {
  // Initialize GA4 dataLayer & gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag('js', new Date());

  // Timezone-gated GA4 page_view filter
  var tz =
    typeof Intl !== 'undefined' && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : null;
  var isNA = tz && (tz.startsWith('America/') || tz === 'Pacific/Honolulu');
  window.gtag('config', 'G-W2J1KV96YJ', { send_page_view: isNA });

  // Initialize Meta Pixel queue
  if (!window.fbq) {
    var n = (window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
  }
  window.fbq('init', '1684128789653811');
  window.fbq('track', 'PageView');

  // Lazy-load function
  var trackingSDKsLoaded = false;
  function loadTrackingSDKs() {
    if (trackingSDKsLoaded) return;
    trackingSDKsLoaded = true;

    // Remove interaction listeners
    var events = ['click', 'scroll', 'touchstart', 'mousemove', 'keydown'];
    events.forEach(function (e) {
      window.removeEventListener(e, loadTrackingSDKs, { passive: true });
    });

    // Load GA4 SDK
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-W2J1KV96YJ';
    document.head.appendChild(gaScript);

    // Load Meta Pixel SDK
    var fbScript = document.createElement('script');
    fbScript.async = true;
    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(fbScript);
  }

  // Attach interaction listeners
  var events = ['click', 'scroll', 'touchstart', 'mousemove', 'keydown'];
  events.forEach(function (e) {
    window.addEventListener(e, loadTrackingSDKs, { passive: true, once: true });
  });

  // Setup idle trigger
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      function () {
        loadTrackingSDKs();
      },
      { timeout: 2000 }
    );
  } else {
    window.setTimeout(loadTrackingSDKs, 2000);
  }

  // ============ Conversion & engagement events (GA4 + Meta Pixel) ============
  // gtag/fbq stubs are initialized above, so events called before SDK load
  // are queued in dataLayer/fbq.queue and flushed on SDK load. No loss.

  // --- 1. Element click tracking (delegated: ALL links + buttons, site-wide) ---
  // Excludes #main-content skip link and same-URL hash jumps to keep noise down.
  document.addEventListener(
    'click',
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('a[href], button') : null;
      if (!el || el.id === 'main-content') return;
      var href = el.getAttribute('href') || '';
      if (href.indexOf('#') === 0) return;
      var label = (
        el.getAttribute('data-cta') ||
        el.getAttribute('aria-label') ||
        el.textContent ||
        ''
      )
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 60);
      var page = window.location.pathname;
      var isExternal =
        href.indexOf('http') === 0 &&
        href.indexOf(window.location.hostname) === -1 &&
        href.indexOf('maps.google') === -1 &&
        href.indexOf('google.com/maps') === -1;
      // GA4 — every link/button click, with element context
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'element_click', {
          element_type: el.tagName.toLowerCase(),
          element_label: label,
          element_destination: href.slice(0, 120),
          is_external: isExternal,
          page_path: page,
        });
      }
      // Keep legacy cta_click for .btn/.checkout-btn continuity in GA4 reports
      if (
        typeof window.gtag === 'function' &&
        el.matches('a.btn, .checkout-btn, a[href^="tel:"], a[href^="mailto:"]')
      ) {
        window.gtag('event', 'cta_click', {
          cta_label: label,
          cta_tier: el.getAttribute('data-tier') || null,
          cta_destination: href.indexOf('#') === 0 ? 'pricing_section' : href,
          page_path: page,
        });
      }
      // Meta: only count intent-to-purchase clicks (tier checkout buttons), not pricing anchors
      if (typeof window.fbq === 'function' && el.classList.contains('checkout-btn')) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: el.getAttribute('data-tier') || label,
        });
      }
    },
    false
  );

  // --- 2. Scroll depth (GA4; 25/50/75/90, once per threshold per page) ---
  var scrollThresholds = { 25: false, 50: false, 75: false, 90: false };
  var scrollTimer = null;
  window.addEventListener(
    'scroll',
    function () {
      if (scrollTimer) return;
      scrollTimer = setTimeout(function () {
        scrollTimer = null;
        var doc = document.documentElement;
        var max = Math.max(doc.scrollHeight - window.innerHeight, 1);
        var pct = Math.min(Math.round((window.scrollY / max) * 100), 100);
        for (var t in scrollThresholds) {
          if (!scrollThresholds[t] && pct >= Number(t)) {
            scrollThresholds[t] = true;
            window.gtag('event', 'scroll_depth', {
              percent_scrolled: Number(t),
              page_path: window.location.pathname,
            });
          }
        }
      }, 250);
    },
    { passive: true }
  );

  // --- 3. Pricing section visibility (GA4; fires once when pricing enters viewport) ---
  var pricingSeen = false;
  function watchPricing() {
    var el = document.querySelector('#pricing');
    if (!el || pricingSeen || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !pricingSeen) {
            pricingSeen = true;
            obs.disconnect();
            window.gtag('event', 'pricing_view', { page_path: window.location.pathname });
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

  // --- 4. Outbound provider sign-up clicks (GA4; attributed affiliate links) ---
  var PROVIDER_HOSTS = ['ipostal1.com', 'anytimemailbox.com', 'postscanmail.com'];
  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('http') !== 0) return;
      var host = '';
      try {
        host = new URL(href).hostname.replace(/^www\./, '');
      } catch {
        return;
      }
      var isProvider = false;
      for (var i = 0; i < PROVIDER_HOSTS.length; i++) {
        if (
          host === PROVIDER_HOSTS[i] ||
          host.indexOf('.' + PROVIDER_HOSTS[i]) === host.length - PROVIDER_HOSTS[i].length - 1
        ) {
          isProvider = true;
          break;
        }
      }
      if (!isProvider) return;
      var label = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'provider_signup_click', {
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
      }
    },
    false
  );

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadTrackingSDKs };
  }
  if (typeof window !== 'undefined') {
    window.loadTrackingSDKs = loadTrackingSDKs;
  }
})();
