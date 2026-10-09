#!/usr/bin/env node
// Article ownership gate (rule: content/articles is internal-only).
// Fails any PR that touches content/articles/ unless submitted by an authorized
// internal author AND the PR body carries the in-house authorship stamp written by
// the article-writer pipeline.
// Stamp (exact line, machine-parsed): `authorship: article-writer-bot (in-house)`
// Repairs are handled in-session (Hermes/owner) — never reassigned to external agents.

import { fileURLToPath } from 'node:url';
import path from 'node:path';
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
 */
export function checkArticleOwnership({
  body = '',
  changedFiles = [],
  author = '',
  isLocal = false,
  authorizedAuthors = DEFAULT_AUTHORIZED_AUTHORS,
} = {}) {
  const touchesArticles = changedFiles.some((f) => f.trim().startsWith('content/articles/'));

  if (!touchesArticles) {
    return {
      success: true,
      touchesArticles: false,
      reason: 'not_applicable',
      message: '✅ article-ownership: PR does not touch content/articles/ — not applicable',
    };
  }

  const normalizedAuthor = author ? author.trim().toLowerCase() : '';
  const normalizedAuthorized = (authorizedAuthors || DEFAULT_AUTHORIZED_AUTHORS).map((a) =>
    a.trim().toLowerCase()
  );

  if (!normalizedAuthor) {
    if (isLocal) {
      return {
        success: true,
        touchesArticles: true,
        reason: 'local_bypass',
        message:
          '⚠️ article-ownership: Local execution detected without author context; bypassing author check for local dev',
      };
    }
    return {
      success: false,
      touchesArticles: true,
      reason: 'missing_author',
      message:
        '❌ article-ownership: PR touches content/articles/ but pull request author is unknown.\n' +
        '   Pass --author or set PR_AUTHOR environment variable.',
    };
  }

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

  if (!body.includes(IN_HOUSE_STAMP)) {
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

  return {
    success: true,
    touchesArticles: true,
    reason: 'verified',
    message: '✅ article-ownership: verified in-house author and authorship stamp present',
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const { positional } = parsePRCliArgs(process.argv);
  if (positional.length < 2 && !process.env.PR_BODY_FILE && !process.env.GITHUB_EVENT_PATH) {
    console.error(
      'usage: node scripts/verify/check-article-ownership.mjs <pr-body-file> <changed-files-file-or-minus> [--author=<login>] [--local]'
    );
    process.exit(2);
  }

  const ctx = getPRContext();

  const customAuthors = process.env.AUTHORIZED_AUTHORS
    ? process.env.AUTHORIZED_AUTHORS.split(',')
    : DEFAULT_AUTHORIZED_AUTHORS;

  const result = checkArticleOwnership({
    body: ctx.body,
    changedFiles: ctx.changedFiles,
    author: ctx.author,
    isLocal: ctx.isLocal,
    authorizedAuthors: customAuthors,
  });

  if (!result.success) {
    console.error(result.message);
    process.exit(1);
  } else {
    console.log(result.message);
    process.exit(0);
  }
}
