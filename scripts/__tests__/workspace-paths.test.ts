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
    it('finds repository root containing .git directory', () => {
      const subDir = path.join(tmpDir, 'scripts', 'lib');
      fs.mkdirSync(path.join(tmpDir, '.git'), { recursive: true });
      fs.mkdirSync(subDir, { recursive: true });

      const resolvedRoot = getWorkspaceRoot(subDir);
      expect(resolvedRoot).toBe(tmpDir);
    });

    it('stops at the nearest .git when the tree nests one repo inside another', () => {
      // Batch-wrapper shape: an outer git repo containing a worktree whose
      // .git is a FILE (worktrees never have a .git directory). The old
      // highest-wins climb resolved into the OUTER repo and silently read
      // foreign content.
      const innerDir = path.join(tmpDir, 'batch', 'wt-1');
      fs.mkdirSync(path.join(tmpDir, '.git'), { recursive: true });
      fs.mkdirSync(path.join(innerDir, 'scripts', 'lib'), { recursive: true });
      fs.writeFileSync(path.join(innerDir, '.git'), 'gitdir: /elsewhere/worktrees/wt-1\n');

      const resolvedRoot = getWorkspaceRoot(path.join(innerDir, 'scripts', 'lib'));
      expect(resolvedRoot).toBe(innerDir);
    });

    it('resolves from inside a worktree even when the wrapper root also holds package.json', () => {
      const innerDir = path.join(tmpDir, 'wrapper', 'wt-2');
      fs.mkdirSync(path.join(tmpDir, '.git'), { recursive: true });
      fs.mkdirSync(path.join(innerDir, 'content'), { recursive: true });
      fs.writeFileSync(path.join(innerDir, '.git'), 'gitdir: /elsewhere/worktrees/wt-2\n');
      fs.writeFileSync(path.join(tmpDir, 'package.json'), '{"workspaces":["x"]}');

      const resolvedRoot = getWorkspaceRoot(path.join(innerDir, 'content'));
      expect(resolvedRoot).toBe(innerDir);
    });

    it('falls back to the nearest package.json when no .git exists anywhere', () => {
      const subDir = path.join(tmpDir, 'a', 'b', 'c');
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'package.json'), '{}');

      const resolvedRoot = getWorkspaceRoot(subDir);
      expect(resolvedRoot).toBe(tmpDir);
    });

    it('prefers the nearest workspaces package in a git-less monorepo tree', () => {
      const subDir = path.join(tmpDir, 'pkg-a', 'src');
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'package.json'), '{"workspaces":["pkg-a"]}');
      fs.writeFileSync(path.join(tmpDir, 'pkg-a', 'package.json'), '{}');

      const resolvedRoot = getWorkspaceRoot(subDir);
      expect(resolvedRoot).toBe(tmpDir);
    });

    it('does not consult the cache when an explicit startDir is given', () => {
      const dirA = path.join(tmpDir, 'a');
      const dirB = path.join(tmpDir, 'b');
      fs.mkdirSync(path.join(dirA, '.git'), { recursive: true });
      fs.mkdirSync(path.join(dirB, '.git'), { recursive: true });

      // A no-startDir call caches dirA; the explicit-startDir call must
      // ignore that cache and resolve dirB.
      expect(getWorkspaceRoot(dirA)).toBe(dirA);
      expect(getWorkspaceRoot(dirB)).toBe(dirB);
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
