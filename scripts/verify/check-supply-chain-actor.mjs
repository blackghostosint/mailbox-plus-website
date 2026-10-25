#!/usr/bin/env node
// Policy gate: protected supply-chain files may only be modified by the repo owner.
// Background (2026-10-05, PR #720): an external agent pinned `braces` to a
// typosquat fork (`@xiaoxige1/braces`) and removed the audit allowlist — CI was
// green but the "fix" was a renamed vulnerable package. This guard rejects any
// PR that touches protected files unless the PR author is the repo owner.
//
// Usage: node scripts/verify/check-supply-chain-actor.mjs <pr_files_file> <pr_author>
// Protected: .github/workflows/*, package.json + package-lock.json (root + astro/),
// scripts/verify/*, netlify.toml, .gitleaks*
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFilesList } from './pr-utils.mjs';

export const DEFAULT_OWNER = process.env.REPO_OWNER || 'blackghostosint';

export const DEFAULT_AUTHORIZED_BOTS = ['google-labs-stitch[bot]', 'google-labs-stitch'];

// Strict owner-only files: automated agents (incl. authorized bots) may NEVER
// touch these, because they alter the dependency/config surface where the
// PR #720 typosquat lived. Bot-authored CI/a11y/code PRs remain allowed.
// (2026-10-23, PR #797: an authorized bot removed netlify/functions from root
// workspaces via package.json+lockfile — passed this gate, caught only by L3 review.)
export const STRICT_OWNER_ONLY = [
  /^(astro\/)?package\.json$/,
  /^(astro\/)?package-lock\.json$/,
  /^netlify\.toml$/,
];

export const PROTECTED = [
  /^\.github\/workflows\//,
  /^(astro\/)?package\.json$/,
  /^(astro\/)?package-lock\.json$/,
  /^scripts\/verify\//,
  /^netlify\.toml$/,
  /^\.gitleaks/,
];

/**
 * Validates that protected supply-chain files are only modified by the repository owner or authorized bot.
 *
 * @param {Object} [options]
 * @param {string[]} [options.changedFiles] - List of changed file paths
 * @param {string} [options.author] - Username/login of the PR author
 * @param {string|string[]} [options.owner] - Repository owner username/login or list of allowed owners
 * @param {string[]} [options.authorizedBots] - List of authorized bot logins on behalf of owner
 * @returns {{ success: boolean, touched: string[], message: string }}
 */
export function checkSupplyChainActor({
  changedFiles = [],
  author = '',
  owner = DEFAULT_OWNER,
  authorizedBots = DEFAULT_AUTHORIZED_BOTS,
} = {}) {
  const files = Array.isArray(changedFiles) ? changedFiles : [];
  const touched = files.filter((f) => PROTECTED.some((rx) => rx.test(f)));

  if (!touched.length) {
    return {
      success: true,
      touched: [],
      message: '✅ no protected supply-chain files touched',
    };
  }

  const normalizedAuthor = (author || '').trim().toLowerCase();
  const rawOwners = Array.isArray(owner) ? owner : [owner];
  const normalizedOwners = rawOwners.filter(Boolean).map((o) => String(o).trim().toLowerCase());

  const hasLockfileOrConfig = files.some(
    (f) => /^(astro\/)?package-lock\.json$/.test(f) || /^netlify\.toml$/.test(f)
  );
  const strictTouched = files.filter((f) => STRICT_OWNER_ONLY.some((rx) => rx.test(f)));
  const isOwner = normalizedAuthor && normalizedOwners.includes(normalizedAuthor);
  const isAuthorizedBot =
    normalizedAuthor &&
    (authorizedBots || []).map((b) => b.trim().toLowerCase()).includes(normalizedAuthor);

  if (strictTouched.length && !isOwner && (!isAuthorizedBot || hasLockfileOrConfig)) {
    return {
      success: false,
      touched: strictTouched,
      message:
        `❌ dependency/config files touched by "${author}": ${strictTouched.join(', ')}. ` +
        'These files are owner-only for EVERY author including authorized bots (see PR #797). ' +
        'Dependency and config changes must be applied by the repo owner.',
    };
  }

  const isDefaultOwnerIncluded = normalizedOwners.some((o) => o === DEFAULT_OWNER.toLowerCase());

  const allowedLogins = new Set(normalizedOwners);
  if (isDefaultOwnerIncluded) {
    for (const bot of authorizedBots || []) {
      if (bot) allowedLogins.add(String(bot).trim().toLowerCase());
    }
  }

  if (normalizedAuthor && allowedLogins.has(normalizedAuthor)) {
    return {
      success: true,
      touched,
      message: `✅ protected files touched by repo owner (${author}): ${touched.join(', ')}`,
    };
  }

  return {
    success: false,
    touched,
    message:
      `PR by "${author}" touches protected supply-chain files: ${touched.join(', ')}. ` +
      'Dependency overrides and CI workflow changes require a PR from the repo owner. ' +
      'Owner reviews and applies dependency changes in-house (see PR #720 incident).',
  };
}

function fail(msg) {
  const formatted = msg.startsWith('❌') ? msg : '❌ ' + msg;
  console.error(formatted);
  process.exit(1);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const [filesFile, authorArg] = process.argv.slice(2);
  if (!filesFile || authorArg === undefined) {
    fail('usage: check-supply-chain-actor.mjs <pr_files_file> <pr_author>');
  }

  const files = readFilesList(filesFile);
  const result = checkSupplyChainActor({
    changedFiles: files,
    author: authorArg,
  });

  if (result.success) {
    console.log(result.message);
    process.exit(0);
  } else {
    fail(result.message);
  }
}
