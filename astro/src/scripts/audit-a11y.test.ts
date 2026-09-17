import { describe, it, expect } from 'vitest';
import {
  evaluateBatchResult,
  selectSampledRoutes,
  categorizeRoute,
  selectRepresentativeRoutes,
  parseArgs,
  CATEGORIES,
} from '../../../scripts/audit-a11y.mjs';

describe('audit-a11y script', () => {
  describe('parseArgs', () => {
    it('parses --all, --limit, --category, and --base-url flags', () => {
      const args = [
        '--all',
        '--limit=5',
        '--category=Articles',
        '--base-url=http://localhost:3000',
      ];
      const options = parseArgs(args);
      expect(options.all).toBe(true);
      expect(options.limit).toBe(5);
      expect(options.category).toBe('Articles');
      expect(options.baseUrl).toBe('http://localhost:3000');
    });

    it('parses space-separated --limit, --category, and --base-url arguments', () => {
      const args = ['--limit', '10', '--category', 'guides', '--base-url', 'http://127.0.0.1:4173'];
      const options = parseArgs(args);
      expect(options.limit).toBe(10);
      expect(options.category).toBe('guides');
      expect(options.baseUrl).toBe('http://127.0.0.1:4173');
    });

    it('defaults options when no arguments are provided', () => {
      const options = parseArgs([]);
      expect(options.all).toBe(false);
      expect(options.limit).toBeNull();
      expect(options.category).toBeNull();
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

    it('returns SUCCESS when all pages pass with 0 violations even if stdout contains warning logs and non-zero exit code', () => {
      const stdout = `
Testing http://127.0.0.1:4173/ ...
 0 violations found!
Testing http://127.0.0.1:4173/about-us/ ...
 0 violations found!
Testing complete of 2 pages
Please note that only 20% to 50% of all accessibility issues can automatically be detected.
`;
      const stderr = 'Warning: ChromeDriver process exited non-zero';
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

    it('returns SUCCESS when stdout contains ANSI escape codes or flexible zero-violation strings', () => {
      const stdout = `
Testing http://127.0.0.1:4173/ ...
\u001b[32m 0 violations found!\u001b[39m
Testing http://127.0.0.1:4173/about-us/ ...
 0 violation found.
Testing complete of 2 pages
`;
      const result = evaluateBatchResult({ code: 0, stdout, stderr: '' }, 2);
      expect(result.type).toBe('SUCCESS');
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
});
