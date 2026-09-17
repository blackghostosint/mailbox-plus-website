import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const netlifyFunctionsDir = path.join(rootDir, 'netlify', 'functions');

console.log('🔍 Checking Netlify functions integrity...');

// Rule 8: Netlify functions must be TypeScript (.ts) only
if (fs.existsSync(netlifyFunctionsDir)) {
  const files = fs.readdirSync(netlifyFunctionsDir);
  const jsFiles = files.filter((f) => f.endsWith('.js'));
  if (jsFiles.length > 0) {
    console.error(
      `❌ Rule 8 Violation: Found plain .js function(s) in netlify/functions: ${jsFiles.join(', ')}. Netlify functions must use .ts extension.`
    );
    process.exit(1);
  }
}

// Get list of valid function names
const validFunctions = new Set(
  fs.existsSync(netlifyFunctionsDir)
    ? fs
        .readdirSync(netlifyFunctionsDir)
        .filter((f) => f.endsWith('.ts'))
        .map((f) => f.replace(/\.ts$/, ''))
    : []
);

console.log(
  `✓ Valid Netlify functions (${validFunctions.size}): ${Array.from(validFunctions).join(', ')}`
);

// Search codebase for explicit function calls like `/.netlify/functions/<name>` or `/api/<name>`
const searchDirs = [
  path.join(rootDir, 'astro', 'src'),
  path.join(rootDir, 'scripts'),
  path.join(rootDir, 'netlify.toml'),
];

const functionRefRegex = /\/\.netlify\/functions\/([a-zA-Z0-9_-]+)/g;

let errors = 0;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  while ((match = functionRefRegex.exec(content)) !== null) {
    const funcName = match[1];
    // Ignore generic placeholders or wildcard splats
    if (funcName === ':splat' || funcName === '*' || funcName === 'undefined') continue;

    if (!validFunctions.has(funcName)) {
      console.error(
        `❌ Broken function reference in ${path.relative(rootDir, filePath)}: function "/.netlify/functions/${funcName}" does not exist in netlify/functions/`
      );
      errors++;
    }
  }
}

function scanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const stat = fs.statSync(dirPath);
  if (stat.isFile()) {
    scanFile(dirPath);
    return;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(js|ts|astro|mjs|cjs|toml|html)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

for (const target of searchDirs) {
  scanDir(target);
}

if (errors > 0) {
  console.error(`❌ Netlify functions check failed with ${errors} error(s).`);
  process.exit(1);
}

console.log('✅ Netlify functions check passed cleanly.');
