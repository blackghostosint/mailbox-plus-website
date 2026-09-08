#!/usr/bin/env node
/**
 * Generates the "## Articles" section of public/llms.txt and appends full
 * article content to public/llms-full.txt, from the content/articles tree.
 *
 * Run automatically during netlify build (see netlify.toml) so the files can
 * never drift from the article corpus. Also runnable manually:
 *   node scripts/generate-llms-articles.cjs [--write]
 * Without --write it prints a summary only (safe for CI checks).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const LLMS_FULL_PATH = path.join(ROOT, 'public', 'llms-full.txt');

const BASE = 'https://mailboxplusohio.com';

function walkMd(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(p));
    else if (entry.name.endsWith('.md') && entry.name !== 'README.md') out.push(p);
  }
  return out;
}

function loadArticles() {
  const articles = [];
  for (const file of walkMd(CONTENT_DIR)) {
    const raw = fs.readFileSync(file, 'utf8');
    const { data: fm, content } = matter(raw);
    if (!fm.slug || fm.status === 'draft') continue;
    articles.push({
      slug: fm.slug,
      title: fm.title || fm.slug,
      description: (fm.description || '').replace(/\s+/g, ' ').trim(),
      category: fm.category || 'general',
      pubDate: fm.pubDate || null,
      lastModified: fm.lastModified || null,
      content,
    });
  }
  return articles;
}

function fmtDate(iso) {
  if (!iso) return 'unknown';
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return 'unknown';
  }
}

function articleSection(articles) {
  const byCat = new Map();
  for (const a of articles) {
    if (!byCat.has(a.category)) byCat.set(a.category, []);
    byCat.get(a.category).push(a);
  }
  const lines = ['', '## Articles', ''];
  const cats = [...byCat.keys()].sort();
  for (const cat of cats) {
    lines.push(`### ${cat}`);
    lines.push('');
    for (const a of byCat.get(cat).sort((x, y) => x.slug.localeCompare(y.slug))) {
      const desc = a.description ? `: ${a.description}` : '';
      lines.push(`- [${a.title}](${BASE}/articles/${a.slug}/)${desc}`);
      lines.push(`  Published ${fmtDate(a.pubDate)}${a.lastModified ? `, updated ${fmtDate(a.lastModified)}` : ''}.`);
    }
    lines.push('');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function fullSection(articles) {
  const lines = ['', '## Articles (Full Text)', ''];
  const sorted = [...articles].sort((a, b) => a.slug.localeCompare(b.slug));
  for (const a of sorted) {
    lines.push(`### ${a.title}`);
    lines.push('');
    lines.push(`URL: ${BASE}/articles/${a.slug}/`);
    lines.push(`Category: ${a.category}`);
    lines.push(`Published: ${fmtDate(a.pubDate)}${a.lastModified ? ` | Updated: ${fmtDate(a.lastModified)}` : ''}`);
    lines.push('');
    lines.push(a.content.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function spliceSection(existing, headerRegex, newContent) {
  const re = new RegExp(`\\n${headerRegex.source}\\n[\\s\\S]*?(?=\\n## |$)`);
  if (re.test(existing)) {
    return existing.replace(re, '\n' + newContent.trimEnd() + '\n');
  }
  return existing.trimEnd() + '\n\n' + newContent.trimEnd() + '\n';
}

const write = process.argv.includes('--write');
const articles = loadArticles();
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
