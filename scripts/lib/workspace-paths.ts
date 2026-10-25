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
 * Deterministically resolves the root directory of the workspace by climbing
 * up the directory tree looking for a root marker (`package.json` or `.git`).
 *
 * @param startDir Optional starting directory. Defaults to `process.cwd()`.
 * @returns Absolute path to the workspace root directory.
 */
export function getWorkspaceRoot(startDir?: string): string {
  if (!startDir && cachedWorkspaceRoot) {
    return cachedWorkspaceRoot;
  }

  let currentDir = startDir ? path.resolve(startDir) : process.cwd();
  let rootWithGitOrWorkspaces: string | null = null;
  let highestPkgDir: string | null = null;

  while (currentDir && currentDir !== path.parse(currentDir).root) {
    const gitPath = path.join(currentDir, '.git');
    const pkgPath = path.join(currentDir, 'package.json');

    if (fs.existsSync(gitPath)) {
      rootWithGitOrWorkspaces = currentDir;
    }

    if (fs.existsSync(pkgPath)) {
      highestPkgDir = currentDir;
      try {
        const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkgContent && pkgContent.workspaces) {
          rootWithGitOrWorkspaces = currentDir;
        }
      } catch {
        // Ignore parse error
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  const resolved =
    rootWithGitOrWorkspaces || highestPkgDir || (startDir ? path.resolve(startDir) : process.cwd());

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
