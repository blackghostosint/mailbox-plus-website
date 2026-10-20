import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, afterEach } from 'vitest';
import {
  normalizeValue,
  parseDocsTokens,
  parseDeprecatedTokens,
  parseCssTokens,
  scanTemplateTokens,
  checkDesignTokens,
} from '../check-design-tokens.ts';

describe('check-design-tokens', () => {
  describe('normalizeValue', () => {
    it('strips enclosing backticks from value', () => {
      expect(normalizeValue('`#123456`')).toBe('#123456');
    });

    it('converts hex colors to lowercase', () => {
      expect(normalizeValue('#FFFFFF')).toBe('#ffffff');
      expect(normalizeValue('#0B1D3A')).toBe('#0b1d3a');
    });

    it('formats commas with a single trailing space and normalizes whitespace', () => {
      expect(normalizeValue('rgb(0,0,0)')).toBe('rgb(0, 0, 0)');
      expect(normalizeValue('1px   solid    black')).toBe('1px solid black');
    });
  });

  describe('parseDocsTokens', () => {
    it('extracts design tokens from markdown table content', () => {
      const docsContent = `
# Design Tokens

| Token | Value | Description |
| --- | --- | --- |
| \`--color-navy-dark\` | \`#0b1d3a\` | Primary dark navy background |
| \`--color-accent-warm\` | \`#984b2e\` | Warm accent color |
| Non-token row | random | Should be ignored |
`;
      const tokens = parseDocsTokens(docsContent);
      expect(tokens.get('--color-navy-dark')).toBe('#0b1d3a');
      expect(tokens.get('--color-accent-warm')).toBe('#984b2e');
      expect(tokens.size).toBe(2);
    });

    it('returns empty map when no valid token table is found', () => {
      const docsContent = '# Header\nSome text without tables.';
      const tokens = parseDocsTokens(docsContent);
      expect(tokens.size).toBe(0);
    });
  });

  describe('parseDeprecatedTokens', () => {
    it('extracts deprecated and removed tokens from markdown documentation', () => {
      const docsContent = `
# Design System

**Removed tokens** (no longer used):
- \`--color-bg-blue-tint\` — replaced by warm tints
- \`--color-bg-cyan-tint\` — replaced by warm tints

| Token | Current state | Status |
| \`--color-border-blue\` | Aliased to \`--color-border-strong\` | Migrate callers, then remove alias |
`;
      const deprecated = parseDeprecatedTokens(docsContent);
      expect(deprecated.has('--color-bg-blue-tint')).toBe(true);
      expect(deprecated.has('--color-bg-cyan-tint')).toBe(true);
      expect(deprecated.has('--color-border-blue')).toBe(true);
      expect(deprecated.size).toBe(3);
    });
  });

  describe('parseCssTokens', () => {
    it('extracts CSS custom properties from :root block', () => {
      const cssContent = `
:root {
  --color-navy-dark: #0b1d3a;
  --color-accent-warm: #984b2e;
  --font-sans: system-ui, sans-serif;
}

body {
  --ignored-property: value;
}
`;
      const tokens = parseCssTokens(cssContent);
      expect(tokens.get('--color-navy-dark')).toBe('#0b1d3a');
      expect(tokens.get('--color-accent-warm')).toBe('#984b2e');
      expect(tokens.get('--font-sans')).toBe('system-ui, sans-serif');
      expect(tokens.has('--ignored-property')).toBe(false);
      expect(tokens.size).toBe(3);
    });
  });

  describe('scanTemplateTokens', () => {
    let tempDir: string;

    afterEach(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('scans var(--token) expressions while ignoring local variable declarations and test files', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'token-scan-test-'));
      const compFile = path.join(tempDir, 'Component.astro');
      const testFile = path.join(tempDir, 'Component.test.ts');

      fs.writeFileSync(
        compFile,
        `
<style>
  .box {
    --local-var: 10px;
    background: var(--color-bg-primary);
    padding: var(--local-var);
    color: var(--color-text-primary);
  }
</style>
`
      );

      fs.writeFileSync(testFile, `const ignored = 'var(--color-ignored)';`);

      const scanned = scanTemplateTokens(tempDir, tempDir);
      expect(scanned.has('--color-bg-primary')).toBe(true);
      expect(scanned.has('--color-text-primary')).toBe(true);
      expect(scanned.has('--local-var')).toBe(false);
      expect(scanned.has('--color-ignored')).toBe(false);
    });
  });

  describe('checkDesignTokens', () => {
    let tempDir: string;

    afterEach(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('verifies token synchronization across docs, CSS, and templates', () => {
      const result = checkDesignTokens();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.success).toBe(true);
    });

    it('reports error when a template references a deprecated token', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-tokens-test-'));
      const docsPath = path.join(tempDir, 'DESIGN_SYSTEM.md');
      const cssPath = path.join(tempDir, 'global.css');
      const srcDir = path.join(tempDir, 'src');
      fs.mkdirSync(srcDir);

      fs.writeFileSync(
        docsPath,
        `
| Token | Value |
| --- | --- |
| \`--color-primary\` | \`#285a8e\` |

**Removed tokens**:
- \`--color-bg-blue-tint\` — removed
`
      );

      fs.writeFileSync(
        cssPath,
        `:root {
  --color-primary: #285a8e;
}`
      );

      fs.writeFileSync(
        path.join(srcDir, 'BadComponent.astro'),
        `<div class="bg-[var(--color-bg-blue-tint)]">Test</div>`
      );

      const result = checkDesignTokens(docsPath, cssPath, srcDir);
      expect(result.success).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('--color-bg-blue-tint') && e.includes('deprecated or removed')
        )
      ).toBe(true);
    });

    it('reports error when a template references an invalid or missing token', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-tokens-test-'));
      const docsPath = path.join(tempDir, 'DESIGN_SYSTEM.md');
      const cssPath = path.join(tempDir, 'global.css');
      const srcDir = path.join(tempDir, 'src');
      fs.mkdirSync(srcDir);

      fs.writeFileSync(
        docsPath,
        `
| Token | Value |
| --- | --- |
| \`--color-primary\` | \`#285a8e\` |
`
      );

      fs.writeFileSync(
        cssPath,
        `:root {
  --color-primary: #285a8e;
}`
      );

      fs.writeFileSync(
        path.join(srcDir, 'UnknownComponent.astro'),
        `<div class="bg-[var(--color-unknown-fake)]">Test</div>`
      );

      const result = checkDesignTokens(docsPath, cssPath, srcDir);
      expect(result.success).toBe(false);
      expect(
        result.errors.some(
          (e) =>
            e.includes('--color-unknown-fake') &&
            e.includes('missing in astro/src/styles/global.css')
        )
      ).toBe(true);
    });
  });
});
