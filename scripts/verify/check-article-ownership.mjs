#!/usr/bin/env node
// Article ownership gate (rule: content/articles is internal-only).
// Fails any PR that touches content/articles/ unless submitted by an authorized
// internal author AND the PR body carries the in-house authorship stamp written by
// the article-writer pipeline.
// Stamp (exact line, machine-parsed): `authorship: article-writer-bot (in-house)`
// Repairs are handled in-session (Hermes/owner) — never reassigned to external agents.

import { fileURLToPath } from 'node:url';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { getPRContext, parsePRCliArgs } from './pr-utils.mjs';

export const DEFAULT_AUTHORIZED_AUTHORS = [
  'article-writer-bot',
  'hermes',
  'hermes-bot',
  'hermes[bot]',
  'blackghostosint',
];

export const IN_HOUSE_STAMP = 'authorship: article-writer-bot (in-house)';

/**
 * Checks article ownership and verifies PR author identity.
 * @param {Object} [options]
 * @param {string} [options.body] - PR body text
 * @param {string[]} [options.changedFiles] - List of changed file paths
 * @param {string} [options.author] - Author username/login
 * @param {boolean} [options.isLocal] - Whether execution is local without author context
 * @param {string[]} [options.authorizedAuthors] - List of authorized internal author logins
 * @param {Record<string,string>} [options.fileStatuses] - Optional map of changed-file path
 *   -> GitHub API status ('added' | 'modified' | 'removed' | 'renamed' | ...). When provided,
 *   deleted ('removed') article files are excluded from the stamp requirement: the ownership
 *   rule governs AUTHORED content, and a removal adds none. When absent, every touched
 *   article file is treated as authored (previous behavior).
 */
export function checkArticleOwnership({
  body = '',
  changedFiles = [],
  author = '',
  isLocal = false,
  authorizedAuthors = DEFAULT_AUTHORIZED_AUTHORS,
  fileStatuses = null,
} = {}) {
  const touchedArticles = changedFiles.filter((f) => f.trim().startsWith('content/articles/'));
  const touchesArticles = touchedArticles.length > 0;

  if (!touchesArticles) {
    return {
      success: true,
      touchesArticles: false,
      reason: 'not_applicable',
      message: '✅ article-ownership: PR does not touch content/articles/ — not applicable',
    };
  }

  // Deletion-only PRs (e.g. GSC sitemap-cleanup branches that `git rm` stale
  // articles) add no article content, so the in-house authorship stamp does not
  // apply — but the author identity check ALWAYS runs (an external actor must
  // not be able to delete articles unchecked). Only enforced when per-file
  // statuses are supplied (CI); without them the previous behavior is preserved.
  let authoredArticles = touchedArticles;
  let deletionsOnly = false;
  if (fileStatuses) {
    authoredArticles = touchedArticles.filter((f) => fileStatuses[f.trim()] !== 'removed');
    deletionsOnly = authoredArticles.length === 0;
  }

  const normalizedAuthor = author ? author.trim().toLowerCase() : '';
  const normalizedAuthorized = (authorizedAuthors || DEFAULT_AUTHORIZED_AUTHORS).map((a) =>
    a.trim().toLowerCase()
  );

  let authorBypassedLocally = false;

  if (isLocal) {
    authorBypassedLocally = true;
  } else if (!normalizedAuthor) {
    return {
      success: false,
      touchesArticles: true,
      reason: 'missing_author',
      message:
        '❌ article-ownership: PR touches content/articles/ but pull request author is unknown.\n' +
        '   Pass --author or set PR_AUTHOR environment variable.',
    };
  } else {
    const isAuthorizedAuthor = normalizedAuthorized.includes(normalizedAuthor);
    if (!isAuthorizedAuthor) {
      return {
        success: false,
        touchesArticles: true,
        reason: 'unauthorized_author',
        message:
          `❌ article-ownership: PR touches content/articles/ but author '${author}' is not an authorized internal author login.\n` +
          '   Articles are produced by internal author accounts ONLY.\n' +
          '   Never reassign article PRs to external agents; repairs are handled in-session by Hermes + owner.',
      };
    }
  }

  if (deletionsOnly) {
    return {
      success: true,
      touchesArticles: true,
      reason: 'deletions_only',
      message:
        '✅ article-ownership: PR only deletes content/articles/ files — no authored content, stamp not required',
    };
  }

  const safeBody = body || '';
  if (!safeBody.includes(IN_HOUSE_STAMP)) {
    return {
      success: false,
      touchesArticles: true,
      reason: 'missing_stamp',
      message:
        '❌ article-ownership: PR touches content/articles/ but is missing the in-house authorship stamp.\n' +
        '   Articles are produced by the internal article-writer pipeline ONLY.\n' +
        '   The PR body must contain the exact line:\n' +
        '   ' +
        IN_HOUSE_STAMP +
        '\n' +
        '   Never reassign article PRs to external agents; repairs are handled in-session by Hermes + owner.',
    };
  }

  if (authorBypassedLocally) {
    return {
      success: true,
      touchesArticles: true,
      reason: 'local_bypass',
      message:
        '⚠️ article-ownership: Local execution detected without author context; verified authorship stamp present',
    };
  }

  return {
    success: true,
    touchesArticles: true,
    reason: 'verified',
    message: '✅ article-ownership: verified in-house author and authorship stamp present',
  };
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  const { positional, isLocalBypass } = parsePRCliArgs(process.argv);
  if (
    positional.length < 2 &&
    !process.env.PR_BODY_FILE &&
    !process.env.GITHUB_EVENT_PATH &&
    !isLocalBypass
  ) {
    console.error(
      'usage: node scripts/verify/check-article-ownership.mjs <pr-body-file> <changed-files-file-or-minus> [--author=<login>] [--local]'
    );
    process.exit(2);
  }

  const ctx = getPRContext();

  const customAuthors = process.env.AUTHORIZED_AUTHORS
    ? process.env.AUTHORIZED_AUTHORS.split(',')
    : DEFAULT_AUTHORIZED_AUTHORS;

  // Optional per-file status map (path -> added/modified/removed) written by CI.
  // When present, deleted article files don't require the authorship stamp.
  let fileStatuses = null;
  if (process.env.PR_FILE_STATUS_FILE) {
    try {
      fileStatuses = JSON.parse(readFileSync(process.env.PR_FILE_STATUS_FILE, 'utf8'));
    } catch {
      fileStatuses = null; // malformed/absent → previous behavior (all touched = authored)
    }
  }

  const result = checkArticleOwnership({
    body: ctx.body,
    changedFiles: ctx.changedFiles,
    author: ctx.author,
    isLocal: ctx.isLocal,
    authorizedAuthors: customAuthors,
    fileStatuses,
  });

  if (!result.success) {
    console.error(result.message);
    process.exit(1);
  } else {
    console.log(result.message);
    process.exit(0);
  }
}
