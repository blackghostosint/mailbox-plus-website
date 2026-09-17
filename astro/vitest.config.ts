import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '~icons': 'virtual:icons',
    },
  },
  test: {
    environment: 'node',
    environmentMatchGlobs: [
      ['../public/js/**', 'happy-dom'],
      ['../tests/public-js/**', 'happy-dom'],
      ['**/*.dom.test.*', 'happy-dom'],
    ],
    globals: true,
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      '../netlify/functions/**/*.{test,spec}.{ts,tsx}',
      '../scripts/**/*.{test,spec}.{ts,tsx}',
      '../public/js/**/*.{test,spec}.{ts,js}',
      '../tests/public-js/**/*.{test,spec}.{ts,js}',
    ],
  },
});
