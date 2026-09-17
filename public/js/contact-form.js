(function () {
  const forms = document.querySelectorAll(
    'form[name="contact"], form[name="accessibility-barrier"]'
  );
  if (!forms.length) return;

  forms.forEach((form) => {
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

      // Clear any existing error messages
      const existingError = form.querySelector('[role="alert"]');
      if (existingError) {
        existingError.remove();
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      let recaptchaToken = '';
      if (recaptchaSiteKey && window.grecaptcha) {
        try {
          recaptchaToken = await new Promise((resolve) => {
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(recaptchaSiteKey, { action: 'contact_us' })
                .then(resolve)
                .catch(() => resolve(''));
            });
          });
        } catch (err) {
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
          const statusElement = form.querySelector('[role="status"]');
          if (statusElement) {
            statusElement.focus();
          }
        } else {
          const data = await res.json().catch(() => ({}));
          const errorMsg = data.error || 'Failed to send message. Please try again.';
          showError(form, submitBtn, errorMsg);
        }
      } catch (err) {
        console.error('Submission error:', err);
        showError(form, submitBtn, 'Network error. Please try again.');
      }
    });
  });

  function showError(form, submitBtn, message) {
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
})();
