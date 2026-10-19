import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    // Directory and file exclusions for ESLint.
    // Note: 'netlify/' and 'scripts/' are excluded from ESLint because they use independent
    // TypeScript configurations (e.g., netlify/functions/tsconfig.json and root tsconfig.json)
    // verified via `npm run typecheck` and dedicated audit scripts rather than frontend ESLint rules.
    ignores: [
      // Build outputs and dependencies
      'dist',
      'node_modules',
      // Configuration files
      '*.config.js',
      '*.config.ts',
      '.eslintrc.cjs',
      '.eslintrc.json',
      // Serverless functions and build/SEO/audit tooling (checked via independent TypeScript configs)
      'netlify/',
      'scripts/',
      // Knowledge base runners, archived code, and coverage reports
      'knowledge/',
      'archive/',
      'coverage/',
      '**/coverage/**',
      // Astro build artifacts and standalone Python utilities
      'astro/.astro/',
      'replace-framer.py',
      'replace-framer-v2.py',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      prettier,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // React hooks
      ...reactHooks.configs.recommended.rules,

      // JSX accessibility
      ...jsxA11y.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Prettier integration - turn Prettier errors into ESLint errors
      'prettier/prettier': 'error',

      // Custom restrictions
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/config/micro-problems/returns',
                '**/config/micro-problems/shipping',
                '**/config/micro-problems/packaging',
                '**/config/micro-problems/misc',
              ],
              message:
                "Do not import individual shard files directly. Import from '@/config/micro-problems' or '@/config/services/micro-problems' instead.",
            },
            {
              group: ['**/pages/ServicePage', '**/pages/ServicePage.tsx'],
              message: 'ServicePage is deprecated. Use ServicePageV2 instead.',
            },
          ],
        },
      ],

      // Accessibility
      'jsx-a11y/control-has-associated-label': 'error',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },
];
