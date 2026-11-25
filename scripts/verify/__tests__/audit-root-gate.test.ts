import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAuditRootGate } from '../audit-root-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

const sampleRootAuditWithVuln = {
  auditReportVersion: 2,
  vulnerabilities: {
    picomatch: {
      name: 'picomatch',
      severity: 'high',
      isDirect: false,
      via: [
        {
          source: 1100001,
          name: 'picomatch',
          dependency: 'picomatch',
          title: 'ReDoS in picomatch extglob matching',
          url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
          severity: 'high',
        },
      ],
    },
  },
};

describe('audit-root-gate.mjs', () => {
  describe('runAuditRootGate execution & CLI', () => {
    it('passes with mock raw payload when advisory is in allowList option', () => {
      const res = runAuditRootGate({
        mockRaw: JSON.stringify(sampleRootAuditWithVuln),
        allowList: ['GHSA-fc5q-39xc-vjpf'],
      });
      expect(res.success).toBe(true);
      expect(res.offenders).toEqual([]);
    });

    it('fails with mock raw payload when advisory is not in allowList option', () => {
      const res = runAuditRootGate({
        mockRaw: JSON.stringify(sampleRootAuditWithVuln),
        allowList: [],
      });
      expect(res.success).toBe(false);
      expect(res.offenders).toEqual(['GHSA-fc5q-39xc-vjpf (picomatch)']);
    });

    it('passes CLI invocation when advisory in AUDIT_MOCK_RAW is allowed via AUDIT_ALLOW', () => {
      const stdout = execSync('node scripts/verify/audit-root-gate.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          AUDIT_MOCK_RAW: JSON.stringify(sampleRootAuditWithVuln),
          AUDIT_ALLOW: 'GHSA-fc5q-39xc-vjpf',
        },
      });

      expect(stdout).toContain(
        '✅ root audit: high advisories present are all in allowlist (GHSA-fc5q-39xc-vjpf)'
      );
    });

    it('fails closed (exit status 1) CLI invocation when unhandled advisory is in AUDIT_MOCK_RAW', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-root-gate.mjs', {
          cwd: ROOT,
          encoding: 'utf8',
          env: {
            ...process.env,
            AUDIT_MOCK_RAW: JSON.stringify(sampleRootAuditWithVuln),
            AUDIT_ALLOW: '',
          },
        });
      } catch (e: any) {
        threw = true;
        expect(e.status).not.toBe(0);
        expect(e.stderr || e.stdout).toContain(
          '❌ high/critical advisories NOT in allowlist: GHSA-fc5q-39xc-vjpf (picomatch)'
        );
      }
      expect(threw).toBe(true);
    });

    it('fails closed (exit status 1) CLI invocation on malformed JSON output', () => {
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
