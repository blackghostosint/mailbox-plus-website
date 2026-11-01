import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { walkDir, walkFiles, walkMdFiles, DEFAULT_IGNORE_DIRS } from '../fs-traversal.ts';

describe('fs-traversal', () => {
  const tempDir = path.resolve(process.cwd(), 'scripts/lib/__tests__/__temp_fs_traversal_test__');

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('exports DEFAULT_IGNORE_DIRS containing standard excluded directories', () => {
    expect(DEFAULT_IGNORE_DIRS).toContain('node_modules');
    expect(DEFAULT_IGNORE_DIRS).toContain('.git');
    expect(DEFAULT_IGNORE_DIRS).toContain('dist');
    expect(DEFAULT_IGNORE_DIRS).toContain('.factchecks');
  });

  describe('walkFiles and walkDir recursive walking', () => {
    it('recursively walks directory and returns all files', () => {
      const subDir = path.join(tempDir, 'sub1', 'sub2');
      fs.mkdirSync(subDir, { recursive: true });

      const file1 = path.join(tempDir, 'file1.txt');
      const file2 = path.join(subDir, 'file2.txt');
      fs.writeFileSync(file1, 'content 1');
      fs.writeFileSync(file2, 'content 2');

      const files = walkFiles(tempDir);
      expect(files.length).toBe(2);
      expect(files).toContain(file1);
      expect(files).toContain(file2);
    });

    it('walkDir calls callback for each file found', () => {
      const subDir = path.join(tempDir, 'nested');
      fs.mkdirSync(subDir, { recursive: true });

      const file1 = path.join(tempDir, 'a.txt');
      const file2 = path.join(subDir, 'b.txt');
      fs.writeFileSync(file1, 'a');
      fs.writeFileSync(file2, 'b');

      const visited: string[] = [];
      walkDir(tempDir, (f) => visited.push(f));

      expect(visited.length).toBe(2);
      expect(visited).toContain(file1);
      expect(visited).toContain(file2);
    });

    it('supports walkDir with options as second or third argument', () => {
      const subDir = path.join(tempDir, 'dir');
      fs.mkdirSync(subDir, { recursive: true });

      const f1 = path.join(tempDir, 'index.ts');
      const f2 = path.join(tempDir, 'index.js');
      fs.writeFileSync(f1, 'ts');
      fs.writeFileSync(f2, 'js');

      const visited1: string[] = [];
      walkDir(tempDir, { extensions: ['.ts'] }, (f) => visited1.push(f));
      expect(visited1).toEqual([f1]);

      const visited2: string[] = [];
      walkDir(tempDir, (f) => visited2.push(f), { extensions: ['.ts'] });
      expect(visited2).toEqual([f1]);
    });

    it('gracefully handles missing or non-existent directories without throwing', () => {
      const nonExistent = path.join(tempDir, 'non-existent-dir');

      expect(() => {
        const res = walkFiles(nonExistent);
        expect(res).toEqual([]);
      }).not.toThrow();

      const visited: string[] = [];
      expect(() => {
        walkDir(nonExistent, (f) => visited.push(f));
      }).not.toThrow();
      expect(visited).toEqual([]);
    });
  });

  describe('directory exclusions and ignoreDirs', () => {
    it('excludes node_modules, .git, dist, and .factchecks by default', () => {
      const nodeModulesDir = path.join(tempDir, 'node_modules');
      const gitDir = path.join(tempDir, '.git');
      const distDir = path.join(tempDir, 'dist');
      const factchecksDir = path.join(tempDir, '.factchecks');
      const srcDir = path.join(tempDir, 'src');

      fs.mkdirSync(nodeModulesDir, { recursive: true });
      fs.mkdirSync(gitDir, { recursive: true });
      fs.mkdirSync(distDir, { recursive: true });
      fs.mkdirSync(factchecksDir, { recursive: true });
      fs.mkdirSync(srcDir, { recursive: true });

      fs.writeFileSync(path.join(nodeModulesDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/main');
      fs.writeFileSync(path.join(distDir, 'index.html'), '<html></html>');
      fs.writeFileSync(path.join(factchecksDir, 'receipt.json'), '{}');
      const validFile = path.join(srcDir, 'app.ts');
      fs.writeFileSync(validFile, 'console.log("ok");');

      const files = walkFiles(tempDir);
      expect(files).toEqual([validFile]);
    });

    it('allows overriding default ignoreDirs with custom exclusions', () => {
      const customIgnoreDir = path.join(tempDir, 'custom_ignore');
      const normalDir = path.join(tempDir, 'normal');
      fs.mkdirSync(customIgnoreDir, { recursive: true });
      fs.mkdirSync(normalDir, { recursive: true });

      fs.writeFileSync(path.join(customIgnoreDir, 'ignored.ts'), 'ignored');
      const kept = path.join(normalDir, 'kept.ts');
      fs.writeFileSync(kept, 'kept');

      const files = walkFiles(tempDir, { ignoreDirs: ['custom_ignore'] });
      expect(files).toEqual([kept]);
    });

    it('allows overriding ignoreDirs with empty array to include default-ignored directories', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const distFile = path.join(distDir, 'bundle.js');
      fs.writeFileSync(distFile, 'console.log("bundle");');

      const files = walkFiles(tempDir, { ignoreDirs: [] });
      expect(files).toContain(distFile);
    });

    it('supports subpath patterns in ignoreDirs', () => {
      const articlesDir = path.join(tempDir, 'content', 'articles');
      const docsDir = path.join(tempDir, 'content', 'docs');
      fs.mkdirSync(articlesDir, { recursive: true });
      fs.mkdirSync(docsDir, { recursive: true });

      fs.writeFileSync(path.join(articlesDir, 'post.md'), 'article');
      const docFile = path.join(docsDir, 'guide.md');
      fs.writeFileSync(docFile, 'doc');

      const files = walkFiles(tempDir, {
        ignoreDirs: ['content/articles'],
      });
      expect(files).toEqual([docFile]);
    });
  });

  describe('extension filtering', () => {
    it('filters files by extension with or without leading dot (case-insensitive)', () => {
      fs.writeFileSync(path.join(tempDir, 'file1.TS'), 'ts uppercase');
      fs.writeFileSync(path.join(tempDir, 'file2.tsx'), 'tsx');
      fs.writeFileSync(path.join(tempDir, 'file3.js'), 'js');
      fs.writeFileSync(path.join(tempDir, 'file4.astro'), 'astro');

      const tsFiles = walkFiles(tempDir, { extensions: ['.ts', 'tsx'] });
      expect(tsFiles.length).toBe(2);
      expect(tsFiles).toContain(path.join(tempDir, 'file1.TS'));
      expect(tsFiles).toContain(path.join(tempDir, 'file2.tsx'));
      expect(tsFiles).not.toContain(path.join(tempDir, 'file3.js'));
    });
  });

  describe('ignoreFiles option', () => {
    it('ignores files by name case-insensitively', () => {
      const readmeUpper = path.join(tempDir, 'README.md');
      const readmeLower = path.join(tempDir, 'readme.txt');
      const regularMd = path.join(tempDir, 'guide.md');
      fs.writeFileSync(readmeUpper, 'readme');
      fs.writeFileSync(readmeLower, 'readme txt');
      fs.writeFileSync(regularMd, 'guide');

      const files = walkFiles(tempDir, { ignoreFiles: ['readme.md'] });
      expect(files).not.toContain(readmeUpper);
      expect(files).toContain(readmeLower);
      expect(files).toContain(regularMd);
    });
  });

  describe('custom filter callback', () => {
    it('applies custom boolean filter callback on file path and entry name', () => {
      const testFile = path.join(tempDir, 'component.test.tsx');
      const specFile = path.join(tempDir, 'component.spec.ts');
      const regularFile = path.join(tempDir, 'component.tsx');
      fs.writeFileSync(testFile, 'test');
      fs.writeFileSync(specFile, 'spec');
      fs.writeFileSync(regularFile, 'code');

      const files = walkFiles(tempDir, {
        filter: (filePath) => !filePath.includes('.test.') && !filePath.includes('.spec.'),
      });

      expect(files).toEqual([regularFile]);
    });
  });

  describe('walkMdFiles', () => {
    it('returns .md files and ignores README.md (case-insensitive)', () => {
      const subDir = path.join(tempDir, 'articles');
      fs.mkdirSync(subDir, { recursive: true });

      const md1 = path.join(subDir, 'guide.md');
      const md2 = path.join(subDir, 'post.MD');
      const readme1 = path.join(subDir, 'README.md');
      const readme2 = path.join(tempDir, 'readme.md');
      const txtFile = path.join(subDir, 'notes.txt');

      fs.writeFileSync(md1, 'guide');
      fs.writeFileSync(md2, 'post');
      fs.writeFileSync(readme1, 'readme');
      fs.writeFileSync(readme2, 'readme root');
      fs.writeFileSync(txtFile, 'text');

      const mdFiles = walkMdFiles(tempDir);
      expect(mdFiles.length).toBe(2);
      expect(mdFiles).toContain(md1);
      expect(mdFiles).toContain(md2);
      expect(mdFiles).not.toContain(readme1);
      expect(mdFiles).not.toContain(readme2);
      expect(mdFiles).not.toContain(txtFile);
    });

    it('returns empty array when directory does not exist', () => {
      const mdFiles = walkMdFiles(path.join(tempDir, 'nonexistent'));
      expect(mdFiles).toEqual([]);
    });
  });
});
