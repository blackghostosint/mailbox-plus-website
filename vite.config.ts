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
        /**
         * Performance Optimization: Granular Vendor Chunk Splitting
         * By default, Vite puts all node_modules into a single 'vendor' chunk.
         * We split them here into logical groups to:
         * 1. Reduce the size of the initial 'vendor-core' chunk needed for the first paint.
         * 2. Improve cache hits when only specific dependencies change.
         * 3. Defer loading of heavy libraries (like markdown or motion) until they are needed by lazy-loaded routes.
         *
         * Expected Impact: Reduces initial vendor bundle size by ~50%.
         */
        manualChunks: (id) => {
          // Core React & Router - Essential for initial load
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-helmet-async/')
          ) {
            return 'vendor-core';
          }
          // UI Libraries (Radix UI) - Shared but secondary components
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-ui';
          }
          // Animations (Framer Motion) - Large library, split to avoid blocking initial render
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion';
          }
          // Markdown related - Very large, only used on Article pages
          if (
            id.includes('node_modules/react-markdown/') ||
            id.includes('node_modules/remark-gfm/')
          ) {
            return 'markdown';
          }
          // Shared Utils - Small common helpers
          if (
            id.includes('node_modules/clsx/') ||
            id.includes('node_modules/tailwind-merge/') ||
            id.includes('node_modules/uuid/')
          ) {
            return 'vendor-utils';
          }
          // Analytics & Tracking - Initial load but can be prioritized lower
          if (id.includes('node_modules/react-gtm-module/')) {
            return 'vendor-analytics';
          }
          // Forms & Security - Specific to Contact and Signup pages
          if (
            id.includes('node_modules/react-google-recaptcha/') ||
            id.includes('node_modules/qrcode.react/')
          ) {
            return 'vendor-security';
          }
        },
      },
    },
  },
});
