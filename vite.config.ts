import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import path from 'path';
import { splitVendorChunkPlugin } from 'vite';
import Icons from 'unplugin-icons/vite';
import routes from './src/data/routes.json';

export default defineConfig({
  plugins: [
    react(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    sitemap({
      hostname: 'https://mailboxplusohio.com',
      dynamicRoutes: routes,
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
