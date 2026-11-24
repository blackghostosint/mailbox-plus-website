import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAuditAstroGate } from '../audit-astro-gate.mjs';

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
