import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const repoRoot = path.resolve(__dirname, '../..');
const checkScript = path.join(repoRoot, 'scripts/check-public-data-refs.sh');

describe('check-public-data-refs.sh', () => {
  it('returns OK when public/data directory does not exist', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-data-test-'));
    try {
      const output = execFileSync('bash', [checkScript], {
        cwd: tmpDir,
        encoding: 'utf8',
      });
      expect(output).toContain('OK: no public/data directory.');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('passes when valid relative path reference exists under public/data/', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-data-test-'));
    try {
      fs.mkdirSync(path.join(tmpDir, 'public/data/faqs'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/data/faqs/general.json'), '{}');

      fs.mkdirSync(path.join(tmpDir, 'astro/src'), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, 'astro/src/faq.ts'),
        "import data from 'public/data/faqs/general.json';"
      );

      const output = execFileSync('bash', [checkScript], {
        cwd: tmpDir,
        encoding: 'utf8',
      });
      expect(output).toContain('OK: all public/data files are referenced.');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('fails when subdirectory file is orphaned even if source code matches bare basename', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-data-test-'));
    try {
      fs.mkdirSync(path.join(tmpDir, 'public/data/faqs'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/data/faqs/general.json'), '{}');

      fs.mkdirSync(path.join(tmpDir, 'astro/src'), { recursive: true });
      // Contains bare filename 'general.json' but NOT relative path 'faqs/general.json'
      fs.writeFileSync(
        path.join(tmpDir, 'astro/src/other.ts'),
        "import localData from './general.json';"
      );

      let failed = false;
      try {
        execFileSync('bash', [checkScript], {
          cwd: tmpDir,
          encoding: 'utf8',
        });
      } catch (err: any) {
        failed = true;
        expect(err.status).toBe(1);
        const output = (err.stdout || '') + (err.stderr || '');
        expect(output).toContain(
          'ORPHAN: public/data/faqs/general.json is not referenced by any source file.'
        );
        expect(output).toContain('FAIL: 1 unreferenced file(s) under public/data/.');
      }
      expect(failed).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('passes for top-level files under public/data/ when referenced by filename', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-data-test-'));
    try {
      fs.mkdirSync(path.join(tmpDir, 'public/data'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/data/config.json'), '{}');

      fs.mkdirSync(path.join(tmpDir, 'astro/src'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'astro/src/config.ts'), "const cfg = 'config.json';");

      const output = execFileSync('bash', [checkScript], {
        cwd: tmpDir,
        encoding: 'utf8',
      });
      expect(output).toContain('OK: all public/data files are referenced.');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('ignores non-code assets under public/data/', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-data-test-'));
    try {
      fs.mkdirSync(path.join(tmpDir, 'public/data/faqs'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/data/faqs/image.png'), 'fake png data');

      const output = execFileSync('bash', [checkScript], {
        cwd: tmpDir,
        encoding: 'utf8',
      });
      expect(output).toContain('OK: all public/data files are referenced.');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('excludes check-public-data-refs.sh itself from reference matching in scripts/', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-data-test-'));
    try {
      fs.mkdirSync(path.join(tmpDir, 'public/data/faqs'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/data/faqs/orphan.json'), '{}');

      fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
      // Copy the script itself into scripts/ directory in tmpDir
      fs.copyFileSync(checkScript, path.join(tmpDir, 'scripts/check-public-data-refs.sh'));

      // If check-public-data-refs.sh were not excluded, any string in it could match.
      // But since orphan.json is not mentioned in any other file in scripts, it should fail.
      let failed = false;
      try {
        execFileSync('bash', [path.join(tmpDir, 'scripts/check-public-data-refs.sh')], {
          cwd: tmpDir,
          encoding: 'utf8',
        });
      } catch (err: any) {
        failed = true;
        expect(err.status).toBe(1);
        const output = (err.stdout || '') + (err.stderr || '');
        expect(output).toContain(
          'ORPHAN: public/data/faqs/orphan.json is not referenced by any source file.'
        );
      }
      expect(failed).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
