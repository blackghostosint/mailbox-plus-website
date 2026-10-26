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
    // Standalone global ignores object
    ignores: [
      // Build outputs and dependencies
      'dist',
      '**/dist/**',
      'node_modules',
      '**/node_modules/**',
      // Legacy configuration files
      '.eslintrc.cjs',
      '.eslintrc.json',
      // Knowledge base runners, archived code, and coverage reports
      'knowledge/**',
      '**/knowledge/**',
      'archive/**',
      '**/archive/**',
      'coverage/**',
      '**/coverage/**',
      // Astro build artifacts and standalone Python utilities
      'astro/.astro/',
      'replace-framer.py',
      'replace-framer-v2.py',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
    },
    rules: {
      // TypeScript rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',

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
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    // Environment override for Node.js runtime scripts, serverless functions, and configuration files
    files: [
      'netlify/**/*.{ts,js,mjs,cjs}',
      'scripts/**/*.{ts,js,mjs,cjs}',
      '*.config.{js,ts,mjs,cjs}',
      '*.config.js',
      '*.config.ts',
      'convert-images.cjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.browser,
      },
    },
  },
  {
    // Environment override and React/JSX rules strictly scoped to frontend components
    files: ['astro/**/*.{ts,tsx,js,jsx}', 'src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // React hooks
      ...reactHooks.configs.recommended.rules,

      // JSX accessibility
      ...jsxA11y.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Accessibility
      'jsx-a11y/control-has-associated-label': 'error',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },
];
