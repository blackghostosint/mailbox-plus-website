import type { Context } from '@netlify/functions';

export interface MockRequestOptions {
  url?: string;
  method?: string;
  headers?: Record<string, string> | Headers;
  clientIp?: string;
  body?: unknown;
  queryParams?: Record<string, string>;
}

/**
 * Helper utility to construct Web Standard Netlify v2 Request objects for integration testing.
 */
export function createMockNetlifyRequest(options: MockRequestOptions = {}): Request {
  const method = (options.method || 'GET').toUpperCase();
  let urlString = options.url || 'https://example.com/.netlify/functions/endpoint';

  if (options.queryParams) {
    const urlObj = new URL(urlString);
    for (const [key, value] of Object.entries(options.queryParams)) {
      urlObj.searchParams.set(key, value);
    }
    urlString = urlObj.toString();
  }

  const headersObj = new Headers(options.headers);

  const clientIp = options.clientIp || '127.0.0.1';
  if (!headersObj.has('x-nf-client-connection-ip')) {
    headersObj.set('x-nf-client-connection-ip', clientIp);
  }

  let bodyPayload: BodyInit | null = null;
  if (
    options.body !== undefined &&
    options.body !== null &&
    method !== 'GET' &&
    method !== 'HEAD'
  ) {
    if (typeof options.body === 'string') {
      bodyPayload = options.body;
    } else {
      bodyPayload = JSON.stringify(options.body);
    }
    if (!headersObj.has('content-type')) {
      headersObj.set('content-type', 'application/json');
    }
  }

  return new Request(urlString, {
    method,
    headers: headersObj,
    body: bodyPayload,
  });
}

/**
 * Helper utility to construct mock Netlify Context objects for integration testing.
 */
export function createMockNetlifyContext(overrides: Partial<Context> = {}): Context {
  const defaultContext: Context = {
    account: { id: 'mock-account-id' },
    cookies: {} as any,
    deploy: {
      context: 'production',
      id: 'mock-deploy-id',
      published: true,
    },
    flags: {} as any,
    geo: {
      city: 'Chardon',
      country: { code: 'US', name: 'United States' },
      subdivision: { code: 'OH', name: 'Ohio' },
      timezone: 'America/New_York',
    },
    ip: overrides.ip || '127.0.0.1',
    json: (input: unknown) =>
      new Response(JSON.stringify(input), {
        headers: { 'Content-Type': 'application/json' },
      }),
    log: () => {},
    next: (() => Promise.resolve(new Response())) as any,
    params: {},
    requestId: 'mock-request-id-12345',
    rewrite: (input: string | URL) => Promise.resolve(new Response(`Rewritten to ${input}`)),
    server: { region: 'us-east-1' },
    site: {
      id: 'mock-site-id',
      name: 'mailbox-plus-test',
      url: 'https://mailboxplusohio.com',
    },
    url: new URL('https://mailboxplusohio.com/.netlify/functions/endpoint'),
  };

  return {
    ...defaultContext,
    ...overrides,
  };
}
