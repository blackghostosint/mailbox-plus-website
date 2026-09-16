// Purchase event tracking: fires Meta Purchase + GA4 purchase ONCE per
// completed checkout session. Server-verified via /.netlify/functions/
// verify-session (accurate tier + amount from Stripe, no PII returned).
// Guard: sessionStorage flag prevents double-fire on page reloads.
(function () {
  var params = new URLSearchParams(window.location.search);
  var sessionId = params.get('session_id');
  if (!sessionId) return;

  var flag = 'purchase_fired_' + sessionId;
  try {
    if (sessionStorage.getItem(flag)) return;
  } catch {
    /* ignore storage errors */
  }

  fetch('/.netlify/functions/verify-session?session_id=' + encodeURIComponent(sessionId))
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(function (data) {
      if (!data || !data.ok) return;
      try {
        sessionStorage.setItem(flag, '1');
      } catch {
        /* ignore storage errors */
      }

      var value = typeof data.amount === 'number' ? data.amount : 0;
      var currency = data.currency || 'USD';
      var contentName = data.product || 'Mailbox Rental';

      // Meta pixel — Purchase
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          value: value,
          currency: currency,
          content_name: contentName,
          content_type: 'product',
        });
      }
      // GA4 — purchase (key event already registered in the property)
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: sessionId,
          value: value,
          currency: currency,
          items: [{ item_name: contentName, item_id: data.tier || contentName }],
        });
      }
    })
    .catch(function () {
      /* silent — tracking must never break the page */
    });
})();
