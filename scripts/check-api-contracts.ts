import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Define Interface for API Contract Diagnostics
interface ContractViolation {
  file: string;
  line?: number;
  endpoint: string;
  rule: string;
  details: string;
}

const ROOT_DIR = path.resolve(process.cwd());
const FUNCTIONS_DIR = path.join(ROOT_DIR, 'netlify', 'functions');

const violations: ContractViolation[] = [];

function addViolation(
  file: string,
  endpoint: string,
  rule: string,
  details: string,
  line?: number
) {
  violations.push({
    file,
    line,
    endpoint,
    rule,
    details,
  });
}

function findLineNumber(fileContent: string, pattern: RegExp | string): number | undefined {
  const lines = fileContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (typeof pattern === 'string' ? lines[i].includes(pattern) : pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return undefined;
}

async function checkApiContracts() {
  const startTime = Date.now();
  console.log('🔍 Starting Serverless API Endpoint Contract Verification...\n');

  // Set safe dummy env vars for contract verification if not provided
  process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'dummy_stripe_secret_key';
  process.env.GOOGLE_PLACES_API_KEY =
    process.env.GOOGLE_PLACES_API_KEY || 'dummy_google_places_api_key';
  process.env.RECAPTCHA_SECRET_KEY =
    process.env.RECAPTCHA_SECRET_KEY || 'dummy_recaptcha_secret_key';
  process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 'dummy_resend_api_key';

  // Intercept global fetch to guarantee deterministic, offline execution with zero external network traffic
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString =
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    let parsedUrl: URL | null = null;
    try {
      parsedUrl = new URL(urlString, 'http://localhost');
    } catch {
      // Fallback for relative or invalid URLs
    }

    const hostname = parsedUrl ? parsedUrl.hostname : '';
    const pathname = parsedUrl ? parsedUrl.pathname : '';

    // Mock Google Places API
    if (hostname === 'places.googleapis.com') {
      return new Response(
        JSON.stringify({
          rating: 4.9,
          userRatingCount: 128,
          reviews: [
            {
              authorAttribution: {
                displayName: 'Jane Doe',
                uri: 'https://maps.google.com/user/123',
              },
              rating: 5,
              text: { text: 'Great shipping and packing store!' },
              relativePublishTimeDescription: '2 weeks ago',
              publishTime: '2026-08-15T12:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mock Google reCAPTCHA Verification API
    if (
      (hostname === 'www.google.com' || hostname === 'google.com') &&
      pathname === '/recaptcha/api/siteverify'
    ) {
      return new Response(JSON.stringify({ success: true, score: 0.9 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mock Netlify Blobs API requests
    if (
      hostname === 'api.netlify.com' ||
      hostname === 'blobs.netlify.com' ||
      pathname.startsWith('/api/v1/blobs') ||
      pathname.includes('/blobs/')
    ) {
      return new Response(JSON.stringify({}), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(
      `Unexpected external network request during offline contract verification: ${urlString}`
    );
  }) as typeof fetch;

  const requiredFunctions = [
    { file: 'health.ts', endpoint: '/.netlify/functions/health' },
    {
      file: 'csp-report.ts',
      endpoint: '/.netlify/functions/csp-report',
      expectedPath: '/.netlify/functions/csp-report',
    },
    { file: 'create-checkout.ts', endpoint: '/.netlify/functions/create-checkout' },
    { file: 'reviews.ts', endpoint: '/api/reviews', expectedPath: '/api/reviews' },
    { file: 'sendEmail.ts', endpoint: '/.netlify/functions/sendEmail' },
    { file: 'verify-session.ts', endpoint: '/.netlify/functions/verify-session' },
  ];

  for (const fn of requiredFunctions) {
    const filePath = path.join(FUNCTIONS_DIR, fn.file);
    const relPath = path.relative(ROOT_DIR, filePath);

    if (!fs.existsSync(filePath)) {
      addViolation(
        relPath,
        fn.endpoint,
        'File Existence',
        `Serverless function file ${fn.file} does not exist.`
      );
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Static Contract Checks
    if (!content.includes('withCors')) {
      const line = findLineNumber(content, 'export default');
      addViolation(
        relPath,
        fn.endpoint,
        'CORS Wrapper',
        'Function does not wrap handler with withCors middleware.',
        line
      );
    }

    if (fn.expectedPath) {
      if (
        !content.includes(`path: '${fn.expectedPath}'`) &&
        !content.includes(`path: "${fn.expectedPath}"`)
      ) {
        const line = findLineNumber(content, 'export const config');
        addViolation(
          relPath,
          fn.endpoint,
          'Route Config Path',
          `Function missing expected route config path '${fn.expectedPath}'.`,
          line
        );
      }
    }

    // 2. Dynamic Contract Checks against exported handler
    try {
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl);
      const handler = mod.default;

      if (typeof handler !== 'function') {
        const line = findLineNumber(content, 'export default');
        addViolation(
          relPath,
          fn.endpoint,
          'Default Export',
          'Function default export is not a callable handler function.',
          line
        );
        continue;
      }

      // Check specific endpoint behaviors
      if (fn.file === 'health.ts') {
        // GET request
        const req = new Request('http://localhost/.netlify/functions/health', { method: 'GET' });
        const res: Response = await handler(req);

        if (res.status !== 200) {
          addViolation(
            relPath,
            fn.endpoint,
            'Status Code (GET)',
            `Expected status 200, got ${res.status}.`
          );
        }

        const json = await res
          .clone()
          .json()
          .catch(() => null);
        if (!json || json.status !== 'healthy' || !json.timestamp || !json.checks) {
          addViolation(
            relPath,
            fn.endpoint,
            'Response Schema',
            'Health response schema missing status, timestamp, or checks.'
          );
        }

        if (!res.headers.get('x-health-check') || !res.headers.get('cache-control')) {
          addViolation(
            relPath,
            fn.endpoint,
            'Mandatory Headers',
            'Health response missing X-Health-Check or Cache-Control header.'
          );
        }

        if (!res.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header',
            'Health response missing Access-Control-Allow-Origin header.'
          );
        }
      } else if (fn.file === 'csp-report.ts') {
        // GET request should be rejected (405 Method Not Allowed)
        const getReq = new Request('http://localhost/.netlify/functions/csp-report', {
          method: 'GET',
        });
        const getRes: Response = await handler(getReq);
        if (getRes.status !== 405) {
          addViolation(
            relPath,
            fn.endpoint,
            'HTTP Method Enforcement',
            `GET request should return status 405, got ${getRes.status}.`
          );
        }

        // Invalid POST request body should return 400 Bad Request
        const badPostReq = new Request('http://localhost/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid-json{',
        });
        const badPostRes: Response = await handler(badPostReq);
        if (badPostRes.status !== 400) {
          addViolation(
            relPath,
            fn.endpoint,
            'Request Body Validation',
            `Malformed POST body should return status 400, got ${badPostRes.status}.`
          );
        }

        // Valid POST request should return 204 No Content
        const validPostReq = new Request('http://localhost/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'csp-report': {
              'document-uri': 'http://example.com',
              'violated-directive': 'script-src',
            },
          }),
        });
        const validPostRes: Response = await handler(validPostReq);
        if (validPostRes.status !== 204) {
          addViolation(
            relPath,
            fn.endpoint,
            'Status Code (POST)',
            `Valid CSP report POST should return status 204, got ${validPostRes.status}.`
          );
        }

        if (!validPostRes.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header',
            'CSP report response missing Access-Control-Allow-Origin header.'
          );
        }
      } else if (fn.file === 'create-checkout.ts') {
        // GET request should be rejected (405 Method Not Allowed)
        const getReq = new Request('http://localhost/.netlify/functions/create-checkout', {
          method: 'GET',
        });
        const getRes: Response = await handler(getReq);
        if (getRes.status !== 405) {
          addViolation(
            relPath,
            fn.endpoint,
            'HTTP Method Enforcement',
            `GET request should return status 405, got ${getRes.status}.`
          );
        }

        // POST request with missing or invalid tier should return 400 Bad Request
        const badPostReq = new Request('http://localhost/.netlify/functions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: 'invalid_tier_name' }),
        });
        const badPostRes: Response = await handler(badPostReq);
        if (badPostRes.status !== 400) {
          addViolation(
            relPath,
            fn.endpoint,
            'Request Body Validation',
            `Invalid tier name in POST should return status 400, got ${badPostRes.status}.`
          );
        }

        if (!badPostRes.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header',
            'Create checkout response missing Access-Control-Allow-Origin header.'
          );
        }
      } else if (fn.file === 'reviews.ts') {
        // GET request
        const getReq = new Request('http://localhost/api/reviews', { method: 'GET' });
        const getRes: Response = await handler(getReq);

        if (getRes.status !== 200) {
          addViolation(
            relPath,
            fn.endpoint,
            'Status Code (GET)',
            `Expected status 200, got ${getRes.status}.`
          );
        }

        const json = await getRes
          .clone()
          .json()
          .catch(() => null);
        if (
          !json ||
          typeof json.rating !== 'number' ||
          typeof json.userRatingCount !== 'number' ||
          !Array.isArray(json.reviews)
        ) {
          addViolation(
            relPath,
            fn.endpoint,
            'Response Schema',
            'Reviews response missing rating, userRatingCount, or reviews array.'
          );
        }

        if (!getRes.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header',
            'Reviews response missing Access-Control-Allow-Origin header.'
          );
        }
      } else if (fn.file === 'sendEmail.ts') {
        // GET request should return 405
        const getReq = new Request('http://localhost/.netlify/functions/sendEmail', {
          method: 'GET',
        });
        const getRes: Response = await handler(getReq);
        if (getRes.status !== 405) {
          addViolation(
            relPath,
            fn.endpoint,
            'HTTP Method Enforcement',
            `GET request should return status 405, got ${getRes.status}.`
          );
        }

        // Invalid reCAPTCHA / missing email should return 400
        const badPostReq = new Request('http://localhost/.netlify/functions/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recaptchaToken: 'dummy', email: 'not-an-email' }),
        });
        const badPostRes: Response = await handler(badPostReq);
        if (badPostRes.status !== 400) {
          addViolation(
            relPath,
            fn.endpoint,
            'Request Body Validation',
            `Invalid email payload should return status 400, got ${badPostRes.status}.`
          );
        }

        if (!badPostRes.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header',
            'Send email response missing Access-Control-Allow-Origin header.'
          );
        }
      } else if (fn.file === 'verify-session.ts') {
        // POST request should return 405
        const postReq = new Request('http://localhost/.netlify/functions/verify-session', {
          method: 'POST',
        });
        const postRes: Response = await handler(postReq);
        if (postRes.status !== 405) {
          addViolation(
            relPath,
            fn.endpoint,
            'HTTP Method Enforcement',
            `POST request should return status 405, got ${postRes.status}.`
          );
        }

        // Missing session_id query parameter should return 400
        const noSessionReq = new Request('http://localhost/.netlify/functions/verify-session', {
          method: 'GET',
        });
        const noSessionRes: Response = await handler(noSessionReq);
        if (noSessionRes.status !== 400) {
          addViolation(
            relPath,
            fn.endpoint,
            'Query Parameter Validation',
            `Missing session_id query param should return status 400, got ${noSessionRes.status}.`
          );
        }

        // Malformed session_id should return 400
        const badSessionReq = new Request(
          'http://localhost/.netlify/functions/verify-session?session_id=invalid_id_format',
          { method: 'GET' }
        );
        const badSessionRes: Response = await handler(badSessionReq);
        if (badSessionRes.status !== 400) {
          addViolation(
            relPath,
            fn.endpoint,
            'Query Parameter Validation',
            `Malformed session_id query param should return status 400, got ${badSessionRes.status}.`
          );
        }

        if (!badSessionRes.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header',
            'Verify session response missing Access-Control-Allow-Origin header.'
          );
        }

        if (!badSessionRes.headers.get('cache-control')?.includes('no-store')) {
          addViolation(
            relPath,
            fn.endpoint,
            'Cache Control Header',
            'Verify session response missing Cache-Control: no-store header.'
          );
        }
      }
    } catch (err: any) {
      addViolation(
        relPath,
        fn.endpoint,
        'Import/Execution Error',
        `Error executing handler: ${err.message}`
      );
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (violations.length > 0) {
    console.error(
      `❌ API Contract Validation Failed (${violations.length} violation(s) found in ${duration}s):\n`
    );
    for (const v of violations) {
      const loc = v.line ? `${v.file}:${v.line}` : v.file;
      console.error(`  - [${v.endpoint}] ${loc}`);
      console.error(`    Rule: ${v.rule}`);
      console.error(`    Details: ${v.details}\n`);
    }
    process.exit(1);
  } else {
    console.log(
      `✅ API Contract Validation Passed: All ${requiredFunctions.length} endpoints satisfy contracts (${duration}s).\n`
    );
    process.exit(0);
  }
}

checkApiContracts().catch((err) => {
  console.error('Fatal error during API contract verification:', err);
  process.exit(1);
});
