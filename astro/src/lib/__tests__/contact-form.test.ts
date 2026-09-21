// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initContactForms } from '../contact-form';

describe('contact-form module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    delete (window as unknown as { grecaptcha?: unknown }).grecaptcha;
    vi.restoreAllMocks();

    const originalAppendChild = document.head.appendChild.bind(document.head);
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLElement && node.tagName === 'SCRIPT') {
        const script = node as HTMLScriptElement;
        if (script.src) {
          script.dataset.src = script.src;
          script.removeAttribute('src');
        }
      }
      return originalAppendChild(node);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns early when no contact forms are present in the DOM', () => {
    document.body.innerHTML = '<div id="app">No forms here</div>';
    initContactForms();
    expect(document.querySelector('script#recaptcha-v3-script')).toBeNull();
  });

  it('marks forms with data-contact-initialized attribute and prevents duplicate initialization', () => {
    document.body.innerHTML = `
      <form name="contact">
        <button type="submit">Submit</button>
      </form>
    `;
    const form = document.querySelector('form')!;
    expect(form.hasAttribute('data-contact-initialized')).toBe(false);

    initContactForms();
    expect(form.getAttribute('data-contact-initialized')).toBe('true');

    // Calling initContactForms again should not throw or re-add duplicate listeners
    initContactForms();
    expect(form.getAttribute('data-contact-initialized')).toBe('true');
  });

  it('loads reCAPTCHA script tag when data-recaptcha-site-key is provided', () => {
    document.body.innerHTML = `
      <form name="contact" data-recaptcha-site-key="test-site-key">
        <button type="submit">Submit</button>
      </form>
    `;

    initContactForms();

    const script = document.getElementById('recaptcha-v3-script') as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script?.dataset.src || script?.src).toContain('render=test-site-key');
    expect(script?.async).toBe(true);

    // Ensure script isn't appended twice
    initContactForms();
    expect(document.querySelectorAll('#recaptcha-v3-script').length).toBe(1);
  });

  it('handles successful contact form submission with reCAPTCHA token', async () => {
    document.body.innerHTML = `
      <form name="contact" data-recaptcha-site-key="site-key-123">
        <input name="name" value="Jane Doe" />
        <input name="email" value="jane@example.com" />
        <input name="phone" value="555-0199" />
        <input name="service" value="Mailbox Rental" />
        <textarea name="message">Interested in a small mailbox.</textarea>
        <button type="submit">Send Message</button>
      </form>
    `;

    window.grecaptcha = {
      ready: (callback: () => void) => callback(),
      execute: vi.fn().mockResolvedValue('mocked-recaptcha-token'),
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form[name="contact"]')!;

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    // Wait for async handler
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(window.grecaptcha.execute).toHaveBeenCalledWith('site-key-123', {
      action: 'contact_us',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/.netlify/functions/sendEmail',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '555-0199',
          service: 'Mailbox Rental',
          message: 'Interested in a small mailbox.',
          url: null,
          barrier_description: null,
          preferred_contact: null,
          recaptchaToken: 'mocked-recaptcha-token',
        }),
      })
    );

    const statusEl = form.querySelector('[role="status"]');
    expect(statusEl).not.toBeNull();
    expect(statusEl?.textContent).toBe('Thank you! Your message has been sent.');
    expect(statusEl?.getAttribute('aria-live')).toBe('polite');
    expect(statusEl?.getAttribute('tabindex')).toBe('-1');
    expect(statusEl?.className).toBe(
      'p-6 text-center text-green-700 font-bold bg-green-50 rounded-xl border border-green-200 focus:outline-none'
    );
    expect(document.activeElement).toBe(statusEl);
  });

  it('handles accessibility-barrier form default service fallback and message mapping', async () => {
    document.body.innerHTML = `
      <form name="accessibility-barrier">
        <input name="name" value="John Smith" />
        <input name="email" value="john@example.com" />
        <input name="url" value="https://example.com/page" />
        <textarea name="barrier_description">Ramp access issue</textarea>
        <input name="preferred_contact" value="email" />
        <button type="submit">Report Barrier</button>
      </form>
    `;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form[name="accessibility-barrier"]')!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/.netlify/functions/sendEmail',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Smith',
          email: 'john@example.com',
          phone: null,
          service: 'Accessibility Barrier / Accommodation',
          message: 'Ramp access issue',
          url: 'https://example.com/page',
          barrier_description: 'Ramp access issue',
          preferred_contact: 'email',
          recaptchaToken: '',
        }),
      })
    );
  });

  it('renders error alert when API response returns non-200 HTTP status', async () => {
    document.body.innerHTML = `
      <form name="contact">
        <input name="name" value="Bad Request" />
        <input name="email" value="invalid-email" />
        <button type="submit">Send</button>
      </form>
    `;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid email address provided.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form')!;
    const submitBtn = form.querySelector<HTMLButtonElement>('button')!;

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await vi.waitFor(() => {
      expect(form.querySelector('[role="alert"]')).not.toBeNull();
    });

    const alertEl = form.querySelector('[role="alert"]');
    expect(alertEl?.textContent).toBe('Invalid email address provided.');
    expect(submitBtn.disabled).toBe(false);
  });

  it('renders network failure error alert when fetch rejects', async () => {
    document.body.innerHTML = `
      <form name="contact">
        <input name="name" value="Network Failure" />
        <button type="submit">Send</button>
      </form>
    `;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form')!;
    const submitBtn = form.querySelector<HTMLButtonElement>('button')!;

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await vi.waitFor(() => {
      expect(form.querySelector('[role="alert"]')).not.toBeNull();
    });

    const alertEl = form.querySelector('[role="alert"]');
    expect(alertEl?.textContent).toBe('Network error. Please try again.');
    expect(submitBtn.disabled).toBe(false);
    consoleErrorSpy.mockRestore();
  });

  it('removes existing role="alert" before submitting new request', async () => {
    document.body.innerHTML = `
      <form name="contact">
        <div role="alert">Old error</div>
        <button type="submit">Submit</button>
      </form>
    `;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(form.querySelectorAll('[role="alert"]').length).toBe(0);
  });

  it('handles reCAPTCHA execution error gracefully without stopping form submit', async () => {
    document.body.innerHTML = `
      <form name="contact" data-recaptcha-site-key="site-key-123">
        <input name="name" value="John" />
        <button type="submit">Submit</button>
      </form>
    `;

    window.grecaptcha = {
      ready: (callback: () => void) => callback(),
      execute: vi.fn().mockRejectedValue(new Error('reCAPTCHA failed')),
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    initContactForms();

    const form = document.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/.netlify/functions/sendEmail',
      expect.objectContaining({
        body: expect.stringContaining('"recaptchaToken":""'),
      })
    );
  });
});
