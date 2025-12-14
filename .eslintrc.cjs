module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["**/config/micro-problems/returns", "**/config/micro-problems/shipping", "**/config/micro-problems/packaging", "**/config/micro-problems/misc"],
            message: "Do not import individual shard files directly. Import from '@/config/micro-problems' or '@/config/services/micro-problems' instead."
          },
          {
            group: ["**/pages/ServicePage", "**/pages/ServicePage.tsx"],
            message: "ServicePage is deprecated. Use ServicePageV2 instead."
          }
        ]
      }
    ]
  },
};
