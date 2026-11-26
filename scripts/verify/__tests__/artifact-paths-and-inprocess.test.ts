import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  extractFrontmatterSlug,
  getFactcheckCandidates,
  getSourcesCandidates,
  resolveArticleSlug,
  resolveFactcheckPath,
  resolveSourcesPath,
} from '../lib/artifact-paths.mjs';
import { makeSourceConstraintGate } from '../source-constraint-gate.mjs';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const VERIFY_CLI = path.join(REPO_ROOT, 'scripts', 'verify', 'verify.mjs');
const PREFLIGHT_SH = path.join(REPO_ROOT, 'scripts', 'preflight-article.sh');

describe('artifact-paths shared resolver, frontmatter slug preflight, and in-process verify.mjs', () => {
  it('extracts YAML frontmatter slug with quotes or comments and falls back to filename basename', () => {
    expect(
      extractFrontmatterSlug('---\ntitle: Test\nslug: ' + "'canonical-slug'" + '\n---\nBody')
    ).toBe('canonical-slug');
    expect(extractFrontmatterSlug('---\ntitle: Test\nslug: "quoted-slug"\n---\nBody')).toBe(
      'quoted-slug'
    );
    expect(
      extractFrontmatterSlug('---\ntitle: Test\nslug: bare-slug # inline comment\n---\nBody')
    ).toBe('bare-slug');
    expect(extractFrontmatterSlug('# No frontmatter\nBody')).toBeNull();

    expect(
      resolveArticleSlug(
        '/repo/content/articles/pack-ship/different-filename.md',
        '---\nslug: frontmatter-wins\n---\nBody'
      )
    ).toBe('frontmatter-wins');
    expect(
      resolveArticleSlug(
        '/repo/content/articles/pack-ship/fallback-filename.md',
        '---\ntitle: No slug field\n---\nBody'
      )
    ).toBe('fallback-filename');
  });

  it('produces identical candidate order for .factcheck.md and .sources.json across gates', () => {
    const opts = {
      slug: 'sample-article',
      draftsDir: '/repo/.factchecks',
      articleDir: '/repo/content/articles/mailbox-rentals',
      root: '/repo',
    };

    expect(getFactcheckCandidates(opts)).toEqual([
      '/repo/.factchecks/sample-article.factcheck.md',
      '/repo/.factchecks/sample-article.factcheck',
      '/repo/content/articles/mailbox-rentals/sample-article.factcheck.md',
      '/repo/content/drafts/sample-article.factcheck.md',
    ]);

    expect(getSourcesCandidates(opts)).toEqual([
      '/repo/.factchecks/sample-article.sources.json',
      '/repo/content/articles/mailbox-rentals/sample-article.sources.json',
      '/repo/content/drafts/sample-article.sources.json',
    ]);
  });

  it('resolves fallback .sources.json from articleDir instead of path.dirname(slug) in source-constraint-gate', () => {
    const slug = 'nested-article-slug';
    const articleDir = '/repo/content/articles/mailbox-rentals';
    const expectedPath = `${articleDir}/${slug}.sources.json`;

    const mockFs = {
      existsSync: (p: string) => p === expectedPath,
      readFileSync: (p: string) => {
        if (p !== expectedPath) throw new Error(`ENOENT: ${p}`);
        return JSON.stringify({
          numeric_claims: [{ value: '$15', scope: 'Mail Only tier' }],
        });
      },
    };

    expect(
      resolveSourcesPath(
        { slug, draftsDir: '/repo/.factchecks', articleDir, root: '/repo' },
        { fs: mockFs as unknown as typeof fs, path }
      )
    ).toBe(expectedPath);

    const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
    const results: Array<{ name: string; pass: boolean; detail: string }> = [];
    runSourceConstraintGate(
      slug,
      'Mail-only plans start at $15.',
      (name: string, pass: boolean, detail: string) =>
        results.push({ name, pass: Boolean(pass), detail }),
      '/repo',
      '/repo/.factchecks',
      articleDir
    );

    expect(results.find((r) => r.name === 'source:constraints')?.pass).toBe(true);
    expect(results.find((r) => r.name === 'source:number-coverage')?.pass).toBe(true);
  });

  it('resolves receipt path via YAML frontmatter slug in preflight-article.sh when filename differs', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-fm-slug-'));
    try {
      execFileSync('git', ['init', '-b', 'main'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: tmpDir });
      execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tmpDir });

      fs.mkdirSync(path.join(tmpDir, 'content/articles/mailbox-rentals'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, '.factchecks'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, 'public'), { recursive: true });
      fs.mkdirSync(path.join(tmpDir, 'scripts/verify'), { recursive: true });

      fs.writeFileSync(path.join(tmpDir, 'public/llms.txt'), 'llms');
      fs.writeFileSync(path.join(tmpDir, 'public/llms-full.txt'), 'llms-full');
      fs.symlinkSync(path.join(REPO_ROOT, 'node_modules'), path.join(tmpDir, 'node_modules'));
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

      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Init');
      execFileSync('git', ['add', '.'], { cwd: tmpDir });
      execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpDir });

      execFileSync('git', ['checkout', '-b', 'feature/frontmatter-slug'], { cwd: tmpDir });

      // Filename is `2026-draft-file.md`, while frontmatter slug is `canonical-pmb-guide`
      fs.writeFileSync(
        path.join(tmpDir, 'content/articles/mailbox-rentals/2026-draft-file.md'),
        [
          '---',
          'title: Canonical PMB Guide',
          'slug: canonical-pmb-guide',
          '---',
          '',
          'Find us in Gristmill Village next to Pub Frato, just off Crile Road.',
        ].join('\n')
      );
      fs.writeFileSync(
        path.join(tmpDir, '.factchecks/canonical-pmb-guide.factcheck.md'),
        '| Claim | Verdict | Source |\n| --- | --- | --- |\n| Gristmill Village | ✅ | content/facts.json |\n'
      );

      const resolved = resolveFactcheckPath({
        slug: resolveArticleSlug(
          path.join(tmpDir, 'content/articles/mailbox-rentals/2026-draft-file.md')
        ),
        draftsDir: path.join(tmpDir, '.factchecks'),
        root: tmpDir,
      });
      expect(resolved).toBe(path.join(tmpDir, '.factchecks/canonical-pmb-guide.factcheck.md'));

      const output = execFileSync('bash', [PREFLIGHT_SH], {
        cwd: tmpDir,
        env: { ...process.env, PATH: process.env.PATH },
        encoding: 'utf8',
      });

      expect(output).toContain('✅ factcheck: canonical-pmb-guide');
      expect(output).toContain('✅ verdicts: 1 receipt rows carry valid verdicts');
      expect(output).not.toContain('2026-draft-file.factcheck');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('runs claims-gate and source-constraint-gate in-process inside verify.mjs without spawning Node subprocesses', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-inprocess-spy-'));
    const logFile = path.join(tmpDir, 'spawned.jsonl');
    const preloadScript = path.join(tmpDir, 'spy-child-process.mjs');

    try {
      fs.writeFileSync(
        preloadScript,
        [
          "import cp from 'node:child_process';",
          "import fs from 'node:fs';",
          "import { syncBuiltinESMExports } from 'node:module';",
          'const origExecFileSync = cp.execFileSync;',
          'cp.execFileSync = function patchedExecFileSync(file, args, options) {',
          '  fs.appendFileSync(process.env.SPAWN_SPY_LOG, JSON.stringify({ file: String(file), args: Array.isArray(args) ? args.map(String) : [] }) + "\\n");',
          '  return origExecFileSync.call(this, file, args, options);',
          '};',
          'syncBuiltinESMExports();',
        ].join('\n'),
        'utf8'
      );

      const out = execFileSync(
        process.execPath,
        [
          '--import',
          pathToFileURL(preloadScript).href,
          '--import',
          'tsx',
          VERIFY_CLI,
          'article',
          'content/articles/pack-ship/fedex-ground-vs-usps-ground-advantage.md',
          '--strict',
          '--offline',
        ],
        {
          cwd: REPO_ROOT,
          env: { ...process.env, SPAWN_SPY_LOG: logFile },
          encoding: 'utf8',
        }
      );

      expect(out).toContain('claims:forbidden-phrases');
      expect(out).toContain('claims:verdicts');
      expect(out).toContain('source:constraints');
      expect(out).toContain('source:number-coverage');

      const spawnedLines = fs.existsSync(logFile)
        ? fs
            .readFileSync(logFile, 'utf8')
            .trim()
            .split('\n')
            .filter(Boolean)
            .map((l) => JSON.parse(l) as { file: string; args: string[] })
        : [];

      const nodeSubprocesses = spawnedLines.filter(
        (entry) =>
          /\bnode(?:\.exe)?$/i.test(entry.file) ||
          entry.args.some((a) => a.includes('claims-gate') || a.includes('source-constraint-gate'))
      );
      expect(nodeSubprocesses).toEqual([]);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
