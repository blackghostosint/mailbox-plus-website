import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from '../sendEmail';
import { verifyRecaptchaToken } from '../lib/recaptcha';
import { createMockNetlifyRequest, createMockNetlifyContext } from './helpers/test-harness';

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

describe('sendEmail function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: 'test_resend_key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('handles OPTIONS preflight request and returns status 204 with CORS headers', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'OPTIONS',
      headers: {
        Origin: 'https://mailboxplusohio.com',
      },
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBeTruthy();
    expect(res.headers.get('Access-Control-Allow-Headers')).toBeTruthy();
  });

  it('returns status 405 for non-POST HTTP methods', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'GET',
      clientIp: `10.0.0.${ipCounter++}`,
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'Method not allowed' });
  });

  it('returns 400 if reCAPTCHA verification fails', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(false);

    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp: `10.0.0.${ipCounter++}`,
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        recaptchaToken: 'invalid_token',
      },
    });
    const ctx = createMockNetlifyContext();

    const response = await handler(req, ctx);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'reCAPTCHA verification failed' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 if email is missing or malformed', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    const ctx = createMockNetlifyContext();

    const reqMissingEmail = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp: `10.0.0.${ipCounter++}`,
      body: { name: 'John Doe', recaptchaToken: 'valid_token' },
    });
    const res1 = await handler(reqMissingEmail, ctx);
    expect(res1.status).toBe(400);
    expect(await res1.json()).toEqual({ error: 'Invalid email address' });

    const reqMalformedEmail = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp: `10.0.0.${ipCounter++}`,
      body: {
        name: 'John Doe',
        email: 'not-an-email',
        recaptchaToken: 'valid_token',
      },
    });
    const res2 = await handler(reqMalformedEmail, ctx);
    expect(res2.status).toBe(400);
    expect(await res2.json()).toEqual({ error: 'Invalid email address' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 if field type is non-string', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    const ctx = createMockNetlifyContext();

    const reqNonStringField = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp: `10.0.0.${ipCounter++}`,
      body: {
        recaptchaToken: 'valid_token',
        name: 12345,
        email: 'john@example.com',
      },
    });
    const res = await handler(reqNonStringField, ctx);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid name: must be a string' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 500 if RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    const ctx = createMockNetlifyContext();

    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp: `10.0.0.${ipCounter++}`,
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        recaptchaToken: 'valid_token',
      },
    });

    const response = await handler(req, ctx);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to send message' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('escapes user inputs in HTML email body and sends email successfully', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    mockSend.mockResolvedValue({ id: 'msg_123' });
    const ctx = createMockNetlifyContext();

    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp: `10.0.0.${ipCounter++}`,
      body: {
        recaptchaToken: 'valid_token',
        name: 'Jane <Script> & "Quote"',
        email: 'jane@example.com',
        phone: '123-456-7890 & <tag>',
        service: 'pack & ship',
        plan: 'gold <tier>',
        message: 'Hello <script>alert("XSS")</script> & world!',
      },
    });

    const response = await handler(req, ctx);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sendArgs = mockSend.mock.calls[0][0];

    expect(sendArgs.replyTo).toBe('jane@example.com');
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

  it('enforces rate limit of 5 requests per 10 minutes and returns 429 on 6th attempt', async () => {
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    mockSend.mockResolvedValue({ id: 'msg_123' });

    const clientIp = '203.0.113.77';

    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      const req = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/sendEmail',
        method: 'POST',
        clientIp,
        body: {
          recaptchaToken: 'valid_token',
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'Hello',
        },
      });
      const ctx = createMockNetlifyContext({ ip: clientIp });
      const res = await handler(req, ctx);
      expect(res.status).toBe(200);
    }

    // 6th request should be rate limited with status 429
    const req6 = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/sendEmail',
      method: 'POST',
      clientIp,
      body: {
        recaptchaToken: 'valid_token',
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello',
      },
    });
    const ctx6 = createMockNetlifyContext({ ip: clientIp });
    const res6 = await handler(req6, ctx6);

    expect(res6.status).toBe(429);
    expect(res6.headers.get('Retry-After')).toBeTruthy();
    expect(res6.headers.get('X-RateLimit-Limit')).toBe('5');
    expect(res6.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(res6.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(await res6.json()).toEqual({ error: 'Too many requests. Please try again later.' });
  });
});
