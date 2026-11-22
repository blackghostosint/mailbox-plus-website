#!/usr/bin/env node
/**
 * open-article-pr — Fail-closed PR opener for Mailbox Plus article/rewrite PRs.
 *
 * Ensures every article PR passes ALL local branch and PR-body gates BEFORE
 * invoking `gh pr create`:
 *   1. Auto-ensures the required in-house authorship stamp when touching content/articles/
 *   2. Validates the PR body via `validatePRBody()` (check-auth-model, check-owner-claims,
 *      check-article-ownership, check-article-paperwork)
 *   3. Runs `npm run preflight:article` (feeds, factcheck, verdicts, source-of-truth, SEO)
 *   4. Only invokes `gh pr create` after all gates exit 0
 *
 * Usage:
 *   npm run pr:article -- --title "..." --body-file .pr-body.md [--base main] [--ready] [--dry-run]
 *   npm run pr:article -- --title "..." --body "..." [--base main] [--ready] [--dry-run]
 */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isMainModule } from './lib/cli-utils.ts';
import { IN_HOUSE_STAMP } from './verify/check-article-ownership.mjs';
import { detectLocalChangedFiles, validatePRBody } from './verify/preflight-pr-body.mjs';

/**
 * Ensures the in-house authorship stamp is present when article files are touched.
 * @param {string} body
 * @param {string[]} changedFiles
 */
export function ensureAuthorshipStamp(body, changedFiles) {
  const touchesArticles = changedFiles.some((f) => f.trim().startsWith('content/articles/'));
  if (!touchesArticles) return body;
  if (body.includes(IN_HOUSE_STAMP)) return body;
  const trimmed = body.trimEnd();
  return `${trimmed}\n\n${IN_HOUSE_STAMP}\n`;
}

/**
 * Parses CLI flags for open-article-pr.
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  const opts = {
    title: '',
    body: '',
    bodyFile: '',
    base: 'main',
    head: '',
    draft: true,
    dryRun: false,
    skipPreflight: false,
    author: process.env.PR_AUTHOR || 'blackghostosint',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--title' && i + 1 < argv.length) opts.title = argv[++i];
    else if (a === '--body' && i + 1 < argv.length) opts.body = argv[++i];
    else if (a === '--body-file' && i + 1 < argv.length) opts.bodyFile = argv[++i];
    else if (a === '--base' && i + 1 < argv.length) opts.base = argv[++i];
    else if (a === '--head' && i + 1 < argv.length) opts.head = argv[++i];
    else if (a === '--ready') opts.draft = false;
    else if (a === '--draft') opts.draft = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--skip-preflight') opts.skipPreflight = true;
    else if (a === '--author' && i + 1 < argv.length) opts.author = argv[++i];
  }
  return opts;
}

/**
 * Prepares and validates the PR body against all deterministic PR-body gates.
 * @param {Object} params
 * @param {string} params.body
 * @param {string[]} params.changedFiles
 * @param {string} [params.author]
 */
export function prepareAndValidatePRBody({ body, changedFiles, author = 'blackghostosint' }) {
  const finalBody = ensureAuthorshipStamp(body, changedFiles);
  const validation = validatePRBody({
    body: finalBody,
    changedFiles,
    author,
    isLocal: true,
  });
  return { finalBody, ...validation };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.title) {
    console.error('❌ open-article-pr: --title is required');
    process.exit(1);
  }

  let rawBody = opts.body;
  if (!rawBody && opts.bodyFile) {
    if (!existsSync(opts.bodyFile)) {
      console.error(`❌ open-article-pr: --body-file not found: ${opts.bodyFile}`);
      process.exit(1);
    }
    rawBody = readFileSync(opts.bodyFile, 'utf8');
  }
  if (!rawBody) {
    console.error('❌ open-article-pr: provide --body or --body-file');
    process.exit(1);
  }

  const changedFiles = detectLocalChangedFiles();
  const { finalBody, success, results } = prepareAndValidatePRBody({
    body: rawBody,
    changedFiles,
    author: opts.author,
  });

  console.log('== open-article-pr: PR body gates ==');
  for (const r of results) {
    console.log(r.message);
  }
  if (!success) {
    console.error('\n❌ Refusing to open PR: fix the PR body gate failure(s) above and re-run.');
    process.exit(1);
  }

  if (!opts.skipPreflight) {
    console.log('\n== open-article-pr: running npm run preflight:article ==');
    const pre = spawnSync('npm', ['run', 'preflight:article'], { stdio: 'inherit' });
    if (pre.status !== 0) {
      console.error('\n❌ Refusing to open PR: npm run preflight:article failed.');
      process.exit(pre.status || 1);
    }
  }

  if (opts.dryRun) {
    console.log('\n✅ --dry-run passed all PR body and preflight gates (gh pr create skipped).');
    process.exit(0);
  }

  const tmpBody = join(tmpdir(), `mpo-pr-body-${Date.now()}.md`);
  writeFileSync(tmpBody, finalBody, 'utf8');
  try {
    const ghArgs = [
      'pr',
      'create',
      '--base',
      opts.base,
      '--title',
      opts.title,
      '--body-file',
      tmpBody,
    ];
    if (opts.head) ghArgs.push('--head', opts.head);
    if (opts.draft) ghArgs.push('--draft');
    const out = execFileSync('gh', ghArgs, { encoding: 'utf8' });
    process.stdout.write(out);
  } finally {
    try {
      unlinkSync(tmpBody);
    } catch {
      // best-effort cleanup
    }
  }
}

if (isMainModule(import.meta.url)) {
  main();
}
