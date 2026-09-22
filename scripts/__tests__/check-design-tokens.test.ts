import { describe, it, expect } from 'vitest';
import {
  normalizeValue,
  parseDocsTokens,
  parseCssTokens,
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

  describe('checkDesignTokens', () => {
    it('verifies token synchronization across docs and CSS', () => {
      const result = checkDesignTokens();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.success).toBe(true);
    });
  });
});
