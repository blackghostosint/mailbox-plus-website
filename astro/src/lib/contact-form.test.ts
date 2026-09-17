// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initContactForms } from './contact-form';

describe('contact-form module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('submits form payload and displays success message on success', async () => {
    document.body.innerHTML = `
      <form name="contact" data-recaptcha-site-key="test-key">
        <input name="name" value="John Doe" />
        <input name="email" value="john@example.com" />
        <textarea name="message">Hello World</textarea>
        <button type="submit">Send</button>
      </form>
    `;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      })
    );

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    // Allow pending promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledWith(
      '/.netlify/functions/sendEmail',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"name":"John Doe"'),
      })
    );

    const statusEl = form.querySelector('[role="status"]');
    expect(statusEl).not.toBeNull();
    expect(statusEl?.textContent).toContain('Thank you! Your message has been sent.');
  });

  it('displays error message when sendEmail fails', async () => {
    document.body.innerHTML = `
      <form name="contact">
        <input name="name" value="Jane Doe" />
        <input name="email" value="jane@example.com" />
        <button type="submit">Submit</button>
      </form>
    `;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Invalid email address' }),
      })
    );

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 0));

    const alertEl = form.querySelector('[role="alert"]');
    expect(alertEl).not.toBeNull();
    expect(alertEl?.textContent).toBe('Invalid email address');
  });
});
