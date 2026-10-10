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
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getPRContext } from './pr-utils.mjs';

const HEADING = /#{2,4}\s*endpoint\s+authentication\s+models/i;
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

  const m = body.match(HEADING);
  if (!m) {
    return {
      success: false,
      functionsTouched: true,
      reason: 'missing_section',
      message:
        'PR touches netlify/functions/ but the body has no "Endpoint Authentication Models" section.',
    };
  }

  const section = body.slice(m.index + m[0].length);
  // stop at the next heading of same-or-higher level
  const next = section.match(/\n#{1,3}\s/);
  const rawContent = next ? section.slice(0, next.index) : section;
  // COMPLETE sanitization: strip every angle bracket from body-derived text in a
  // single pass, so no HTML fragment of any kind can survive into echoed strings.
  const content = rawContent.replace(/[<>]/g, '').trim();

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

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const ctx = getPRContext();
  const result = checkAuthModel({ body: ctx.body, changedFiles: ctx.changedFiles });

  if (!result.success) {
    fail(result.message);
  } else {
    console.log(result.message);
    process.exit(0);
  }
}
