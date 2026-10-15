import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from 'vitest';
import {
  parseRedirects,
  checkCatchAllPlacement,
  checkShadowedRules,
  checkCircularLoops,
  auditRedirects,
  checkRedirectsFile,
  DEFAULT_REDIRECTS_PATH,
} from '../check-redirects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('check-redirects linter script', () => {
  describe('parseRedirects', () => {
    it('parses redirect rules correctly and ignores comments and blank lines', () => {
      const sample = `
# Comment line
/Store-Hours /contact-us 301!

# Another comment
/old-page /new-page 301
/temp-page /dest-page 302
/* /404.html 404
`;
      const rules = parseRedirects(sample);
      expect(rules).toHaveLength(4);

      expect(rules[0]).toEqual({
        lineNum: 3,
        from: '/Store-Hours',
        to: '/contact-us',
        status: '301',
        isForced: true,
        rawStatus: '301!',
        raw: '/Store-Hours /contact-us 301!',
      });

      expect(rules[1]).toEqual({
        lineNum: 6,
        from: '/old-page',
        to: '/new-page',
        status: '301',
        isForced: false,
        rawStatus: '301',
        raw: '/old-page /new-page 301',
      });

      expect(rules[2].status).toBe('302');
      expect(rules[3].status).toBe('404');
    });
  });

  describe('checkCatchAllPlacement', () => {
    it('fails when explicit rules sit below a /* catch-all', () => {
      const sample = `
/old-page /new-page 301!
/* /404.html 404
/rewards/join /home-business/mailbox-rental/ 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkCatchAllPlacement(rules);

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('sits below wildcard catch-all');
      expect(errors[0]).toContain('/rewards/join');
    });

    it('passes when wildcard catch-all sits at the bottom of the file', () => {
      const sample = `
/old-page /new-page 301!
/rewards/join /home-business/mailbox-rental/ 301!
/* /404.html 404
`;
      const rules = parseRedirects(sample);
      const errors = checkCatchAllPlacement(rules);

      expect(errors).toHaveLength(0);
    });
  });

  describe('checkShadowedRules', () => {
    it('detects when a specific subpath rule is shadowed by a prefix wildcard rule', () => {
      const sample = `
/Pack-Ship/* /pack-ship/:splat 301!
/Pack-Ship/Shipping/UPS /pack-ship/ups-shipping/ 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkShadowedRules(rules);

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('is shadowed by earlier rule');
      expect(errors[0]).toContain('/Pack-Ship/Shipping/UPS');
    });

    it('passes when specific subpath rules sit before prefix wildcard rules', () => {
      const sample = `
/Pack-Ship/Shipping/UPS /pack-ship/ups-shipping/ 301!
/Pack-Ship/* /pack-ship/:splat 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkShadowedRules(rules);

      expect(errors).toHaveLength(0);
    });

    it('ignores domain-level HTTPS rules when evaluating path shadowing', () => {
      const sample = `
http://mailboxplusohio.com/* https://mailboxplusohio.com/:splat 301!
/Pack-Ship/Shipping/UPS /pack-ship/ups-shipping/ 301!
/Pack-Ship/* /pack-ship/:splat 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkShadowedRules(rules);

      expect(errors).toHaveLength(0);
    });
  });

  describe('checkCircularLoops', () => {
    it('detects direct self-redirect loops', () => {
      const sample = `
/same-page /same-page 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkCircularLoops(rules);

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Circular redirect loop detected');
      expect(errors[0]).toContain('/same-page');
    });

    it('detects multi-hop circular redirect loops', () => {
      const sample = `
/path-a /path-b 301!
/path-b /path-c 301!
/path-c /path-a 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkCircularLoops(rules);

      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(errors[0]).toContain('Circular redirect loop detected');
    });

    it('passes valid non-circular redirect chains', () => {
      const sample = `
/legacy-page /intermediate-page 301!
/intermediate-page /canonical-target/ 301!
`;
      const rules = parseRedirects(sample);
      const errors = checkCircularLoops(rules);

      expect(errors).toHaveLength(0);
    });
  });

  describe('auditRedirects end-to-end', () => {
    it('validates a correct redirect manifest', () => {
      const sample = `
# Canonical Domain
http://mailboxplusohio.com/* https://mailboxplusohio.com/:splat 301!

# Specific fixes
/Pack-Ship/Shipping/UPS /pack-ship/ups 301!
/Pack-Ship/* /pack-ship/:splat 301!

# Catch-all
/* /404.html 404
`;
      const result = auditRedirects(sample);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.rulesCount).toBe(4);
    });
  });

  describe('checkRedirectsFile on public/_redirects', () => {
    it('passes validation for the repository public/_redirects file', () => {
      const result = checkRedirectsFile(DEFAULT_REDIRECTS_PATH);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.rulesCount).toBeGreaterThan(50);
    });
  });
});
