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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{ts,tsx,js,jsx}',
        '../netlify/functions/**/*.{ts,tsx,js,jsx}',
        '../scripts/**/*.{ts,tsx,js,jsx}',
        '../knowledge/**/*.{ts,tsx,js,jsx}',
      ],
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
