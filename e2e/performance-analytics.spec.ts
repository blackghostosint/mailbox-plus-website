/* global process */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

let server: http.Server;
const WORKER_INDEX = Number(process.env.TEST_WORKER_INDEX || 0);
const PORT = 9090 + WORKER_INDEX;

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    // Basic static file server for ./dist
    let urlPath = req.url || '/';
    // Remove query params or hashes
    urlPath = urlPath.split('?')[0].split('#')[0];

    let filePath = path.join(process.cwd(), 'dist', urlPath === '/' ? 'index.html' : urlPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.woff2') contentType = 'font/woff2';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  console.log(
    `[Playwright test server - Worker ${WORKER_INDEX}] Serving ./dist on http://localhost:${PORT}`
  );
});

test.afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test.describe('Astro Performance & Analytics E2E', () => {
  test('defer third-party scripts until interaction or idle, then fire GA4/Meta Pixel', async ({
    page,
  }) => {
    const requestedUrls: string[] = [];

    // Track all network requests
    page.on('request', (request) => {
      requestedUrls.push(request.url());
    });

    // 1. Verify build files on disk first
    const indexHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
    const fileHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Verify Google Fonts uses preload / onload pattern
    expect(fileHtml).toContain(
      'rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Sans'
    );
    expect(fileHtml).toContain('onload="this.onload=null;this.rel=\'stylesheet\'"');

    // Verify the noscript fallback exists for Google Fonts
    expect(fileHtml).toContain(
      '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans'
    );

    // Verify Astro global CSS is deferred with media="print" onload and <noscript> fallback
    expect(fileHtml).toContain('media="print" onload="this.media=\'all\'"');
    expect(fileHtml).toContain('</noscript>');

    // Verify no static render-blocking scripts for GTM or Facebook are present in HTML file
    expect(fileHtml).not.toContain('<script async src="https://www.googletagmanager.com');
    expect(fileHtml).not.toContain('<script src="https://connect.facebook.net');
    expect(fileHtml).not.toContain('<script async src="https://connect.facebook.net');

    // 2. Load the page in Playwright
    await page.goto(`http://localhost:${PORT}/`);

    // Verify queues exist on load
    const initialQueues = await page.evaluate(() => {
      return {
        dataLayerExists: Array.isArray((window as any).dataLayer),
        fbqExists: typeof (window as any).fbq === 'function',
      };
    });

    expect(initialQueues.dataLayerExists).toBe(true);
    expect(initialQueues.fbqExists).toBe(true);

    // 3. Simulate User Interaction (scroll)
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });

    // Wait for network requests to trigger and succeed
    await page.waitForTimeout(1500);

    const hasGtagAfterInteraction = requestedUrls.some((url) =>
      url.includes('googletagmanager.com/gtag/js')
    );
    const hasFbAfterInteraction = requestedUrls.some((url) =>
      url.includes('connect.facebook.net/en_US/fbevents.js')
    );

    expect(hasGtagAfterInteraction).toBe(true);
    expect(hasFbAfterInteraction).toBe(true);

    // Verify SDKs load successfully and track
    const sdkStateAfter = await page.evaluate(() => {
      return {
        fbqLoaded: (window as any).fbq && (window as any).fbq.loaded === true,
        gtagExists: typeof (window as any).gtag === 'function',
      };
    });

    expect(sdkStateAfter.fbqLoaded).toBe(true);
    expect(sdkStateAfter.gtagExists).toBe(true);
  });

  test('measure mobile blocking task duration (CDP)', async ({ page, browserName }) => {
    // Only works on Chromium browser
    if (browserName !== 'chromium') {
      console.log('Skipping CDP performance timing check for non-chromium browser.');
      return;
    }

    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForTimeout(1000);

    const metricsBefore = await client.send('Performance.getMetrics');
    const taskDurationBefore =
      metricsBefore.metrics.find((m) => m.name === 'TaskDuration')?.value || 0;

    // Simulate interaction
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await page.waitForTimeout(1000);

    const metricsAfter = await client.send('Performance.getMetrics');
    const taskDurationAfter =
      metricsAfter.metrics.find((m) => m.name === 'TaskDuration')?.value || 0;

    console.log(`[Performance Metrics]`);
    console.log(`- Task Duration (Before Interaction): ${taskDurationBefore.toFixed(4)}s`);
    console.log(`- Task Duration (After Interaction): ${taskDurationAfter.toFixed(4)}s`);

    // Total Blocking Time (TBT) estimate is low because heavy tracking scripts are deferred
    expect(taskDurationBefore).toBeLessThan(1.5); // Ensure baseline tasks are lightweight on initial load
  });
});
