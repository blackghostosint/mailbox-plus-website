#!/usr/bin/env tsx
/**
 * Generates the "## Articles" section of public/llms.txt and appends full
 * article content to public/llms-full.txt, from the content/articles tree.
 *
 * Run automatically during netlify build (see netlify.toml) so the files can
 * never drift from the article corpus. Also runnable manually:
 *   npx tsx scripts/generate-llms-articles.ts [--write]
 * Without --write it prints a summary only (safe for CI checks).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadArticles } from './lib/article-utils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const LLMS_FULL_PATH = path.join(ROOT, 'public', 'llms-full.txt');

const BASE = 'https://mailboxplusohio.com';

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return 'unknown';
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return 'unknown';
  }
}

interface ArticleItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  pubDate: string | null;
  lastModified: string | null;
  content: string;
}

function getLLMArticles(): ArticleItem[] {
  const loaded = loadArticles(CONTENT_DIR, { filterPublished: true, rootDir: ROOT });
  return loaded.map((art) => ({
    slug: art.frontmatter.slug,
    title: art.frontmatter.title || art.frontmatter.slug,
    description: (art.frontmatter.description || '').replace(/\s+/g, ' ').trim(),
    category: art.frontmatter.category || 'general',
    pubDate: art.frontmatter.pubDate || null,
    lastModified: art.frontmatter.lastModified || null,
    content: art.content,
  }));
}

function articleSection(articles: ArticleItem[]): string {
  const byCat = new Map<string, ArticleItem[]>();
  for (const a of articles) {
    if (!byCat.has(a.category)) byCat.set(a.category, []);
    byCat.get(a.category)!.push(a);
  }
  const lines: string[] = ['', '## Articles', ''];
  const cats = [...byCat.keys()].sort();
  for (const cat of cats) {
    lines.push(`### ${cat}`);
    lines.push('');
    for (const a of byCat.get(cat)!.sort((x, y) => x.slug.localeCompare(y.slug))) {
      const desc = a.description ? `: ${a.description}` : '';
      lines.push(`- [${a.title}](${BASE}/articles/${a.slug}/)${desc}`);
      lines.push(
        `  Published ${fmtDate(a.pubDate)}${a.lastModified ? `, updated ${fmtDate(a.lastModified)}` : ''}.`
      );
    }
    lines.push('');
  }
  return (
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

function fullSection(articles: ArticleItem[]): string {
  const lines: string[] = ['', '## Articles (Full Text)', ''];
  const sorted = [...articles].sort((a, b) => a.slug.localeCompare(b.slug));
  for (const a of sorted) {
    lines.push(`### ${a.title}`);
    lines.push('');
    lines.push(`URL: ${BASE}/articles/${a.slug}/`);
    lines.push(`Category: ${a.category}`);
    lines.push(
      `Published: ${fmtDate(a.pubDate)}${a.lastModified ? ` | Updated: ${fmtDate(a.lastModified)}` : ''}`
    );
    lines.push('');
    lines.push(a.content.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }
  return (
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

function spliceSection(existing: string, headerRegex: RegExp, newContent: string): string {
  const match = existing.match(headerRegex);
  if (match) {
    const beforeHeader = existing.slice(0, match.index).trimEnd();
    return beforeHeader + '\n\n' + newContent.trimEnd() + '\n';
  }
  return existing.trimEnd() + '\n\n' + newContent.trimEnd() + '\n';
}

const write = process.argv.includes('--write');
const articles = getLLMArticles();
console.log(`[llms] loaded ${articles.length} published articles`);

if (!write) {
  console.log('[llms] dry run (pass --write to update files)');
  process.exit(0);
}

// llms.txt: replace/append the "## Articles" section, keep everything else intact
const llms = fs.readFileSync(LLMS_PATH, 'utf8');
const updatedLlms = spliceSection(llms, /## Articles/, articleSection(articles));
fs.writeFileSync(LLMS_PATH, updatedLlms);

// llms-full.txt: replace/append "## Articles (Full Text)" section
const full = fs.readFileSync(LLMS_FULL_PATH, 'utf8');
const updatedFull = spliceSection(full, /## Articles \(Full Text\)/, fullSection(articles));
fs.writeFileSync(LLMS_FULL_PATH, updatedFull);

console.log('[llms] wrote llms.txt Articles section + llms-full.txt full text');
