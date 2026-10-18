import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

describe('verify.mjs doctor', () => {
  it('runs doctor command and passes env:completeness check', () => {
    const stdout = execSync('node scripts/verify/verify.mjs doctor --json', {
      cwd: ROOT,
      encoding: 'utf8',
    });

    const parsed = JSON.parse(stdout);
    expect(parsed.ok).toBe(true);

    const envCheck = parsed.results.find((r: { name: string }) => r.name === 'env:completeness');
    expect(envCheck).toBeDefined();
    expect(envCheck.pass).toBe(true);
    expect(envCheck.detail).toContain('27 keys mapped');
  }, 15000);
});

describe('verify.mjs docs', () => {
  it('runs docs command and passes security docs checks', () => {
    const stdout = execSync('node scripts/verify/verify.mjs docs --json', {
      cwd: ROOT,
      encoding: 'utf8',
    });

    const parsed = JSON.parse(stdout);
    expect(parsed.ok).toBe(true);

    const envVarsCheck = parsed.results.find(
      (r: { name: string }) => r.name === 'doc:security-env-vars'
    );
    expect(envVarsCheck).toBeDefined();
    expect(envVarsCheck.pass).toBe(true);
    expect(envVarsCheck.detail).toContain(
      'all 27 environment variable(s) from .env.example are documented'
    );

    const headersCheck = parsed.results.find(
      (r: { name: string }) => r.name === 'doc:security-headers'
    );
    expect(headersCheck).toBeDefined();
    expect(headersCheck.pass).toBe(true);
    expect(headersCheck.detail).toContain('header configurations');
  }, 15000);

  it('fails doc:security-headers check when table header line references are swapped', () => {
    const secPath = path.join(ROOT, 'docs', 'SECURITY.md');
    const originalSec = execSync(`git show HEAD:docs/SECURITY.md`, { cwd: ROOT, encoding: 'utf8' });

    try {
      // Swap X-Frame-Options and Permissions-Policy line references in SECURITY.md
      const swappedSec = originalSec
        .replace('`netlify.toml:79`', '`TEMP_REF`')
        .replace('`netlify.toml:82`', '`netlify.toml:79`')
        .replace('`TEMP_REF`', '`netlify.toml:82`');

      const fs = require('node:fs');
      fs.writeFileSync(secPath, swappedSec, 'utf8');

      let stdout: string;
      try {
        stdout = execSync('node scripts/verify/verify.mjs docs --json', {
          cwd: ROOT,
          encoding: 'utf8',
        });
      } catch (err: any) {
        stdout = err.stdout;
      }

      const parsed = JSON.parse(stdout);
      expect(parsed.ok).toBe(false);

      const headersCheck = parsed.results.find(
        (r: { name: string }) => r.name === 'doc:security-headers'
      );
      expect(headersCheck).toBeDefined();
      expect(headersCheck.pass).toBe(false);
      expect(headersCheck.detail).toContain('mismatched netlify.toml reference');
    } finally {
      const fs = require('node:fs');
      fs.writeFileSync(secPath, originalSec, 'utf8');
    }
  }, 15000);
});
