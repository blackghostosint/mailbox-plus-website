import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('preflight-article.sh path with spaces handling', () => {
  it('correctly handles article filenames with spaces without word-splitting', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-test-'));
    try {
      execFileSync('git', ['init'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.email', 'test@example.com'], {
        cwd: tmpDir,
      });

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

      fs.mkdirSync(path.join(tmpDir, 'content/articles/folder'), {
        recursive: true,
      });
      fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });

      const articlePath = path.join(tmpDir, 'content/articles/folder/test space article.md');
      const receiptPath = path.join(tmpDir, '.factchecks/test space article.factcheck.md');

      fs.writeFileSync(articlePath, '# Test Article\n\nContent');
      fs.writeFileSync(
        receiptPath,
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| test | evidence | ✅ |\n'
      );
      fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
      fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add article with spaces'], {
        cwd: tmpDir,
      });

      const repoRoot = path.resolve(__dirname, '../..');
      const preflightScript = path.join(repoRoot, 'scripts/preflight-article.sh');

      // Symlink node_modules into tmpDir so node --import tsx can resolve tsx
      fs.symlinkSync(path.join(repoRoot, 'node_modules'), path.join(tmpDir, 'node_modules'));

      // Copy helper script preflight-verify-verdicts.mjs to tmpDir/scripts
      fs.copyFileSync(
        path.join(repoRoot, 'scripts/preflight-verify-verdicts.mjs'),
        path.join(tmpDir, 'scripts/preflight-verify-verdicts.mjs')
      );

      // Create mock scripts/verify/verify.mjs that returns successful image:body gate output
      fs.mkdirSync(path.join(tmpDir, 'scripts/verify'), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, 'scripts/verify/verify.mjs'),
        'console.log("✅ image:body: mock pass");\n'
      );

      // Create package.json in tmpDir with dummy prebuild and seo:check-href-slash
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          name: 'test-pkg',
          scripts: {
            prebuild: 'echo prebuild',
            'seo:check-href-slash': 'echo seo-ok',
          },
        })
      );

      const output = execFileSync('bash', [preflightScript], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: test space article');
      expect(output).toContain(
        '✅ image:body manifest: content/articles/folder/test space article.md'
      );
      expect(output).not.toContain('no receipt for test');
      expect(output).not.toContain('no receipt for space');
      expect(output).not.toContain('no receipt for article');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('fails preflight execution, outputs error logs, and avoids false success output when prebuild fails', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-prebuild-fail-test-'));
    try {
      execFileSync('git', ['init'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

      fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
      fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

      const repoRoot = path.resolve(__dirname, '../..');
      const preflightScript = path.join(repoRoot, 'scripts/preflight-article.sh');

      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          name: 'test-pkg',
          scripts: {
            prebuild: 'echo "prebuild failed with severe error" >&2 && exit 1',
            'seo:check-href-slash': 'echo seo-ok',
          },
        })
      );

      let failed = false;
      try {
        execFileSync('bash', [preflightScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });
      } catch (err: any) {
        failed = true;
        expect(err.status).toBe(1);
        const output = (err.stdout || '') + (err.stderr || '');
        expect(output).toContain('❌ feeds: prebuild failed');
        expect(output).toContain('prebuild failed with severe error');
        expect(output).not.toContain('✅ feeds: in sync');
        expect(output).not.toContain('llms.txt/llms-full.txt out of sync');
      }
      expect(failed).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('unmasks error details when seo:check-href-slash fails', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-seo-fail-test-'));
    try {
      execFileSync('git', ['init'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

      fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
      fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

      const repoRoot = path.resolve(__dirname, '../..');
      const preflightScript = path.join(repoRoot, 'scripts/preflight-article.sh');

      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          name: 'test-pkg',
          scripts: {
            prebuild: 'echo prebuild-ok',
            'seo:check-href-slash': 'echo "internal href slash validation failed detail" >&2 && exit 1',
          },
        })
      );

      let failed = false;
      try {
        execFileSync('bash', [preflightScript], {
          cwd: tmpDir,
          env: { ...process.env, PATH: process.env.PATH },
          encoding: 'utf8',
        });
      } catch (err: any) {
        failed = true;
        expect(err.status).toBe(1);
        const output = (err.stdout || '') + (err.stderr || '');
        expect(output).toContain('❌ seo: internal link missing trailing slash');
        expect(output).toContain('internal href slash validation failed detail');
      }
      expect(failed).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
