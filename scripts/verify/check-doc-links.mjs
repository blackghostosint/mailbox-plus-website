#!/usr/bin/env node
/**
 * Standalone Node.js documentation link validator and CI preflight check.
 * Validates file path references in markdown documentation files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..', '..');

// Top-level repository directories where file paths might be anchored
export const REPO_TOP_FOLDERS = new Set([
  'docs',
  'scripts',
  'astro',
  'netlify',
  'knowledge',
  'content',
  'public',
  'research',
  'archive',
  '.github',
  '.factchecks',
]);

// Known root repository files
export const REPO_ROOT_FILES = new Set([
  'package.json',
  'package-lock.json',
  'netlify.toml',
  'AGENTS.md',
  'SECURITY.md',
  'README.md',
  'CONTRIBUTING.md',
  'lighthouserc.json',
  'eslint.config.js',
  'tsconfig.json',
  '.gitleaks.toml',
  '.gitleaksignore',
]);

// Common file extensions for repository files
export const FILE_EXTENSIONS_REGEX =
  /\.(md|ts|tsx|js|mjs|cjs|json|yml|yaml|sh|py|css|toml|txt|csv|html|astro|png|jpg|webp|svg|woff2)$/i;

// Cache for store-photos.json keys
let storePhotosKeys = null;
export function getStorePhotosKeys(rootDir = ROOT) {
  if (storePhotosKeys) return storePhotosKeys;
  storePhotosKeys = new Set();
  const manifestPath = path.join(rootDir, 'content', 'store-photos.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (data && Array.isArray(data.photos)) {
        for (const item of data.photos) {
          if (item.key) storePhotosKeys.add(item.key);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
  return storePhotosKeys;
}

/**
 * Checks if a path exists relative to document dir, repo root, astro/, or public/
 */
export function checkPathExists(targetPath, dirOfDoc, rootDir = ROOT) {
  if (!targetPath) return true;

  // Clean path
  let clean = targetPath.replace(/\\/g, '/');
  if (clean.startsWith('./')) clean = clean.slice(2);

  // 1. Relative to document directory
  const relDocPath = path.resolve(dirOfDoc, clean);
  if (fs.existsSync(relDocPath)) return true;

  // 2. Relative to repository root
  const rootRel = clean.startsWith('/') ? clean.slice(1) : clean;
  const absRootPath = path.resolve(rootDir, rootRel);
  if (fs.existsSync(absRootPath)) return true;

  // 3. Relative to astro/ directory
  const astroPath = path.resolve(rootDir, 'astro', rootRel);
  if (fs.existsSync(astroPath)) return true;

  // 4. Relative to public/ directory
  const publicPath = path.resolve(rootDir, 'public', rootRel);
  if (fs.existsSync(publicPath)) return true;

  // 5. Check store-photos.json manifest keys
  const photoKeys = getStorePhotosKeys(rootDir);
  if (photoKeys.has(rootRel) || photoKeys.has(clean)) return true;

  return false;
}

/**
 * Checks if a path is a website route URL (e.g. /services/, /contact-us/, /api/...)
 */
export function isSiteRouteUrl(target) {
  if (!target.startsWith('/')) return false;

  // If it starts with a top-level repo folder like /docs/, /scripts/, /astro/, /netlify/, it's a file path!
  const firstSegment = target.slice(1).split('/')[0];
  if (REPO_TOP_FOLDERS.has(firstSegment.toLowerCase())) {
    return false;
  }

  // Common website routes
  if (
    /^\/(services|contact-us|copy-print|home-business|pack-ship|guide|articles|api|service-area|about-us|privacy-policy|terms|accessibility|after-signup|thank-you|amazon-counter|ask-mailbox-plus)\b/i.test(
      target
    )
  ) {
    return true;
  }

  // API or Netlify function URL routes
  if (
    target.startsWith('/api/') ||
    target.startsWith('/.netlify/functions/') ||
    target.startsWith('/csp-report')
  ) {
    return true;
  }

  // If it ends with / and doesn't have a file extension, treat as website route URL
  if (target.endsWith('/') && !FILE_EXTENSIONS_REGEX.test(target)) {
    return true;
  }

  // Any non-repo single slash route
  if (
    !target.includes('.') &&
    !target.includes('scripts') &&
    !target.includes('docs') &&
    !target.includes('astro') &&
    !target.includes('netlify')
  ) {
    return true;
  }

  return false;
}

export const KNOWN_DOMAINS = new Set([
  'mailboxplusohio.com',
  'google.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'github.com',
  'gitlab.com',
  'netlify.app',
  'netlify.com',
]);

/**
 * Safely determines if a token is a web domain or hostname without incomplete substring matching.
 */
export function isWebDomain(term) {
  if (!term) return false;
  try {
    const urlStr = term.includes('://') ? term : `https://${term}`;
    const hostname = new URL(urlStr).hostname.toLowerCase();
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join('.');
      if (KNOWN_DOMAINS.has(rootDomain)) {
        return true;
      }
    }
  } catch {
    // If URL parsing fails, return false
  }
  return false;
}

/**
 * Clean punctuation from raw backtick terms
 */
export function cleanToken(rawTerm) {
  if (!rawTerm) return '';
  let term = rawTerm.replace(/^[("']+|[)"',;:.]+$/g, '');
  if (term.includes('=') && !term.startsWith('./') && !term.startsWith('/')) {
    const parts = term.split('=');
    term = parts[parts.length - 1].replace(/^[("']+|[)"',;:.]+$/g, '');
  }
  return term;
}

/**
 * Determines if a backtick term should be skipped
 */
export function shouldSkipBacktickToken(term, codeSpan = '') {
  if (!term) return true;

  // External URLs, modules, or protocols
  if (
    term.startsWith('http://') ||
    term.startsWith('https://') ||
    term.startsWith('//') ||
    term.startsWith('mailto:') ||
    term.startsWith('tel:') ||
    term.startsWith('git@') ||
    term.startsWith('github.com/') ||
    term.startsWith('gitlab.com/')
  ) {
    return true;
  }

  // CLI options/flags
  if (term.startsWith('--') || term.startsWith('-')) return true;

  // Environment variables or code variables
  if (
    term.startsWith('$') ||
    term.startsWith('process.env') ||
    term.startsWith('import.meta') ||
    term.startsWith('VITE_') ||
    term.startsWith('GEMINI_') ||
    term.startsWith('STRIPE_') ||
    term.startsWith('RECAPTCHA_')
  ) {
    return true;
  }

  // Pure extensions
  if (/^\.(md|ts|tsx|js|mjs|cjs|astro|sh|py|css|json|toml|yaml|yml|txt|csv|html)$/i.test(term)) {
    return true;
  }

  // Git branches or refs
  if (term.startsWith('origin/') || term === 'main' || term === 'staging' || term === 'HEAD') {
    return true;
  }

  // Temporary paths and build output/transient directories
  if (
    term.startsWith('/tmp/') ||
    term.includes('os.tmpdir()') ||
    /^(dist|coverage|archive|\.astro|node_modules)(\/.*)?$/i.test(term)
  ) {
    return true;
  }

  // Website route URLs
  if (isSiteRouteUrl(term)) return true;

  // Web domains
  if (isWebDomain(term)) {
    return true;
  }

  // Package imports / dependencies
  if (
    term.startsWith('@') ||
    term === 'zod' ||
    term === 'gray-matter' ||
    term === 'resend' ||
    term === 'stripe' ||
    term === 'dotenv' ||
    term === 'vitest' ||
    term === 'eslint' ||
    term === 'prettier' ||
    term === 'playwright'
  ) {
    return true;
  }

  // Tags or text strings containing slashes that are not paths
  if (
    term === 'Mailbox Plus/Captioned' ||
    term === 'Plus/Captioned' ||
    codeSpan.includes('Mailbox Plus/Captioned') ||
    term === 'DELETE' ||
    term === 'MERGE' ||
    term === 'REWRITE' ||
    term === 'KEEP'
  ) {
    return true;
  }

  return false;
}

/**
 * Determines if a path contains dynamic placeholders or wildcards
 */
export function isDynamicOrPlaceholderPath(term) {
  if (!term) return false;
  return (
    term.includes('<') ||
    term.includes('>') ||
    term.includes('{') ||
    term.includes('}') ||
    term.includes('*') ||
    /\b(YYYY|MM|DD|QX)\b/.test(term)
  );
}

/**
 * Checks if the static base directory of a dynamic path exists
 */
export function checkDynamicPathBaseExists(term, dirOfDoc, rootDir = ROOT) {
  const staticPrefix = term.split(/[\<\{\*\b(YYYY|MM|DD|QX)\b]/)[0];
  if (!staticPrefix) return true;

  let baseDir = staticPrefix;
  if (!baseDir.endsWith('/')) {
    baseDir = path.dirname(baseDir);
  }
  if (!baseDir || baseDir === '.' || baseDir === '/') return true;

  return checkPathExists(baseDir, dirOfDoc, rootDir);
}

/**
 * Determines if a term is a candidate file or directory path
 */
export function isPathCandidate(term) {
  if (!term) return false;

  // Contains slashes
  if (term.includes('/')) return true;

  // Has recognized file extension
  if (FILE_EXTENSIONS_REGEX.test(term)) return true;

  // Matches known repo root file
  if (REPO_ROOT_FILES.has(term)) return true;

  return false;
}

/**
 * Recursively discovers markdown files in directory
 */
export function getMdFiles(dir = ROOT) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (
        entry.name !== 'node_modules' &&
        entry.name !== '.git' &&
        entry.name !== 'dist' &&
        entry.name !== '.factchecks' &&
        entry.name !== 'reports' && // Generated audit reports folder
        rel !== 'content/articles' &&
        !rel.startsWith('content/articles/')
      ) {
        results = results.concat(getMdFiles(fullPath));
      }
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Validates markdown string content
 */
export function validateMarkdownContent(content, fileDir = ROOT, rootDir = ROOT) {
  const lines = content.split('\n');
  const errors = [];

  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;

    // 1. Markdown Links [text](target) or ![alt](target)
    const mdLinkRegex = /!?\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdLinkRegex.exec(line)) !== null) {
      let rawTarget = match[2].trim();
      let target = rawTarget.split(/\s+["']/)[0].trim();

      if (target.startsWith('<') && target.endsWith('>')) {
        target = target.slice(1, -1).trim();
      }

      const [cleanTarget] = target.split('#')[0].split('?');
      if (!cleanTarget) continue;

      if (
        cleanTarget.startsWith('http://') ||
        cleanTarget.startsWith('https://') ||
        cleanTarget.startsWith('//') ||
        cleanTarget.startsWith('mailto:') ||
        cleanTarget.startsWith('tel:') ||
        cleanTarget.startsWith('git@')
      ) {
        continue;
      }

      if (isSiteRouteUrl(cleanTarget)) continue;

      let decodedTarget;
      try {
        decodedTarget = decodeURIComponent(cleanTarget);
      } catch {
        decodedTarget = cleanTarget;
      }

      if (!checkPathExists(decodedTarget, fileDir, rootDir)) {
        errors.push({
          lineNum,
          type: 'LINK',
          target: cleanTarget,
          detail: `Referenced file or directory does not exist: "${cleanTarget}"`,
        });
      }
    }

    // 2. Backtick Spans `path`
    const backtickRegex = /`([^`]+)`/g;
    while ((match = backtickRegex.exec(line)) !== null) {
      const codeSpan = match[1].trim();
      const terms = codeSpan.split(/\s+/);
      for (let rawTerm of terms) {
        let term = cleanToken(rawTerm);

        if (shouldSkipBacktickToken(term, codeSpan)) continue;

        if (isDynamicOrPlaceholderPath(term)) {
          if (!checkDynamicPathBaseExists(term, fileDir, rootDir)) {
            errors.push({
              lineNum,
              type: 'BACKTICK',
              target: term,
              detail: `Base directory for dynamic path does not exist: "${term}"`,
            });
          }
          continue;
        }

        if (isPathCandidate(term)) {
          if (!checkPathExists(term, fileDir, rootDir)) {
            errors.push({
              lineNum,
              type: 'BACKTICK',
              target: term,
              detail: `Referenced path does not exist on disk: "${term}"`,
            });
          }
        }
      }
    }
  });

  return errors;
}

/**
 * Validates a single markdown file for broken file paths
 */
export function validateFile(file, rootDir = ROOT) {
  const content = fs.readFileSync(file, 'utf8');
  const dirOfDoc = path.dirname(file);
  return validateMarkdownContent(content, dirOfDoc, rootDir);
}

// ---------- CLI Execution ----------
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cliArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

  let targetFiles = [];
  if (cliArgs.length > 0) {
    targetFiles = cliArgs.map((f) => (path.isAbsolute(f) ? f : path.resolve(ROOT, f)));
  } else {
    targetFiles = getMdFiles(ROOT);
  }

  let totalErrors = 0;
  const resultsByFile = [];

  for (const file of targetFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ File not found: ${file}`);
      totalErrors++;
      continue;
    }

    const errors = validateFile(file);
    const relFile = path.relative(ROOT, file);

    if (errors.length > 0) {
      resultsByFile.push({ file: relFile, errors });
      totalErrors += errors.length;
    }
  }

  if (totalErrors > 0) {
    console.error(
      `❌ Documentation Link Validation Failed (${totalErrors} broken reference(s) in ${resultsByFile.length} file(s)):`
    );
    for (const item of resultsByFile) {
      console.error(`\n📄 ${item.file}:`);
      for (const err of item.errors) {
        console.error(`   Line ${err.lineNum}: [${err.type}] ${err.detail}`);
      }
    }
    process.exit(1);
  } else {
    console.log(
      `✅ Documentation Link Validation Passed cleanly (0 broken references across ${targetFiles.length} file(s)).`
    );
    process.exit(0);
  }
}
