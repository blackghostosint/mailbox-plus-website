import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DOCS_PATH = path.join(process.cwd(), 'docs/DESIGN_SYSTEM.md');
const CSS_PATH = path.join(process.cwd(), 'astro/src/styles/global.css');

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

export function checkDesignTokens(): { success: boolean; errors: string[] } {
  if (!fs.existsSync(DOCS_PATH)) {
    return {
      success: false,
      errors: [`❌ Documentation file not found: ${DOCS_PATH}`],
    };
  }
  if (!fs.existsSync(CSS_PATH)) {
    return {
      success: false,
      errors: [`❌ CSS file not found: ${CSS_PATH}`],
    };
  }

  const docsContent = fs.readFileSync(DOCS_PATH, 'utf8');
  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');

  const docsTokens = parseDocsTokens(docsContent);
  const cssTokens = parseCssTokens(cssContent);

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
      '✅ All design tokens in docs/DESIGN_SYSTEM.md and astro/src/styles/global.css are synchronized.'
    );
    process.exit(0);
  }
}
