import fs from 'node:fs';
import path from 'node:path';

let cachedWorkspaceRoot: string | null = null;

/**
 * Resets the cached workspace root. Intended primarily for testing.
 */
export function resetWorkspaceRootCache(): void {
  cachedWorkspaceRoot = null;
}

/**
 * Deterministically resolves the root directory of the workspace.
 *
 * Walks up from `startDir` (default `process.cwd()`) and stops at the FIRST
 * project boundary:
 *
 * 1. A `.git` entry — a directory in a normal clone, a FILE in a worktree or
 *    submodule — is a hard repo wall. Whatever sits above it belongs to a
 *    different checkout, so the walk must never continue past it. Climbing
 *    past the nearest `.git` made scripts running inside batch/worktree
 *    wrappers resolve into the WRAPPER's tree instead of the worktree (the
 *    2026-11-17 llms-feed contamination: feeds generated from the outer
 *    batch repo's content tree, missing draft articles).
 * 2. If no `.git` exists anywhere up the tree, fall back to the nearest
 *    enclosing `package.json` (preferring one with `workspaces`), matching
 *    node's own project-root convention.
 *
 * @param startDir Optional starting directory. Defaults to `process.cwd()`.
 * @returns Absolute path to the workspace root directory.
 */
export function getWorkspaceRoot(startDir?: string): string {
  if (!startDir && cachedWorkspaceRoot) {
    return cachedWorkspaceRoot;
  }

  let currentDir = startDir ? path.resolve(startDir) : process.cwd();
  let nearestWorkspacesPkgDir: string | null = null;
  let nearestPkgDir: string | null = null;

  while (currentDir && currentDir !== path.parse(currentDir).root) {
    // Hard boundary: nearest enclosing repo root wins, unconditionally.
    if (fs.existsSync(path.join(currentDir, '.git'))) {
      if (!startDir) {
        cachedWorkspaceRoot = currentDir;
      }
      return currentDir;
    }

    const pkgPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      if (nearestPkgDir === null) {
        nearestPkgDir = currentDir;
      }
      try {
        const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkgContent && pkgContent.workspaces && nearestWorkspacesPkgDir === null) {
          nearestWorkspacesPkgDir = currentDir;
        }
      } catch {
        // Ignore parse errors; keep climbing.
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  // No git boundary anywhere: nearest enclosing package is the project.
  const resolved =
    nearestWorkspacesPkgDir || nearestPkgDir || (startDir ? path.resolve(startDir) : process.cwd());

  if (!startDir) {
    cachedWorkspaceRoot = resolved;
  }
  return resolved;
}

/**
 * Writes data atomically to a file by first writing to a sibling temporary file
 * in the target file's parent directory, then performing an atomic rename (`fs.renameSync`).
 *
 * Placed in the same directory to guarantee same filesystem mount and avoid EXDEV errors.
 *
 * @param filePath Path to target output file.
 * @param data Data string or Uint8Array/Buffer to write.
 * @param options Write file options or encoding.
 */
export function atomicWriteFileSync(
  filePath: string,
  data: string | Uint8Array,
  options?: fs.WriteFileOptions | string
): void {
  const absPath = path.resolve(filePath);
  const dir = path.dirname(absPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const baseName = path.basename(absPath);
  const rand = Math.random().toString(36).substring(2, 8);
  const tempPath = path.join(dir, `.${baseName}.tmp.${process.pid}.${Date.now()}.${rand}`);

  try {
    fs.writeFileSync(tempPath, data, options as any);
    fs.renameSync(tempPath, absPath);
  } catch (err) {
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // Ignore errors when cleaning up temp file
      }
    }
    throw err;
  }
}

/**
 * Writes JSON data atomically to a file by stringifying data and using `atomicWriteFileSync`.
 *
 * @param filePath Path to target JSON output file.
 * @param data JavaScript object or data to stringify.
 * @param space Indentation spacing (default 2).
 */
export function atomicWriteJsonSync(
  filePath: string,
  data: unknown,
  space: number | string = 2
): void {
  const jsonContent = JSON.stringify(data, null, space) + '\n';
  atomicWriteFileSync(filePath, jsonContent, 'utf8');
}
