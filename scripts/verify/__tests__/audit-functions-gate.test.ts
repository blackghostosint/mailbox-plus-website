import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

describe('audit-functions-gate.mjs', () => {
  it('passes audit check for netlify/functions with exit code 0', () => {
    const stdout = execSync('node scripts/verify/audit-functions-gate.mjs', {
      cwd: ROOT,
      encoding: 'utf8',
    });

    expect(stdout).toContain(
      '✅ netlify/functions audit: high advisories present are all in allowlist'
    );
  });

  it('honors AUDIT_ALLOW environment variable for allowlisted advisories', () => {
    const stdout = execSync('node scripts/verify/audit-functions-gate.mjs', {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        AUDIT_ALLOW: 'GHSA-test-advisory-id',
      },
    });

    expect(stdout).toContain('GHSA-test-advisory-id');
  });
});
