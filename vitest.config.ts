import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getViteConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default getViteConfig({
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  resolve: {
    alias: {
      '~icons': 'virtual:icons',
      '@google/generative-ai': path.resolve(__dirname, 'node_modules/@google/generative-ai'),
      dotenv: path.resolve(__dirname, 'node_modules/dotenv'),
      stripe: path.resolve(__dirname, 'node_modules/stripe'),
      sharp: path.resolve(__dirname, 'node_modules/sharp'),
      resend: path.resolve(__dirname, 'node_modules/resend'),
    },
  },
  test: {
    testTimeout: 20000,
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
      reportsDirectory: './astro/coverage',
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
