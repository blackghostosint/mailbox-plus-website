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
  });
});
