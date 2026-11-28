import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const IGNORED_DIRS = new Set(['node_modules', '.git', '.astro', 'dist', 'coverage']);

const SOURCE_FILE_RE = /\.(ts|tsx|js|jsx|mjs|cjs|astro)$/;
const TEST_FILE_RE = /\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/;

/**
 * Intentional build/sync scripts under astro/src/scripts/ that run via Vitest CLI
 * (e.g. `npm run vault:extract`) to export live configuration data.
 */
const INTENTIONAL_BUILD_SCRIPTS = new Set([
  'astro/src/scripts/vault-extract.test.ts',
  'astro/src/scripts/facts-sync.test.ts',
]);

/**
 * Deferred municipal location helper paired with `astro/src/config/locations.ts`
 * (tracked under a separate municipal locations refactor).
 */
const DEFERRED_ORPHAN_ALLOWLIST = new Set(['astro/src/utils/location.ts']);

function toPosixRel(rootDir: string, absPath: string): string {
  return path.relative(rootDir, absPath).split(path.sep).join('/');
}

function walkRepoFiles(rootDir: string, subDir = ''): string[] {
  const startDir = subDir ? path.join(rootDir, subDir) : rootDir;
  if (!fs.existsSync(startDir)) return [];

  const results: string[] = [];
  const stack = [startDir];

  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        results.push(toPosixRel(rootDir, fullPath));
      }
    }
  }

  return results.sort();
}

function isTestFile(relPath: string): boolean {
  return TEST_FILE_RE.test(relPath) || relPath.includes('/__tests__/');
}

function resolveImportSpecifier(
  rootDir: string,
  fromRelPath: string,
  specifier: string
): string | null {
  let targetBase: string;
  if (specifier.startsWith('@/')) {
    targetBase = path.join(rootDir, 'astro/src', specifier.slice(2));
  } else if (specifier.startsWith('.')) {
    targetBase = path.resolve(rootDir, path.dirname(fromRelPath), specifier);
  } else {
    return null;
  }

  const stripped = targetBase.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, '');
  const candidates = [
    targetBase,
    `${targetBase}.ts`,
    `${targetBase}.tsx`,
    `${targetBase}.js`,
    `${targetBase}.mjs`,
    `${targetBase}.astro`,
    `${targetBase}.json`,
    `${stripped}.ts`,
    `${stripped}.tsx`,
    `${stripped}.js`,
    `${stripped}.mjs`,
    `${stripped}.astro`,
    path.join(targetBase, 'index.ts'),
    path.join(targetBase, 'index.tsx'),
    path.join(targetBase, 'index.js'),
    path.join(targetBase, 'index.astro'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return toPosixRel(rootDir, candidate);
    }
  }

  return null;
}

const IMPORT_SPECIFIER_RE = /(?:from|import)\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

export function analyzeProductionGraph(
  rootDir: string,
  options: { deferredAllowlist?: Set<string> } = {}
): {
  iconImportViolations: Array<{ file: string; specifier: string }>;
  decommissionedTokenViolations: Array<{ file: string; token: string }>;
  orphanedModules: string[];
} {
  const allowlist = options.deferredAllowlist ?? DEFERRED_ORPHAN_ALLOWLIST;
  const allFiles = [
    ...walkRepoFiles(rootDir, 'astro'),
    ...walkRepoFiles(rootDir, 'netlify/functions'),
    ...walkRepoFiles(rootDir, 'scripts'),
    ...walkRepoFiles(rootDir, 'knowledge'),
    ...walkRepoFiles(rootDir, 'shared'),
  ];
  for (const rootConfig of ['tsconfig.json', 'vitest.config.ts']) {
    if (fs.existsSync(path.join(rootDir, rootConfig))) {
      allFiles.push(rootConfig);
    }
  }

  const iconImportViolations: Array<{ file: string; specifier: string }> = [];
  const decommissionedTokenViolations: Array<{ file: string; token: string }> = [];

  const scanTargets = allFiles.filter(
    (f) => f.startsWith('astro/') || f === 'tsconfig.json' || f === 'vitest.config.ts'
  );

  for (const relFile of scanTargets) {
    const content = fs.readFileSync(path.join(rootDir, relFile), 'utf8');

    IMPORT_SPECIFIER_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = IMPORT_SPECIFIER_RE.exec(content)) !== null) {
      const spec = match[1] || match[2];
      if (spec && spec.startsWith('~icons/')) {
        iconImportViolations.push({ file: relFile, specifier: spec });
      }
    }

    for (const token of ['~icons/', 'IconComponent', 'isFullWidth']) {
      if (content.includes(token)) {
        decommissionedTokenViolations.push({ file: relFile, token });
      }
    }
  }

  // Entrypoints: live pages, Astro config, serverless handlers, CLI/audit scripts, and intentional build extractors
  const entrypoints = allFiles.filter((f) => {
    if (f.startsWith('astro/src/pages/') && SOURCE_FILE_RE.test(f) && !isTestFile(f)) return true;
    if (f === 'astro/astro.config.mjs') return true;
    if (/^netlify\/functions\/[^/]+\.ts$/.test(f) && !isTestFile(f)) return true;
    if (INTENTIONAL_BUILD_SCRIPTS.has(f)) return true;
    if (
      (f.startsWith('scripts/') || f.startsWith('knowledge/')) &&
      SOURCE_FILE_RE.test(f) &&
      !isTestFile(f)
    ) {
      return true;
    }
    return false;
  });

  const reachable = new Set<string>();
  const queue = [...entrypoints];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);

    const absCurrent = path.join(rootDir, current);
    if (!fs.existsSync(absCurrent) || !SOURCE_FILE_RE.test(current)) continue;

    const content = fs.readFileSync(absCurrent, 'utf8');
    IMPORT_SPECIFIER_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = IMPORT_SPECIFIER_RE.exec(content)) !== null) {
      const spec = match[1] || match[2];
      if (!spec) continue;
      const resolved = resolveImportSpecifier(rootDir, current, spec);
      if (resolved && !reachable.has(resolved)) {
        queue.push(resolved);
      }
    }
  }

  const productionCandidates = allFiles.filter(
    (f) =>
      (f.startsWith('astro/src/') || f.startsWith('netlify/functions/lib/')) &&
      SOURCE_FILE_RE.test(f) &&
      !f.endsWith('.d.ts') &&
      !isTestFile(f) &&
      !allowlist.has(f)
  );

  const orphanedModules = productionCandidates.filter((f) => !reachable.has(f));

  return {
    iconImportViolations,
    decommissionedTokenViolations,
    orphanedModules,
  };
}

describe('production-import-graph', () => {
  it('rejects ~icons/* imports, IconComponent, and isFullWidth across astro/, tsconfig.json, and vitest.config.ts', () => {
    const { iconImportViolations, decommissionedTokenViolations } =
      analyzeProductionGraph(REPO_ROOT);

    expect(iconImportViolations).toEqual([]);
    expect(decommissionedTokenViolations).toEqual([]);
  });

  it('reports zero unreferenced production modules in astro/src/ and netlify/functions/lib/', () => {
    const { orphanedModules } = analyzeProductionGraph(REPO_ROOT);
    expect(orphanedModules).toEqual([]);
  });

  it('ensures every individual FAQ module in astro/src/config/faqs/ is consumed outside the faqs barrel', () => {
    const faqFiles = walkRepoFiles(REPO_ROOT, 'astro/src/config/faqs').filter(
      (f) => f.endsWith('.ts') && path.basename(f) !== 'index.ts'
    );
    const consumerFiles = walkRepoFiles(REPO_ROOT, 'astro/src').filter(
      (f) => !f.startsWith('astro/src/config/faqs/') && SOURCE_FILE_RE.test(f)
    );
    const consumerContents = consumerFiles.map((f) =>
      fs.readFileSync(path.join(REPO_ROOT, f), 'utf8')
    );

    const unreferencedFaqFiles: string[] = [];
    for (const faqFile of faqFiles) {
      const content = fs.readFileSync(path.join(REPO_ROOT, faqFile), 'utf8');
      const exportedSymbols = [...content.matchAll(/export const (\w+)/g)].map((m) => m[1]);
      const baseName = path.basename(faqFile, '.ts');

      const hasConsumer = consumerContents.some(
        (c) => c.includes(baseName) || exportedSymbols.some((sym) => c.includes(sym))
      );
      if (!hasConsumer) {
        unreferencedFaqFiles.push(faqFile);
      }
    }

    expect(unreferencedFaqFiles).toEqual([]);
  });

  it('detects synthetic ~icons/* imports and test-only orphaned modules in fixture workspaces', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'import-graph-guard-'));
    try {
      fs.mkdirSync(path.join(tmpRoot, 'astro/src/pages'), { recursive: true });
      fs.mkdirSync(path.join(tmpRoot, 'astro/src/components'), { recursive: true });
      fs.mkdirSync(path.join(tmpRoot, 'netlify/functions/lib'), { recursive: true });

      // Live page importing ActiveBanner
      fs.writeFileSync(
        path.join(tmpRoot, 'astro/src/pages/index.astro'),
        `---\nimport ActiveBanner from '../components/ActiveBanner';\n---\n<ActiveBanner />\n`
      );
      fs.writeFileSync(
        path.join(tmpRoot, 'astro/src/components/ActiveBanner.tsx'),
        `export default function ActiveBanner() { return null; }\n`
      );

      // Test-only orphan in astro/src/components + ~icons import
      fs.writeFileSync(
        path.join(tmpRoot, 'astro/src/components/DeadModal.tsx'),
        `import Box from '~icons/lucide/box';\nexport const DeadModal = () => Box;\n`
      );
      fs.writeFileSync(
        path.join(tmpRoot, 'astro/src/components/DeadModal.test.tsx'),
        `import { DeadModal } from './DeadModal';\nconsole.log(DeadModal);\n`
      );

      // Test-only orphan in netlify/functions/lib
      fs.writeFileSync(
        path.join(tmpRoot, 'netlify/functions/lib/dead-cache.ts'),
        `export const deadCache = new Map();\n`
      );
      fs.writeFileSync(
        path.join(tmpRoot, 'netlify/functions/lib/dead-cache.test.ts'),
        `import { deadCache } from './dead-cache';\nconsole.log(deadCache);\n`
      );

      const report = analyzeProductionGraph(tmpRoot, { deferredAllowlist: new Set() });
      expect(report.iconImportViolations).toEqual([
        { file: 'astro/src/components/DeadModal.tsx', specifier: '~icons/lucide/box' },
      ]);
      expect(report.orphanedModules).toEqual([
        'astro/src/components/DeadModal.tsx',
        'netlify/functions/lib/dead-cache.ts',
      ]);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });
});
