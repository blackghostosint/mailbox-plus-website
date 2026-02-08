import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import path from 'path';
import { splitVendorChunkPlugin } from 'vite';
import Icons from 'unplugin-icons/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import sitemapConfig from './src/data/sitemap-config.json';

// Convert string dates to Date objects for the plugin
const lastmodMap = Object.entries(sitemapConfig.lastmod).reduce((acc, [route, dateStr]) => {
  acc[route] = new Date(dateStr);
  return acc;
}, {} as Record<string, Date>);

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    sitemap({
      hostname: 'https://mailboxplusohio.com',
      dynamicRoutes: sitemapConfig.routes,
      lastmod: lastmodMap,
      generateRobotsTxt: false,
    }),
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2018',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
