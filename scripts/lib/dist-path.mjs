import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

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
    return envDist;
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
