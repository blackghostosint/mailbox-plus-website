import { defineProject } from 'vitest/config';

export default [
  defineProject({
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
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
      ],
    },
  }),
  defineProject({
    extends: './vitest.config.ts',
    test: {
      name: 'retrieval',
      include: ['knowledge/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
  defineProject({
    extends: './vitest.config.ts',
    test: {
      name: 'seo',
      include: ['scripts/seo/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
  defineProject({
    extends: './vitest.config.ts',
    test: {
      name: 'a11y',
      include: ['scripts/__tests__/audit-a11y.test.ts'],
    },
  }),
];
