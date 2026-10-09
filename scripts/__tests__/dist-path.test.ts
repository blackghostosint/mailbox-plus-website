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

    it('returns empty array when target directory does not exist or is a regular file', () => {
      const nonExistentDir = path.join(tmpDir, 'does-not-exist');
      const results1 = getHtmlFiles(nonExistentDir);
      expect(results1).toEqual([]);

      const regularFile = path.join(tmpDir, 'some-file.html');
      fs.writeFileSync(regularFile, '<html>Hello</html>');
      const results2 = getHtmlFiles(regularFile);
      expect(results2).toEqual([]);
    });

    it('traverses symlinks to directories and handles symlink html files, broken symlinks, and cycles', () => {
      const realDir = path.join(tmpDir, 'real-folder');
      fs.mkdirSync(realDir, { recursive: true });

      const htmlFileInReal = path.join(realDir, 'inside.html');
      fs.writeFileSync(htmlFileInReal, '<html>Real Folder</html>');

      // 1. Symlink pointing to realDir, even if named with .html suffix
      const symlinkDir = path.join(tmpDir, 'symlink-dir.html');
      try {
        fs.symlinkSync(realDir, symlinkDir, 'dir');
      } catch {
        // Skip symlink test if environment lacks symlink privileges
        return;
      }

      // 2. Symlink pointing to file
      const symlinkFile = path.join(tmpDir, 'alias.html');
      fs.symlinkSync(htmlFileInReal, symlinkFile, 'file');

      // 3. Broken symlink
      const brokenSymlink = path.join(tmpDir, 'broken.html');
      fs.symlinkSync(path.join(tmpDir, 'nonexistent.html'), brokenSymlink, 'file');

      // 4. Circular symlink inside realDir pointing to realDir itself
      const cycleSymlink = path.join(realDir, 'cycle');
      fs.symlinkSync(realDir, cycleSymlink, 'dir');

      const results = getHtmlFiles(tmpDir);

      // Must find htmlFileInReal, inside.html via symlinkDir, and alias.html via symlinkFile
      expect(results).toContain(htmlFileInReal);
      expect(results).toContain(path.join(symlinkDir, 'inside.html'));
      expect(results).toContain(symlinkFile);
      expect(results).not.toContain(brokenSymlink);
      expect(results).not.toContain(symlinkDir); // Should NOT treat directory symlink as a file
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
