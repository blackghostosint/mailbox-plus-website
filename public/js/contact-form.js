(function () {
  const contactForm = document.querySelector('form[name="contact"]');
  if (!contactForm) return;

  const recaptchaSiteKey = contactForm.getAttribute('data-recaptcha-site-key') || '';

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

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
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

    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message'),
      recaptchaToken,
    };

    try {
      const res = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        contactForm.innerHTML =
          '<div class="p-6 text-center text-green-700 font-bold bg-green-50 rounded-xl border border-green-200">Thank you! Your message has been sent.</div>';
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to send message. Please try again.');
        if (submitBtn) submitBtn.disabled = false;
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Network error. Please try again.');
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
