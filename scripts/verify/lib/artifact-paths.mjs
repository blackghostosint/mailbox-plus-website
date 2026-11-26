#!/usr/bin/env node
/**
 * Shared path & slug resolver for article verification artifacts (`.factcheck.md` and `.sources.json`).
 *
 * Keeps candidate lookup order and frontmatter `slug` resolution identical across
 * `verify.mjs`, `claims-gate.js`, `source-constraint-gate.mjs`, and `preflight-article.sh`.
 */
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

/**
 * Extracts `slug` from YAML frontmatter without external dependencies.
 * Returns `null` if frontmatter or `slug` is absent/empty.
 * @param {string} markdownText
 * @returns {string | null}
 */
export function extractFrontmatterSlug(markdownText) {
  if (typeof markdownText !== 'string' || !markdownText.startsWith('---')) {
    return null;
  }
  const fmMatch = markdownText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!fmMatch) return null;

  const lines = fmMatch[1].split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^slug\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    let raw = m[1].trim();
    if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
      raw = raw.slice(1, -1).trim();
    } else {
      // Strip trailing inline YAML comment if unquoted
      raw = raw.replace(/\s+#.*$/, '').trim();
    }
    if (raw) return raw;
  }
  return null;
}

/**
 * Resolves canonical receipt/sources slug for an article, preferring YAML frontmatter
 * `slug` before falling back to filename `basename` without extension.
 *
 * @param {string} articlePath
 * @param {string | null} [articleText]
 * @param {{ fs?: typeof nodeFs, path?: typeof nodePath }} [deps]
 * @returns {string}
 */
export function resolveArticleSlug(
  articlePath,
  articleText = null,
  { fs = nodeFs, path = nodePath } = {}
) {
  let content = articleText;
  if (content === null && articlePath && typeof fs.readFileSync === 'function') {
    try {
      content = fs.readFileSync(articlePath, 'utf8');
    } catch {
      content = '';
    }
  }
  const fmSlug = extractFrontmatterSlug(content || '');
  if (fmSlug) return fmSlug;

  const ext = path.extname(articlePath);
  return path.basename(articlePath, ext);
}

function dedupePaths(candidates) {
  const seen = new Set();
  const out = [];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    out.push(candidate);
  }
  return out;
}

/**
 * Returns ordered candidate paths for an article's fact-check receipt:
 *   1. `<draftsDir>/<slug>.factcheck.md`
 *   2. `<draftsDir>/<slug>.factcheck`
 *   3. `<articleDir>/<slug>.factcheck.md` (when `articleDir` or `articlePath` is provided)
 *   4. `<root>/content/drafts/<slug>.factcheck.md` (when `root` is provided)
 *
 * @param {{
 *   slug: string,
 *   draftsDir?: string,
 *   articleDir?: string,
 *   articlePath?: string,
 *   root?: string
 * }} options
 * @param {{ path?: typeof nodePath }} [deps]
 * @returns {string[]}
 */
export function getFactcheckCandidates(options, { path = nodePath } = {}) {
  const { slug, draftsDir, articlePath, root } = options || {};
  if (!slug) return [];
  const effectiveArticleDir = options?.articleDir || (articlePath ? path.dirname(articlePath) : '');
  const effectiveDraftsDir =
    draftsDir || (root ? path.resolve(root, '.factchecks') : '.factchecks');
  const repoDraftsFallback = root ? path.resolve(root, 'content', 'drafts') : '';

  return dedupePaths([
    effectiveDraftsDir ? path.join(effectiveDraftsDir, `${slug}.factcheck.md`) : '',
    effectiveDraftsDir ? path.join(effectiveDraftsDir, `${slug}.factcheck`) : '',
    effectiveArticleDir ? path.join(effectiveArticleDir, `${slug}.factcheck.md`) : '',
    repoDraftsFallback ? path.join(repoDraftsFallback, `${slug}.factcheck.md`) : '',
  ]);
}

/**
 * Returns the first existing fact-check receipt path from `getFactcheckCandidates`, or `null`.
 *
 * @param {Parameters<typeof getFactcheckCandidates>[0]} options
 * @param {{ fs?: typeof nodeFs, path?: typeof nodePath }} [deps]
 * @returns {string | null}
 */
export function resolveFactcheckPath(options, { fs = nodeFs, path = nodePath } = {}) {
  const candidates = getFactcheckCandidates(options, { path });
  return candidates.find((f) => fs.existsSync(f)) || null;
}

/**
 * Returns ordered candidate paths for an article's `.sources.json` constraint file:
 *   1. `<draftsDir>/<slug>.sources.json`
 *   2. `<articleDir>/<slug>.sources.json` (when `articleDir` or `articlePath` is provided)
 *   3. `<root>/content/drafts/<slug>.sources.json` (when `root` is provided)
 *
 * @param {{
 *   slug: string,
 *   draftsDir?: string,
 *   articleDir?: string,
 *   articlePath?: string,
 *   root?: string
 * }} options
 * @param {{ path?: typeof nodePath }} [deps]
 * @returns {string[]}
 */
export function getSourcesCandidates(options, { path = nodePath } = {}) {
  const { slug, draftsDir, articlePath, root } = options || {};
  if (!slug) return [];
  const effectiveArticleDir = options?.articleDir || (articlePath ? path.dirname(articlePath) : '');
  const effectiveDraftsDir =
    draftsDir || (root ? path.resolve(root, '.factchecks') : '.factchecks');
  const repoDraftsFallback = root ? path.resolve(root, 'content', 'drafts') : '';

  return dedupePaths([
    effectiveDraftsDir ? path.join(effectiveDraftsDir, `${slug}.sources.json`) : '',
    effectiveArticleDir ? path.join(effectiveArticleDir, `${slug}.sources.json`) : '',
    repoDraftsFallback ? path.join(repoDraftsFallback, `${slug}.sources.json`) : '',
  ]);
}

/**
 * Returns the first existing `.sources.json` path from `getSourcesCandidates`, or `null`.
 *
 * @param {Parameters<typeof getSourcesCandidates>[0]} options
 * @param {{ fs?: typeof nodeFs, path?: typeof nodePath }} [deps]
 * @returns {string | null}
 */
export function resolveSourcesPath(options, { fs = nodeFs, path = nodePath } = {}) {
  const candidates = getSourcesCandidates(options, { path });
  return candidates.find((f) => fs.existsSync(f)) || null;
}

const isDirect =
  process.argv[1] &&
  nodePath.resolve(process.argv[1]) === nodePath.resolve(fileURLToPath(import.meta.url));

if (isDirect) {
  const { values } = parseArgs({
    options: {
      article: { type: 'string' },
      slug: { type: 'string' },
      root: { type: 'string' },
      drafts: { type: 'string' },
      field: { type: 'string', default: 'json' },
    },
    strict: false,
  });

  const root = values.root ? nodePath.resolve(values.root) : process.cwd();
  const articlePath = values.article ? nodePath.resolve(root, values.article) : '';
  const draftsDir = values.drafts
    ? nodePath.resolve(root, values.drafts)
    : nodePath.resolve(root, '.factchecks');
  const slug =
    values.slug ||
    (articlePath ? resolveArticleSlug(articlePath, null, { fs: nodeFs, path: nodePath }) : '');
  const articleDir = articlePath ? nodePath.dirname(articlePath) : '';

  const opts = { slug, draftsDir, articleDir, root };
  const factcheckPath = resolveFactcheckPath(opts, { fs: nodeFs, path: nodePath });
  const sourcesPath = resolveSourcesPath(opts, { fs: nodeFs, path: nodePath });

  if (values.field === 'slug') {
    process.stdout.write(`${slug}\n`);
  } else if (values.field === 'factcheck') {
    process.stdout.write(`${factcheckPath || ''}\n`);
  } else if (values.field === 'sources') {
    process.stdout.write(`${sourcesPath || ''}\n`);
  } else if (values.field === 'shell') {
    process.stdout.write(`${slug}\t${factcheckPath || ''}\t${sourcesPath || ''}\n`);
  } else if (values.field === 'lines') {
    process.stdout.write(`${slug}\n${factcheckPath || ''}\n${sourcesPath || ''}\n`);
  } else {
    console.log(
      JSON.stringify({
        slug,
        factcheckPath,
        sourcesPath,
        factcheckCandidates: getFactcheckCandidates(opts, { path: nodePath }),
        sourcesCandidates: getSourcesCandidates(opts, { path: nodePath }),
      })
    );
  }
}
