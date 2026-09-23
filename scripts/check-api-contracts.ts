import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

interface DiscoveredFunction {
  name: string;
  filePath: string;
}

function getDiscoveredFunctions(): DiscoveredFunction[] {
  if (!fs.existsSync(FUNCTIONS_DIR)) return [];
  const entries = fs.readdirSync(FUNCTIONS_DIR, { withFileTypes: true });
  const functions: DiscoveredFunction[] = [];

  for (const entry of entries) {
    if (
      entry.isFile() &&
      entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.spec.ts')
    ) {
      const name = path.basename(entry.name, '.ts');
      functions.push({
        name,
        filePath: path.join(FUNCTIONS_DIR, entry.name),
      });
    }
  }

  return functions;
}

interface EndpointContractConfig {
  allowedMethods: string[];
  testHandler: (handler: (req: Request, ctx?: any) => Promise<Response>) => Promise<void>;
}

const ENDPOINT_REGISTRY: Record<string, EndpointContractConfig> = {
  health: {
    allowedMethods: ['GET'],
    testHandler: async (handler) => {
      const req = new Request('http://localhost/.netlify/functions/health', { method: 'GET' });
      const res = await handler(req);
      if (res.status !== 200) {
        addViolation(
          'health.ts',
          'health',
          'Status Contract',
          `Expected HTTP status 200, got ${res.status}`
        );
      }
      const data = await res.json();
      if (data.status !== 'healthy') {
        addViolation(
          'health.ts',
          'health',
          'Payload Contract',
          `Expected status "healthy", got ${data.status}`
        );
      }
    },
  },
  reviews: {
    allowedMethods: ['GET'],
    testHandler: async (handler) => {
      const req = new Request('http://localhost/api/reviews', { method: 'GET' });
      const res = await handler(req);
      if (res.status !== 200) {
        addViolation(
          'reviews.ts',
          'reviews',
          'Status Contract',
          `Expected HTTP status 200, got ${res.status}`
        );
      }
      const data = await res.json();
      if (typeof data.rating !== 'number' || !Array.isArray(data.reviews)) {
        addViolation(
          'reviews.ts',
          'reviews',
          'Payload Contract',
          `Expected rating and reviews array in payload`
        );
      }
    },
  },
  'csp-report': {
    allowedMethods: ['POST'],
    testHandler: async (handler) => {
      const req = new Request('http://localhost/.netlify/functions/csp-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'csp-report': {
            'document-uri': 'http://example.com/test',
            referrer: '',
            'violated-directive': 'script-src-elem',
            'effective-directive': 'script-src-elem',
            'original-policy': "script-src 'self'",
            disposition: 'enforce',
            'blocked-uri': 'http://example.com/eval.js',
            'line-number': 1,
            'column-number': 1,
            'source-file': 'http://example.com/test',
            'status-code': 200,
            'script-sample': '',
          },
        }),
      });
      const res = await handler(req);
      if (res.status !== 200 && res.status !== 204) {
        addViolation(
          'csp-report.ts',
          'csp-report',
          'Status Contract',
          `Expected HTTP status 200 or 204, got ${res.status}`
        );
      }
    },
  },
  'create-checkout': {
    allowedMethods: ['POST'],
    testHandler: async (handler) => {
      const reqInvalid = new Request('http://localhost/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'invalid_tier_key' }),
      });
      const resInvalid = await handler(reqInvalid);
      if (resInvalid.status !== 400) {
        addViolation(
          'create-checkout.ts',
          'create-checkout',
          'Validation Contract',
          `Expected 400 Bad Request on invalid tier, got ${resInvalid.status}`
        );
      }
    },
  },
  sendEmail: {
    allowedMethods: ['POST'],
    testHandler: async (handler) => {
      const reqInvalid = new Request('http://localhost/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Jane', email: 'invalid-email', message: 'Hi' }),
      });
      const resInvalid = await handler(reqInvalid);
      if (resInvalid.status !== 400) {
        addViolation(
          'sendEmail.ts',
          'sendEmail',
          'Validation Contract',
          `Expected 400 Bad Request on invalid email format, got ${resInvalid.status}`
        );
      }
    },
  },
  'verify-session': {
    allowedMethods: ['GET'],
    testHandler: async (handler) => {
      const reqMissing = new Request('http://localhost/.netlify/functions/verify-session', {
        method: 'GET',
      });
      const resMissing = await handler(reqMissing);
      if (resMissing.status !== 400) {
        addViolation(
          'verify-session.ts',
          'verify-session',
          'Validation Contract',
          `Expected 400 Bad Request on missing session_id, got ${resMissing.status}`
        );
      }
    },
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

  // Intercept global fetch to guarantee deterministic, offline execution with zero external network traffic
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString =
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const parsedUrl = new URL(urlString, 'http://localhost');
    const method = (init?.method || 'GET').toUpperCase();
    const hostname = parsedUrl.hostname;
    const pathname = parsedUrl.pathname;

    // Google Places API
    if (hostname === 'places.googleapis.com') {
      if (method !== 'GET') {
        throw new Error(`Unexpected method ${method} for Google Places API`);
      }
      if (!/^\/v1\/places\/[a-zA-Z0-9_-]+$/.test(pathname)) {
        throw new Error(`Unexpected pathname ${pathname} for Google Places API`);
      }
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

    // Google reCAPTCHA Verification API
    if (hostname === 'www.google.com' || hostname === 'google.com') {
      if (pathname === '/recaptcha/api/siteverify') {
        if (method !== 'POST') {
          throw new Error(`Unexpected method ${method} for reCAPTCHA API`);
        }
        return new Response(JSON.stringify({ success: true, score: 0.9 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Netlify API & Blobs API requests
    if (hostname === 'api.netlify.com') {
      if (!['GET', 'PUT', 'DELETE', 'HEAD', 'POST'].includes(method)) {
        throw new Error(`Unexpected method ${method} for api.netlify.com`);
      }
      const isSiteBlobs =
        /^\/api\/v1\/sites\/[a-zA-Z0-9_-]+\/blobs\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_%.-]+$/.test(
          pathname
        );
      const isDirectBlobs =
        /^\/api\/v1\/blobs\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_%.-]+$/.test(pathname);
      if (!isSiteBlobs && !isDirectBlobs) {
        throw new Error(`Unexpected pathname ${pathname} for api.netlify.com: ${pathname}`);
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (hostname === 'blobs.netlify.com' || hostname.endsWith('.blobs.netlify.com')) {
      if (!['GET', 'PUT', 'DELETE', 'HEAD', 'POST'].includes(method)) {
        throw new Error(`Unexpected method ${method} for Netlify Blobs`);
      }
      const ALLOWED_STORES = [
        'reviews-cache',
        'rate-limits',
        'sendEmail-rate-limits',
        'query-embeddings',
      ];
      const parts = pathname.split('/').filter(Boolean);
      let storeName = parts[0];
      if (storeName === 'uncached' || storeName === 'api') {
        if (storeName === 'uncached') storeName = parts[1];
        else if (storeName === 'api' && parts[1] === 'v1' && parts[2] === 'blobs')
          storeName = parts[3];
      }
      if (!storeName || !ALLOWED_STORES.includes(storeName)) {
        throw new Error(
          `Unapproved store '${storeName}' in Netlify Blobs request path: ${pathname}`
        );
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unexpected external network request in offline contract check: ${urlString}`);
  }) as typeof fetch;

  const discoveredFunctions = getDiscoveredFunctions();
  const discoveredNames = new Set(discoveredFunctions.map((f) => f.name));
  const registryNames = new Set(Object.keys(ENDPOINT_REGISTRY));

  // Check Parity
  for (const fn of discoveredFunctions) {
    if (!registryNames.has(fn.name)) {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'Registry Parity',
        `Discovered serverless function '${fn.name}.ts' is missing from ENDPOINT_REGISTRY.`
      );
    }
  }

  for (const regName of registryNames) {
    if (!discoveredNames.has(regName)) {
      addViolation(
        `${regName}.ts`,
        regName,
        'Registry Parity',
        `Registered function '${regName}' in ENDPOINT_REGISTRY does not exist on disk in netlify/functions/.`
      );
    }
  }

  // Execute verification per discovered function
  for (const fn of discoveredFunctions) {
    const fnConfig = ENDPOINT_REGISTRY[fn.name];
    if (!fnConfig) continue;

    const fileUrl = pathToFileURL(fn.filePath).href;
    let mod: any;
    try {
      mod = await import(fileUrl);
    } catch (err: any) {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'Module Import',
        `Failed to import function module: ${err?.message || err}`
      );
      continue;
    }

    const handler = mod.default;
    if (typeof handler !== 'function') {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'Handler Export',
        `Default export in ${fn.name}.ts is not a function.`
      );
      continue;
    }

    const routePath = mod.config?.path || `/.netlify/functions/${fn.name}`;

    // 1. CORS Preflight (OPTIONS) Check
    const optionsReq = new Request(`http://localhost${routePath}`, { method: 'OPTIONS' });
    const optionsRes = await handler(optionsReq);
    if (optionsRes.status !== 204) {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'CORS Preflight',
        `Expected HTTP status 204 for OPTIONS preflight, got ${optionsRes.status}`
      );
    }
    if (!optionsRes.headers.get('Access-Control-Allow-Origin')) {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'CORS Preflight',
        `Missing Access-Control-Allow-Origin header in OPTIONS preflight response.`
      );
    }
    if (!optionsRes.headers.get('Access-Control-Allow-Methods')) {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'CORS Preflight',
        `Missing Access-Control-Allow-Methods header in OPTIONS preflight response.`
      );
    }

    // 2. HTTP Method Enforcement & Probing (Non-allowed methods MUST return 405)
    const ALL_HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const unallowedMethods = ALL_HTTP_METHODS.filter((m) => !fnConfig.allowedMethods.includes(m));

    for (const unallowedMethod of unallowedMethods) {
      const req = new Request(`http://localhost${routePath}`, { method: unallowedMethod });
      const res = await handler(req);
      if (res.status !== 405) {
        addViolation(
          `${fn.name}.ts`,
          fn.name,
          'Method Not Allowed',
          `Expected 405 Method Not Allowed for ${unallowedMethod} request, got ${res.status}`
        );
      }
      if (!res.headers.get('Access-Control-Allow-Origin')) {
        addViolation(
          `${fn.name}.ts`,
          fn.name,
          'CORS Header Preservation',
          `Missing Access-Control-Allow-Origin header on 405 response for ${unallowedMethod}.`
        );
      }
    }

    // 3. Status and Schema Assertions via Registry Test Handler
    try {
      await fnConfig.testHandler(handler);
    } catch (err: any) {
      addViolation(
        `${fn.name}.ts`,
        fn.name,
        'Contract Assertion Error',
        `Registry test handler error: ${err?.message || err}`
      );
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (violations.length > 0) {
    console.error(
      `❌ Serverless API Endpoint Contract Verification Failed (${violations.length} violation(s) found in ${duration}s):\n`
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
      `✅ Serverless API Endpoint Contract Verification Passed: 100% contract compliance across ${discoveredFunctions.length} endpoint(s) (${duration}s).\n`
    );
    process.exit(0);
  }
}

checkApiContracts().catch((err) => {
  console.error('Fatal error during serverless API endpoint contract verification:', err);
  process.exit(1);
});
