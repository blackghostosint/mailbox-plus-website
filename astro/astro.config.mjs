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
  ],
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
