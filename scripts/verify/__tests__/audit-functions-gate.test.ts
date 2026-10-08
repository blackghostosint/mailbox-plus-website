import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAuditData, runAuditFunctionsGate } from '../audit-functions-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

const sampleAuditWithVuln = {
  auditReportVersion: 2,
  vulnerabilities: {
    '@fastify/busboy': {
      name: '@fastify/busboy',
      severity: 'high',
      isDirect: true,
      via: [
        {
          source: 1098234,
          name: '@fastify/busboy',
          dependency: '@fastify/busboy',
          title: 'Denial of Service in @fastify/busboy',
          url: 'https://github.com/advisories/GHSA-xjh9-v7x6-24jw',
          severity: 'high',
        },
      ],
    },
  },
};

describe('audit-functions-gate.mjs', () => {
  describe('evaluateAuditData pure function', () => {
    it('flags high/critical advisories NOT in allowlist', () => {
      const offenders = evaluateAuditData(sampleAuditWithVuln, []);
      expect(offenders).toEqual(['GHSA-xjh9-v7x6-24jw (@fastify/busboy)']);
    });

    it('excludes advisories genuinely allowed by AUDIT_ALLOW from offenders set', () => {
      const offenders = evaluateAuditData(sampleAuditWithVuln, ['GHSA-xjh9-v7x6-24jw']);
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

  describe('runAuditFunctionsGate execution & CLI', () => {
    it('passes audit check for netlify/functions with exit code 0 on clean repo', () => {
      const stdout = execSync('node scripts/verify/audit-functions-gate.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
      });

      expect(stdout).toContain(
        '✅ netlify/functions audit: high advisories present are all in allowlist'
      );
    });

    it('fails closed (exit status 1) when unhandled high advisory is in AUDIT_MOCK_RAW', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-functions-gate.mjs', {
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
          '❌ high/critical advisories NOT in allowlist: GHSA-xjh9-v7x6-24jw (@fastify/busboy)'
        );
      }
      expect(threw).toBe(true);
    });

    it('passes (exit status 0) when advisory in AUDIT_MOCK_RAW is genuinely in AUDIT_ALLOW', () => {
      const stdout = execSync('node scripts/verify/audit-functions-gate.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          AUDIT_MOCK_RAW: JSON.stringify(sampleAuditWithVuln),
          AUDIT_ALLOW: 'GHSA-xjh9-v7x6-24jw',
        },
      });

      expect(stdout).toContain(
        '✅ netlify/functions audit: high advisories present are all in allowlist (GHSA-xjh9-v7x6-24jw)'
      );
    });

    it('fails closed (exit status 1) on invalid JSON audit output', () => {
      let threw = false;
      try {
        execSync('node scripts/verify/audit-functions-gate.mjs', {
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
          '❌ netlify/functions audit gate failed: unable to parse JSON output'
        );
      }
      expect(threw).toBe(true);
    });
  });
});
