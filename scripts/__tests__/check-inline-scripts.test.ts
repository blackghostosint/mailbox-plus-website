import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { findInlineScripts, getHtmlFiles, checkInlineScripts } from '../check-inline-scripts.mjs';

describe('check-inline-scripts', () => {
  describe('findInlineScripts', () => {
    it('detects executable inline scripts', () => {
      const html = '<html><body><script>console.log("executable");</script></body></html>';
      const violations = findInlineScripts(html);
      expect(violations.length).toBe(1);
      expect(violations[0].scriptBody).toBe('console.log("executable");');
    });

    it('detects inline scripts with explicit type="text/javascript" or type="module"', () => {
      const html = `
        <script type="text/javascript">var x = 10;</script>
        <script type="module">import './app.js';</script>
      `;
      const violations = findInlineScripts(html);
      expect(violations.length).toBe(2);
    });

    it('ignores external scripts with src attribute', () => {
      const html =
        '<script src="/js/main.js"></script><script src="/js/analytics.js" defer></script>';
      const violations = findInlineScripts(html);
      expect(violations.length).toBe(0);
    });

    it('ignores application/ld+json structured data scripts', () => {
      const html = '<script type="application/ld+json">{"@context": "https://schema.org"}</script>';
      const violations = findInlineScripts(html);
      expect(violations.length).toBe(0);
    });

    it('ignores non-executable script types like text/template or speculationrules', () => {
      const html = `
        <script type="text/template"><div>Template</div></script>
        <script type="speculationrules">{"prefetch": []}</script>
      `;
      const violations = findInlineScripts(html);
      expect(violations.length).toBe(0);
    });

    it('ignores empty script tags', () => {
      const html = '<script></script><script type="text/javascript"></script>';
      const violations = findInlineScripts(html);
      expect(violations.length).toBe(0);
    });
  });

  describe('getHtmlFiles', () => {
    const tmpDir = path.resolve(process.cwd(), '../scripts/__test_html_tmp__');

    it('recursively finds all html files in directory', () => {
      const subDir = path.join(tmpDir, 'nested');
      fs.mkdirSync(subDir, { recursive: true });

      const file1 = path.join(tmpDir, 'index.html');
      const file2 = path.join(subDir, 'about.html');
      const file3 = path.join(tmpDir, 'styles.css');

      fs.writeFileSync(file1, '<html></html>');
      fs.writeFileSync(file2, '<html></html>');
      fs.writeFileSync(file3, 'body {}');

      try {
        const htmlFiles = getHtmlFiles(tmpDir);
        expect(htmlFiles.length).toBe(2);
        expect(htmlFiles.some((f) => f.endsWith('index.html'))).toBe(true);
        expect(htmlFiles.some((f) => f.endsWith('about.html'))).toBe(true);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe('checkInlineScripts', () => {
    const tmpDir = path.resolve(process.cwd(), '../scripts/__test_check_inline_tmp__');

    it('returns success: false when violations exist in target dir', () => {
      fs.mkdirSync(tmpDir, { recursive: true });
      const htmlFile = path.join(tmpDir, 'test.html');
      fs.writeFileSync(htmlFile, '<html><script>alert("xss");</script></html>');

      try {
        const result = checkInlineScripts(tmpDir);
        expect(result.success).toBe(false);
        expect(result.totalInlineScripts).toBe(1);
        expect(result.violations.length).toBe(1);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('returns success: true when zero executable inline scripts exist', () => {
      fs.mkdirSync(tmpDir, { recursive: true });
      const htmlFile = path.join(tmpDir, 'test.html');
      fs.writeFileSync(
        htmlFile,
        '<html><script src="/app.js"></script><script type="application/ld+json">{}</script></html>'
      );

      try {
        const result = checkInlineScripts(tmpDir);
        expect(result.success).toBe(true);
        expect(result.totalInlineScripts).toBe(0);
        expect(result.violations.length).toBe(0);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });
});
