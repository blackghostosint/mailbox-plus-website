import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Build a slug -> lastmod (or pubDate fallback) map from article frontmatter
// so the sitemap carries real per-page dates instead of none.
function buildArticleDateMap() {
  const contentDir = path.resolve(__dirname, '../content/articles');
  const map = new Map();
  if (!fs.existsSync(contentDir)) return map;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
        try {
          const { data: fm } = matter(fs.readFileSync(p, 'utf8'));
          if (!fm.slug || fm.status === 'draft') continue;
          const d = fm.lastModified || fm.pubDate;
          if (d) {
            const iso = new Date(d).toISOString();
            map.set(`/articles/${fm.slug}/`, iso);
            map.set(`/articles/${fm.slug}`, iso);
          }
        } catch { /* skip unreadable file */ }
      }
    }
  };
  walk(contentDir);
  return map;
}

const articleDates = buildArticleDateMap();

export default defineConfig({
  site: 'https://mailboxplusohio.com',
  output: 'static',
  srcDir: './src',
  outDir: '../dist',
  publicDir: '../public',
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  vite: {
    plugins: [Icons({ compiler: 'jsx', jsx: 'react' })],
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/accept-invite') &&
        !page.includes('/after-signup') &&
        !page.includes('/rewards') &&
        !page.includes('/terms') &&
        !page.includes('/privacy'),
      serialize(item) {
        // item.url is the full URL; /articles/<slug>/ entries get their
        // frontmatter date as lastmod. Non-articles serialize unchanged.
        try {
          const u = new URL(item.url);
          const iso = articleDates.get(u.pathname);
          if (iso) return { ...item, lastmod: iso };
        } catch { /* fall through */ }
        return item;
      },
    }),
  ],
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
