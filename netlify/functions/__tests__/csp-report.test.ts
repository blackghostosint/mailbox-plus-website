import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from '../csp-report';

describe('csp-report function handler', () => {
  let ipCounter = 1;

  const createRequest = (method: string, body?: any, isRawBody = false) => {
    return new Request('https://example.com/.netlify/functions/csp-report', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Agent/1.0',
        'x-nf-client-connection-ip': `10.4.0.${ipCounter++}`,
      },
      ...(body !== undefined ? { body: isRawBody ? body : JSON.stringify(body) } : {}),
    });
  };

  it('returns status 405 for non-POST HTTP methods', async () => {
    const req = createRequest('GET');
    const res = await handler(req, {} as any);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'Method not allowed' });
  });

  it('handles nested csp-report payload and returns status 204', async () => {
    const nestedPayload = {
      'csp-report': {
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src',
        'blocked-uri': 'https://eval.com/malicious.js',
        'source-file': 'https://example.com/script.js',
        'line-number': 42,
      },
    };

    const req = createRequest('POST', nestedPayload);
    const res = await handler(req, {} as any);

    expect(res.status).toBe(204);
    expect(await res.text()).toBe('');
  });

  it('handles flat CSP report payload and returns status 204', async () => {
    const flatPayload = {
      documentUri: 'https://example.com/page',
      violatedDirective: 'style-src',
      blockedUri: 'https://cdn.com/bad.css',
      sourceFile: 'https://example.com/app.js',
      lineNumber: 10,
    };

    const req = createRequest('POST', flatPayload);
    const res = await handler(req, {} as any);

    expect(res.status).toBe(204);
    expect(await res.text()).toBe('');
  });

  it('returns status 400 for invalid JSON payload', async () => {
    const req = createRequest('POST', '{ malformed json: ', true);
    const res = await handler(req, {} as any);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Bad Request' });
  });
});
