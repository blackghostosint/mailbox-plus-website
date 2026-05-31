import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import path from 'path';
import { splitVendorChunkPlugin } from 'vite';
import Icons from 'unplugin-icons/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import sitemapConfig from './src/data/sitemap-config.json';

// Convert string dates to Date objects for the plugin
const lastmodMap = Object.entries(sitemapConfig.lastmod).reduce(
  (acc, [route, dateStr]) => {
    acc[route] = new Date(dateStr);
    return acc;
  },
  {} as Record<string, Date>
);

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
    drop: ['console'], // Strip all console.* calls from production builds
    chunkSizeWarningLimit: 700, // Suppress warning for chunks under 700KB
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate framer-motion
          if (id.includes('framer-motion')) {
            return 'motion';
          }
          // Separate react-markdown and remark-gfm
          if (id.includes('react-markdown') || id.includes('remark-gfm')) {
            return 'markdown';
          }
          // Separate uuid
          if (id.includes('uuid')) {
            return 'utils';
          }
          // Let splitVendorChunkPlugin handle node_modules
          if (id.includes('node_modules')) {
            // This will be handled by splitVendorChunkPlugin()
            return 'vendor';
          }
        },
      },
    },
  },
});
