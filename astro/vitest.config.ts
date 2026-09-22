import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  resolve: {
    alias: {
      '~icons': 'virtual:icons',
    },
  },
  test: {
    environment: 'node',
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'happy-dom'],
      ['**/*.spec.tsx', 'happy-dom'],
    ],
    globals: true,
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      '../netlify/functions/**/*.{test,spec}.{ts,tsx}',
      '../scripts/**/*.{test,spec}.{ts,tsx}',
      '../knowledge/**/*.{test,spec}.{ts,tsx}',
    ],
  },
});
