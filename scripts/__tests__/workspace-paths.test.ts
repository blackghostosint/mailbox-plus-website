import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  getWorkspaceRoot,
  atomicWriteFileSync,
  atomicWriteJsonSync,
  resetWorkspaceRootCache,
} from '../lib/workspace-paths.ts';

describe('workspace-paths', () => {
  let tmpDir: string;

  beforeEach(() => {
    resetWorkspaceRootCache();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-paths-test-'));
  });

  afterEach(() => {
    resetWorkspaceRootCache();
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  describe('getWorkspaceRoot', () => {
    it('finds repository root containing package.json from nested subdirectories', () => {
      const subDir = path.join(tmpDir, 'a', 'b', 'c');
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'package.json'), '{}');

      const resolvedRoot = getWorkspaceRoot(subDir);
      expect(resolvedRoot).toBe(tmpDir);
    });

    it('finds repository root containing .git directory', () => {
      const subDir = path.join(tmpDir, 'scripts', 'lib');
      fs.mkdirSync(path.join(tmpDir, '.git'), { recursive: true });
      fs.mkdirSync(subDir, { recursive: true });

      const resolvedRoot = getWorkspaceRoot(subDir);
      expect(resolvedRoot).toBe(tmpDir);
    });

    it('returns workspace root when run from the actual repository root', () => {
      const actualRoot = getWorkspaceRoot();
      expect(fs.existsSync(path.join(actualRoot, 'package.json'))).toBe(true);
    });
  });

  describe('atomicWriteFileSync', () => {
    it('atomically creates target file and parent directories if missing', () => {
      const targetPath = path.join(tmpDir, 'nested', 'deep', 'output.txt');
      const content = 'Hello, Atomic World!';

      atomicWriteFileSync(targetPath, content, 'utf8');

      expect(fs.existsSync(targetPath)).toBe(true);
      expect(fs.readFileSync(targetPath, 'utf8')).toBe(content);
    });

    it('overwrites existing target file without leaving temp files behind', () => {
      const targetPath = path.join(tmpDir, 'data.txt');
      fs.writeFileSync(targetPath, 'Initial Data', 'utf8');

      atomicWriteFileSync(targetPath, 'Updated Data', 'utf8');

      expect(fs.readFileSync(targetPath, 'utf8')).toBe('Updated Data');

      const dirContents = fs.readdirSync(tmpDir);
      expect(dirContents.length).toBe(1);
      expect(dirContents[0]).toBe('data.txt');
    });
  });

  describe('atomicWriteJsonSync', () => {
    it('writes formatted JSON atomically with trailing newline', () => {
      const targetPath = path.join(tmpDir, 'data.json');
      const payload = { key: 'value', number: 42 };

      atomicWriteJsonSync(targetPath, payload, 2);

      expect(fs.existsSync(targetPath)).toBe(true);
      const fileText = fs.readFileSync(targetPath, 'utf8');
      expect(fileText).toContain('{\n  "key": "value",\n  "number": 42\n}\n');
      expect(JSON.parse(fileText)).toEqual(payload);
    });
  });
});
