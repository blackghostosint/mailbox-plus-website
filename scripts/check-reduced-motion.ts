import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

export const DEFAULT_GLOBAL_CSS_PATH = path.join(REPO_ROOT, 'astro/src/styles/global.css');
export const DEFAULT_CRITICAL_CSS_PATH = path.join(REPO_ROOT, 'public/critical.css');

export function extractReducedMotionBlock(cssContent: string): string | null {
  const match = cssContent.match(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{/i);
  if (!match || match.index === undefined) {
    return null;
  }

  let braceCount = 0;
  let startIndex = match.index + match[0].length;
  braceCount = 1;

  for (let i = startIndex; i < cssContent.length; i++) {
    if (cssContent[i] === '{') {
      braceCount++;
    } else if (cssContent[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        return cssContent.substring(startIndex, i);
      }
    }
  }

  return null;
}

export function checkCssContent(cssContent: string, fileName: string): string[] {
  const errors: string[] = [];
  const block = extractReducedMotionBlock(cssContent);

  if (!block) {
    errors.push(
      `❌ ${fileName} is missing @media (prefers-reduced-motion: reduce) override block.`
    );
    return errors;
  }

  if (!/transition-duration\s*:\s*0\.01ms\s*!important/i.test(block)) {
    errors.push(
      `❌ ${fileName} is missing "transition-duration: 0.01ms !important" rule in @media (prefers-reduced-motion: reduce) block.`
    );
  }

  if (!/transform\s*:\s*none\s*!important/i.test(block)) {
    errors.push(
      `❌ ${fileName} is missing "transform: none !important" rule in @media (prefers-reduced-motion: reduce) block.`
    );
  }

  const interactiveSelectorPattern =
    /(\ba\b|\bbutton\b|\.btn-primary|\.btn-secondary|\.btn-ghost|:hover|:active|:focus|:focus-within|:focus-visible)/i;
  if (!interactiveSelectorPattern.test(block)) {
    errors.push(
      `❌ ${fileName} is missing interactive element hover/active/focus selectors in @media (prefers-reduced-motion: reduce) block.`
    );
  }

  return errors;
}

export function checkReducedMotion(customPaths?: {
  globalCssPath?: string;
  criticalCssPath?: string;
}): { success: boolean; errors: string[] } {
  const globalCssPath = customPaths?.globalCssPath || DEFAULT_GLOBAL_CSS_PATH;
  const criticalCssPath = customPaths?.criticalCssPath || DEFAULT_CRITICAL_CSS_PATH;

  const errors: string[] = [];

  if (!fs.existsSync(globalCssPath)) {
    errors.push(`❌ Global CSS file not found: ${globalCssPath}`);
  } else {
    const globalCssContent = fs.readFileSync(globalCssPath, 'utf8');
    errors.push(...checkCssContent(globalCssContent, 'global.css'));
  }

  if (!fs.existsSync(criticalCssPath)) {
    errors.push(`❌ Critical CSS file not found: ${criticalCssPath}`);
  } else {
    const criticalCssContent = fs.readFileSync(criticalCssPath, 'utf8');
    errors.push(...checkCssContent(criticalCssContent, 'critical.css'));
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  const result = checkReducedMotion();
  if (!result.success) {
    result.errors.forEach((err) => console.error(err));
    process.exit(1);
  } else {
    console.log(
      '✅ Global CSS and Critical CSS contain valid prefers-reduced-motion overrides for transitions and transforms.'
    );
    process.exit(0);
  }
}
