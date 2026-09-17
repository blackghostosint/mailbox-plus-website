import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BATCH_SIZE = 25;

const CATEGORIES = {
  HOMEPAGE: 'Homepage',
  SERVICE_PILLARS: 'Service Pillars',
  SERVICE_DETAILS: 'Service Details',
  ARTICLES: 'Articles',
  GUIDES: 'Guides',
  LOCAL_LANDING: 'Local Landing',
  UTILITY_LEGAL: 'Utility/Legal',
  INTERACTIVE: 'Interactive',
  UNCATEGORIZED: 'Uncategorized',
};

const UTILITY_ROUTES = new Set([
  '/',
  '/404/',
  '/privacy/',
  '/terms/',
  '/accessibility/',
  '/rental-agreement/',
  '/sms-consent/',
  '/about-us/',
  '/contact-us/',
  '/pickup-hours/',
  '/shipping-partners/',
  '/thank-you/',
  '/after-signup/',
]);

const INTERACTIVE_ROUTES = new Set(['/tracking/', '/ask-mailbox-plus/', '/amazon-counter/']);

const SERVICE_PILLAR_INDEXES = new Set([
  '/pack-ship/',
  '/copy-print/',
  '/home-business/',
  '/services/',
  '/service-area/',
  '/articles/',
]);

const PREFERRED_REPRESENTATIVES = {
  [CATEGORIES.HOMEPAGE]: ['/'],
  [CATEGORIES.SERVICE_PILLARS]: ['/services/', '/pack-ship/'],
  [CATEGORIES.SERVICE_DETAILS]: ['/pack-ship/fedex-shipping/', '/copy-print/business-cards/'],
  [CATEGORIES.ARTICLES]: ['/articles/concord-township-shipping-insurance/'],
  [CATEGORIES.GUIDES]: ['/guide/shipping-wine/'],
  [CATEGORIES.LOCAL_LANDING]: ['/service-area/concord-township/'],
  [CATEGORIES.UTILITY_LEGAL]: ['/accessibility/', '/contact-us/'],
  [CATEGORIES.INTERACTIVE]: ['/ask-mailbox-plus/'],
  [CATEGORIES.UNCATEGORIZED]: [],
};

const CATEGORIES_LIST_FOR_SAMPLING = [
  'articles',
  'service-area',
  'guide',
  'copy-print',
  'pack-ship',
  'home-business',
  'specialty',
  'rewards',
];

function parseArgs(args) {
  const options = {
    all: false,
    limit: null,
    category: null,
    baseUrl: process.env.AUDIT_BASE_URL || process.env.BASE_URL || null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--all' || arg === '--mode=full') {
      options.all = true;
    } else if (arg === '--mode=sampled') {
      options.all = false;
    } else if (arg.startsWith('--limit=')) {
      const parsed = parseInt(arg.split('=')[1], 10);
      options.limit = isNaN(parsed) ? null : parsed;
    } else if (arg === '--limit' && i + 1 < args.length) {
      const parsed = parseInt(args[++i], 10);
      options.limit = isNaN(parsed) ? null : parsed;
    } else if (arg.startsWith('--category=')) {
      options.category = arg.split('=')[1];
    } else if (arg === '--category' && i + 1 < args.length) {
      options.category = args[++i];
    } else if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.split('=')[1];
    } else if (arg === '--base-url' && i + 1 < args.length) {
      options.baseUrl = args[++i];
    }
  }

  return options;
}

function discoverRoutes(distDir = DIST_DIR) {
  if (!fs.existsSync(distDir)) {
    console.error(`❌ Error: Build output directory "${distDir}" does not exist.`);
    console.error('Please run "npm run build" before running the accessibility audit.\n');
    process.exit(1);
  }

  const htmlFiles = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }

  walk(distDir);

  if (htmlFiles.length === 0) {
    console.error(`❌ Error: No HTML files found in "${distDir}". Please build the site first.\n`);
    process.exit(1);
  }

  const routes = htmlFiles.map((file) => {
    let rel = path.relative(distDir, file).replace(/\\/g, '/');
    if (rel === 'index.html') return '/';
    if (rel === '404.html') return '/404/';
    if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -11) + '/';
    if (rel.endsWith('.html')) return '/' + rel.slice(0, -5) + '/';
    return '/' + rel + '/';
  });

  return Array.from(new Set(routes)).sort();
}

function categorizeRoute(route) {
  const norm = route.endsWith('/') ? route : route + '/';

  if (norm === '/') return CATEGORIES.HOMEPAGE;
  if (SERVICE_PILLAR_INDEXES.has(norm)) return CATEGORIES.SERVICE_PILLARS;
  if (UTILITY_ROUTES.has(norm)) return CATEGORIES.UTILITY_LEGAL;
  if (INTERACTIVE_ROUTES.has(norm) || norm.startsWith('/research/')) {
    return CATEGORIES.INTERACTIVE;
  }
  if (norm.startsWith('/articles/')) return CATEGORIES.ARTICLES;
  if (norm.startsWith('/guide/')) return CATEGORIES.GUIDES;
  if (norm.startsWith('/service-area/')) return CATEGORIES.LOCAL_LANDING;
  if (
    norm.startsWith('/pack-ship/') ||
    norm.startsWith('/copy-print/') ||
    norm.startsWith('/home-business/') ||
    norm.startsWith('/specialty/')
  ) {
    return CATEGORIES.SERVICE_DETAILS;
  }

  const pathSegments = norm.split('/').filter(Boolean);
  if (pathSegments.length === 1) {
    return CATEGORIES.LOCAL_LANDING;
  }

  return CATEGORIES.UNCATEGORIZED;
}

function normalizeCategoryKey(cat) {
  return cat.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findCategoryMatch(categoryInput, categorizedRoutes) {
  const normInput = normalizeCategoryKey(categoryInput);
  const categories = Object.keys(categorizedRoutes);

  if (normInput === 'utility' || normInput === 'legal') {
    return CATEGORIES.UTILITY_LEGAL;
  }

  for (const cat of categories) {
    if (normalizeCategoryKey(cat) === normInput) {
      return cat;
    }
  }
  return null;
}

function selectRepresentativeRoutes(categorizedRoutes) {
  const selected = [];
  for (const [catName, routes] of Object.entries(categorizedRoutes)) {
    if (!routes || routes.length === 0) continue;

    const preferredList = PREFERRED_REPRESENTATIVES[catName] || [];
    let added = false;
    for (const pref of preferredList) {
      if (routes.includes(pref)) {
        selected.push(pref);
        added = true;
        break;
      }
    }
    if (!added && routes.length > 0) {
      selected.push(routes[0]);
    }
  }
  return selected;
}

function selectSampledRoutes(allRoutes) {
  const routeSet = new Set(allRoutes);
  const selected = new Set();

  for (const utilPath of UTILITY_ROUTES) {
    if (routeSet.has(utilPath)) {
      selected.add(utilPath);
    }
  }

  for (const cat of CATEGORIES_LIST_FOR_SAMPLING) {
    const prefix = '/' + cat + '/';
    const catRoutes = allRoutes.filter((r) => r === prefix || r.startsWith(prefix));
    if (catRoutes.length > 0) {
      const indexRoute = catRoutes.find((r) => r === prefix);
      const subRoute = catRoutes.find((r) => r !== prefix);
      if (indexRoute) selected.add(indexRoute);
      if (subRoute) selected.add(subRoute);
      if (!indexRoute && !subRoute && catRoutes[0]) {
        selected.add(catRoutes[0]);
      }
    }
  }

  return Array.from(selected);
}

let serverProcess = null;

function cleanupServer() {
  if (serverProcess) {
    console.log('Stopping local static server process...');
    try {
      serverProcess.kill('SIGTERM');
      serverProcess.kill('SIGKILL');
    } catch {
      // ignore
    }
    serverProcess = null;
  }
}

process.on('exit', cleanupServer);
process.on('SIGINT', cleanupServer);
process.on('SIGTERM', cleanupServer);

const SERVE_STATIC_SCRIPT = `
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const distDir = process.argv[1];
const targetPort = parseInt(process.argv[2] || '4173', 10);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(distDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.statusCode = 404;
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.statusCode = 500;
    res.end('500 Internal Server Error');
  }
});

function startServer(p) {
  server.listen(p, '127.0.0.1', () => {
    const address = server.address();
    const actualPort = typeof address === 'object' ? address.port : p;
    process.stdout.write(\`READY:\${actualPort}\\n\`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && targetPort !== 0) {
    startServer(0);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

startServer(targetPort);
`;

async function startBackgroundServer(distDir, preferredPort = 4173) {
  return new Promise((resolve, reject) => {
    serverProcess = spawn(
      process.execPath,
      ['--input-type=module', '-e', SERVE_STATIC_SCRIPT, distDir, String(preferredPort)],
      {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'inherit'],
      }
    );

    let output = '';
    const onData = (chunk) => {
      output += chunk.toString();
      const match = output.match(/READY:(\d+)/);
      if (match) {
        serverProcess.stdout.removeListener('data', onData);
        const port = match[1];
        resolve(`http://127.0.0.1:${port}`);
      }
    };

    serverProcess.stdout.on('data', onData);

    serverProcess.on('error', (err) => {
      reject(new Error(`Failed to start static server: ${err.message}`));
    });

    serverProcess.on('exit', (code) => {
      if (code !== null && code !== 0) {
        reject(new Error(`Static server exited prematurely with code ${code}`));
      }
    });
  });
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function runAxeCliBatch(urls, { chromePath, chromedriverPath }) {
  return new Promise((resolve) => {
    const args = [
      '--yes',
      '@axe-core/cli',
      ...urls,
      '--tags',
      'wcag2a,wcag2aa,wcag21a,wcag21aa',
      '--chrome-options',
      'no-sandbox,disable-setuid-sandbox,disable-dev-shm-usage,disable-gpu',
    ];
    if (chromePath && fs.existsSync(chromePath)) {
      args.push('--chrome-path', chromePath);
    }
    if (chromedriverPath && fs.existsSync(chromedriverPath)) {
      args.push('--chromedriver-path', chromedriverPath);
    }

    const child = spawn('npx', args, {
      cwd: process.cwd(),
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const str = chunk.toString();
      stdout += str;
      process.stdout.write(chunk);
    });

    child.stderr.on('data', (chunk) => {
      const str = chunk.toString();
      stderr += str;
      process.stderr.write(chunk);
    });

    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });

    child.on('error', (err) => {
      resolve({ code: 1, stdout, stderr: stderr + '\n' + err.message });
    });
  });
}

function evaluateBatchResult(result, expectedUrlCount) {
  const { code, stdout, stderr } = result;

  const stripAnsi = (str) => (str || '').replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
  const cleanStdout = stripAnsi(stdout);
  const cleanStderr = stripAnsi(stderr);

  const zeroMatches = (cleanStdout.match(/(?:0|\bzero\b)\s+violations?\s+found/gi) || []).length;
  const explicitViolationMatches = cleanStdout.match(/Violation of "[^"]+"/g) || [];
  const hasExplicitViolations =
    explicitViolationMatches.length > 0 ||
    /[1-9]\d*\s+violations?\s+found!/i.test(cleanStdout) ||
    /[1-9]\d*\s+Accessibility\s+issues?\s+(?:detected|found)/i.test(cleanStdout);

  if (zeroMatches >= expectedUrlCount) {
    if (code !== 0) {
      console.warn(
        `\n⚠️ Notice: axe CLI exited with status ${code}, but all ${expectedUrlCount} page(s) passed with 0 violations.`
      );
      if (cleanStderr.trim()) {
        console.warn(`CLI stderr output:\n${cleanStderr.trim()}`);
      }
    }
    return {
      type: 'SUCCESS',
      message: `All ${expectedUrlCount} page(s) audited with 0 violations.`,
    };
  }

  if (hasExplicitViolations) {
    return {
      type: 'WCAG_VIOLATIONS',
      message: 'WCAG 2.1 AA accessibility violations detected.',
    };
  }

  const errorMsg =
    cleanStderr.trim() ||
    cleanStdout
      .trim()
      .split('\n')
      .filter((l) => l.toLowerCase().includes('error'))
      .join(' ') ||
    `CLI exited with status code ${code} without completing audit of all pages (${zeroMatches}/${expectedUrlCount} passed).`;

  return {
    type: 'CLI_ERROR',
    message: errorMsg,
  };
}

async function main() {
  let hasA11yViolations = false;
  let hasCliErrors = false;
  try {
    const options = parseArgs(process.argv.slice(2));

    const allRoutes = discoverRoutes(DIST_DIR);

    const categorized = {};
    for (const catVal of Object.values(CATEGORIES)) {
      categorized[catVal] = [];
    }

    for (const r of allRoutes) {
      const cat = categorizeRoute(r);
      categorized[cat].push(r);
    }

    // Clean up empty categories from summary object
    for (const catKey of Object.keys(categorized)) {
      if (categorized[catKey].length === 0) {
        delete categorized[catKey];
      }
    }

    let targetCategories = { ...categorized };

    if (options.category) {
      const matchedCategory = findCategoryMatch(options.category, categorized);
      if (!matchedCategory) {
        const validNames = Object.keys(categorized).join(', ');
        console.error(`❌ Error: Category "${options.category}" not found.`);
        console.error(`Available categories with routes: ${validNames}\n`);
        process.exit(1);
      }
      targetCategories = { [matchedCategory]: categorized[matchedCategory] };
    }

    let selectedRoutes = [];
    let modeDescription = '';

    if (options.all) {
      for (const routes of Object.values(targetCategories)) {
        selectedRoutes.push(...routes);
      }
      modeDescription = options.category
        ? `All routes in category "${Object.keys(targetCategories)[0]}"`
        : 'Comprehensive Audit (All Discovered Routes)';
    } else {
      selectedRoutes = selectRepresentativeRoutes(targetCategories);
      modeDescription = options.category
        ? `Representative route for category "${Object.keys(targetCategories)[0]}"`
        : 'Representative Category Sampling (Default CI Mode)';
    }

    if (options.limit !== null && options.limit >= 0) {
      selectedRoutes = selectedRoutes.slice(0, options.limit);
      modeDescription += ` [Limited to ${options.limit} URL(s)]`;
    }

    console.log('\n==================================================');
    console.log('       ACCESSIBILITY AUDIT (axe-core)            ');
    console.log('==================================================');
    console.log(
      `Discovered ${allRoutes.length} static routes across ${Object.keys(categorized).length} categories in dist/\n`
    );
    console.log('Category Breakdown:');
    for (const [catName, routes] of Object.entries(categorized)) {
      console.log(`  - ${catName}: ${routes.length} route(s)`);
    }
    console.log(`\nMode: ${modeDescription}`);
    console.log(`Auditing ${selectedRoutes.length} selected URL(s):`);
    for (let i = 0; i < selectedRoutes.length; i++) {
      console.log(`  ${i + 1}. ${selectedRoutes[i]}`);
    }
    console.log('==================================================\n');

    if (selectedRoutes.length === 0) {
      console.log('ℹ️ No URLs selected for audit. Exiting successfully.');
      process.exit(0);
    }

    let baseUrl = options.baseUrl;
    if (!baseUrl) {
      console.log(`Starting background static server for ${DIST_DIR}...`);
      baseUrl = await startBackgroundServer(DIST_DIR, 4173);
      console.log(`Server is ready at ${baseUrl}`);
    } else {
      console.log(`Using provided base URL: ${baseUrl}`);
    }

    console.log('Ensuring compatible Chrome and ChromeDriver binaries...');
    execSync('npx --yes browser-driver-manager install chrome', {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    const envPath = path.join(os.homedir(), '.browser-driver-manager', '.env');
    let chromePath = '';
    let chromedriverPath = '';

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      for (const line of envContent.split('\n')) {
        const matchChrome = line.match(/^CHROME_TEST_PATH="([^"]+)"$/);
        if (matchChrome) chromePath = matchChrome[1];
        const matchDriver = line.match(/^CHROMEDRIVER_TEST_PATH="([^"]+)"$/);
        if (matchDriver) chromedriverPath = matchDriver[1];
      }
    }

    const targetUrls = selectedRoutes.map((r) => new URL(r, baseUrl).href);
    const batches = chunkArray(targetUrls, BATCH_SIZE);

    console.log(
      `Executing axe-core across ${targetUrls.length} page(s) in ${batches.length} batch(es)...`
    );

    for (let i = 0; i < batches.length; i++) {
      console.log(
        `\n--- Running Batch ${i + 1}/${batches.length} (${batches[i].length} pages) ---`
      );
      const batchUrls = batches[i];
      const MAX_ATTEMPTS = 2;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        if (attempt > 1) {
          console.log(
            `\n🔄 Retrying Batch ${i + 1}/${batches.length} (Attempt ${attempt}/${MAX_ATTEMPTS})...`
          );
        }

        const result = await runAxeCliBatch(batchUrls, { chromePath, chromedriverPath });
        const evaluation = evaluateBatchResult(result, batchUrls.length);

        if (evaluation.type === 'SUCCESS') {
          break;
        } else if (evaluation.type === 'WCAG_VIOLATIONS') {
          console.error(`❌ Batch ${i + 1} detected WCAG accessibility violations.`);
          hasA11yViolations = true;
          break;
        } else if (evaluation.type === 'CLI_ERROR') {
          console.error(
            `⚠️ Batch ${i + 1} encountered CLI execution error (Attempt ${attempt}/${MAX_ATTEMPTS}):`,
            evaluation.message
          );
          if (attempt === MAX_ATTEMPTS) {
            console.error(
              `❌ Batch ${i + 1} failed due to unrecoverable CLI/driver error:`,
              evaluation.message
            );
            hasCliErrors = true;
          }
        }
      }
    }

    if (hasA11yViolations) {
      console.error('\n❌ Accessibility audit failed due to WCAG 2.1 AA violations.');
      process.exit(1);
    } else if (hasCliErrors) {
      console.error('\n❌ Accessibility audit failed due to CLI/driver execution error.');
      process.exit(1);
    } else {
      console.log('\n🎉 Accessibility audit completed successfully with zero violations!');
    }
  } catch (error) {
    console.error('Audit failed:', error.message || error);
    process.exit(1);
  } finally {
    cleanupServer();
  }
}

export {
  evaluateBatchResult,
  runAxeCliBatch,
  discoverRoutes,
  selectSampledRoutes,
  categorizeRoute,
  selectRepresentativeRoutes,
  parseArgs,
  CATEGORIES,
};

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
  main();
}
