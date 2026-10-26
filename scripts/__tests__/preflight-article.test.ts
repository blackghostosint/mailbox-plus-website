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

      // Create package.json in tmpDir with dummy prebuild, seo:check-href-slash, and verify:ownership
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

      const output = execFileSync('bash', [preflightScript], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: test space article');
      expect(output).toContain(
        '✅ verification & store photo manifest: content/articles/folder/test space article.md'
      );
      expect(output).toContain('✅ ownership: article ownership verified');
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
            'verify:ownership': 'echo ownership-ok',
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
            'seo:check-href-slash':
              'echo "internal href slash validation failed detail" >&2 && exit 1',
            'verify:ownership': 'echo ownership-ok',
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

  it('unmasks error details when verify:ownership fails', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-ownership-fail-test-'));
    try {
      execFileSync('git', ['init'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Test Repo');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

      fs.mkdirSync(path.join(tmpDir, 'content/articles/folder'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, 'scripts/verify'), { recursive: true });

      const articlePath = path.join(tmpDir, 'content/articles/folder/test.md');
      const receiptPath = path.join(tmpDir, '.factchecks/test.factcheck.md');

      fs.writeFileSync(articlePath, '# Test Article\n\nContent');
      fs.writeFileSync(
        receiptPath,
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| test | evidence | ✅ |\n'
      );
      fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
      fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add article'], { cwd: tmpDir });

      const repoRoot = path.resolve(__dirname, '../..');
      const preflightScript = path.join(repoRoot, 'scripts/preflight-article.sh');

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
            'verify:ownership': 'echo "article ownership validation failed detail" >&2 && exit 1',
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
        expect(output).toContain('❌ ownership: article ownership check failed');
        expect(output).toContain('article ownership validation failed detail');
      }
      expect(failed).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

function setupTestRepo(tmpDir: string, repoRoot: string) {
  execFileSync('git', ['init', '-b', 'main'], { cwd: tmpDir });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

  fs.mkdirSync(path.join(tmpDir, 'content/articles'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, 'scripts/verify'), { recursive: true });

  fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
  fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');

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
}

describe('preflight-article.sh merge-base target resolution', () => {
  const repoRoot = path.resolve(__dirname, '../..');
  const preflightScript = path.join(repoRoot, 'scripts/preflight-article.sh');

  it('evaluates all modified articles across multi-commit branches against target merge-base', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-multi-commit-'));
    try {
      setupTestRepo(tmpDir, repoRoot);

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Main Branch');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit on main'], { cwd: tmpDir });

      execFileSync('git', ['checkout', '-b', 'feature/multi-commit'], { cwd: tmpDir });

      // Commit 1: add article 1
      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/article1.md'),
        '# Article 1\n\nContent 1'
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/article1.factcheck.md'),
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| claim1 | evidence1 | ✅ |\n'
      );
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add article 1'], { cwd: tmpDir });

      // Commit 2: add article 2
      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/article2.md'),
        '# Article 2\n\nContent 2'
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/article2.factcheck.md'),
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| claim2 | evidence2 | ✅ |\n'
      );
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add article 2'], { cwd: tmpDir });

      const output = execFileSync('bash', [preflightScript], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: article1');
      expect(output).toContain('✅ factcheck: article2');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('supports positional target branch parameter', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-target-arg-'));
    try {
      setupTestRepo(tmpDir, repoRoot);

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Custom Target');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit on main'], { cwd: tmpDir });

      execFileSync('git', ['checkout', '-b', 'custom-base'], { cwd: tmpDir });
      fs.writeFileSync(path.join(tmpDir, 'CUSTOM.md'), '# Custom base file');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Commit on custom base'], { cwd: tmpDir });

      execFileSync('git', ['checkout', '-b', 'feature/custom-branch'], { cwd: tmpDir });

      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/custom.md'),
        '# Custom Article\n\nContent'
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/custom.factcheck.md'),
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| claim | evidence | ✅ |\n'
      );
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add custom article'], { cwd: tmpDir });

      const output = execFileSync('bash', [preflightScript, 'custom-base'], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: custom');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('auto-fetches remote target branch when ref is unfetched locally', () => {
    const remoteDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-remote-bare-'));
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-unfetched-'));
    try {
      execFileSync('git', ['init', '--bare', '-b', 'main'], { cwd: remoteDir });

      setupTestRepo(tmpDir, repoRoot);

      execFileSync('git', ['remote', 'add', 'origin', remoteDir], { cwd: tmpDir });

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Initial');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });
      execFileSync('git', ['push', '-u', 'origin', 'main'], { cwd: tmpDir });

      execFileSync('git', ['checkout', '-b', 'feature/unfetched'], { cwd: tmpDir });

      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/remote.md'),
        '# Remote Article\n\nContent'
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/remote.factcheck.md'),
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| claim | evidence | ✅ |\n'
      );
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add remote article'], { cwd: tmpDir });

      // Remove local main branch and local origin/main ref to simulate unfetched remote
      execFileSync('git', ['branch', '-D', 'main'], { cwd: tmpDir });
      execFileSync('git', ['update-ref', '-d', 'refs/remotes/origin/main'], { cwd: tmpDir });

      const output = execFileSync('bash', [preflightScript, 'main'], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: remote');
    } finally {
      fs.rmSync(remoteDir, { recursive: true, force: true });
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('captures uncommitted working tree changes alongside committed changes', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-dirty-tree-'));
    try {
      setupTestRepo(tmpDir, repoRoot);

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Initial');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit on main'], { cwd: tmpDir });

      execFileSync('git', ['checkout', '-b', 'feature/dirty-tree'], { cwd: tmpDir });

      // Committed article on feature branch
      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/committed.md'),
        '# Committed Article\n\nContent'
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/committed.factcheck.md'),
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| claim | evidence | ✅ |\n'
      );
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Add committed article'], { cwd: tmpDir });

      // Uncommitted dirty working tree article
      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/dirty.md'),
        '# Dirty Article\n\nContent'
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/dirty.factcheck.md'),
        '| Claim | Evidence | Verdict |\n|---|---|---|\n| claim | evidence | ✅ |\n'
      );

      const output = execFileSync('bash', [preflightScript], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: committed');
      expect(output).toContain('✅ factcheck: dirty');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
