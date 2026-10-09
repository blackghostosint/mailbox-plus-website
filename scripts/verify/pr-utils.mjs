#!/usr/bin/env node
/**
 * Shared Pull Request metadata utilities.
 * Handles event payload extraction, author resolution, PR body reading, and changed file parsing.
 * Uses Node.js core modules only.
 */
import { readFileSync, existsSync } from 'node:fs';

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
 * @returns {{ body: string, changedFiles: string[], author: string, isLocal: boolean, isCi: boolean, prNumber: string|number|null }}
 */
export function getPRContext(options = {}) {
  const args = options.args || process.argv;
  const env = options.env || process.env;

  const { author: cliAuthor, isLocalBypass, positional } = parsePRCliArgs(args);

  const bodySource = options.bodyFile ?? positional[0] ?? env.PR_BODY_FILE;
  const filesSource = options.filesFile ?? positional[1] ?? env.PR_FILES_FILE ?? env.CHANGED_FILES;

  const body = readPRBody(bodySource, env);
  const changedFiles = readFilesList(filesSource);
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
