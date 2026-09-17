// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import contactMod from '../../public/js/contact-form.js';

describe('contact-form.js', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = `
      <form name="contact" data-recaptcha-site-key="test-site-key">
        <input name="name" value="Jane Doe" />
        <input name="email" value="jane@example.com" />
        <input name="phone" value="555-1234" />
        <textarea name="message">Hello world</textarea>
        <button type="submit">Send</button>
      </form>
    `;

    // Mock grecaptcha v3
    // @ts-ignore
    window.grecaptcha = {
      ready: (cb: Function) => cb(),
      execute: vi.fn().mockResolvedValue('fake-recaptcha-token'),
    };
  });

  it('injects recaptcha script and sends POST request to sendEmail function', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    contactMod.initContactForms();

    // Check script tag inserted
    const script = document.getElementById('recaptcha-v3-script') as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.src).toContain('render=test-site-key');

    const form = document.querySelector('form[name="contact"]') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    await vi.waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/.netlify/functions/sendEmail',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '555-1234',
            service: '',
            message: 'Hello world',
            url: null,
            barrier_description: null,
            preferred_contact: null,
            recaptchaToken: 'fake-recaptcha-token',
          }),
        })
      );

      const statusEl = form.querySelector('[role="status"]');
      expect(statusEl).not.toBeNull();
      expect(statusEl?.textContent).toContain('Thank you! Your message has been sent.');
    });
  });

  it('renders alert message on submission error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid reCAPTCHA token' }),
    });

    contactMod.initContactForms();

    const form = document.querySelector('form[name="contact"]') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    await vi.waitFor(() => {
      const errorEl = form.querySelector('[role="alert"]');
      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent).toBe('Invalid reCAPTCHA token');
    });
  });
});
