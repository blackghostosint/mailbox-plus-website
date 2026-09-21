import fs from 'node:fs';
import path from 'node:path';

interface DocViolation {
  file: string;
  line?: number;
  variable: string;
  rule: string;
  details: string;
}

const ROOT_DIR = path.resolve(process.cwd());
const ENV_EXAMPLE_PATH = path.join(ROOT_DIR, '.env.example');
const ENV_DOC_PATH = path.join(ROOT_DIR, 'docs', 'ENVIRONMENT.md');

const CODE_DIRS = [
  path.join(ROOT_DIR, 'astro', 'src'),
  path.join(ROOT_DIR, 'netlify', 'functions'),
  path.join(ROOT_DIR, 'scripts'),
];

// System/framework built-in variables ignored from custom app environment contract checks
const IGNORED_VARS = new Set([
  'NODE_ENV',
  'MODE',
  'DEV',
  'PROD',
  'SSR',
  'BASE_URL',
  'CONTEXT',
  'NETLIFY_SITE_ID',
  'NETLIFY_AUTH_TOKEN',
  'VITE_NETLIFY_CONTEXT',
  'CI',
  'GITHUB_BASE_REF',
  'GITHUB_BASE_SHA',
  'GITHUB_EVENT_PATH',
  'GITHUB_TOKEN',
  'GITHUB_REF',
  'GITHUB_SHA',
  'PWD',
  'MODEL_API_KEY',
  'OPENROUTER_API_KEY',
]);

// Server secrets that must NEVER carry a VITE_ prefix
const SERVER_SECRETS = [
  'STRIPE_SECRET_KEY',
  'RESEND_API_KEY',
  'RECAPTCHA_SECRET_KEY',
  'GEMINI_API_KEY',
  'GOOGLE_PLACES_API_KEY',
  'CONTACT_EMAIL',
  'RECAPTCHA_MIN_SCORE',
];

const violations: DocViolation[] = [];

function addViolation(
  file: string,
  variable: string,
  rule: string,
  details: string,
  line?: number
) {
  violations.push({ file, line, variable, rule, details });
}

interface VarRef {
  varName: string;
  file: string;
  line: number;
}

function parseEnvExample(): Map<string, number> {
  const map = new Map<string, number>();
  if (!fs.existsSync(ENV_EXAMPLE_PATH)) return map;

  const content = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match VAR=value or # VAR=value or #VITE_VAR=value
    const match = line.match(/^#?\s*([A-Za-z0-9_]+)=/);
    if (match) {
      const varName = match[1];
      if (!IGNORED_VARS.has(varName)) {
        map.set(varName, i + 1);
      }
    }
  }

  return map;
}

function parseDocEnvironment(): Map<string, number> {
  const map = new Map<string, number>();
  if (!fs.existsSync(ENV_DOC_PATH)) return map;

  const content = fs.readFileSync(ENV_DOC_PATH, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Find backticked variable names e.g. `VITE_R2_PUBLIC_BASE_URL` or `STRIPE_SECRET_KEY`
    const matches = line.matchAll(/`([A-Z0-9_]{3,})`/g);
    for (const match of matches) {
      const varName = match[1];
      // Ignore trailing underscore incomplete prefixes like VITE_
      if (varName.endsWith('_')) continue;
      if (!IGNORED_VARS.has(varName) && !map.has(varName)) {
        map.set(varName, i + 1);
      }
    }
  }

  return map;
}

function collectCodeEnvRefs(): VarRef[] {
  const refs: VarRef[] = [];

  function scanDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name !== 'node_modules' &&
          entry.name !== 'dist' &&
          entry.name !== '.git' &&
          entry.name !== '__tests__'
        ) {
          scanDir(fullPath);
        }
      } else if (entry.isFile()) {
        if (
          /\.(ts|tsx|js|jsx|mjs|cjs|astro)$/.test(entry.name) &&
          !entry.name.endsWith('.test.ts') &&
          !entry.name.endsWith('.test.tsx') &&
          !entry.name.endsWith('.spec.ts') &&
          !entry.name.endsWith('.spec.tsx')
        ) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          const relPath = path.relative(ROOT_DIR, fullPath);

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const regexes = [
              /process\.env\.([A-Za-z0-9_]+)/g,
              /import\.meta\.env\.([A-Za-z0-9_]+)/g,
              /Netlify\.env\.get\(['"]([A-Za-z0-9_]+)['"]\)/g,
              /process\.env\['([A-Za-z0-9_]+)'\]/g,
              /import\.meta\.env\['([A-Za-z0-9_]+)'\]/g,
            ];

            for (const re of regexes) {
              const matches = line.matchAll(re);
              for (const match of matches) {
                const varName = match[1];
                if (!IGNORED_VARS.has(varName)) {
                  refs.push({ varName, file: relPath, line: i + 1 });
                }
              }
            }
          }
        }
      }
    }
  }

  for (const dir of CODE_DIRS) {
    scanDir(dir);
  }

  return refs;
}

async function checkDocContracts() {
  const startTime = Date.now();
  console.log('🔍 Starting Environment Documentation Contract Verification...\n');

  const exampleVars = parseEnvExample();
  const docVars = parseDocEnvironment();
  const codeRefs = collectCodeEnvRefs();

  // Deduplicate variables referenced in code
  const codeVarMap = new Map<string, VarRef[]>();
  for (const ref of codeRefs) {
    if (!codeVarMap.has(ref.varName)) {
      codeVarMap.set(ref.varName, []);
    }
    codeVarMap.get(ref.varName)!.push(ref);
  }

  // 1. Verify Code Usages against Documentation & .env.example
  for (const [varName, refs] of codeVarMap.entries()) {
    const firstRef = refs[0];

    if (!docVars.has(varName)) {
      addViolation(
        firstRef.file,
        varName,
        'Missing Documentation',
        `Variable '${varName}' used in code is missing from docs/ENVIRONMENT.md.`,
        firstRef.line
      );
    }

    if (!exampleVars.has(varName)) {
      addViolation(
        firstRef.file,
        varName,
        'Missing Env Example',
        `Variable '${varName}' used in code is missing from .env.example.`,
        firstRef.line
      );
    }
  }

  // 2. Verify .env.example vs docs/ENVIRONMENT.md Synchronization
  for (const [varName, line] of exampleVars.entries()) {
    if (!docVars.has(varName)) {
      addViolation(
        '.env.example',
        varName,
        'Undocumented Example Variable',
        `Variable '${varName}' present in .env.example is not documented in docs/ENVIRONMENT.md.`,
        line
      );
    }
  }

  for (const [varName, line] of docVars.entries()) {
    if (!exampleVars.has(varName)) {
      addViolation(
        'docs/ENVIRONMENT.md',
        varName,
        'Missing Example Definition',
        `Variable '${varName}' documented in docs/ENVIRONMENT.md is missing from .env.example.`,
        line
      );
    }
  }

  // 3. Security Boundary Verification
  for (const secretVar of SERVER_SECRETS) {
    const viteSecretVar = `VITE_${secretVar}`;
    if (exampleVars.has(viteSecretVar)) {
      addViolation(
        '.env.example',
        viteSecretVar,
        'Security Boundary Violation',
        `Server secret '${secretVar}' must NOT carry a VITE_ prefix in .env.example.`,
        exampleVars.get(viteSecretVar)
      );
    }
    if (docVars.has(viteSecretVar)) {
      addViolation(
        'docs/ENVIRONMENT.md',
        viteSecretVar,
        'Security Boundary Violation',
        `Server secret '${secretVar}' must NOT carry a VITE_ prefix in docs/ENVIRONMENT.md.`,
        docVars.get(viteSecretVar)
      );
    }
    if (codeVarMap.has(viteSecretVar)) {
      const ref = codeVarMap.get(viteSecretVar)![0];
      addViolation(
        ref.file,
        viteSecretVar,
        'Security Boundary Violation',
        `Server secret '${secretVar}' must NOT carry a VITE_ prefix in code usages.`,
        ref.line
      );
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (violations.length > 0) {
    console.error(
      `❌ Environment Documentation Contract Validation Failed (${violations.length} violation(s) found in ${duration}s):\n`
    );
    for (const v of violations) {
      const loc = v.line ? `${v.file}:${v.line}` : v.file;
      console.error(`  - [${v.variable}] ${loc}`);
      console.error(`    Rule: ${v.rule}`);
      console.error(`    Details: ${v.details}\n`);
    }
    process.exit(1);
  } else {
    console.log(
      `✅ Environment Documentation Contract Validation Passed: 100% synchronization across code, .env.example, and docs/ENVIRONMENT.md (${duration}s).\n`
    );
    process.exit(0);
  }
}

checkDocContracts().catch((err) => {
  console.error('Fatal error during environment documentation verification:', err);
  process.exit(1);
});
