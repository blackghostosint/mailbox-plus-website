import { apiFetch } from './api-client';
import { siteConfig } from '../config/siteConfig';
import { CreateCheckoutSuccessSchema, type CreateCheckoutSuccess } from './contracts';
import { executeAction } from './action-controller';

export async function createCheckoutSession(tier: string): Promise<CreateCheckoutSuccess> {
  const data = await apiFetch<unknown>('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier }),
    timeout: 20000,
  });
  return CreateCheckoutSuccessSchema.parse(data);
}

export function initCheckoutButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.checkout-btn').forEach((btn) => {
    if (btn.hasAttribute('data-checkout-initialized')) return;
    btn.setAttribute('data-checkout-initialized', 'true');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const tier = btn.getAttribute('data-tier');
      if (!tier) return;

      try {
        await executeAction(
          async () => {
            const data = await createCheckoutSession(tier);
            if (data && data.url) {
              window.location.href = data.url;
            } else {
              throw new Error('Checkout failed');
            }
          },
          {
            button: btn,
            pendingText: 'Opening secure checkout…',
            container: btn.parentElement || btn,
            errorClassName:
              'checkout-error mt-2 p-3 text-xs text-red-800 bg-red-50 rounded-lg border border-red-200 focus:outline-none',
            errorSelector: '[role="alert"].checkout-error',
            getErrorMessage: () =>
              `Sorry, we couldn’t open checkout. Please call us at ${siteConfig.contact.phone}.`,
          }
        );
      } catch (err) {
        console.error('Checkout error:', err);
      }
    });
  });
}
