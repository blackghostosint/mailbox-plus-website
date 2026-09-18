import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { resolveDistDir, ROOT_DIR } from '../../../scripts/lib/dist-path.mjs';

describe('dist-path module', () => {
  const originalEnv = process.env.DIST_DIR;

  beforeEach(() => {
    delete process.env.DIST_DIR;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.DIST_DIR = originalEnv;
    } else {
      delete process.env.DIST_DIR;
    }
    vi.restoreAllMocks();
  });

  it('returns valid directory path when DIST_DIR environment variable is set to existing directory', () => {
    const validDir = path.resolve(ROOT_DIR, 'scripts');
    process.env.DIST_DIR = validDir;

    const result = resolveDistDir();
    expect(result).toBe(validDir);
  });

  it('logs error and calls process.exit(1) when DIST_DIR environment variable points to non-existent directory', () => {
    const invalidDir = path.resolve(ROOT_DIR, 'non-existent-dist-dir-12345');
    process.env.DIST_DIR = invalidDir;

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as unknown as () => never);

    resolveDistDir();

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error: dist directory "${invalidDir}" specified by DIST_DIR does not exist. Please run "npm run build" first.`
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('resolves root dist or astro/dist or default primary dist when DIST_DIR is not set', () => {
    const rootDist = path.resolve(ROOT_DIR, 'dist');
    const astroDist = path.resolve(ROOT_DIR, 'astro', 'dist');

    const result = resolveDistDir();
    if (fs.existsSync(rootDist) && fs.statSync(rootDist).isDirectory()) {
      expect(result).toBe(rootDist);
    } else if (fs.existsSync(astroDist) && fs.statSync(astroDist).isDirectory()) {
      expect(result).toBe(astroDist);
    } else {
      expect(result).toBe(rootDist);
    }
  });
});
