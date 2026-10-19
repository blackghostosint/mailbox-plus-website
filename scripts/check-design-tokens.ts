import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const DOCS_PATH = path.join(REPO_ROOT, 'docs/DESIGN_SYSTEM.md');
const CSS_PATH = path.join(REPO_ROOT, 'astro/src/styles/global.css');
const SRC_DIR = path.join(REPO_ROOT, 'astro/src');

export function normalizeValue(value: string): string {
  let normalized = value.trim();
  if (normalized.startsWith('`') && normalized.endsWith('`')) {
    normalized = normalized.slice(1, -1).trim();
  }
  if (/^#[0-9a-fA-F]{3,8}$/.test(normalized)) {
    return normalized.toLowerCase();
  }
  normalized = normalized.replace(/\s*,\s*/g, ', ');
  normalized = normalized.replace(/\s+/g, ' ');
  return normalized;
}

export function parseDocsTokens(docsContent: string): Map<string, string> {
  const tokens = new Map<string, string>();
  const lines = docsContent.split('\n');

  let inTokenTable = false;
  let tokenColIndex = -1;
  let valueColIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line.startsWith('|')) {
      inTokenTable = false;
      continue;
    }

    const cols = line.split('|').map((col) => col.trim());

    const tokenIdx = cols.findIndex((col) => col.toLowerCase() === 'token');
    const valueIdx = cols.findIndex((col) => col.toLowerCase() === 'value');

    if (tokenIdx !== -1 && valueIdx !== -1) {
      inTokenTable = true;
      tokenColIndex = tokenIdx;
      valueColIndex = valueIdx;
      continue;
    }

    if (inTokenTable) {
      if (line.includes('---')) {
        continue;
      }

      if (tokenColIndex < cols.length && valueColIndex < cols.length) {
        let tokenRaw = cols[tokenColIndex];
        let valueRaw = cols[valueColIndex];

        tokenRaw = tokenRaw.replace(/`/g, '').trim();
        valueRaw = valueRaw.replace(/`/g, '').trim();

        if (tokenRaw.startsWith('--')) {
          tokens.set(tokenRaw, valueRaw);
        }
      }
    }
  }

  return tokens;
}

export function parseDeprecatedTokens(docsContent: string): Set<string> {
  const deprecated = new Set<string>();
  const lines = docsContent.split('\n');

  let inRemovedSection = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('removed tokens') || lower.includes('deprecated tokens')) {
      inRemovedSection = true;
    } else if (line.startsWith('#') || line.startsWith('---')) {
      inRemovedSection = false;
    }

    if (inRemovedSection) {
      const match = line.match(/-\s*`?(--[a-zA-Z0-9_-]+)`?/);
      if (match) {
        deprecated.add(match[1]);
      }
    }

    if (
      line.includes('|') &&
      (lower.includes('aliased to') ||
        lower.includes('migrate callers') ||
        lower.includes('removed') ||
        lower.includes('deprecated'))
    ) {
      const tokenMatch = line.match(/`?(--[a-zA-Z0-9_-]+)`?/);
      if (tokenMatch) {
        deprecated.add(tokenMatch[1]);
      }
    }
  }

  return deprecated;
}

export function parseCssTokens(cssContent: string): Map<string, string> {
  const tokens = new Map<string, string>();
  const rootMatch = cssContent.match(/:root\s*\{([^}]+)\}/s);

  if (rootMatch) {
    const rootBody = rootMatch[1];
    const lines = rootBody.split('\n');

    for (const line of lines) {
      const match = line.match(/\s*(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/);
      if (match) {
        const tokenName = match[1].trim();
        const tokenValue = match[2].trim();
        tokens.set(tokenName, tokenValue);
      }
    }
  }

  return tokens;
}

export function scanTemplateTokens(
  srcDir: string,
  baseDir: string = REPO_ROOT
): Map<string, Set<string>> {
  const tokenMap = new Map<string, Set<string>>();

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '__tests__') {
          continue;
        }
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.astro', '.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
          if (entry.name.includes('.test.') || entry.name.includes('.spec.')) {
            continue;
          }
          const content = fs.readFileSync(fullPath, 'utf8');
          const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

          // Collect local variable declarations in this file
          const localDecls = new Set<string>();
          const declRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
          let declMatch: RegExpExecArray | null;
          while ((declMatch = declRegex.exec(content)) !== null) {
            localDecls.add(declMatch[1]);
          }

          // Scan var(--token) expressions
          const varRegex = /var\(\s*(--[a-zA-Z0-9_-]+)/g;
          let varMatch: RegExpExecArray | null;
          while ((varMatch = varRegex.exec(content)) !== null) {
            const token = varMatch[1];
            // Skip locally declared CSS variables
            if (localDecls.has(token)) {
              continue;
            }
            if (!tokenMap.has(token)) {
              tokenMap.set(token, new Set());
            }
            tokenMap.get(token)!.add(relPath);
          }
        }
      }
    }
  }

  walk(srcDir);
  return tokenMap;
}

export function checkDesignTokens(
  docsPath: string = DOCS_PATH,
  cssPath: string = CSS_PATH,
  srcDir: string = SRC_DIR
): { success: boolean; errors: string[] } {
  if (!fs.existsSync(docsPath)) {
    return {
      success: false,
      errors: [`❌ Documentation file not found: ${docsPath}`],
    };
  }
  if (!fs.existsSync(cssPath)) {
    return {
      success: false,
      errors: [`❌ CSS file not found: ${cssPath}`],
    };
  }

  const docsContent = fs.readFileSync(docsPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  const docsTokens = parseDocsTokens(docsContent);
  const cssTokens = parseCssTokens(cssContent);
  const deprecatedTokens = parseDeprecatedTokens(docsContent);

  const errors: string[] = [];

  // 1. Bi-directional check: Docs -> CSS (check value mismatch & missing in CSS)
  for (const [token, docVal] of docsTokens.entries()) {
    if (!cssTokens.has(token)) {
      errors.push(
        `❌ Token ${token} defined in docs/DESIGN_SYSTEM.md but missing in astro/src/styles/global.css`
      );
    } else {
      const cssVal = cssTokens.get(token)!;
      if (normalizeValue(docVal) !== normalizeValue(cssVal)) {
        errors.push(
          `❌ Token mismatch for ${token}: expected ${docVal} (docs/DESIGN_SYSTEM.md), got ${cssVal} (astro/src/styles/global.css)`
        );
      }
    }
  }

  // 2. Bi-directional check: CSS -> Docs (check missing in docs)
  for (const token of cssTokens.keys()) {
    if (!docsTokens.has(token)) {
      errors.push(
        `❌ CSS variable ${token} defined in astro/src/styles/global.css but missing in docs/DESIGN_SYSTEM.md`
      );
    }
  }

  // 3. Template scanning check
  if (fs.existsSync(srcDir)) {
    const templateTokens = scanTemplateTokens(srcDir);

    for (const [token, fileSet] of templateTokens.entries()) {
      const fileList = Array.from(fileSet).join(', ');

      if (deprecatedTokens.has(token)) {
        errors.push(
          `❌ Token ${token} referenced in template file(s) [${fileList}] is marked as deprecated or removed in docs/DESIGN_SYSTEM.md`
        );
      } else if (!cssTokens.has(token)) {
        errors.push(
          `❌ Token ${token} referenced in template file(s) [${fileList}] is missing in astro/src/styles/global.css`
        );
      } else if (!docsTokens.has(token)) {
        errors.push(
          `❌ Token ${token} referenced in template file(s) [${fileList}] is missing in docs/DESIGN_SYSTEM.md`
        );
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  const result = checkDesignTokens();
  if (!result.success) {
    result.errors.forEach((err) => console.error(err));
    process.exit(1);
  } else {
    console.log(
      '✅ All design tokens in templates, docs/DESIGN_SYSTEM.md, and astro/src/styles/global.css are valid and synchronized.'
    );
    process.exit(0);
  }
}
