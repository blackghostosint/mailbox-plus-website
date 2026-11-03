import fs from 'node:fs';
import path from 'node:path';

/**
 * Standard directories excluded from traversal by default across repository scripts.
 */
export const DEFAULT_IGNORE_DIRS: readonly string[] = Object.freeze([
  'node_modules',
  '.git',
  'dist',
  '.factchecks',
]);

export interface TraversalOptions {
  /**
   * File extensions to include (e.g. ['.ts', '.astro'] or ['ts', 'astro']).
   * Matching is case-insensitive. If omitted or empty, all extensions are included.
   */
  extensions?: string[];

  /**
   * Directory names or subpaths to skip during traversal.
   * If omitted, defaults to DEFAULT_IGNORE_DIRS.
   * Pass an empty array `[]` to allow traversing all directories.
   */
  ignoreDirs?: string[];

  /**
   * File names to ignore during traversal (e.g. ['README.md']).
   * Matching is case-insensitive against the base file name.
   */
  ignoreFiles?: string[];

  /**
   * Custom filter predicate invoked for each candidate file.
   * Return true to include the file, false to exclude.
   */
  filter?: (filePath: string, entryName: string) => boolean;
}

export type TraversalCallback = (filePath: string) => void;

/**
 * Recursively walks a directory and invokes a callback for each file matching the options.
 *
 * Supports signatures:
 * - walkDir(dir, callback)
 * - walkDir(dir, callback, options)
 * - walkDir(dir, options, callback)
 */
export function walkDir(
  dir: string,
  arg2: TraversalCallback | TraversalOptions,
  arg3?: TraversalCallback | TraversalOptions
): void {
  let callback: TraversalCallback;
  let options: TraversalOptions = {};

  if (typeof arg2 === 'function') {
    callback = arg2;
    if (arg3 && typeof arg3 === 'object') {
      options = arg3;
    }
  } else if (typeof arg3 === 'function') {
    callback = arg3;
    options = arg2 || {};
  } else {
    throw new TypeError('walkDir requires a callback function');
  }

  walkFilesInternal(dir, options, callback);
}

/**
 * Recursively walks a directory and returns an array of absolute file paths matching the options.
 */
export function walkFiles(dir: string, options: TraversalOptions = {}): string[] {
  const results: string[] = [];
  walkFilesInternal(dir, options, (filePath) => {
    results.push(filePath);
  });
  return results;
}

/**
 * Recursively walks a directory and returns paths of all markdown files,
 * ignoring README.md files (case-insensitive) and default ignore directories.
 */
export function walkMdFiles(dir: string, options: TraversalOptions = {}): string[] {
  const ignoreFiles = options.ignoreFiles ? [...options.ignoreFiles, 'README.md'] : ['README.md'];
  return walkFiles(dir, {
    ...options,
    extensions: ['.md'],
    ignoreFiles,
  });
}

function tryIsFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function walkFilesInternal(
  dir: string,
  options: TraversalOptions,
  callback: TraversalCallback
): void {
  if (!dir) return;

  try {
    if (!fs.existsSync(dir)) return;
  } catch {
    return;
  }

  const ignoreDirs = options.ignoreDirs !== undefined ? options.ignoreDirs : DEFAULT_IGNORE_DIRS;
  const ignoreDirSet = new Set(ignoreDirs.map((d) => d.toLowerCase()));

  const normalizedExtensions = options.extensions?.length
    ? options.extensions.map((ext) =>
        ext.startsWith('.') ? ext.toLowerCase() : '.' + ext.toLowerCase()
      )
    : null;

  const ignoreFileSet = options.ignoreFiles?.length
    ? new Set(options.ignoreFiles.map((f) => f.toLowerCase()))
    : null;

  function traverse(currentDir: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        const lowerName = entry.name.toLowerCase();
        if (ignoreDirSet.has(lowerName)) {
          continue;
        }

        // Also check if relative path matches any ignoreDirs item (e.g. "content/articles" or "foo/bar")
        if (ignoreDirs.length > 0) {
          const relPath = path.relative(dir, fullPath).replace(/\\/g, '/').toLowerCase();
          if (
            ignoreDirs.some((d) => {
              const lowerD = d.toLowerCase();
              return relPath === lowerD || relPath.startsWith(lowerD + '/');
            })
          ) {
            continue;
          }
        }

        traverse(fullPath);
      } else if (entry.isFile() || (entry.isSymbolicLink() && tryIsFile(fullPath))) {
        const lowerName = entry.name.toLowerCase();

        // Check ignoreFiles
        if (ignoreFileSet && ignoreFileSet.has(lowerName)) {
          continue;
        }

        // Check extensions
        if (normalizedExtensions) {
          const ext = path.extname(entry.name).toLowerCase();
          if (!normalizedExtensions.includes(ext)) {
            continue;
          }
        }

        // Check custom filter callback
        if (options.filter && !options.filter(fullPath, entry.name)) {
          continue;
        }

        callback(fullPath);
      }
    }
  }

  traverse(dir);
}
