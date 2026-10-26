import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const repoRoot = path.resolve(__dirname, '../..');
const checkPublicDataScript = path.join(repoRoot, 'scripts/check-public-data-refs.sh');
const preflightArticleScript = path.join(repoRoot, 'scripts/preflight-article.sh');
const vaultSyncScript = path.join(repoRoot, 'scripts/vault-sync/sync.sh');

describe('Shell Preflight Test Suite (scripts/__tests__/shell-preflight.test.ts)', () => {
  describe('check-public-data-refs.sh', () => {
    it('exits 0 when public/data directory does not exist', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-public-data-'));
      try {
        const res = spawnSync('bash', [checkPublicDataScript], {
          cwd: tmpDir,
          encoding: 'utf8',
        });
        expect(res.status).toBe(0);
        expect(res.stdout).toContain('OK: no public/data directory.');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 0 when all public/data files are referenced by source files', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-public-data-'));
      try {
        fs.mkdirSync(path.join(tmpDir, 'public/data/faqs'), { recursive: true });
        fs.writeFileSync(path.join(tmpDir, 'public/data/faqs/general.json'), '{}');

        fs.mkdirSync(path.join(tmpDir, 'astro/src'), { recursive: true });
        fs.writeFileSync(
          path.join(tmpDir, 'astro/src/faq.ts'),
          "import data from 'public/data/faqs/general.json';"
        );

        const res = spawnSync('bash', [checkPublicDataScript], {
          cwd: tmpDir,
          encoding: 'utf8',
        });
        expect(res.status).toBe(0);
        expect(res.stdout).toContain('OK: all public/data files are referenced.');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when unreferenced orphan files exist in public/data/', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-public-data-'));
      try {
        fs.mkdirSync(path.join(tmpDir, 'public/data/faqs'), { recursive: true });
        fs.writeFileSync(path.join(tmpDir, 'public/data/faqs/orphan.json'), '{}');

        const res = spawnSync('bash', [checkPublicDataScript], {
          cwd: tmpDir,
          encoding: 'utf8',
        });
        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('ORPHAN: public/data/faqs/orphan.json is not referenced');
        expect(output).toContain('FAIL: 1 unreferenced file(s) under public/data/.');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe('preflight-article.sh', () => {
    it('exits 0 when all article preflight gates pass', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-article-'));
      try {
        spawnSync('git', ['init'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

        fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

        fs.mkdirSync(path.join(tmpDir, 'content/articles/category'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'scripts/verify'), { recursive: true });

        const articlePath = path.join(tmpDir, 'content/articles/category/test-article.md');
        const receiptPath = path.join(tmpDir, '.factchecks/test-article.factcheck.md');

        fs.writeFileSync(articlePath, '# Test Article\n\nContent');
        fs.writeFileSync(
          receiptPath,
          '| Claim | Evidence | Verdict |\n|---|---|---|\n| test | evidence | ✅ |\n'
        );
        fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
        fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Add test article'], { cwd: tmpDir });

        fs.symlinkSync(path.join(repoRoot, 'node_modules'), path.join(tmpDir, 'node_modules'));
        fs.copyFileSync(
          path.join(repoRoot, 'scripts/preflight-verify-verdicts.mjs'),
          path.join(tmpDir, 'scripts/preflight-verify-verdicts.mjs')
        );
        fs.writeFileSync(
          path.join(tmpDir, 'scripts/verify/verify.mjs'),
          'console.log("✅ image:body: mock pass");\n'
        );

        fs.writeFileSync(
          path.join(tmpDir, 'package.json'),
          JSON.stringify({
            name: 'test-pkg',
            scripts: {
              prebuild: 'echo prebuild',
              'seo:check-href-slash': 'echo seo-ok',
              'verify:ownership': 'echo ownership-ok',
            },
          })
        );

        const res = spawnSync('bash', [preflightArticleScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });

        expect(res.status).toBe(0);
        const output = res.stdout || '';
        expect(output).toContain('✅ feeds: in sync');
        expect(output).toContain('✅ factcheck: test-article');
        expect(output).toContain('✅ seo: href slashes OK');
        expect(output).toContain('✅ ownership: article ownership verified');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when prebuild fails during article preflight', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-article-'));
      try {
        spawnSync('git', ['init'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

        fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

        fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
        fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
        fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

        fs.writeFileSync(
          path.join(tmpDir, 'package.json'),
          JSON.stringify({
            name: 'test-pkg',
            scripts: {
              prebuild: 'echo "prebuild script failed" >&2 && exit 1',
              'seo:check-href-slash': 'echo seo-ok',
              'verify:ownership': 'echo ownership-ok',
            },
          })
        );

        const res = spawnSync('bash', [preflightArticleScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });

        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('❌ feeds: prebuild failed');
        expect(output).toContain('prebuild script failed');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when llms feeds are out of sync after prebuild', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-article-'));
      try {
        spawnSync('git', ['init'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

        fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
        fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
        fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms original');
        fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full original');

        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

        // prebuild script modifies public/llms.txt causing git diff
        fs.writeFileSync(
          path.join(tmpDir, 'package.json'),
          JSON.stringify({
            name: 'test-pkg',
            scripts: {
              prebuild: 'echo "out of sync change" >> public/llms.txt',
              'seo:check-href-slash': 'echo seo-ok',
              'verify:ownership': 'echo ownership-ok',
            },
          })
        );

        const res = spawnSync('bash', [preflightArticleScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });

        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('❌ feeds: llms.txt/llms-full.txt out of sync');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when a modified article is missing a factcheck receipt', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-article-'));
      try {
        spawnSync('git', ['init'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

        fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

        fs.mkdirSync(path.join(tmpDir, 'content/articles/category'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });

        const articlePath = path.join(tmpDir, 'content/articles/category/missing-receipt.md');
        fs.writeFileSync(articlePath, '# Article without receipt\n');
        fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
        fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Add article without receipt'], { cwd: tmpDir });

        fs.writeFileSync(
          path.join(tmpDir, 'package.json'),
          JSON.stringify({
            name: 'test-pkg',
            scripts: {
              prebuild: 'echo prebuild',
              'seo:check-href-slash': 'echo seo-ok',
              'verify:ownership': 'echo ownership-ok',
            },
          })
        );

        const res = spawnSync('bash', [preflightArticleScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });

        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('❌ factcheck: no receipt for missing-receipt');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when seo:check-href-slash fails', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-article-'));
      try {
        spawnSync('git', ['init'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

        fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

        fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
        fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
        fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

        fs.writeFileSync(
          path.join(tmpDir, 'package.json'),
          JSON.stringify({
            name: 'test-pkg',
            scripts: {
              prebuild: 'echo prebuild',
              'seo:check-href-slash': 'echo "href slash error" >&2 && exit 1',
              'verify:ownership': 'echo ownership-ok',
            },
          })
        );

        const res = spawnSync('bash', [preflightArticleScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });

        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('❌ seo: internal link missing trailing slash');
        expect(output).toContain('href slash error');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when verify:ownership fails', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-article-'));
      try {
        spawnSync('git', ['init'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
        spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

        fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

        fs.mkdirSync(path.join(tmpDir, 'content/articles/category'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'scripts/verify'), { recursive: true });

        const articlePath = path.join(tmpDir, 'content/articles/category/test.md');
        const receiptPath = path.join(tmpDir, '.factchecks/test.factcheck.md');

        fs.writeFileSync(articlePath, '# Test Article\n');
        fs.writeFileSync(
          receiptPath,
          '| Claim | Evidence | Verdict |\n|---|---|---|\n| test | evidence | ✅ |\n'
        );
        fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
        fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

        spawnSync('git', ['add', '.'], { cwd: tmpDir });
        spawnSync('git', ['commit', '-m', 'Add test article'], { cwd: tmpDir });

        fs.symlinkSync(path.join(repoRoot, 'node_modules'), path.join(tmpDir, 'node_modules'));
        fs.copyFileSync(
          path.join(repoRoot, 'scripts/preflight-verify-verdicts.mjs'),
          path.join(tmpDir, 'scripts/preflight-verify-verdicts.mjs')
        );
        fs.writeFileSync(
          path.join(tmpDir, 'scripts/verify/verify.mjs'),
          'console.log("✅ image:body: mock pass");\n'
        );

        fs.writeFileSync(
          path.join(tmpDir, 'package.json'),
          JSON.stringify({
            name: 'test-pkg',
            scripts: {
              prebuild: 'echo prebuild',
              'seo:check-href-slash': 'echo seo-ok',
              'verify:ownership': 'echo "ownership failed detail" >&2 && exit 1',
            },
          })
        );

        const res = spawnSync('bash', [preflightArticleScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });

        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('❌ ownership: article ownership check failed');
        expect(output).toContain('ownership failed detail');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe('vault-sync sync.sh', () => {
    it('exits 0 and outputs dry run message when DRY_RUN=1', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-vault-sync-'));
      try {
        fs.mkdirSync(path.join(tmpDir, 'astro'), { recursive: true });
        fs.writeFileSync(
          path.join(tmpDir, 'astro/package.json'),
          JSON.stringify({
            name: 'mock-astro',
            scripts: {
              test: 'node -e "fs.writeFileSync(process.env.TMP_DATA, \'{}\')"',
            },
          })
        );

        const mockGenPath = path.join(tmpDir, 'vault-generate.py');
        fs.writeFileSync(
          mockGenPath,
          'import sys, os\nos.makedirs(sys.argv[2], exist_ok=True)\nopen(os.path.join(sys.argv[2], "Business Identity.md"), "w").write("test content")\n'
        );

        const res = spawnSync('bash', [vaultSyncScript], {
          cwd: repoRoot,
          env: {
            ...process.env,
            REPO: tmpDir,
            GEN: mockGenPath,
            DRY_RUN: '1',
          },
          encoding: 'utf8',
        });

        expect(res.status).toBe(0);
        expect(res.stdout).toContain(
          'DRY_RUN mode enabled. Dry run completed successfully without upload.'
        );
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 0 and copies notes to DEST_DIR when DEST_DIR is specified', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-vault-sync-'));
      try {
        fs.mkdirSync(path.join(tmpDir, 'astro'), { recursive: true });
        fs.writeFileSync(
          path.join(tmpDir, 'astro/package.json'),
          JSON.stringify({
            name: 'mock-astro',
            scripts: {
              test: 'node -e "fs.writeFileSync(process.env.TMP_DATA, \'{}\')"',
            },
          })
        );

        const mockGenPath = path.join(tmpDir, 'vault-generate.py');
        fs.writeFileSync(
          mockGenPath,
          'import sys, os\nos.makedirs(sys.argv[2], exist_ok=True)\nopen(os.path.join(sys.argv[2], "Business Identity.md"), "w").write("test content")\n'
        );

        const destDir = path.join(tmpDir, 'synced-notes');

        const res = spawnSync('bash', [vaultSyncScript], {
          cwd: repoRoot,
          env: {
            ...process.env,
            REPO: tmpDir,
            GEN: mockGenPath,
            DRY_RUN: '0',
            DEST_DIR: destDir,
          },
          encoding: 'utf8',
        });

        expect(res.status).toBe(0);
        expect(res.stdout).toContain(`Copying synced notes to local destination: ${destDir}`);
        expect(fs.existsSync(destDir)).toBe(true);
        expect(fs.readdirSync(destDir)).toContain('Business Identity.md');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('exits 1 when extraction step fails during vault sync', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-vault-sync-'));
      try {
        fs.mkdirSync(path.join(tmpDir, 'astro'), { recursive: true });
        fs.writeFileSync(
          path.join(tmpDir, 'astro/package.json'),
          JSON.stringify({
            name: 'mock-astro',
            scripts: {
              test: 'node -e "process.exit(1)"',
            },
          })
        );

        const res = spawnSync('bash', [vaultSyncScript], {
          cwd: repoRoot,
          env: {
            ...process.env,
            REPO: tmpDir,
            DRY_RUN: '1',
          },
          encoding: 'utf8',
        });

        expect(res.status).toBe(1);
        const output = (res.stdout || '') + (res.stderr || '');
        expect(output).toContain('extract failed');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });
});
