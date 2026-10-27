import { apiFetch, ApiClientError } from './api-client';
import { SendEmailSuccessSchema, type SendEmailSuccess } from './contracts';
import { executeRecaptcha } from './recaptcha-loader';
import { executeAction } from './action-controller';
import { announcePolite } from './announcer';

export async function submitContactForm(payload: unknown): Promise<SendEmailSuccess> {
  const data = await apiFetch<unknown>('/.netlify/functions/sendEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return SendEmailSuccessSchema.parse(data);
}

export function initContactForms(): void {
  const forms = document.querySelectorAll<HTMLFormElement>(
    'form[name="contact"], form[name="accessibility-barrier"]'
  );
  if (!forms.length) return;

  forms.forEach((form) => {
    if (form.hasAttribute('data-contact-initialized')) return;
    form.setAttribute('data-contact-initialized', 'true');

    const recaptchaSiteKey = form.getAttribute('data-recaptcha-site-key') || '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

      try {
        await executeAction(
          async () => {
            const recaptchaToken = recaptchaSiteKey
              ? await executeRecaptcha(recaptchaSiteKey, 'contact_us')
              : '';

            const formData = new FormData(form);
            const formName = form.getAttribute('name') || '';
            const payload = {
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              service:
                formData.get('service') ||
                (formName === 'accessibility-barrier'
                  ? 'Accessibility Barrier / Accommodation'
                  : ''),
              message: formData.get('message') || formData.get('barrier_description') || '',
              url: formData.get('url'),
              barrier_description: formData.get('barrier_description'),
              preferred_contact: formData.get('preferred_contact'),
              recaptchaToken,
            };

            await submitContactForm(payload);

            const statusDiv = document.createElement('div');
            statusDiv.setAttribute('role', 'status');
            statusDiv.setAttribute('aria-live', 'polite');
            statusDiv.setAttribute('tabindex', '-1');
            statusDiv.className =
              'p-6 text-center text-green-700 font-bold bg-green-50 rounded-xl border border-green-200 focus:outline-none';
            statusDiv.textContent = 'Thank you! Your message has been sent.';

            form.replaceChildren(statusDiv);
            statusDiv.focus();
            announcePolite('Thank you! Your message has been sent.');
          },
          {
            button: submitBtn,
            pendingText: 'Sending message...',
            container: form,
            insertBefore: submitBtn,
            getErrorMessage: (err: unknown) => {
              let errorMsg = 'Network error. Please try again.';
              if (err instanceof ApiClientError) {
                if (err.isTimeout) {
                  errorMsg = 'Request timed out. Please try again.';
                } else if (err.status) {
                  errorMsg = err.message || 'Failed to send message. Please try again.';
                }
              } else if (err instanceof Error && err.message) {
                errorMsg = err.message;
              }
              return errorMsg;
            },
          }
        );
      } catch {
        // Handled by ActionController
      }
    });
  });
}
