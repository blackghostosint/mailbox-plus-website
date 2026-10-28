import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAuditData, runAuditRootGate } from '../audit-root-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

const sampleAuditWithVuln = {
  auditReportVersion: 2,
  vulnerabilities: {
    sharp: {
      name: 'sharp',
      severity: 'high',
      isDirect: true,
      via: [
        {
          source: 1098234,
          name: 'sharp',
          dependency: 'sharp',
          title: 'Buffer overflow in sharp',
          url: 'https://github.com/advisories/GHSA-f88m-g3jw-g9cj',
          severity: 'high',
        },
      ],
    },
  },
};

describe('audit-root-gate.mjs', () => {
  describe('evaluateAuditData pure function', () => {
    it('flags high/critical advisories NOT in allowlist', () => {
      const offenders = evaluateAuditData(sampleAuditWithVuln, []);
      expect(offenders).toEqual(['GHSA-f88m-g3jw-g9cj (sharp)']);
    });

    it('excludes advisories allowed by AUDIT_ALLOW from offenders set', () => {
      const offenders = evaluateAuditData(sampleAuditWithVuln, ['GHSA-f88m-g3jw-g9cj']);
      expect(offenders).toEqual([]);
    });

    it('fails closed on missing, malformed, or error audit data payloads', () => {
      expect(() => evaluateAuditData(null as any, [])).toThrow('Audit payload is invalid or empty');
      expect(() => evaluateAuditData({ error: { code: 'ENOTFOUND' } }, [])).toThrow(
        'npm audit execution error'
      );
      expect(() => evaluateAuditData({}, [])).toThrow(
        'Audit payload missing vulnerabilities object'
      );
    });
  });

  describe('runAuditRootGate execution & CLI', () => {
    it('passes programmatically when mock payload advisory is in allowList', () => {
      const res = runAuditRootGate({
        mockRaw: JSON.stringify(sampleAuditWithVuln),
        allowList: ['GHSA-f88m-g3jw-g9cj'],
      });
      expect(res.success).toBe(true);
      expect(res.offenders).toEqual([]);
    });

    it('fails closed (exit status 1) when unhandled high advisory is in AUDIT_MOCK_RAW', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-root-gate.mjs', {
          cwd: ROOT,
          encoding: 'utf8',
          env: {
            ...process.env,
            AUDIT_MOCK_RAW: JSON.stringify(sampleAuditWithVuln),
            AUDIT_ALLOW: '',
          },
        });
      } catch (e: any) {
        threw = true;
        expect(e.status).not.toBe(0);
        expect(e.stderr || e.stdout).toContain(
          '❌ high/critical advisories NOT in allowlist: GHSA-f88m-g3jw-g9cj (sharp)'
        );
      }
      expect(threw).toBe(true);
    });

    it('passes (exit status 0) when advisory in AUDIT_MOCK_RAW is genuinely in AUDIT_ALLOW', () => {
      const stdout = execSync('node scripts/verify/audit-root-gate.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          AUDIT_MOCK_RAW: JSON.stringify(sampleAuditWithVuln),
          AUDIT_ALLOW: 'GHSA-f88m-g3jw-g9cj',
        },
      });

      expect(stdout).toContain(
        '✅ root audit: high advisories present are all in allowlist (GHSA-f88m-g3jw-g9cj)'
      );
    });

    it('fails closed (exit status 1) on invalid JSON audit output', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-root-gate.mjs', {
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
          '❌ root audit gate failed: unable to parse JSON output'
        );
      }
      expect(threw).toBe(true);
    });
  });
});
