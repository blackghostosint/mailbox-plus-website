import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseAllowList,
  parseAuditReport,
  evaluateAuditVulnerabilities,
  runAuditAstroGate,
} from '../audit-astro-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

const sampleAstroAuditWithVuln = {
  auditReportVersion: 2,
  vulnerabilities: {
    braces: {
      name: 'braces',
      severity: 'high',
      isDirect: false,
      via: [
        {
          source: 1098000,
          name: 'braces',
          dependency: 'braces',
          title: 'Uncontrolled resource consumption in braces',
          url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
          severity: 'high',
        },
      ],
    },
  },
};

describe('audit-astro-gate.mjs', () => {
  describe('parseAllowList pure function', () => {
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

  describe('parseAuditReport pure function', () => {
    it('throws error on empty string or null/undefined payload', () => {
      expect(() => parseAuditReport('')).toThrow('Audit payload is invalid or empty');
      expect(() => parseAuditReport(null as any)).toThrow('Audit payload is invalid or empty');
    });

    it('throws error on malformed JSON output', () => {
      expect(() => parseAuditReport('not-valid-json')).toThrow(
        'unable to parse JSON output from npm audit'
      );
    });

    it('throws error when audit JSON contains execution error', () => {
      const payload = JSON.stringify({ error: { code: 'ENOTFOUND', summary: 'Network failed' } });
      expect(() => parseAuditReport(payload)).toThrow('npm audit execution error: Network failed');
    });

    it('throws error when vulnerabilities object is missing', () => {
      const payload = JSON.stringify({ metadata: {} });
      expect(() => parseAuditReport(payload)).toThrow(
        'Audit payload missing vulnerabilities object'
      );
    });

    it('returns parsed payload object for valid audit JSON string or object', () => {
      const payload = { vulnerabilities: {} };
      expect(parseAuditReport(JSON.stringify(payload))).toEqual({ vulnerabilities: {} });
      expect(parseAuditReport(payload)).toEqual({ vulnerabilities: {} });
    });
  });

  describe('evaluateAuditVulnerabilities pure function', () => {
    it('returns empty offenders list when no vulnerabilities exist', () => {
      const data = { vulnerabilities: {} };
      expect(evaluateAuditVulnerabilities(data, [])).toEqual([]);
    });

    it('filters out moderate and low severity vulnerabilities', () => {
      const data = {
        vulnerabilities: {
          pkgLow: {
            severity: 'low',
            via: [{ url: 'https://github.com/advisories/GHSA-low-severity' }],
          },
          pkgMod: {
            severity: 'moderate',
            via: [{ url: 'https://github.com/advisories/GHSA-moderate-severity' }],
          },
        },
      };
      expect(evaluateAuditVulnerabilities(data, [])).toEqual([]);
    });

    it('flags high/critical advisories NOT in allowlist', () => {
      const offenders = evaluateAuditVulnerabilities(sampleAstroAuditWithVuln, []);
      expect(offenders).toEqual(['GHSA-vfj7-8cjw-p6xm (braces)']);
    });

    it('excludes advisories that are in allowlist', () => {
      const offenders = evaluateAuditVulnerabilities(sampleAstroAuditWithVuln, [
        'GHSA-vfj7-8cjw-p6xm',
      ]);
      expect(offenders).toEqual([]);
    });

    it('accepts space-separated string as allowlist input', () => {
      const offenders = evaluateAuditVulnerabilities(
        sampleAstroAuditWithVuln,
        'GHSA-other-id GHSA-vfj7-8cjw-p6xm'
      );
      expect(offenders).toEqual([]);
    });

    it('does NOT permit package names in allowlist to pass advisories', () => {
      const offenders = evaluateAuditVulnerabilities(sampleAstroAuditWithVuln, ['braces']);
      expect(offenders).toEqual(['GHSA-vfj7-8cjw-p6xm (braces)']);
    });

    it('handles non-object entries in via array safely', () => {
      const dataWithMixedVia = {
        vulnerabilities: {
          braces: {
            severity: 'high',
            via: [
              'some-package-name',
              null,
              123,
              {
                url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
              },
            ],
          },
        },
      };
      const offenders = evaluateAuditVulnerabilities(dataWithMixedVia, []);
      expect(offenders).toEqual(['GHSA-vfj7-8cjw-p6xm (braces)']);
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
      const offenders = evaluateAuditVulnerabilities(dataWithTwoVulns, ['GHSA-vfj7-8cjw-p6xm']);
      expect(offenders).toEqual(['GHSA-wq5f-xc86-pv6w (sharp)']);
    });
  });

  describe('runAuditAstroGate execution & CLI', () => {
    it('passes with mock raw payload when advisory is in allowList option', () => {
      const res = runAuditAstroGate({
        mockRaw: JSON.stringify(sampleAstroAuditWithVuln),
        allowList: ['GHSA-vfj7-8cjw-p6xm'],
      });
      expect(res.success).toBe(true);
      expect(res.offenders).toEqual([]);
    });

    it('fails with mock raw payload when advisory is not in allowList option', () => {
      const res = runAuditAstroGate({
        mockRaw: JSON.stringify(sampleAstroAuditWithVuln),
        allowList: [],
      });
      expect(res.success).toBe(false);
      expect(res.offenders).toEqual(['GHSA-vfj7-8cjw-p6xm (braces)']);
    });

    it('passes CLI invocation when advisory in AUDIT_MOCK_RAW is allowed via AUDIT_ALLOW', () => {
      const stdout = execSync('node scripts/verify/audit-astro-gate.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          AUDIT_MOCK_RAW: JSON.stringify(sampleAstroAuditWithVuln),
          AUDIT_ALLOW: 'GHSA-vfj7-8cjw-p6xm',
        },
      });

      expect(stdout).toContain(
        '✅ astro audit: high advisories present are all in allowlist (GHSA-vfj7-8cjw-p6xm)'
      );
    });

    it('fails closed (exit status 1) CLI invocation when unhandled advisory is in AUDIT_MOCK_RAW', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-astro-gate.mjs', {
          cwd: ROOT,
          encoding: 'utf8',
          env: {
            ...process.env,
            AUDIT_MOCK_RAW: JSON.stringify(sampleAstroAuditWithVuln),
            AUDIT_ALLOW: '',
          },
        });
      } catch (e: any) {
        threw = true;
        expect(e.status).not.toBe(0);
        expect(e.stderr || e.stdout).toContain(
          '❌ high/critical advisories NOT in allowlist: GHSA-vfj7-8cjw-p6xm (braces)'
        );
      }
      expect(threw).toBe(true);
    });

    it('fails closed (exit status 1) CLI invocation on malformed JSON output', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-astro-gate.mjs', {
          cwd: ROOT,
          encoding: 'utf8',
          env: {
            ...process.env,
            AUDIT_MOCK_RAW: 'invalid json string',
          },
        });
      } catch (e: any) {
        threw = true;
        expect(e.status).not.toBe(0);
        expect(e.stderr || e.stdout).toContain(
          '❌ astro audit gate failed: unable to parse JSON output'
        );
      }
      expect(threw).toBe(true);
    });
  });
});
