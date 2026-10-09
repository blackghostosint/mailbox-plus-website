import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import {
  getHtmlFiles,
  resolveDistDir,
  GetHtmlFilesInputSchema,
  GetHtmlFilesOutputSchema,
} from '../lib/dist-path.mjs';

describe('dist-path module', () => {
  const tmpDir = path.resolve(process.cwd(), '../scripts/__test_dist_path_tmp__');

  beforeEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  describe('getHtmlFiles', () => {
    it('recursively discovers all .html files in directory structure', () => {
      const subDir = path.join(tmpDir, 'nested', 'deep');
      fs.mkdirSync(subDir, { recursive: true });

      const file1 = path.join(tmpDir, 'index.html');
      const file2 = path.join(tmpDir, 'about.html');
      const file3 = path.join(subDir, 'page.html');
      const file4 = path.join(tmpDir, 'styles.css');
      const file5 = path.join(subDir, 'app.js');

      fs.writeFileSync(file1, '<html>Index</html>');
      fs.writeFileSync(file2, '<html>About</html>');
      fs.writeFileSync(file3, '<html>Page</html>');
      fs.writeFileSync(file4, 'body { color: red; }');
      fs.writeFileSync(file5, 'console.log("hello");');

      const results = getHtmlFiles(tmpDir);

      expect(results.length).toBe(3);
      expect(results).toContain(file1);
      expect(results).toContain(file2);
      expect(results).toContain(file3);
      expect(results).not.toContain(file4);
      expect(results).not.toContain(file5);
    });

    it('returns empty array when target directory does not exist', () => {
      const nonExistentDir = path.join(tmpDir, 'does-not-exist');
      const results = getHtmlFiles(nonExistentDir);
      expect(results).toEqual([]);
    });

    it('enforces input Zod schema validation on non-string inputs', () => {
      expect(() => {
        // @ts-expect-error - Testing runtime schema validation with invalid type
        getHtmlFiles(12345);
      }).toThrow();

      expect(() => {
        // @ts-expect-error - Testing runtime schema validation with invalid type
        getHtmlFiles(null);
      }).toThrow();
    });

    it('exposes Zod schemas for input and output validation', () => {
      expect(GetHtmlFilesInputSchema.safeParse('/valid/path').success).toBe(true);
      expect(GetHtmlFilesInputSchema.safeParse(123).success).toBe(false);

      expect(GetHtmlFilesOutputSchema.safeParse(['/path1.html', '/path2.html']).success).toBe(true);
      expect(GetHtmlFilesOutputSchema.safeParse('not-an-array').success).toBe(false);
    });
  });

  describe('resolveDistDir', () => {
    it('returns a string directory path', () => {
      const distDir = resolveDistDir();
      expect(typeof distDir).toBe('string');
      expect(distDir.length).toBeGreaterThan(0);
    });
  });
});
