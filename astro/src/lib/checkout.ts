export function initCheckoutButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.checkout-btn').forEach((btn) => {
    if (btn.hasAttribute('data-checkout-initialized')) return;
    btn.setAttribute('data-checkout-initialized', 'true');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const tier = btn.getAttribute('data-tier');
      if (!tier) return;

      const existingError = btn.parentElement?.querySelector('[role="alert"].checkout-error');
      if (existingError) existingError.remove();

      const originalText = btn.textContent || '';
      btn.textContent = 'Opening secure checkout…';
      btn.disabled = true;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      try {
        const res = await fetch('/.netlify/functions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (res.ok && data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Checkout failed');
        }
      } catch (err: unknown) {
        clearTimeout(timer);
        console.error('Checkout error:', err);
        btn.textContent = originalText;
        btn.disabled = false;
        showCheckoutError(btn, 'Sorry, we couldn’t open checkout. Please call us at 440-709-1946.');
      }
    });
  });
}

function showCheckoutError(btn: HTMLElement, message: string): void {
  const existingError = btn.parentElement?.querySelector('[role="alert"].checkout-error');
  if (existingError) {
    existingError.textContent = message;
    (existingError as HTMLElement).focus();
    return;
  }
  const errorDiv = document.createElement('div');
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');
  errorDiv.setAttribute('tabindex', '-1');
  errorDiv.className =
    'checkout-error mt-2 p-3 text-xs text-red-800 bg-red-50 rounded-lg border border-red-200 focus:outline-none';
  errorDiv.textContent = message;
  if (btn.parentElement) {
    btn.parentElement.appendChild(errorDiv);
  }
  errorDiv.focus();
}
