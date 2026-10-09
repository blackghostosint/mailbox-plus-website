import { describe, it, expect } from 'vitest';
import { parseAuditPayload, evaluateAuditData, runAuditGate } from '../audit-utils.mjs';

describe('audit-utils.mjs', () => {
  describe('parseAuditPayload', () => {
    it('throws error on empty string or non-string', () => {
      expect(() => parseAuditPayload('')).toThrow('Audit payload is invalid or empty');
      expect(() => parseAuditPayload(null as any)).toThrow('Audit payload is invalid or empty');
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

    it('returns parsed payload for valid audit JSON', () => {
      const payload = JSON.stringify({ vulnerabilities: {} });
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

    it('allows high severity vulnerability when present in allowlist', () => {
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
  });
});
