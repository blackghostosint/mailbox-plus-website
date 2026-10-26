#!/usr/bin/env node
/**
 * check-auth-model — local pre-flight helper for AGENTS.md Rule 7 enforcement.
 * Delegates directly to scripts/verify/check-auth-model.mjs.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkAuthModel } from './verify/check-auth-model.mjs';
import { getPRContext } from './verify/pr-utils.mjs';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';

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

export { checkAuthModel };
