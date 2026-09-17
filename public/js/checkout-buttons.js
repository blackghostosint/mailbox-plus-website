/* global module */
(function () {
  function initCheckoutButtons() {
    document.querySelectorAll('.checkout-btn').forEach(function (btn) {
      if (btn.hasAttribute('data-checkout-initialized')) return;
      btn.setAttribute('data-checkout-initialized', 'true');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var tier = btn.getAttribute('data-tier');
        if (!tier) return;
        var original = btn.textContent;
        btn.textContent = 'Opening secure checkout…';
        btn.disabled = true;
        var controller = new AbortController();
        var timer = setTimeout(function () {
          controller.abort();
        }, 20000); // 20s guard so a slow function can't hang the button
        fetch('/.netlify/functions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: tier }),
          signal: controller.signal,
        })
          .then(function (r) {
            return r.json().then(function (d) {
              return { ok: r.ok, d: d };
            });
          })
          .then(function (res) {
            clearTimeout(timer);
            if (res.ok && res.d.url) {
              window.location.href = res.d.url;
            } else {
              throw new Error(res.d.error || 'Checkout failed');
            }
          })
          .catch(function (err) {
            clearTimeout(timer);
            console.error('Checkout error:', err);
            btn.textContent = original;
            btn.disabled = false;
            alert('Sorry, we couldn’t open checkout. Please call us at 440-709-1946.');
          });
      });
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCheckoutButtons);
    } else {
      initCheckoutButtons();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCheckoutButtons };
  }
  if (typeof window !== 'undefined') {
    window.initCheckoutButtons = initCheckoutButtons;
  }
})();
