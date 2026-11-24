import { describe, it, expect } from 'vitest';
import {
  parseAllowList,
  parseAuditPayload,
  evaluateAuditData,
  runAuditGate,
} from '../audit-utils.mjs';

describe('audit-utils.mjs', () => {
  describe('parseAllowList', () => {
    it('returns an empty array for undefined, null, empty string, or whitespace', () => {
      expect(parseAllowList(undefined)).toEqual([]);
      expect(parseAllowList(null as any)).toEqual([]);
      expect(parseAllowList('')).toEqual([]);
      expect(parseAllowList('   ')).toEqual([]);
    });

    it('parses space-separated GHSA strings', () => {
      expect(parseAllowList('GHSA-vfj7-8cjw-p6xm GHSA-xjh9-v7x6-24jw')).toEqual([
        'GHSA-vfj7-8cjw-p6xm',
        'GHSA-xjh9-v7x6-24jw',
      ]);
    });

    it('handles multiple spaces, tabs, and newlines in string input', () => {
      expect(parseAllowList('  GHSA-1111   \t GHSA-2222 \n GHSA-3333  ')).toEqual([
        'GHSA-1111',
        'GHSA-2222',
        'GHSA-3333',
      ]);
    });

    it('accepts array input and cleans empty or non-string elements', () => {
      expect(
        parseAllowList(['GHSA-vfj7-8cjw-p6xm', '', '   ', 'GHSA-xjh9-v7x6-24jw', null as any])
      ).toEqual(['GHSA-vfj7-8cjw-p6xm', 'GHSA-xjh9-v7x6-24jw']);
    });
  });

  describe('parseAuditPayload', () => {
    it('throws error on empty string, whitespace, or non-string/non-object', () => {
      expect(() => parseAuditPayload('')).toThrow('Audit payload is invalid or empty');
      expect(() => parseAuditPayload('   ')).toThrow('Audit payload is invalid or empty');
      expect(() => parseAuditPayload(null as any)).toThrow('Audit payload is invalid or empty');
      expect(() => parseAuditPayload(undefined as any)).toThrow(
        'Audit payload is invalid or empty'
      );
    });

    it('throws error on malformed JSON', () => {
      expect(() => parseAuditPayload('not-json')).toThrow(
        'unable to parse JSON output from npm audit'
      );
    });

    it('throws error when JSON contains npm audit error', () => {
      const payload = JSON.stringify({ error: { code: 'ENOTFOUND', summary: 'Network error' } });
      expect(() => parseAuditPayload(payload)).toThrow('npm audit execution error: Network error');
    });

    it('throws error when vulnerabilities object is missing', () => {
      const payload = JSON.stringify({ metadata: {} });
      expect(() => parseAuditPayload(payload)).toThrow(
        'Audit payload missing vulnerabilities object'
      );
    });

    it('returns parsed payload for valid audit JSON string or object', () => {
      const payload = { vulnerabilities: {} };
      expect(parseAuditPayload(JSON.stringify(payload))).toEqual({ vulnerabilities: {} });
      expect(parseAuditPayload(payload)).toEqual({ vulnerabilities: {} });
    });
  });

  describe('evaluateAuditData', () => {
    it('returns empty offenders list when no vulnerabilities exist', () => {
      const data = { vulnerabilities: {} };
      expect(evaluateAuditData(data, [])).toEqual([]);
    });

    it('filters out moderate and low severity vulnerabilities', () => {
      const data = {
        vulnerabilities: {
          pkgLow: {
            severity: 'low',
            via: [{ url: 'https://github.com/advisories/GHSA-low-severity' }],
          },
          pkgA: {
            severity: 'moderate',
            via: [{ url: 'https://github.com/advisories/GHSA-mod-1' }],
          },
        },
      };
      expect(evaluateAuditData(data, [])).toEqual([]);
    });

    it('flags high severity vulnerability not in allowlist', () => {
      const data = {
        vulnerabilities: {
          pkgB: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-1234-5678' }],
          },
        },
      };
      expect(evaluateAuditData(data, [])).toEqual(['GHSA-1234-5678 (pkgB)']);
    });

    it('allows high severity vulnerability when present in allowlist array', () => {
      const data = {
        vulnerabilities: {
          pkgB: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-1234-5678' }],
          },
        },
      };
      expect(evaluateAuditData(data, ['GHSA-1234-5678'])).toEqual([]);
    });

    it('accepts space-separated string as allowlist input', () => {
      const data = {
        vulnerabilities: {
          braces: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm' }],
          },
        },
      };
      expect(evaluateAuditData(data, 'GHSA-other-id GHSA-vfj7-8cjw-p6xm')).toEqual([]);
    });

    it('does NOT permit package names in allowlist to pass advisories', () => {
      const data = {
        vulnerabilities: {
          braces: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm' }],
          },
        },
      };
      expect(evaluateAuditData(data, ['braces'])).toEqual(['GHSA-vfj7-8cjw-p6xm (braces)']);
    });

    it('handles null vulnerability entries and non-object entries in via array safely', () => {
      const dataWithMixedEntries = {
        vulnerabilities: {
          nullPkg: null,
          nonArrayViaPkg: {
            severity: 'high',
            via: 'not-an-array',
          },
          braces: {
            severity: 'high',
            via: [
              'some-package-name',
              null,
              123,
              { url: 456 },
              { url: '' },
              {
                url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
              },
            ],
          },
        },
      };
      expect(evaluateAuditData(dataWithMixedEntries, [])).toEqual(['GHSA-vfj7-8cjw-p6xm (braces)']);
    });

    it('flags multiple non-allowlisted advisories correctly', () => {
      const dataWithTwoVulns = {
        vulnerabilities: {
          braces: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm' }],
          },
          sharp: {
            severity: 'critical',
            via: [{ url: 'https://github.com/advisories/GHSA-wq5f-xc86-pv6w' }],
          },
        },
      };
      expect(evaluateAuditData(dataWithTwoVulns, ['GHSA-vfj7-8cjw-p6xm'])).toEqual([
        'GHSA-wq5f-xc86-pv6w (sharp)',
      ]);
    });
  });

  describe('runAuditGate', () => {
    it('passes with mock raw output that matches allowlist', () => {
      const mockRaw = JSON.stringify({
        vulnerabilities: {
          pkgC: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-allowed-id' }],
          },
        },
      });

      const res = runAuditGate({
        mockRaw,
        allowList: ['GHSA-allowed-id'],
        gateName: 'test-gate',
      });

      expect(res.success).toBe(true);
      expect(res.offenders).toEqual([]);
    });

    it('accepts space-separated allowList string option', () => {
      const mockRaw = JSON.stringify({
        vulnerabilities: {
          pkgC: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-allowed-id' }],
          },
        },
      });

      const res = runAuditGate({
        mockRaw,
        allowList: 'GHSA-other GHSA-allowed-id',
        gateName: 'test-gate',
      });

      expect(res.success).toBe(true);
      expect(res.offenders).toEqual([]);
    });

    it('fails with mock raw output when advisory is not in allowlist', () => {
      const mockRaw = JSON.stringify({
        vulnerabilities: {
          pkgD: {
            severity: 'critical',
            via: [{ url: 'https://github.com/advisories/GHSA-blocked-id' }],
          },
        },
      });

      const res = runAuditGate({
        mockRaw,
        allowList: [],
        gateName: 'test-gate',
      });

      expect(res.success).toBe(false);
      expect(res.offenders).toEqual(['GHSA-blocked-id (pkgD)']);
    });

    it('ignores process.env.AUDIT_ALLOW when options.allowList is explicitly empty', () => {
      const mockRaw = JSON.stringify({
        vulnerabilities: {
          pkgD: {
            severity: 'high',
            via: [{ url: 'https://github.com/advisories/GHSA-env-id' }],
          },
        },
      });

      const prevAllow = process.env.AUDIT_ALLOW;
      process.env.AUDIT_ALLOW = 'GHSA-env-id';
      try {
        const resEmptyArray = runAuditGate({
          mockRaw,
          allowList: [],
          gateName: 'test-gate',
        });
        expect(resEmptyArray.success).toBe(false);
        expect(resEmptyArray.offenders).toEqual(['GHSA-env-id (pkgD)']);

        const resEmptyString = runAuditGate({
          mockRaw,
          allowList: '',
          gateName: 'test-gate',
        });
        expect(resEmptyString.success).toBe(false);
        expect(resEmptyString.offenders).toEqual(['GHSA-env-id (pkgD)']);

        const resFromEnv = runAuditGate({
          mockRaw,
          gateName: 'test-gate',
        });
        expect(resFromEnv.success).toBe(true);
        expect(resFromEnv.offenders).toEqual([]);
      } finally {
        if (prevAllow === undefined) {
          delete process.env.AUDIT_ALLOW;
        } else {
          process.env.AUDIT_ALLOW = prevAllow;
        }
      }
    });
  });
});
