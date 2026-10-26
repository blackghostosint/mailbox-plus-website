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
import { fileURLToPath } from 'node:url';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';
import { checkAuthModel } from './check-auth-model.mjs';
import { checkOwnerClaims } from './check-owner-claims.mjs';
import { checkArticleOwnership } from './check-article-ownership.mjs';
import {
  readPRBody,
  readFilesList,
  resolveAuthor,
  detectLocalChangedFiles,
  detectLocalBodyFile,
} from './pr-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _ROOT = path.resolve(__dirname, '../..');

export { detectLocalChangedFiles, detectLocalBodyFile };

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

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  main().catch((err) => {
    console.error('Fatal error during PR body preflight:', err);
    process.exit(1);
  });
}
