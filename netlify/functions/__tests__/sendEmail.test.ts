import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock dependencies before importing handler
vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn().mockImplementation(() => {
    throw new Error('Blobs store disabled in test environment');
  }),
}));

vi.mock('../lib/recaptcha', () => ({
  verifyRecaptchaToken: vi.fn(),
}));

const mockSend = vi.fn();
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(function (this: any) {
      this.emails = {
        send: mockSend,
      };
    }),
  };
});

import { handler } from '../sendEmail';
import { verifyRecaptchaToken } from '../lib/recaptcha';

describe('sendEmail function handler', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: 'test_resend_key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns 400 if reCAPTCHA verification fails', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(false);

    const req = new Request('https://example.com/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'x-nf-client-connection-ip': '10.0.0.1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        recaptchaToken: 'invalid_token',
      }),
    });

    const response = await handler(req);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'reCAPTCHA verification failed' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 if email is missing or malformed', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);

    const reqMissingEmail = new Request('https://example.com/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'x-nf-client-connection-ip': '10.0.0.2',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'John Doe', recaptchaToken: 'valid_token' }),
    });
    const res1 = await handler(reqMissingEmail);
    expect(res1.status).toBe(400);
    expect(await res1.json()).toEqual({ error: 'Invalid email address' });

    const reqMalformedEmail = new Request('https://example.com/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'x-nf-client-connection-ip': '10.0.0.3',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'not-an-email',
        recaptchaToken: 'valid_token',
      }),
    });
    const res2 = await handler(reqMalformedEmail);
    expect(res2.status).toBe(400);
    expect(await res2.json()).toEqual({ error: 'Invalid email address' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 if field type is non-string', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);

    const reqNonStringField = new Request('https://example.com/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'x-nf-client-connection-ip': '10.0.0.4',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recaptchaToken: 'valid_token',
        name: 12345,
        email: 'john@example.com',
      }),
    });
    const res = await handler(reqNonStringField);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid name: must be a string' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 500 if RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);

    const req = new Request('https://example.com/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'x-nf-client-connection-ip': '10.0.0.5',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        recaptchaToken: 'valid_token',
      }),
    });

    const response = await handler(req);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to send message' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('escapes user inputs in HTML email body and sends email successfully', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    mockSend.mockResolvedValue({ id: 'msg_123' });

    const req = new Request('https://example.com/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'x-nf-client-connection-ip': '10.0.0.6',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recaptchaToken: 'valid_token',
        name: 'Jane <Script> & "Quote"',
        email: 'jane@example.com',
        phone: '123-456-7890 & <tag>',
        service: 'pack & ship',
        plan: 'gold <tier>',
        message: 'Hello <script>alert("XSS")</script> & world!',
      }),
    });

    const response = await handler(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sendArgs = mockSend.mock.calls[0][0];

    expect(sendArgs.reply_to).toBe('jane@example.com');
    expect(sendArgs.subject).toBe('New Contact Form Submission from Jane <Script> & "Quote"');

    // Verify HTML content has escaped HTML entities
    expect(sendArgs.html).toContain('Jane &lt;Script&gt; &amp; &quot;Quote&quot;');
    expect(sendArgs.html).toContain('123-456-7890 &amp; &lt;tag&gt;');
    expect(sendArgs.html).toContain('pack &amp; ship');
    expect(sendArgs.html).toContain('gold &lt;tier&gt;');
    expect(sendArgs.html).toContain(
      'Hello &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; world!'
    );

    // Verify text content preserves unescaped string
    expect(sendArgs.text).toContain('Hello <script>alert("XSS")</script> & world!');
  });
});
