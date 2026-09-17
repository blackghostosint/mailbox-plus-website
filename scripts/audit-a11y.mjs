import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BATCH_SIZE = 25;

const STANDALONE_UTILITY_PATHS = [
  '/',
  '/accessibility/',
  '/contact-us/',
  '/privacy/',
  '/terms/',
  '/about-us/',
  '/services/',
  '/thank-you/',
  '/tracking/',
  '/pickup-hours/',
  '/shipping-partners/',
  '/sms-consent/',
  '/rental-agreement/',
  '/after-signup/',
];

const CATEGORIES = [
  'articles',
  'service-area',
  'guide',
  'copy-print',
  'pack-ship',
  'home-business',
  'specialty',
  'rewards',
];

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

function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function discoverRoutes() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(`Build directory "${DIST_DIR}" does not exist. Run "npm run build" first.`);
  }

  const htmlFiles = getHtmlFiles(DIST_DIR);
  const routes = htmlFiles.map((file) => {
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    if (rel === 'index.html') return '/';
    if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -11) + '/';
    if (rel.endsWith('.html')) return '/' + rel.slice(0, -5);
    return '/' + rel;
  });

  return Array.from(new Set(routes)).sort();
}

function selectSampledRoutes(allRoutes) {
  const routeSet = new Set(allRoutes);
  const selected = new Set();

  // 1. Audit all available standalone utility pages
  for (const utilPath of STANDALONE_UTILITY_PATHS) {
    if (routeSet.has(utilPath)) {
      selected.add(utilPath);
    }
  }

  // 2. Audit representative routes from each content category directory
  for (const cat of CATEGORIES) {
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

function parseModeArg() {
  const args = process.argv.slice(2);
  let mode = 'sampled';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode=full') mode = 'full';
    else if (args[i] === '--mode=sampled') mode = 'sampled';
    else if (args[i] === '--mode' && args[i + 1] === 'full') {
      mode = 'full';
      i++;
    } else if (args[i] === '--mode' && args[i + 1] === 'sampled') {
      mode = 'sampled';
      i++;
    }
  }
  return mode;
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

  const zeroMatches = (stdout.match(/0 violations found!/g) || []).length;
  const hasExplicitViolations =
    /Violation of "/.test(stdout) ||
    /[1-9]\d* violations found!/.test(stdout) ||
    /[1-9]\d*\s+Accessibility issue/i.test(stdout);

  if (zeroMatches >= expectedUrlCount) {
    if (code !== 0) {
      console.warn(
        `\n⚠️ Notice: axe CLI exited with status ${code}, but all ${expectedUrlCount} page(s) passed with 0 violations.`
      );
      if (stderr && stderr.trim()) {
        console.warn(`CLI stderr output:\n${stderr.trim()}`);
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
    stderr.trim() ||
    stdout
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
    const mode = parseModeArg();
    console.log(`Starting accessibility audit in [${mode.toUpperCase()}] mode...`);

    const allRoutes = discoverRoutes();
    console.log(`Discovered ${allRoutes.length} total HTML routes built in dist/`);

    const targetRoutePaths = mode === 'full' ? allRoutes : selectSampledRoutes(allRoutes);
    console.log(`Selected ${targetRoutePaths.length} route(s) for accessibility auditing.`);

    let baseUrl = process.env.AUDIT_BASE_URL;
    if (!baseUrl) {
      console.log(`Starting background static server for ${DIST_DIR}...`);
      baseUrl = await startBackgroundServer(DIST_DIR, 4173);
      console.log(`Server is ready at ${baseUrl}`);
    } else {
      console.log(`Using provided AUDIT_BASE_URL: ${baseUrl}`);
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

    const targetUrls = targetRoutePaths.map((r) => new URL(r, baseUrl).href);
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

export { evaluateBatchResult, runAxeCliBatch, discoverRoutes, selectSampledRoutes };

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
  main();
}
