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
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          environmentMatchGlobs: [
            ['**/*.test.tsx', 'happy-dom'],
            ['**/*.spec.tsx', 'happy-dom'],
          ],
          globals: true,
          include: [
            'astro/src/**/*.{test,spec}.{ts,tsx}',
            'netlify/functions/**/*.{test,spec}.{ts,tsx}',
            'shared/**/*.{test,spec}.{ts,tsx}',
            'scripts/__tests__/**/*.{test,spec}.{ts,tsx}',
            'scripts/verify/__tests__/**/*.{test,spec}.{ts,tsx}',
          ],
          exclude: [
            'scripts/__tests__/audit-a11y.test.ts',
            'scripts/seo/__tests__/**',
            'knowledge/__tests__/**',
            '**/node_modules/**',
            '**/dist/**',
            '**/tests/e2e/**',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'retrieval',
          environment: 'node',
          globals: true,
          include: ['knowledge/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'seo',
          environment: 'node',
          globals: true,
          include: ['scripts/seo/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'a11y',
          environment: 'node',
          globals: true,
          include: ['scripts/__tests__/audit-a11y.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['astro/src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        '**/*.{test,spec}.{ts,tsx,js,jsx}',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/dist/**',
        '**/node_modules/**',
        '**/coverage/**',
      ],
      thresholds: {
        statements: 91.95,
        branches: 77.01,
        functions: 91.35,
        lines: 93.28,
      },
    },
  },
});
