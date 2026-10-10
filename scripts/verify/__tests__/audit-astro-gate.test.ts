import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

describe('audit-astro-gate.mjs', () => {
  it('passes audit check for astro with exit code 0 when dependencies have no unhandled advisories', () => {
    const stdout = execSync('node scripts/verify/audit-astro-gate.mjs', {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        AUDIT_ALLOW: '',
      },
    });

    expect(stdout).toContain('✅ astro audit: high advisories present are all in allowlist');
  }, 15000);

  it('fails closed (exit status 1) when unhandled high advisory is in AUDIT_MOCK_RAW without AUDIT_ALLOW', () => {
    const mockAuditWithNewVuln = {
      auditReportVersion: 2,
      vulnerabilities: {
        'some-bad-package': {
          name: 'some-bad-package',
          severity: 'high',
          isDirect: true,
          via: [
            {
              source: 9999999,
              name: 'some-bad-package',
              dependency: 'some-bad-package',
              title: 'Critical Vulnerability in some-bad-package',
              url: 'https://github.com/advisories/GHSA-9999-8888-7777',
              severity: 'high',
            },
          ],
        },
      },
    };

    let threw = false;
    try {
      execSync('node scripts/verify/audit-astro-gate.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          AUDIT_MOCK_RAW: JSON.stringify(mockAuditWithNewVuln),
          AUDIT_ALLOW: '',
        },
      });
    } catch (e: any) {
      threw = true;
      expect(e.status).not.toBe(0);
      expect(e.stderr || e.stdout).toContain(
        '❌ high/critical advisories NOT in allowlist: GHSA-9999-8888-7777 (some-bad-package)'
      );
    }
    expect(threw).toBe(true);
  });

  it('passes audit check when advisory in AUDIT_MOCK_RAW is matched in AUDIT_ALLOW', () => {
    const mockAuditWithNewVuln = {
      auditReportVersion: 2,
      vulnerabilities: {
        'some-bad-package': {
          name: 'some-bad-package',
          severity: 'high',
          isDirect: true,
          via: [
            {
              source: 9999999,
              name: 'some-bad-package',
              dependency: 'some-bad-package',
              title: 'Critical Vulnerability in some-bad-package',
              url: 'https://github.com/advisories/GHSA-9999-8888-7777',
              severity: 'high',
            },
          ],
        },
      },
    };

    const stdout = execSync('node scripts/verify/audit-astro-gate.mjs', {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        AUDIT_MOCK_RAW: JSON.stringify(mockAuditWithNewVuln),
        AUDIT_ALLOW: 'GHSA-9999-8888-7777',
      },
    });

    expect(stdout).toContain(
      '✅ astro audit: high advisories present are all in allowlist (GHSA-9999-8888-7777)'
    );
  }, 15000);
});
