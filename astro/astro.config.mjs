/* global console */
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';

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
    tailwind({
      config: { path: './tailwind.config.mjs' },
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      lastmod: new Date(),
    }),
    {
      name: 'async-css',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const { fileURLToPath } = await import('node:url');
          const fs = await import('node:fs');
          const path = await import('node:path');

          const outDirPath = fileURLToPath(dir);
          console.log('[async-css-integration] Processing output files in:', outDirPath);

          function walk(currentDir) {
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
              const filepath = path.join(currentDir, file);
              const stat = fs.statSync(filepath);
              if (stat.isDirectory()) {
                walk(filepath);
              } else if (stat.isFile() && file.endsWith('.html')) {
                const html = fs.readFileSync(filepath, 'utf-8');

                // 1. Extract noscript blocks
                const noscriptBlocks = [];
                let processedHtml = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, (match) => {
                  const placeholder = `<!--__NOSCRIPT_PLACEHOLDER_${noscriptBlocks.length}__-->`;
                  noscriptBlocks.push(match);
                  return placeholder;
                });

                // 2. Find and rewrite stylesheet links
                let changed = false;
                const linkRegex = /<link[^>]+>/gi;
                processedHtml = processedHtml.replace(linkRegex, (linkTag) => {
                  const isStyleSheet =
                    /rel=["']?stylesheet["']?/i.test(linkTag) &&
                    /href=["']?(\/_astro\/[^"'\s>]+.css)["']?/i.test(linkTag);
                  if (!isStyleSheet) {
                    return linkTag;
                  }

                  if (/media=["']?print["']?/i.test(linkTag) || /onload=/i.test(linkTag)) {
                    return linkTag;
                  }

                  const hrefMatch = linkTag.match(/href=["']?(\/_astro\/[^"'\s>]+.css)["']?/i);
                  if (!hrefMatch) {
                    return linkTag;
                  }
                  const href = hrefMatch[1];
                  changed = true;
                  return `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
                });

                // 3. Put noscript blocks back
                for (let i = 0; i < noscriptBlocks.length; i++) {
                  const placeholder = `<!--__NOSCRIPT_PLACEHOLDER_${i}__-->`;
                  processedHtml = processedHtml.replace(placeholder, noscriptBlocks[i]);
                }

                if (changed) {
                  fs.writeFileSync(filepath, processedHtml, 'utf-8');
                }
              }
            }
          }

          walk(outDirPath);
          console.log(
            '[async-css-integration] CSS files rewritten to non-render-blocking successfully.'
          );
        },
      },
    },
  ],
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
