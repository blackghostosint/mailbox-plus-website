import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { toISODateString } from './src/utils/dateUtils.ts';

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
            const iso = toISODateString(d, '', 'iso');
            if (iso) {
              map.set(`/articles/${fm.slug}/`, iso);
              map.set(`/articles/${fm.slug}`, iso);
            }
          }
        } catch {
          /* skip unreadable file */
        }
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
    // Astro's default envPrefix is PUBLIC_ only; the checkout client reads
    // import.meta.env.VITE_RECAPTCHA_SITE_KEY, which was silently inlined as an
    // empty object — so the browser never sent a reCAPTCHA token and the
    // fail-closed create-checkout function rejected every attempt (2026-10-21).
    envPrefix: ['PUBLIC_', 'VITE_'],
    build: {
      assetsInlineLimit: 0,
    },
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
          const pathname = item.url.replace(/^https?:\/\/[^/]+/, '');
          const iso = articleDates.get(pathname);
          if (iso) return { ...item, lastmod: iso };
        } catch {
          /* fall through */
        }
        return item;
      },
    }),
  ],
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
