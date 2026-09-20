#!/usr/bin/env tsx
/**
 * Static environment variable scanner script.
 * Extracts process.env.* and import.meta.env.* references across:
 *   - astro/src
 *   - netlify/functions
 *   - scripts
 * and compares them against docs/ENVIRONMENT.md and .env.example.
 *
 * Exit code 0: All environment variables are synchronized.
 * Exit code 1: Missing or extraneous environment variables detected.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const ENV_DOC_PATH = path.join(ROOT, 'docs', 'ENVIRONMENT.md');
const ENV_EXAMPLE_PATH = path.join(ROOT, '.env.example');

const SEARCH_DIRS = [
  path.join(ROOT, 'astro', 'src'),
  path.join(ROOT, 'netlify', 'functions'),
  path.join(ROOT, 'scripts'),
];

// Built-in Vite, Node, Netlify platform, or GitHub Actions runner variables that are not user app configs
const IGNORED_SYSTEM_VARS = new Set([
  'DEV',
  'PROD',
  'MODE',
  'SSR',
  'NODE_ENV',
  'CI',
  'CONTEXT',
  'GITHUB_BASE_REF',
  'GITHUB_BASE_SHA',
  'GITHUB_EVENT_PATH',
  'GITHUB_TOKEN',
  'GITHUB_WORKSPACE',
  'GITHUB_REF',
  'GITHUB_SHA',
  'CHROMEDRIVER_SKIP_DOWNLOAD',
  'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD',
  'DRY_RUN',
]);

const FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.astro']);

function isTestFile(filePath: string): boolean {
  const norm = filePath.replace(/\\/g, '/');
  return (
    norm.includes('/__tests__/') ||
    norm.endsWith('.test.ts') ||
    norm.endsWith('.test.tsx') ||
    norm.endsWith('.test.js') ||
    norm.endsWith('.spec.ts') ||
    norm.endsWith('.spec.js')
  );
}

function walkDir(dirPath: string, callback: (filePath: string) => void): void {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

export function parseDocumentedVars(docPath: string): Set<string> {
  const documented = new Set<string>();
  if (!fs.existsSync(docPath)) {
    console.error(`❌ Environment documentation file not found at ${docPath}`);
    return documented;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  // Match backticked uppercase strings like `VITE_R2_PUBLIC_BASE_URL`
  const backtickRegex = /`([A-Z0-9_]{2,})`/g;
  let match: RegExpExecArray | null;
  while ((match = backtickRegex.exec(content)) !== null) {
    const varName = match[1];
    // Must look like an environment variable name (starts with letter, uppercase, no trailing underscore)
    if (/^[A-Z][A-Z0-9_]+$/.test(varName) && !varName.endsWith('_')) {
      documented.add(varName);
    }
  }

  return documented;
}

export function parseEnvExampleVars(examplePath: string): Set<string> {
  const exampleVars = new Set<string>();
  if (!fs.existsSync(examplePath)) return exampleVars;

  const lines = fs.readFileSync(examplePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      // Check commented out lines like "# VITE_GOOGLE_MAPS_KEY=..."
      const commentMatch = trimmed.match(/^#\s*([A-Z0-9_]+)=/);
      if (commentMatch) {
        exampleVars.add(commentMatch[1]);
      }
      continue;
    }
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const varName = trimmed.slice(0, eqIdx).trim();
      if (/^[A-Z0-9_]+$/.test(varName)) {
        exampleVars.add(varName);
      }
    }
  }

  return exampleVars;
}

export interface CodeEnvOccurrence {
  varName: string;
  filePath: string;
}

export function scanCodebaseForEnvVars(dirs: string[]): Map<string, Set<string>> {
  const varUsages = new Map<string, Set<string>>(); // varName -> Set<relativeFilePath>

  for (const searchDir of dirs) {
    walkDir(searchDir, (filePath) => {
      const ext = path.extname(filePath);
      if (
        !FILE_EXTENSIONS.has(ext) ||
        isTestFile(filePath) ||
        filePath.replace(/\\/g, '/').endsWith('scripts/verify/check-env-docs.ts')
      )
        return;

      const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Match process.env.VAR_NAME, process.env['VAR_NAME'], process.env["VAR_NAME"]
      // and import.meta.env.VAR_NAME, import.meta.env['VAR_NAME'], import.meta.env["VAR_NAME"]
      const processDotRegex = /process\.env\.([A-Z0-9_]+)/g;
      const processBracketRegex = /process\.env\[['"]([A-Z0-9_]+)['"]\]/g;
      const importMetaDotRegex = /import\.meta\.env\.([A-Z0-9_]+)/g;
      const importMetaBracketRegex = /import\.meta\.env\[['"]([A-Z0-9_]+)['"]\]/g;

      const matches: string[] = [];
      let m: RegExpExecArray | null;

      while ((m = processDotRegex.exec(fileContent)) !== null) matches.push(m[1]);
      while ((m = processBracketRegex.exec(fileContent)) !== null) matches.push(m[1]);
      while ((m = importMetaDotRegex.exec(fileContent)) !== null) matches.push(m[1]);
      while ((m = importMetaBracketRegex.exec(fileContent)) !== null) matches.push(m[1]);

      for (const varName of matches) {
        if (IGNORED_SYSTEM_VARS.has(varName)) continue;
        if (!varUsages.has(varName)) {
          varUsages.set(varName, new Set());
        }
        varUsages.get(varName)!.add(relPath);
      }
    });
  }

  return varUsages;
}

export function checkEnvDocs(): boolean {
  console.log('🔍 Checking environment variable documentation sync...');

  const documentedVars = parseDocumentedVars(ENV_DOC_PATH);
  const exampleVars = parseEnvExampleVars(ENV_EXAMPLE_PATH);
  const codeUsages = scanCodebaseForEnvVars(SEARCH_DIRS);

  const usedVars = new Set(codeUsages.keys());

  // 1. Check for missing environment variables (used in code, but not documented in docs/ENVIRONMENT.md)
  const missingVars: { varName: string; files: string[] }[] = [];
  for (const [varName, filesSet] of codeUsages.entries()) {
    if (!documentedVars.has(varName)) {
      missingVars.push({ varName, files: Array.from(filesSet) });
    }
  }

  // 2. Check for extraneous documented variables (documented in docs/ENVIRONMENT.md, but never used in code or .env.example)
  const extraneousVars: string[] = [];
  for (const docVar of documentedVars) {
    if (!usedVars.has(docVar) && !exampleVars.has(docVar) && !IGNORED_SYSTEM_VARS.has(docVar)) {
      extraneousVars.push(docVar);
    }
  }

  let hasError = false;

  if (missingVars.length > 0) {
    hasError = true;
    console.error('\n❌ Missing environment variables in docs/ENVIRONMENT.md:');
    for (const item of missingVars) {
      console.error(`   - ${item.varName}`);
      console.error(`     Referenced in: ${item.files.join(', ')}`);
    }
  }

  if (extraneousVars.length > 0) {
    hasError = true;
    console.error(
      '\n❌ Extraneous environment variables in docs/ENVIRONMENT.md (not found in source code or .env.example):'
    );
    for (const varName of extraneousVars) {
      console.error(`   - ${varName}`);
    }
  }

  if (hasError) {
    console.error(
      '\n❌ Environment documentation verification failed! Please update docs/ENVIRONMENT.md.'
    );
    return false;
  }

  console.log(
    '✅ Environment documentation is fully synchronized with source code and .env.example.'
  );
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const success = checkEnvDocs();
  process.exit(success ? 0 : 1);
}
