import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { resolveDistDir } from '../lib/dist-path.mjs';
import {
  discoverRoutes,
  categorizeRoute,
  selectRepresentativeRoutes,
  startBackgroundServer,
  cleanupServer,
  runAxeCliBatch,
  evaluateBatchResult,
  CATEGORIES,
} from '../audit-a11y.mjs';

describe('Accessibility Audit Suite (axe-core)', () => {
  const distDir = resolveDistDir();
  let baseUrl: string | null = null;

  beforeAll(async () => {
    if (fs.existsSync(distDir)) {
      baseUrl = process.env.AUDIT_BASE_URL || (await startBackgroundServer(distDir, 4173));
    }
  });

  afterAll(() => {
    cleanupServer();
  });

  it('verifies route categorization and representative route selection', () => {
    const homepageCat = categorizeRoute('/');
    expect(homepageCat).toBe(CATEGORIES.HOMEPAGE);

    const packShipCat = categorizeRoute('/pack-ship/');
    expect(packShipCat).toBe(CATEGORIES.SERVICE_PILLARS);

    const articleCat = categorizeRoute('/articles/test-article/');
    expect(articleCat).toBe(CATEGORIES.ARTICLES);
  });

  it('runs accessibility audit across sampled routes when dist/ exists', async () => {
    if (!fs.existsSync(distDir)) {
      console.warn('dist/ directory not found. Skipping live axe-core audit test.');
      return;
    }

    expect(baseUrl).toBeTruthy();

    const allRoutes = discoverRoutes(distDir);
    expect(allRoutes.length).toBeGreaterThan(0);

    const categorized: Record<string, string[]> = {};
    for (const catVal of Object.values(CATEGORIES)) {
      categorized[catVal] = [];
    }
    for (const r of allRoutes) {
      const cat = categorizeRoute(r);
      if (categorized[cat]) {
        categorized[cat].push(r);
      }
    }

    const selectedRoutes = selectRepresentativeRoutes(categorized);
    expect(selectedRoutes.length).toBeGreaterThan(0);

    // Ensure Chrome/ChromeDriver binaries are installed
    try {
      execSync('npx --yes browser-driver-manager install chrome', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    } catch {
      // Driver manager output error handled in batch runner
    }

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

    const targetUrls = selectedRoutes.map((r) => new URL(r, baseUrl!).href);
    const result = await runAxeCliBatch(targetUrls, {
      chromePath,
      chromedriverPath,
      outputDir: path.resolve(process.cwd(), 'a11y-reports'),
    });

    const evaluation = evaluateBatchResult(result, targetUrls.length);
    expect(evaluation.type).not.toBe('WCAG_VIOLATIONS');
    expect(evaluation.type).toBe('SUCCESS');
  }, 120000);
});
