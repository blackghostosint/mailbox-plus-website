import { apiFetch } from './api-client';
import { renderFormError, clearFormError } from './dom-error';

export function initCheckoutButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.checkout-btn').forEach((btn) => {
    if (btn.hasAttribute('data-checkout-initialized')) return;
    btn.setAttribute('data-checkout-initialized', 'true');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const tier = btn.getAttribute('data-tier');
      if (!tier) return;

      clearFormError(btn.parentElement || btn, '[role="alert"].checkout-error');

      const originalText = btn.textContent || '';
      btn.textContent = 'Opening secure checkout…';
      btn.disabled = true;

      try {
        const data = await apiFetch<{ url?: string }>('/.netlify/functions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier }),
          timeout: 20000,
        });

        if (data && data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Checkout failed');
        }
      } catch (err: unknown) {
        console.error('Checkout error:', err);
        btn.textContent = originalText;
        btn.disabled = false;
        renderFormError(
          btn.parentElement || btn,
          'Sorry, we couldn’t open checkout. Please call us at 440-709-1946.',
          {
            button: btn,
            className:
              'checkout-error mt-2 p-3 text-xs text-red-800 bg-red-50 rounded-lg border border-red-200 focus:outline-none',
            selector: '[role="alert"].checkout-error',
          }
        );
      }
    });
  });
}
