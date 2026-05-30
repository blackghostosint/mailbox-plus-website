# Mailbox Plus Website - Technology Stack

**Last Updated**: January 1, 2026

## Core Technology Stack

- **Framework**: React 18.3.1 (Single Page Application)
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 5.4.21
- **Styling**: TailwindCSS 3.4.1 + PostCSS 8.4.35 + Autoprefixer 10.4.18
- **Target**: ES2020 (TypeScript), ES2018 (Build output)
- **Recommended Node.js**: 18+ (no .nvmrc specified)

---

## Production Dependencies

### Core React Libraries

| Package              | Version | Purpose                  |
| -------------------- | ------- | ------------------------ |
| `react`              | ^18.3.1 | Core React library       |
| `react-dom`          | ^18.3.1 | React DOM rendering      |
| `react-router-dom`   | ^6.25.1 | Client-side routing      |
| `react-helmet-async` | ^2.0.4  | SEO meta tags management |

### UI & Animation

| Package                     | Version   | Purpose                        |
| --------------------------- | --------- | ------------------------------ |
| `framer-motion`             | ^12.23.22 | Animation library              |
| `@radix-ui/react-accordion` | ^1.2.12   | Accessible accordion component |
| `lucide-react`              | ^0.344.0  | Icon library                   |
| `qrcode.react`              | ^4.2.0    | QR code generation             |

### Styling Utilities

| Package          | Version | Purpose                             |
| ---------------- | ------- | ----------------------------------- |
| `clsx`           | ^2.1.1  | Conditional CSS class names utility |
| `tailwind-merge` | ^3.3.1  | Tailwind class merging utility      |

### Third-Party Integrations

| Package                  | Version | Purpose                      |
| ------------------------ | ------- | ---------------------------- |
| `react-google-recaptcha` | ^3.1.0  | reCAPTCHA integration        |
| `react-gtm-module`       | ^2.0.11 | Google Tag Manager analytics |
| `resend`                 | ^6.1.2  | Email API client             |

### Configuration

| Package  | Version | Purpose                         |
| -------- | ------- | ------------------------------- |
| `dotenv` | ^17.2.3 | Environment variable management |

---

## Development Dependencies

### TypeScript & Type Definitions

| Package                         | Version | Purpose                       |
| ------------------------------- | ------- | ----------------------------- |
| `typescript`                    | ^5.5.3  | TypeScript compiler           |
| `typescript-eslint`             | ^8.3.0  | TypeScript ESLint integration |
| `@types/react`                  | ^18.3.5 | React type definitions        |
| `@types/react-dom`              | ^18.3.0 | React DOM type definitions    |
| `@types/react-google-recaptcha` | ^2.1.9  | reCAPTCHA type definitions    |
| `@types/react-gtm-module`       | ^2.0.4  | GTM type definitions          |
| `schema-dts`                    | ^1.1.5  | Schema.org type definitions   |

### Linting & Code Quality

| Package                            | Version     | Purpose                      |
| ---------------------------------- | ----------- | ---------------------------- |
| `eslint`                           | ^8.56.0     | JavaScript/TypeScript linter |
| `@eslint/js`                       | ^9.39.0     | ESLint JavaScript rules      |
| `@typescript-eslint/eslint-plugin` | ^8.46.2     | TypeScript linting rules     |
| `@typescript-eslint/parser`        | ^8.46.2     | TypeScript parser for ESLint |
| `eslint-plugin-jsx-a11y`           | ^6.10.2     | Accessibility linting        |
| `eslint-plugin-react`              | ^7.34.3     | React-specific linting rules |
| `eslint-plugin-react-hooks`        | ^5.1.0-rc.0 | React Hooks linting          |
| `eslint-plugin-react-refresh`      | ^0.4.11     | React Fast Refresh support   |
| `globals`                          | ^15.9.0     | Global variables definitions |

### Build Tools & Plugins

| Package                | Version | Purpose                   |
| ---------------------- | ------- | ------------------------- |
| `vite`                 | ^5.4.21 | Build tool and dev server |
| `@vitejs/plugin-react` | ^4.3.1  | Vite React plugin         |
| `vite-plugin-sitemap`  | ^0.8.2  | Sitemap generation        |

### CSS Processing

| Package        | Version  | Purpose                      |
| -------------- | -------- | ---------------------------- |
| `tailwindcss`  | ^3.4.1   | Utility-first CSS framework  |
| `postcss`      | ^8.4.35  | CSS transformation tool      |
| `autoprefixer` | ^10.4.18 | CSS vendor prefix automation |

---

## Build Configuration

### Vite Configuration

- **Base URL**: `https://mailboxplusohio.com`
- **Build Target**: ES2018
- **Minifier**: esbuild
- **Code Splitting**: Enabled with vendor chunking
- **Manual Chunks**:
  - `vendor`: React, React DOM, React Router, React Helmet
  - `motion`: Framer Motion (separate bundle)

### TypeScript Configuration

- **Target**: ES2020
- **Module**: ESNext
- **Module Resolution**: bundler
- **JSX**: react-jsx
- **Strict Mode**: Enabled
- **Unused Locals/Parameters**: Error
- **No Fallthrough Cases**: Enabled

### TailwindCSS Configuration

- **Content**: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **Plugins**: None (base configuration)

---

## Available Scripts

```bash
# Development
npm run dev                           # Start Vite dev server

# Build & Preview
npm run build                         # Create production build
npm run preview                       # Preview production build locally

# Code Quality
npm run lint                          # Run ESLint on all files
npm run lint:a11y                     # Run accessibility-focused linting
npm run typecheck                     # TypeScript type checking without emitting

# Custom Audits
npm run audit:micro-problems          # Run micro-problems audit
npm run audit:micro-problems:report   # Generate micro-problems report
```

---

## Key Features

✅ **TypeScript** with strict mode and comprehensive type checking  
✅ **TailwindCSS** for utility-first styling  
✅ **SEO Optimized** with sitemap generation and react-helmet-async  
✅ **Accessibility** focused with jsx-a11y linting  
✅ **Code Splitting** with vendor chunking for optimal loading  
✅ **Google Tag Manager** integration for analytics  
✅ **reCAPTCHA** support for form protection  
✅ **QR Code** generation capabilities  
✅ **Animation** support via Framer Motion  
✅ **Email** functionality via Resend API  
✅ **Radix UI** for accessible components  
✅ **Custom Auditing** scripts for micro-problems

---

## Browser Targets

- **Modern browsers** supporting ES2018+
- **TypeScript compilation target**: ES2020
- **Build output target**: ES2018

---

## Notes

- No specific Node.js version is pinned (`.nvmrc` not present)
- Recommended: **Node.js 18+** for compatibility with React 18 and Vite 5
- Project uses ESM (ECMAScript Modules) throughout
- Fast Refresh enabled for optimal development experience
