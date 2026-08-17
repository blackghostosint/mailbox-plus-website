import { defineConfig } from 'astro/config';
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
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/accept-invite') &&
        !page.includes('/after-signup') &&
        !page.includes('/rewards') &&
        !page.includes('/terms') &&
        !page.includes('/privacy') &&
        // Archived articles keep their URL but leave the sitemap
        !page.includes('/articles/kirtland-hills-graphic-design'),
    }),
  ],
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
