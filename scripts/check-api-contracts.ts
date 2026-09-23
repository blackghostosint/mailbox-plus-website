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

interface EndpointTestCase {
  name: string;
  makeRequest: (endpointPath: string) => Request;
  expectedStatus: number;
  validate?: (res: Response, json: any) => string | null;
}

interface EndpointSpec {
  fnName: string;
  allowedMethods: string[];
  testCases: EndpointTestCase[];
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

// Single Endpoint Registry: One source of truth for all endpoint contract specifications
const ENDPOINT_REGISTRY: Record<string, EndpointSpec> = {
  health: {
    fnName: 'health',
    allowedMethods: ['GET'],
    testCases: [
      {
        name: 'GET health check status and schema',
        makeRequest: (endpoint) => new Request(`http://localhost${endpoint}`, { method: 'GET' }),
        expectedStatus: 200,
        validate: (res, json) => {
          if (!json || json.status !== 'healthy' || !json.timestamp || !json.checks) {
            return 'Health response schema missing status, timestamp, or checks.';
          }
          if (!res.headers.get('x-health-check') || !res.headers.get('cache-control')) {
            return 'Health response missing X-Health-Check or Cache-Control header.';
          }
          if (!res.headers.get('access-control-allow-origin')) {
            return 'Health response missing Access-Control-Allow-Origin header.';
          }
          return null;
        },
      },
    ],
  },
  'csp-report': {
    fnName: 'csp-report',
    allowedMethods: ['POST'],
    testCases: [
      {
        name: 'POST malformed JSON payload validation',
        makeRequest: (endpoint) =>
          new Request(`http://localhost${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: 'invalid-json{',
          }),
        expectedStatus: 400,
      },
      {
        name: 'POST valid CSP report payload',
        makeRequest: (endpoint) =>
          new Request(`http://localhost${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              'csp-report': {
                'document-uri': 'http://example.com',
                'violated-directive': 'script-src',
              },
            }),
          }),
        expectedStatus: 204,
        validate: (res) => {
          if (!res.headers.get('access-control-allow-origin')) {
            return 'CSP report response missing Access-Control-Allow-Origin header.';
          }
          return null;
        },
      },
    ],
  },
  'create-checkout': {
    fnName: 'create-checkout',
    allowedMethods: ['POST'],
    testCases: [
      {
        name: 'POST invalid tier payload validation',
        makeRequest: (endpoint) =>
          new Request(`http://localhost${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier: 'invalid_tier_name' }),
          }),
        expectedStatus: 400,
        validate: (res) => {
          if (!res.headers.get('access-control-allow-origin')) {
            return 'Create checkout response missing Access-Control-Allow-Origin header.';
          }
          return null;
        },
      },
    ],
  },
  reviews: {
    fnName: 'reviews',
    allowedMethods: ['GET'],
    testCases: [
      {
        name: 'GET reviews status and schema',
        makeRequest: (endpoint) => new Request(`http://localhost${endpoint}`, { method: 'GET' }),
        expectedStatus: 200,
        validate: (res, json) => {
          if (
            !json ||
            typeof json.rating !== 'number' ||
            typeof json.userRatingCount !== 'number' ||
            !Array.isArray(json.reviews)
          ) {
            return 'Reviews response missing rating, userRatingCount, or reviews array.';
          }
          if (!res.headers.get('access-control-allow-origin')) {
            return 'Reviews response missing Access-Control-Allow-Origin header.';
          }
          return null;
        },
      },
    ],
  },
  sendEmail: {
    fnName: 'sendEmail',
    allowedMethods: ['POST'],
    testCases: [
      {
        name: 'POST invalid email payload validation',
        makeRequest: (endpoint) =>
          new Request(`http://localhost${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recaptchaToken: 'dummy', email: 'not-an-email' }),
          }),
        expectedStatus: 400,
        validate: (res) => {
          if (!res.headers.get('access-control-allow-origin')) {
            return 'Send email response missing Access-Control-Allow-Origin header.';
          }
          return null;
        },
      },
    ],
  },
  'verify-session': {
    fnName: 'verify-session',
    allowedMethods: ['GET'],
    testCases: [
      {
        name: 'GET missing session_id query parameter',
        makeRequest: (endpoint) => new Request(`http://localhost${endpoint}`, { method: 'GET' }),
        expectedStatus: 400,
      },
      {
        name: 'GET malformed session_id query parameter',
        makeRequest: (endpoint) =>
          new Request(`http://localhost${endpoint}?session_id=invalid_id_format`, {
            method: 'GET',
          }),
        expectedStatus: 400,
        validate: (res) => {
          if (!res.headers.get('access-control-allow-origin')) {
            return 'Verify session response missing Access-Control-Allow-Origin header.';
          }
          if (!res.headers.get('cache-control')?.includes('no-store')) {
            return 'Verify session response missing Cache-Control: no-store header.';
          }
          return null;
        },
      },
    ],
  },
};

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

  // Intercept global fetch with exact-host and exact-path allowlisting
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString =
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = (init?.method || 'GET').toUpperCase();

    let parsedUrl: URL | null = null;
    try {
      parsedUrl = new URL(urlString, 'http://localhost');
    } catch {
      // Fallback for relative or invalid URLs
    }

    const hostname = parsedUrl ? parsedUrl.hostname : '';
    const pathname = parsedUrl ? parsedUrl.pathname : '';

    // Mock Google Places API Details endpoint (exact GET method and /v1/places/:placeId path)
    if (
      hostname === 'places.googleapis.com' &&
      method === 'GET' &&
      /^\/v1\/places\/[a-zA-Z0-9_-]+$/.test(pathname)
    ) {
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

    // Mock Google reCAPTCHA Verification API (exact POST method and /recaptcha/api/siteverify path)
    if (
      (hostname === 'www.google.com' || hostname === 'google.com') &&
      method === 'POST' &&
      pathname === '/recaptcha/api/siteverify'
    ) {
      return new Response(JSON.stringify({ success: true, score: 0.9 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Allowlist exact Netlify Blobs storage requests (strict method, host, store, and key path matching)
    const ALLOWED_BLOBS_METHODS = ['GET', 'PUT', 'DELETE', 'HEAD', 'POST'];
    const ALLOWED_STORES = '(reviews-cache|rate-limits|sendEmail-rate-limits|query-embeddings)';
    const apiSiteBlobsRegex = new RegExp(
      `^\\/api\\/v1\\/sites\\/[a-zA-Z0-9_-]+\\/blobs\\/${ALLOWED_STORES}\\/[a-zA-Z0-9_%.-]+$`
    );
    const apiBlobsRegex = new RegExp(
      `^\\/api\\/v1\\/blobs\\/[a-zA-Z0-9_-]+\\/${ALLOWED_STORES}\\/[a-zA-Z0-9_%.-]+$`
    );
    const directBlobsRegex = new RegExp(`^\\/(uncached\\/)?${ALLOWED_STORES}\\/[a-zA-Z0-9_%.-]+$`);

    const isAllowedNetlifyBlobs =
      ALLOWED_BLOBS_METHODS.includes(method) &&
      ((hostname === 'api.netlify.com' &&
        (apiSiteBlobsRegex.test(pathname) || apiBlobsRegex.test(pathname))) ||
        ((hostname === 'blobs.netlify.com' ||
          /^[a-zA-Z0-9_-]+\.blobs\.netlify\.com$/.test(hostname)) &&
          (directBlobsRegex.test(pathname) || apiBlobsRegex.test(pathname))));

    if (isAllowedNetlifyBlobs) {
      return new Response(JSON.stringify({}), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(
      `Unexpected external network request during offline contract verification: ${method} ${urlString}`
    );
  }) as typeof fetch;

  // 1. Runtime discovery of serverless endpoints in netlify/functions/*.ts
  const functionFiles = fs
    .readdirSync(FUNCTIONS_DIR)
    .filter((file) => file.endsWith('.ts') && fs.statSync(path.join(FUNCTIONS_DIR, file)).isFile());

  if (functionFiles.length === 0) {
    addViolation(
      'netlify/functions',
      '*',
      'Function Discovery',
      'No serverless function files found in netlify/functions/.'
    );
  }

  const discoveredFunctions = functionFiles.map((file) => {
    const fnName = file.replace(/\.ts$/, '');
    const filePath = path.join(FUNCTIONS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract expected route path from export const config = { path: '...' }
    const configPathMatch = content.match(
      /export\s+const\s+config\s*=\s*\{[^}]*path:\s*['"]([^'"]+)['"]/
    );
    const expectedPath = configPathMatch ? configPathMatch[1] : undefined;
    const endpoint = expectedPath || `/.netlify/functions/${fnName}`;

    return {
      file,
      fnName,
      filePath,
      endpoint,
      expectedPath,
      content,
    };
  });

  // 2. Parity check between disk files and ENDPOINT_REGISTRY (one source of truth)
  const discoveredFnNames = new Set(discoveredFunctions.map((f) => f.fnName));
  const registeredFnNames = new Set(Object.keys(ENDPOINT_REGISTRY));

  for (const registeredName of registeredFnNames) {
    if (!discoveredFnNames.has(registeredName)) {
      addViolation(
        'netlify/functions',
        registeredName,
        'Endpoint Registry Parity',
        `Registered endpoint '${registeredName}' in ENDPOINT_REGISTRY was not found on disk in netlify/functions/.`
      );
    }
  }

  for (const fn of discoveredFunctions) {
    if (!registeredFnNames.has(fn.fnName)) {
      const relPath = path.relative(ROOT_DIR, fn.filePath);
      addViolation(
        relPath,
        fn.endpoint,
        'Endpoint Registry Parity',
        `Discovered serverless endpoint '${fn.fnName}' is missing from ENDPOINT_REGISTRY.`
      );
    }
  }

  // 3. Perform contract verification across discovered endpoints using ENDPOINT_REGISTRY
  for (const fn of discoveredFunctions) {
    const relPath = path.relative(ROOT_DIR, fn.filePath);
    const spec = ENDPOINT_REGISTRY[fn.fnName];
    if (!spec) continue;

    // Static Contract Checks
    if (!fn.content.includes('withCors')) {
      const line = findLineNumber(fn.content, 'export default');
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
        !fn.content.includes(`path: '${fn.expectedPath}'`) &&
        !fn.content.includes(`path: "${fn.expectedPath}"`)
      ) {
        const line = findLineNumber(fn.content, 'export const config');
        addViolation(
          relPath,
          fn.endpoint,
          'Route Config Path',
          `Function missing expected route config path '${fn.expectedPath}'.`,
          line
        );
      }
    }

    // Dynamic Contract Checks against exported handler
    try {
      const fileUrl = pathToFileURL(fn.filePath).href;
      const mod = await import(fileUrl);
      const handler = mod.default;

      if (typeof handler !== 'function') {
        const line = findLineNumber(fn.content, 'export default');
        addViolation(
          relPath,
          fn.endpoint,
          'Default Export',
          'Function default export is not a callable handler function.',
          line
        );
        continue;
      }

      // CORS Preflight (OPTIONS) Contract Check
      const optionsReq = new Request(`http://localhost${fn.endpoint}`, {
        method: 'OPTIONS',
      });
      const optionsRes: Response = await handler(optionsReq);

      if (optionsRes.status !== 204) {
        addViolation(
          relPath,
          fn.endpoint,
          'CORS Preflight (OPTIONS)',
          `OPTIONS preflight request should return status 204 No Content, got ${optionsRes.status}.`
        );
      }

      if (!optionsRes.headers.get('access-control-allow-origin')) {
        addViolation(
          relPath,
          fn.endpoint,
          'CORS Preflight Headers',
          'OPTIONS preflight response missing Access-Control-Allow-Origin header.'
        );
      }

      if (!optionsRes.headers.get('access-control-allow-methods')) {
        addViolation(
          relPath,
          fn.endpoint,
          'CORS Preflight Headers',
          'OPTIONS preflight response missing Access-Control-Allow-Methods header.'
        );
      }

      if (!optionsRes.headers.get('access-control-allow-headers')) {
        addViolation(
          relPath,
          fn.endpoint,
          'CORS Preflight Headers',
          'OPTIONS preflight response missing Access-Control-Allow-Headers header.'
        );
      }

      // Probe non-allowed methods to enforce rejection contract (405 Method Not Allowed)
      const allHttpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      const unallowedMethods = allHttpMethods.filter((m) => !spec.allowedMethods.includes(m));

      for (const unallowedMethod of unallowedMethods) {
        const unallowedReq = new Request(`http://localhost${fn.endpoint}`, {
          method: unallowedMethod,
        });
        const unallowedRes: Response = await handler(unallowedReq);

        if (unallowedRes.status !== 405) {
          addViolation(
            relPath,
            fn.endpoint,
            'HTTP Method Enforcement',
            `Unsupported method ${unallowedMethod} should return status 405 Method Not Allowed, got ${unallowedRes.status}.`
          );
        }

        if (!unallowedRes.headers.get('access-control-allow-origin')) {
          addViolation(
            relPath,
            fn.endpoint,
            'CORS Header on Method Rejection',
            `Response for unsupported method ${unallowedMethod} missing Access-Control-Allow-Origin header.`
          );
        }
      }

      // Execute Registry Test Cases for Status and Schema Validation
      for (const testCase of spec.testCases) {
        const req = testCase.makeRequest(fn.endpoint);
        const res: Response = await handler(req);

        if (res.status !== testCase.expectedStatus) {
          addViolation(
            relPath,
            fn.endpoint,
            `Registry Assertion (${testCase.name})`,
            `Expected status ${testCase.expectedStatus}, got ${res.status}.`
          );
        }

        if (testCase.validate) {
          const json = await res
            .clone()
            .json()
            .catch(() => null);
          const validationError = testCase.validate(res, json);
          if (validationError) {
            addViolation(
              relPath,
              fn.endpoint,
              `Registry Assertion (${testCase.name})`,
              validationError
            );
          }
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
      `✅ API Contract Validation Passed: All ${discoveredFunctions.length} endpoints satisfy contracts (${duration}s).\n`
    );
    process.exit(0);
  }
}

checkApiContracts().catch((err) => {
  console.error('Fatal error during API contract verification:', err);
  process.exit(1);
});
