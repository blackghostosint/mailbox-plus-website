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
import fs from 'node:fs';
import { readFilesList } from './pr-utils.mjs';

export const DEFAULT_OWNER = process.env.REPO_OWNER || 'blackghostosint';

export const DEFAULT_AUTHORIZED_BOTS = ['google-labs-stitch[bot]', 'google-labs-stitch'];

// Strict owner-only files: automated agents (incl. authorized bots) may NEVER
// touch dependency manifests (package.json / package-lock.json) or netlify.toml.
// Bot-authored CI/a11y/code PRs remain allowed.
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

const APPROVED_GITLEAKS_PATH_PATTERNS = [
  /^\.env\.example$/,
  /^netlify\/functions\/__tests__\//,
  /^netlify\/functions\/lib\/.*\.test\.ts$/,
  /^astro\/src\/lib\/__tests__\//,
  /^scripts\/__tests__\//,
  /^tests\//,
];

/**
 * Validates that a .gitleaks.toml configuration does not broaden secret-scanning exemptions.
 *
 * @param {string} content - Raw .gitleaks.toml file content
 * @returns {{ valid: boolean, reason?: string }}
 */
export function verifyGitleaksConfigExemptionsNotBroadened(content) {
  if (!content || typeof content !== 'string') {
    return { valid: false, reason: '.gitleaks.toml content is empty or unreadable' };
  }

  if (!/useDefault\s*=\s*true/i.test(content)) {
    return { valid: false, reason: '.gitleaks.toml must keep "useDefault = true"' };
  }

  if (/^\s*\[\[/m.test(content)) {
    const match = content.match(/^\s*\[\[\s*([^\s\]]+)\s*\]\]/m);
    const tableName = match ? match[1] : 'unknown';
    return {
      valid: false,
      reason: `.gitleaks.toml must not define custom [[rules]] overrides or table array "[[${tableName}]]"`,
    };
  }

  const allowedSections = new Set(['root', 'extend', 'allowlist']);
  const allowedKeysBySection = {
    root: new Set(['title', 'useDefault']),
    extend: new Set(['useDefault']),
    allowlist: new Set(['description', 'regexes', 'paths']),
  };

  let currentSection = 'root';
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    let lineNoComment = '';
    let inQuote = null;
    for (let charIdx = 0; charIdx < trimmed.length; charIdx++) {
      const ch = trimmed[charIdx];
      if ((ch === '"' || ch === "'") && (charIdx === 0 || trimmed[charIdx - 1] !== '\\')) {
        if (!inQuote) inQuote = ch;
        else if (inQuote === ch) inQuote = null;
      }
      if (ch === '#' && !inQuote) {
        break;
      }
      lineNoComment += ch;
    }
    const cleanLine = lineNoComment.trim();
    if (!cleanLine) continue;

    if (cleanLine.startsWith('[') && cleanLine.endsWith(']')) {
      const sectionMatch = cleanLine.match(/^\[\s*([\w.-]+)\s*\]$/);
      if (!sectionMatch) {
        return {
          valid: false,
          reason: `invalid section header format "${cleanLine}" in .gitleaks.toml`,
        };
      }
      const sectionName = sectionMatch[1].trim();
      if (!allowedSections.has(sectionName)) {
        return {
          valid: false,
          reason: `.gitleaks.toml contains unauthorized section "[${sectionName}]"`,
        };
      }
      currentSection = sectionName;
      continue;
    }

    const kvMatch = cleanLine.match(/^([\w.-]+)\s*=/);
    if (kvMatch) {
      const rawKey = kvMatch[1].trim();
      let targetSection = currentSection;
      let targetKey = rawKey;

      if (rawKey.includes('.')) {
        const parts = rawKey.split('.');
        targetSection = parts[0];
        targetKey = parts.slice(1).join('.');
      }

      if (!allowedSections.has(targetSection)) {
        return {
          valid: false,
          reason: `.gitleaks.toml contains key for unauthorized section "${targetSection}"`,
        };
      }

      const validKeys = allowedKeysBySection[targetSection];
      if (!validKeys || !validKeys.has(targetKey)) {
        return {
          valid: false,
          reason: `.gitleaks.toml contains unauthorized exemption key "${targetKey}" in section "${targetSection}"`,
        };
      }
    }
  }

  const extractTomlArray = (key) => {
    const match = content.match(new RegExp(`${key}\\s*=\\s*\\[([^\\]]*)\\]`, 's'));
    if (!match) return [];
    const rawInside = match[1];
    const stringMatches = rawInside.match(/('''[\s\S]*?'''|"""[\s\S]*?"""|'[^']*'|"[^"]*")/g);
    if (stringMatches) {
      return stringMatches
        .map((str) => str.replace(/^('''|"""|'|")/, '').replace(/('''|"""|'|")$/, ''))
        .filter(Boolean);
    }
    return rawInside
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.replace(/,$/, '').trim())
      .filter(Boolean);
  };

  const regexes = extractTomlArray('regexes');
  const disallowedRegexTerms = [
    /\.\*/,
    /\.\+/,
    /\[.*\]/,
    /\\w/,
    /\\d/,
    /secret/i,
    /dummy/i,
    /mock/i,
    /^sk[-_]/i,
    /^pk[-_]/i,
  ];
  for (const entry of regexes) {
    if (disallowedRegexTerms.some((rx) => rx.test(entry))) {
      return {
        valid: false,
        reason: `regexes entry "${entry}" contains disallowed wildcard or secret placeholder pattern`,
      };
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry)) {
      return {
        valid: false,
        reason: `regexes entry "${entry}" is not an exact non-secret slug identifier`,
      };
    }
  }

  const paths = extractTomlArray('paths');
  for (const entry of paths) {
    const normalizedPath = entry.replace(/\\([./])/g, '$1');
    const isApproved = APPROVED_GITLEAKS_PATH_PATTERNS.some((rx) => rx.test(normalizedPath));
    if (!isApproved) {
      return {
        valid: false,
        reason: `paths entry "${entry}" is outside approved test/example path scopes`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validates that protected supply-chain files are only modified by the repository owner or authorized bot.
 *
 * @param {Object} [options]
 * @param {string[]} [options.changedFiles] - List of changed file paths
 * @param {string} [options.author] - Username/login of the PR author
 * @param {string|string[]} [options.owner] - Repository owner username/login or list of allowed owners
 * @param {string[]} [options.authorizedBots] - List of authorized bot logins on behalf of owner
 * @param {string} [options.repoRoot] - Optional repository root directory for reading files
 * @returns {{ success: boolean, touched: string[], message: string }}
 */
export function checkSupplyChainActor({
  changedFiles = [],
  author = '',
  owner = DEFAULT_OWNER,
  authorizedBots = DEFAULT_AUTHORIZED_BOTS,
  repoRoot = process.cwd(),
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

  const strictTouched = files.filter((f) => STRICT_OWNER_ONLY.some((rx) => rx.test(f)));
  const isOwner = normalizedAuthor && normalizedOwners.includes(normalizedAuthor);
  const isAuthorizedBot =
    normalizedAuthor &&
    (authorizedBots || []).map((b) => b.trim().toLowerCase()).includes(normalizedAuthor);

  if (strictTouched.length && !isOwner) {
    return {
      success: false,
      touched: strictTouched,
      message:
        `❌ dependency/config files touched by "${author}": ${strictTouched.join(', ')}. ` +
        'These files are owner-only for EVERY author including authorized bots (see PR #797). ' +
        'Dependency and config changes must be applied by the repo owner.',
    };
  }

  const gitleaksFiles = files.filter((f) => /^\.gitleaks/.test(f));
  if (gitleaksFiles.length && !isOwner) {
    if (!isAuthorizedBot) {
      return {
        success: false,
        touched: gitleaksFiles,
        message:
          `PR by "${author}" touches protected supply-chain files: ${gitleaksFiles.join(', ')}. ` +
          'Dependency overrides and CI workflow changes require a PR from the repo owner.',
      };
    }

    const nonConfigFile = gitleaksFiles.find((f) => f !== '.gitleaks.toml');
    if (nonConfigFile) {
      return {
        success: false,
        touched: [nonConfigFile],
        message: `❌ secret scanning config "${nonConfigFile}" touched by authorized bot "${author}" is strictly owner-only.`,
      };
    }

    const gitleaksPath = path.join(repoRoot, '.gitleaks.toml');
    let content = '';
    try {
      content = fs.readFileSync(gitleaksPath, 'utf8');
    } catch {
      return {
        success: false,
        touched: ['.gitleaks.toml'],
        message: `❌ unable to read .gitleaks.toml for validation at ${gitleaksPath}`,
      };
    }

    const validation = verifyGitleaksConfigExemptionsNotBroadened(content);
    if (!validation.valid) {
      return {
        success: false,
        touched: ['.gitleaks.toml'],
        message:
          `❌ .gitleaks.toml touched by authorized bot "${author}" violates exemption restrictions: ${validation.reason}. ` +
          'Secret scanning configurations may not broaden allowlists or wildcards.',
      };
    }
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
