import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { resolveDistDir } from '../lib/dist-path.mjs';
import {
  parseArgs,
  categorizeRoute,
  selectRepresentativeRoutes,
  selectSampledRoutes,
  evaluateBatchResult,
  saveAuditReport,
  discoverRoutes,
  CATEGORIES,
} from '../audit-a11y.mjs';

describe('Accessibility Audit Suite (axe-core unit tests)', () => {
  const distDir = resolveDistDir();

  describe('parseArgs', () => {
    it('parses default CLI options correctly', () => {
      const options = parseArgs([]);
      expect(options.all).toBe(false);
      expect(options.limit).toBeNull();
      expect(options.category).toBeNull();
      expect(options.outputDir).toBe('a11y-reports');
    });

    it('parses --all, --limit, --category, --base-url, and --output-dir flags', () => {
      const options = parseArgs([
        '--all',
        '--limit=5',
        '--category=articles',
        '--base-url=http://localhost:3000',
        '--output-dir=/tmp/reports',
      ]);
      expect(options.all).toBe(true);
      expect(options.limit).toBe(5);
      expect(options.category).toBe('articles');
      expect(options.baseUrl).toBe('http://localhost:3000');
      expect(options.outputDir).toBe('/tmp/reports');
    });
  });

  describe('categorizeRoute', () => {
    it('correctly categorizes routes into template categories', () => {
      expect(categorizeRoute('/')).toBe(CATEGORIES.HOMEPAGE);
      expect(categorizeRoute('/services/')).toBe(CATEGORIES.SERVICE_PILLARS);
      expect(categorizeRoute('/pack-ship/fedex-shipping/')).toBe(CATEGORIES.SERVICE_DETAILS);
      expect(categorizeRoute('/articles/shipping-tips/')).toBe(CATEGORIES.ARTICLES);
      expect(categorizeRoute('/guide/packing/')).toBe(CATEGORIES.GUIDES);
      expect(categorizeRoute('/service-area/concord/')).toBe(CATEGORIES.LOCAL_LANDING);
      expect(categorizeRoute('/privacy/')).toBe(CATEGORIES.UTILITY_LEGAL);
      expect(categorizeRoute('/tracking/')).toBe(CATEGORIES.INTERACTIVE);
      expect(categorizeRoute('/research/shipping-label-osint/')).toBe(CATEGORIES.INTERACTIVE);
    });
  });

  describe('selectRepresentativeRoutes', () => {
    it('selects preferred representative routes per category', () => {
      const categorized = {
        [CATEGORIES.ARTICLES]: [
          '/articles/other-article/',
          '/articles/concord-township-shipping-insurance/',
        ],
        [CATEGORIES.GUIDES]: ['/guide/shipping-wine/', '/guide/boxes/'],
      };
      const selected = selectRepresentativeRoutes(categorized);
      expect(selected).toContain('/articles/concord-township-shipping-insurance/');
      expect(selected).toContain('/guide/shipping-wine/');
      expect(selected.length).toBe(2);
    });

    it('mandates full coverage for interactive and utility categories while sampling others', () => {
      const categorized = {
        [CATEGORIES.INTERACTIVE]: [
          '/tracking/',
          '/ask-mailbox-plus/',
          '/amazon-counter/',
          '/research/shipping-label-osint/',
        ],
        [CATEGORIES.UTILITY_LEGAL]: ['/contact-us/', '/after-signup/', '/accessibility/'],
        [CATEGORIES.ARTICLES]: ['/articles/one/', '/articles/two/'],
      };
      const selected = selectRepresentativeRoutes(categorized);
      expect(selected).toContain('/tracking/');
      expect(selected).toContain('/ask-mailbox-plus/');
      expect(selected).toContain('/amazon-counter/');
      expect(selected).toContain('/research/shipping-label-osint/');
      expect(selected).toContain('/contact-us/');
      expect(selected).toContain('/after-signup/');
      expect(selected).toContain('/accessibility/');
      expect(selected).toContain('/articles/one/');
      expect(selected.length).toBe(8);
    });
  });

  describe('evaluateBatchResult', () => {
    it('returns SUCCESS when all pages pass with zero violations and code 0', () => {
      const stdout = `
Testing http://127.0.0.1:4173/ ...
 0 violations found!
Testing http://127.0.0.1:4173/about-us/ ...
 0 violations found!
Testing complete of 2 pages
`;
      const result = evaluateBatchResult({ code: 0, stdout, stderr: '' }, 2);
      expect(result.type).toBe('SUCCESS');
    });

    it('returns SUCCESS when all pages pass with zero violations despite non-zero exit code', () => {
      const stdout = `
Testing http://127.0.0.1:4173/ ...
 0 violations found!
Testing http://127.0.0.1:4173/contact-us/ ...
 0 violations found!
Testing complete of 2 pages
`;
      const stderr = 'Notice: chromedriver driver teardown warning';
      const result = evaluateBatchResult({ code: 1, stdout, stderr }, 2);
      expect(result.type).toBe('SUCCESS');
    });

    it('returns WCAG_VIOLATIONS when actual violations are reported in stdout', () => {
      const stdout = `
Testing http://127.0.0.1:4173/bad ...
  Violation of "color-contrast" with 1 occurrences!
1 Accessibility issue detected.
Testing complete of 1 pages
`;
      const result = evaluateBatchResult({ code: 1, stdout, stderr: '' }, 1);
      expect(result.type).toBe('WCAG_VIOLATIONS');
    });

    it('returns CLI_ERROR with error details when audit fails before completing all pages', () => {
      const stdout = `
Testing http://127.0.0.1:4173/ ...
 0 violations found!
`;
      const stderr = 'Error: WebDriverError: chrome not reachable';
      const result = evaluateBatchResult({ code: 1, stdout, stderr }, 2);
      expect(result.type).toBe('CLI_ERROR');
      expect(result.message).toContain('chrome not reachable');
    });
  });

  describe('selectSampledRoutes', () => {
    it('samples standalone utility pages and category representative routes', () => {
      const routes = [
        '/',
        '/accessibility/',
        '/contact-us/',
        '/articles/',
        '/articles/first-article/',
        '/articles/second-article/',
        '/service-area/',
        '/service-area/mentor/',
      ];
      const sampled = selectSampledRoutes(routes);
      expect(sampled).toContain('/');
      expect(sampled).toContain('/accessibility/');
      expect(sampled).toContain('/contact-us/');
      expect(sampled).toContain('/articles/');
      expect(sampled).toContain('/articles/first-article/');
      expect(sampled).toContain('/service-area/');
      expect(sampled).toContain('/service-area/mentor/');
      expect(sampled.length).toBeLessThan(routes.length);
    });
  });

  describe('saveAuditReport', () => {
    it('writes structured json audit report to specified output directory', () => {
      const targetDir = path.join(process.cwd(), 'node_modules', '.tmp-a11y-test-report');
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }

      const sampleData = {
        timestamp: '2026-10-16T12:00:00.000Z',
        mode: 'sampled',
        summary: {
          totalAudited: 5,
          hasA11yViolations: false,
          hasCliErrors: false,
          status: 'PASSED',
        },
      };

      saveAuditReport(sampleData, targetDir);

      const reportFilePath = path.join(targetDir, 'a11y-audit-report.json');
      expect(fs.existsSync(reportFilePath)).toBe(true);

      const savedContent = JSON.parse(fs.readFileSync(reportFilePath, 'utf8'));
      expect(savedContent.summary.status).toBe('PASSED');
      expect(savedContent.summary.totalAudited).toBe(5);

      fs.rmSync(targetDir, { recursive: true, force: true });
    });
  });

  describe('discoverRoutes', () => {
    it('discovers routes when build directory exists', () => {
      expect(fs.existsSync(distDir)).toBe(true);
      const routes = discoverRoutes(distDir);
      expect(routes.length).toBeGreaterThan(0);
      expect(routes).toContain('/');
    });

    it('exits with error when build directory is missing', () => {
      const spyExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {});

      discoverRoutes('/non-existent-dist-directory-9999');

      expect(spyExit).toHaveBeenCalledWith(1);
      spyExit.mockRestore();
      spyErr.mockRestore();
    });
  });
});
