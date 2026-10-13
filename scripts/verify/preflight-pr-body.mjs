#!/usr/bin/env node
/**
 * preflight-pr-body — Local preflight validation for PR description requirements.
 *
 * Runs the deterministic PR body gates BEFORE pushing to GitHub:
 *   1. check-auth-model (Rule 7: netlify/functions/ changes require Auth Model section)
 *   2. check-owner-claims (Rule 3: content/articles/ changes require Business Claims section/status)
 *   3. check-article-ownership (Rule: content/articles/ requires in-house authorship stamp)
 *
 * Usage:
 *   node scripts/verify/preflight-pr-body.mjs [body-file] [changed-files.txt]
 *
 * Auto-detects changed files via `git diff --name-only origin/main...HEAD` if not provided.
 * Auto-detects body file from common local paths (.pr-body.md, pr-body.md, .github/PULL_REQUEST_BODY.md)
 * or PR_BODY_FILE env variable.
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = one or more PR body gates failed
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkAuthModel } from './check-auth-model.mjs';
import { checkOwnerClaims } from './check-owner-claims.mjs';
import { checkArticleOwnership, IN_HOUSE_STAMP } from './check-article-ownership.mjs';
import { readPRBody, readFilesList, resolveAuthor } from './pr-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

export function detectLocalChangedFiles() {
  try {
    const stdout = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const files = stdout
      .split(/\r?\n/)
      .map((f) => f.trim())
      .filter(Boolean);
    if (files.length > 0) return files;
  } catch {}

  try {
    const stdout = execFileSync('git', ['diff', '--name-only', 'HEAD~1'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return stdout
      .split(/\r?\n/)
      .map((f) => f.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function detectLocalBodyFile() {
  const candidates = [
    process.env.PR_BODY_FILE,
    path.join(ROOT, '.pr-body.md'),
    path.join(ROOT, 'pr-body.md'),
    path.join(ROOT, '.github', 'PULL_REQUEST_BODY.md'),
    path.join(ROOT, '.github', 'pull_request_body.md'),
    path.join(process.env.HOME || '', '.hermes', 'cache', 'scratch', 'pr-body.md'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Validates PR body against the 3 deterministic PR gates.
 * @param {Object} [options]
 * @param {string} [options.body]
 * @param {string[]} [options.changedFiles]
 * @param {string} [options.author]
 * @param {boolean} [options.isLocal]
 */
export function validatePRBody({
  body = '',
  changedFiles = /** @type {string[]} */ ([]),
  author = '',
  isLocal = true,
} = {}) {
  const results = [];

  // 1. Auth Model (rule 7)
  const authRes = checkAuthModel({ body, changedFiles });
  results.push({
    gate: 'check-auth-model',
    success: authRes.success,
    message: authRes.message,
  });

  // 2. Owner Claims (rule 3)
  const claimsRes = checkOwnerClaims({ body, changedFiles });
  results.push({
    gate: 'check-owner-claims',
    success: claimsRes.success,
    message: claimsRes.message,
  });

  // 3. Article Ownership (authorship stamp)
  const ownerRes = checkArticleOwnership({
    body,
    changedFiles,
    author: author || 'blackghostosint',
    isLocal,
  });
  results.push({
    gate: 'check-article-ownership',
    success: ownerRes.success,
    message: ownerRes.message,
  });

  const allPassed = results.every((r) => r.success);
  return {
    success: allPassed,
    results,
  };
}

async function main() {
  const args = process.argv.slice(2);
  let bodyFile = args[0] || detectLocalBodyFile();
  let filesSource = args[1] || (process.env.PR_FILES_FILE ?? detectLocalChangedFiles());

  let body = '';
  if (bodyFile && existsSync(bodyFile)) {
    body = readFileSync(bodyFile, 'utf8');
  } else if (bodyFile && typeof bodyFile === 'string') {
    body = bodyFile;
  } else {
    body = readPRBody(undefined, process.env);
  }

  const changedFiles = Array.isArray(filesSource) ? filesSource : readFilesList(filesSource);

  const author = resolveAuthor(undefined, process.env) || 'blackghostosint';

  console.log('== PR Body Preflight ==');
  console.log(`• Files changed: ${changedFiles.length}`);
  console.log(`• Body source: ${bodyFile || (body ? '<inline>' : '<none>')}\n`);

  if (
    !body.trim() &&
    changedFiles.some(
      (f) => f.startsWith('content/articles/') || f.startsWith('netlify/functions/')
    )
  ) {
    console.error(
      '❌ Error: PR body is empty or not found, but article or function files are changed.'
    );
    console.error(
      '   Save your PR body to .pr-body.md or pass the file path: node scripts/verify/preflight-pr-body.mjs <file>'
    );
    process.exit(1);
  }

  const validation = validatePRBody({
    body,
    changedFiles,
    author,
    isLocal: true,
  });

  for (const r of validation.results) {
    const symbol = r.success ? '✅' : '❌';
    console.log(`${symbol} ${r.gate}: ${r.message}`);
  }

  if (!validation.success) {
    console.error('\n❌ PR body preflight FAILED. Fix the body issues above before pushing.');
    process.exit(1);
  }

  console.log('\n✅ All PR body gates PASSED locally.');
  process.exit(0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Fatal error during PR body preflight:', err);
    process.exit(1);
  });
}
