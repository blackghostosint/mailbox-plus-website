export function initContactForms(): void {
  const forms = document.querySelectorAll<HTMLFormElement>(
    'form[name="contact"], form[name="accessibility-barrier"]'
  );
  if (!forms.length) return;

  forms.forEach((form) => {
    if (form.hasAttribute('data-contact-initialized')) return;
    form.setAttribute('data-contact-initialized', 'true');

    const recaptchaSiteKey = form.getAttribute('data-recaptcha-site-key') || '';

    if (
      recaptchaSiteKey &&
      typeof document !== 'undefined' &&
      !document.getElementById('recaptcha-v3-script')
    ) {
      const s = document.createElement('script');
      s.id = 'recaptcha-v3-script';
      s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`;
      s.async = true;
      document.head.appendChild(s);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const existingError = form.querySelector('[role="alert"]');
      if (existingError) {
        existingError.remove();
      }

      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      let recaptchaToken = '';
      if (recaptchaSiteKey && window.grecaptcha) {
        try {
          recaptchaToken = await new Promise<string>((resolve) => {
            window.grecaptcha?.ready(() => {
              window.grecaptcha
                ?.execute(recaptchaSiteKey, { action: 'contact_us' })
                .then(resolve)
                .catch(() => resolve(''));
            });
          });
        } catch (err: unknown) {
          console.error('reCAPTCHA execution error:', err);
        }
      }

      const formData = new FormData(form);
      const formName = form.getAttribute('name') || '';
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service:
          formData.get('service') ||
          (formName === 'accessibility-barrier' ? 'Accessibility Barrier / Accommodation' : ''),
        message: formData.get('message') || formData.get('barrier_description') || '',
        url: formData.get('url'),
        barrier_description: formData.get('barrier_description'),
        preferred_contact: formData.get('preferred_contact'),
        recaptchaToken,
      };

      try {
        const res = await fetch('/.netlify/functions/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          form.innerHTML =
            '<div role="status" aria-live="polite" tabindex="-1" class="p-6 text-center text-green-700 font-bold bg-green-50 rounded-xl border border-green-200 focus:outline-none">Thank you! Your message has been sent.</div>';
          const statusElement = form.querySelector<HTMLElement>('[role="status"]');
          if (statusElement) {
            statusElement.focus();
          }
        } else {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          const errorMsg = data.error || 'Failed to send message. Please try again.';
          showFormError(form, submitBtn, errorMsg);
        }
      } catch (err: unknown) {
        console.error('Submission error:', err);
        showFormError(form, submitBtn, 'Network error. Please try again.');
      }
    });
  });
}

function showFormError(
  form: HTMLFormElement,
  submitBtn: HTMLButtonElement | null,
  message: string
): void {
  const errorDiv = document.createElement('div');
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');
  errorDiv.setAttribute('tabindex', '-1');
  errorDiv.className =
    'p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-xl border border-red-200 focus:outline-none';
  errorDiv.textContent = message;

  if (submitBtn && submitBtn.parentNode) {
    submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
  } else {
    form.appendChild(errorDiv);
  }

  errorDiv.focus();
  if (submitBtn) submitBtn.disabled = false;
}
