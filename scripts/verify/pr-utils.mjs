#!/usr/bin/env node
/**
 * Shared Pull Request metadata utilities.
 * Handles event payload extraction, author resolution, PR body reading, and changed file parsing.
 * Uses Node.js core modules only.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/**
 * Auto-detects changed files in the local git repository (branch diff and working tree).
 * @param {string} [root=process.cwd()]
 * @returns {string[]}
 */
export function detectLocalChangedFiles(root = process.cwd()) {
  const filesSet = new Set();

  const baseRefs = ['origin/main...HEAD', 'main...HEAD', 'HEAD~1'];
  for (const ref of baseRefs) {
    try {
      const stdout = execFileSync('git', ['diff', '--name-only', ref], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      const files = stdout
        .split(/\r?\n/)
        .map((f) => f.trim())
        .filter(Boolean);
      for (const f of files) filesSet.add(f);
      if (files.length > 0) break;
    } catch {
      // ignore
    }
  }

  try {
    const stdout = execFileSync('git', ['diff', '--name-only', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const files = stdout
      .split(/\r?\n/)
      .map((f) => f.trim())
      .filter(Boolean);
    for (const f of files) filesSet.add(f);
  } catch {
    // ignore
  }

  try {
    const stdout = execFileSync('git', ['status', '--porcelain'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const lines = stdout.split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const filePart = line.slice(3).trim();
      const p = filePart.includes('->') ? filePart.split('->').pop().trim() : filePart;
      if (p) filesSet.add(p);
    }
  } catch {
    // ignore
  }

  return Array.from(filesSet);
}

/**
 * Auto-detects local PR description body file.
 * @param {string} [root=process.cwd()]
 * @param {object} [env=process.env]
 * @returns {string|null}
 */
export function detectLocalBodyFile(root = process.cwd(), env = process.env) {
  const candidates = [
    env.PR_BODY_FILE,
    path.join(root, '.pr-body.md'),
    path.join(root, 'pr-body.md'),
    path.join(root, '.github', 'PULL_REQUEST_BODY.md'),
    path.join(root, '.github', 'pull_request_body.md'),
    path.join(env.HOME || '', '.hermes', 'cache', 'scratch', 'pr-body.md'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Reads and parses a list of changed files from an array, file path, stdin ('-'), or multiline string.
 * @param {string|string[]} [source]
 * @returns {string[]}
 */
export function readFilesList(source) {
  if (Array.isArray(source)) {
    return source.map((f) => String(f).trim()).filter(Boolean);
  }
  if (!source || typeof source !== 'string') {
    return [];
  }

  let content = '';
  const trimmedSource = source.trim();

  if (trimmedSource === '-') {
    try {
      content = readFileSync(0, 'utf8');
    } catch {
      content = '';
    }
  } else if (existsSync(trimmedSource)) {
    try {
      content = readFileSync(trimmedSource, 'utf8');
    } catch {
      content = '';
    }
  } else {
    content = source;
  }

  return content
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);
}

/**
 * Reads PR body content from a string, file path, or event payload.
 * @param {string} [source]
 * @param {object} [env=process.env]
 * @returns {string}
 */
export function readPRBody(source, env = process.env) {
  if (typeof source === 'string' && source.trim()) {
    const trimmed = source.trim();
    if (existsSync(trimmed)) {
      try {
        return readFileSync(trimmed, 'utf8');
      } catch {
        return '';
      }
    }
    return source;
  }

  if (env.PR_BODY_FILE && existsSync(env.PR_BODY_FILE)) {
    try {
      return readFileSync(env.PR_BODY_FILE, 'utf8');
    } catch {
      // ignore
    }
  }

  if (env.PR_BODY) {
    return env.PR_BODY;
  }

  if (env.GITHUB_EVENT_PATH && existsSync(env.GITHUB_EVENT_PATH)) {
    try {
      const ev = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
      if (ev?.pull_request?.body != null) {
        return String(ev.pull_request.body);
      }
    } catch {
      // ignore parse error
    }
  }

  // Fallback for local execution when no explicit source or env vars are provided
  const localCandidates = [
    '.prbody.md',
    '.pr-body.md',
    'pr-body.md',
    'prbody.md',
    '.github/PULL_REQUEST_BODY.md',
    '.github/pull_request_body.md',
  ];
  for (const candidate of localCandidates) {
    if (existsSync(candidate)) {
      try {
        const content = readFileSync(candidate, 'utf8');
        if (content.trim()) return content;
      } catch {
        // ignore
      }
    }
  }

  try {
    const gitLogBody = execSync('git log -1 --pretty=%B', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (gitLogBody && gitLogBody.trim()) {
      return gitLogBody;
    }
  } catch {
    // ignore
  }

  return '';
}

/**
 * Resolves PR author login username.
 * @param {string} [cliAuthor]
 * @param {object} [env=process.env]
 * @returns {string}
 */
export function resolveAuthor(cliAuthor = '', env = process.env) {
  if (cliAuthor && typeof cliAuthor === 'string') {
    return cliAuthor.trim();
  }
  if (env.PR_AUTHOR && typeof env.PR_AUTHOR === 'string') {
    return env.PR_AUTHOR.trim();
  }
  if (env.GITHUB_EVENT_PATH && existsSync(env.GITHUB_EVENT_PATH)) {
    try {
      const ev = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
      if (ev?.pull_request?.user?.login) {
        return String(ev.pull_request.user.login).trim();
      }
    } catch {
      // ignore
    }
  }
  return '';
}

/**
 * Parses CLI positional and flag arguments for PR scripts.
 * @param {string[]} [args=process.argv]
 * @returns {{ author: string, isLocalBypass: boolean, positional: string[] }}
 */
export function parsePRCliArgs(args = process.argv) {
  let author = '';
  let isLocalBypass = false;
  const positional = [];

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg !== 'string') continue;
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

/**
 * Loads unified PR context from CLI arguments and environment variables.
 * @param {object} [options]
 * @param {string[]} [options.args=process.argv]
 * @param {object} [options.env=process.env]
 * @param {string} [options.root=process.cwd()]
 * @param {string} [options.bodyFile]
 * @param {string|string[]} [options.filesFile]
 * @param {string} [options.author]
 * @param {boolean} [options.isLocal]
 * @returns {{ body: string, changedFiles: string[], author: string, isLocal: boolean, isCi: boolean, prNumber: string|number|null }}
 */
export function getPRContext(options = {}) {
  const args = options.args || process.argv;
  const env = options.env || process.env;
  const root = options.root || process.cwd();

  const { author: cliAuthor, isLocalBypass, positional } = parsePRCliArgs(args);

  const rawBodySource = options.bodyFile ?? positional[0] ?? env.PR_BODY_FILE;
  const rawFilesSource =
    options.filesFile ?? positional[1] ?? env.PR_FILES_FILE ?? env.CHANGED_FILES;

  let bodySource = rawBodySource;
  if (!bodySource) {
    const detectedBodyFile = detectLocalBodyFile(root, env);
    if (detectedBodyFile) {
      bodySource = detectedBodyFile;
    }
  }

  let changedFiles = readFilesList(rawFilesSource);
  if (changedFiles.length === 0 && !rawFilesSource) {
    changedFiles = detectLocalChangedFiles(root);
  }

  const body = readPRBody(bodySource, env);
  const author = resolveAuthor(cliAuthor || options.author, env);

  const isCi = Boolean(env.CI || env.GITHUB_ACTIONS || env.GITHUB_EVENT_PATH);
  const isLocal = Boolean(options.isLocal || isLocalBypass || (!author && !isCi));

  let prNumber = env.PR_NUMBER || null;
  if (!prNumber && env.GITHUB_EVENT_PATH && existsSync(env.GITHUB_EVENT_PATH)) {
    try {
      const ev = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
      if (ev?.pull_request?.number) {
        prNumber = ev.pull_request.number;
      }
    } catch {
      // ignore
    }
  }

  return {
    body,
    changedFiles,
    author,
    isLocal,
    isCi,
    prNumber,
  };
}
