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
      '@google/generative-ai': path.resolve(__dirname, '../node_modules/@google/generative-ai'),
      dotenv: path.resolve(__dirname, '../node_modules/dotenv'),
      stripe: path.resolve(__dirname, '../node_modules/stripe'),
      sharp: path.resolve(__dirname, '../node_modules/sharp'),
      resend: path.resolve(__dirname, '../node_modules/resend'),
    },
  },
  test: {
    environment: 'node',
    // 20s: IO-heavy tests (article corpus parsing, vault-sync shell scripts)
    // routinely exceed vitest's 5s default when the full 1200-test suite
    // saturates the runner. 5s flaked ~2-3 tests per run, different each time.
    testTimeout: 20000,
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
    exclude: [
      '../scripts/__tests__/audit-a11y.test.ts',
      '../scripts/seo/__tests__/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx,js,jsx}'],
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
