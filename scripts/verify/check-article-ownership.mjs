#!/usr/bin/env node
// Article ownership gate (rule: content/articles is internal-only).
// Fails any PR that touches content/articles/ unless submitted by an authorized
// internal author AND the PR body carries the in-house authorship stamp written by
// the article-writer pipeline.
// Stamp (exact line, machine-parsed): `authorship: article-writer-bot (in-house)`
// Repairs are handled in-session (Hermes/owner) — never reassigned to external agents.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

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

function parseCliArgs(args) {
  let author = '';
  let isLocalBypass = false;
  const positional = [];

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--author=')) {
      author = arg.split('=').slice(1).join('=');
    } else if (arg === '--author') {
      author = args[++i] || '';
    } else if (arg === '--bypass-local' || arg === '--local') {
      isLocalBypass = true;
    } else {
      positional.push(arg);
    }
  }

  return { author, isLocalBypass, positional };
}

function resolveAuthor(cliAuthor) {
  if (cliAuthor) return cliAuthor;
  if (process.env.PR_AUTHOR) return process.env.PR_AUTHOR;
  if (process.env.GITHUB_EVENT_PATH) {
    try {
      const ev = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      if (ev?.pull_request?.user?.login) {
        return ev.pull_request.user.login;
      }
    } catch {
      // ignore read/parse errors
    }
  }
  return '';
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const { author: cliAuthor, isLocalBypass, positional } = parseCliArgs(process.argv);
  const bodyFile = positional[0];
  const filesFile = positional[1];

  if (!bodyFile || !filesFile) {
    console.error(
      'usage: node scripts/verify/check-article-ownership.mjs <pr-body-file> <changed-files-file-or-minus> [--author=<login>] [--local]'
    );
    process.exit(2);
  }

  let body = '';
  try {
    body = readFileSync(bodyFile, 'utf8');
  } catch {
    body = '';
  }

  let changedRaw = '';
  if (filesFile === '-') {
    changedRaw = readFileSync(0, 'utf8');
  } else {
    try {
      changedRaw = readFileSync(filesFile, 'utf8');
    } catch {
      changedRaw = '';
    }
  }

  const changedFiles = changedRaw
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);

  const author = resolveAuthor(cliAuthor);
  const isCi = Boolean(
    process.env.CI || process.env.GITHUB_ACTIONS || process.env.GITHUB_EVENT_PATH
  );
  const isLocal = isLocalBypass || (!author && !isCi);

  const customAuthors = process.env.AUTHORIZED_AUTHORS
    ? process.env.AUTHORIZED_AUTHORS.split(',')
    : DEFAULT_AUTHORIZED_AUTHORS;

  const result = checkArticleOwnership({
    body,
    changedFiles,
    author,
    isLocal,
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
