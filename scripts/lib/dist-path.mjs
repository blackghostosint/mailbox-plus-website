import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

export const GetHtmlFilesInputSchema = z.string({
  invalid_type_error: 'Directory path must be a string',
});
export const GetHtmlFilesOutputSchema = z.array(z.string());

/**
 * Recursively walks directory to find all .html files.
 * Enforces Zod runtime validation schema for inputs and outputs.
 * Preserves symlink-to-directory traversal and uses statSync().isFile()
 * to filter valid files.
 *
 * @param {string} dir Directory path to scan.
 * @param {string[]} [fileList=[]] Optional array accumulator for html file paths.
 * @param {Set<string>} [visited=new Set()] Set of visited canonical directory paths.
 * @returns {string[]} Array of absolute html file paths.
 */
export function getHtmlFiles(dir, fileList = [], visited = new Set()) {
  GetHtmlFilesInputSchema.parse(dir);

  if (!fs.existsSync(dir)) {
    return GetHtmlFilesOutputSchema.parse(fileList);
  }

  let canonicalDir;
  try {
    canonicalDir = fs.realpathSync(dir);
  } catch {
    canonicalDir = path.resolve(dir);
  }

  if (visited.has(canonicalDir)) {
    return GetHtmlFilesOutputSchema.parse(fileList);
  }

  const nextVisited = new Set(visited);
  nextVisited.add(canonicalDir);

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      getHtmlFiles(fullPath, fileList, nextVisited);
    } else if (stat.isFile() && entry.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }

  return GetHtmlFilesOutputSchema.parse(fileList);
}

/**
 * Resolves the build output directory (dist).
 *
 * Probe order:
 * 1. process.env.DIST_DIR (if set and valid on disk)
 * 2. Root dist directory (<ROOT>/dist)
 * 3. Package output directory (<ROOT>/astro/dist)
 *
 * If no valid candidate exists, emits a clear error message instructing
 * the user to run `npm run build` and returns the default root dist path.
 *
 * @returns {string} Absolute path to resolved dist directory.
 */
export function resolveDistDir() {
  if (process.env.DIST_DIR && process.env.DIST_DIR.trim() !== '') {
    const envDist = path.resolve(process.env.DIST_DIR.trim());
    if (fs.existsSync(envDist) && fs.statSync(envDist).isDirectory()) {
      return envDist;
    }
    console.error(
      `Error: dist directory "${envDist}" specified by DIST_DIR does not exist. Please run "npm run build" first.`
    );
    process.exit(1);
  }

  const candidates = [path.resolve(ROOT_DIR, 'dist'), path.resolve(ROOT_DIR, 'astro', 'dist')];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }

  const primaryDist = candidates[0];
  console.error('Error: dist directory does not exist. Please run "npm run build" first.');
  return primaryDist;
}

export { ROOT_DIR };
