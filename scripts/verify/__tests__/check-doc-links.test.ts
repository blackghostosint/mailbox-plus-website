import { describe, it, expect } from 'vitest';
import path from 'node:path';
import {
  validateMarkdownContent,
  checkPathExists,
  isSiteRouteUrl,
  isDynamicOrPlaceholderPath,
  isWebDomain,
  ROOT,
} from '../check-doc-links.mjs';

describe('check-doc-links', () => {
  it('passes when markdown contains valid file paths and relative links', () => {
    const markdown = [
      '# Documentation Guide',
      '',
      'Refer to `package.json` and `scripts/verify/README.md`.',
      'Check the security guide at [Security Docs](../../docs/SECURITY.md).',
      'Check website route [Contact Page](/contact-us/).',
    ].join('\n');

    const errors = validateMarkdownContent(markdown, path.join(ROOT, 'scripts', 'verify'), ROOT);
    expect(errors).toHaveLength(0);
  });

  it('detects broken file paths in backticks', () => {
    const markdown = ['# Test Guide', 'Check `non/existent/script/file.js` for details.'].join(
      '\n'
    );

    const errors = validateMarkdownContent(markdown, ROOT, ROOT);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('BACKTICK');
    expect(errors[0].target).toBe('non/existent/script/file.js');
    expect(errors[0].lineNum).toBe(2);
  });

  it('detects broken markdown link targets', () => {
    const markdown = [
      '# Test Guide',
      'Read the [Nonexistent Guide](./non-existent-guide.md).',
    ].join('\n');

    const errors = validateMarkdownContent(markdown, ROOT, ROOT);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('LINK');
    expect(errors[0].target).toBe('./non-existent-guide.md');
    expect(errors[0].lineNum).toBe(2);
  });

  it('skips external http/https links and website route URLs', () => {
    const markdown = [
      'Visit [Website](https://mailboxplusohio.com).',
      'Check [Services](/services/) and [API Endpoint](/.netlify/functions/health).',
    ].join('\n');

    const errors = validateMarkdownContent(markdown, ROOT, ROOT);
    expect(errors).toHaveLength(0);
  });

  it('handles dynamic placeholder paths and wildcard patterns', () => {
    const markdown = [
      'Export search data to `scripts/audits/search-console-data/YYYY-MM-DD.csv`.',
      'Pass parameters `node scripts/verify/verify.mjs article <path.md>`.',
    ].join('\n');

    const errors = validateMarkdownContent(markdown, ROOT, ROOT);
    expect(errors).toHaveLength(0);
  });

  it('correctly identifies website route URLs vs repo file paths', () => {
    expect(isSiteRouteUrl('/services/')).toBe(true);
    expect(isSiteRouteUrl('/contact-us/')).toBe(true);
    expect(isSiteRouteUrl('/.netlify/functions/health')).toBe(true);

    expect(isSiteRouteUrl('/docs/SECURITY.md')).toBe(false);
    expect(isSiteRouteUrl('/scripts/verify/README.md')).toBe(false);
  });

  it('correctly detects dynamic path placeholders', () => {
    expect(isDynamicOrPlaceholderPath('search-console-data/YYYY-MM-DD.csv')).toBe(true);
    expect(isDynamicOrPlaceholderPath('reports/*.md')).toBe(true);
    expect(isDynamicOrPlaceholderPath('node verify.mjs <path.md>')).toBe(true);
    expect(isDynamicOrPlaceholderPath('scripts/verify/check-doc-links.mjs')).toBe(false);
  });

  it('correctly identifies web domains and hostnames', () => {
    expect(isWebDomain('mailboxplusohio.com')).toBe(true);
    expect(isWebDomain('google.com')).toBe(true);
    expect(isWebDomain('facebook.com')).toBe(true);
    expect(isWebDomain('subdomain.google.com')).toBe(true);
    expect(isWebDomain('https://mailboxplusohio.com/services/')).toBe(true);

    expect(isWebDomain('scripts/verify/check-doc-links.mjs')).toBe(false);
    expect(isWebDomain('package.json')).toBe(false);
    expect(isWebDomain('google.com.attacker.com')).toBe(false);
  });
});
