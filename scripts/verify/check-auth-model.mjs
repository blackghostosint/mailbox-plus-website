#!/usr/bin/env node
/**
 * check-auth-model — AGENTS.md rule 7 enforcement.
 * Fails if the PR diff touches netlify/functions/ but the PR body lacks an
 * "Endpoint Authentication Models" section with substantive content.
 *
 * Modes:
 *   CI:     Using PR context files or GITHUB_EVENT_PATH payload.
 *   Manual: node scripts/verify/check-auth-model.mjs <body-file> <changed-files.txt>
 *
 * Exit 0 = compliant / not applicable. Exit 1 = missing or hollow section.
 */
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';
import { getPRContext } from './pr-utils.mjs';

const HEADING = /#{2,4}\s*endpoint\s+authentication\s+models[^\n]*/i;
const MIN_SECTION_CHARS = 120; // heading + real content, not a bare word
const IGNORED_FUNCTIONS_PATTERNS = [
  /^netlify\/functions\/package(-lock)?\.json$/,
  /^netlify\/functions\/tsconfig\.json$/,
];

/**
 * Validates PR body for Endpoint Authentication Models section when netlify/functions/ are changed.
 * @param {Object} [params]
 * @param {string} [params.body]
 * @param {string[]} [params.changedFiles]
 */
export function checkAuthModel({ body = '', changedFiles = [] } = {}) {
  const functionFiles = changedFiles.filter(
    (f) =>
      f.startsWith('netlify/functions/') &&
      !IGNORED_FUNCTIONS_PATTERNS.some((pattern) => pattern.test(f))
  );
  const functionsTouched = functionFiles.length > 0;
  if (!functionsTouched) {
    return {
      success: true,
      functionsTouched: false,
      message: `check-auth-model: no netlify/functions/ changes (${changedFiles.length} files) — OK`,
    };
  }

  // Strip HTML comments BEFORE any section analysis: the PR template ships the
  // Endpoint Authentication Models guidance inside <!-- -->; counting commented
  // guidance would let an untouched template satisfy the gate. Only uncommented,
  // author-written text counts — including the heading itself.
  // SINGLE-PASS sanitizer (CodeQL incomplete-sanitization, js/html-injection):
  // one replace whose alternation consumes paired comments, an unclosed comment
  // opener through end-of-string, AND every bare angle bracket — so no '<!--' or
  // HTML fragment of any kind can survive into the result.
  const uncommented = body.replace(/<!--[\s\S]*?(?:-->|$)|[<>]/g, '');

  const m = uncommented.match(HEADING);
  if (!m) {
    return {
      success: false,
      functionsTouched: true,
      reason: 'missing_section',
      message:
        'PR touches netlify/functions/ but the body has no "Endpoint Authentication Models" section.',
    };
  }

  const section = uncommented.slice(m.index + m[0].length);
  // stop at the next heading of same-or-higher level
  const next = section.match(/\n#{1,3}\s/);
  const rawContent = next ? section.slice(0, next.index) : section;
  const content = rawContent.trim();

  if (content.length < MIN_SECTION_CHARS) {
    return {
      success: false,
      functionsTouched: true,
      reason: 'hollow_section',
      contentLength: content.length,
      sanitizedContent: content,
      message: `"Endpoint Authentication Models" section exists but is hollow (${content.length} chars, need ${MIN_SECTION_CHARS}). Open the PR body and fill the section with real content.`,
    };
  }

  return {
    success: true,
    functionsTouched: true,
    contentLength: content.length,
    sanitizedContent: content,
    message: `check-auth-model: auth model section present (${content.length} chars) — OK`,
  };
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  console.error(`   Add an "Endpoint Authentication Models" section to the PR body.`);
  console.error(`   For each endpoint: who may call it, how identity is proven, rate limit.`);
  console.error(`   See .github/pull_request_template.md and AGENTS.md rule 7.`);
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  const ctx = getPRContext();
  const result = checkAuthModel({ body: ctx.body, changedFiles: ctx.changedFiles });

  if (!result.success) {
    fail(result.message);
  } else {
    console.log(result.message);
    process.exit(0);
  }
}
