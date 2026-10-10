#!/usr/bin/env node
// Astro dependency audit gate with scoped allowlist.
// GHSA-vfj7-8cjw-p6xm (braces <=3.0.3, stack-exhaustion DoS) has NO upstream fix
// (3.0.3 is the latest published version). Until braces 3.0.4 ships, allow ONLY
// advisories named in AUDIT_ALLOW env (space-separated GHSA ids). Any high
// advisory NOT in the allowlist fails the gate.
// TODO(2026-10): remove allowlist once braces 3.0.4 is published.
import { fileURLToPath } from 'node:url';
import { evaluateAuditData, runAuditGate } from './audit-utils.mjs';

export { evaluateAuditData };

export function runAuditAstroGate(options = {}) {
  const cwd = new URL('../../astro/', import.meta.url).pathname;
  return runAuditGate({
    cwd,
    gateName: 'astro audit',
    allowList: options.allowList,
    mockRaw: options.mockRaw,
  });
}

const isDirectCall = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectCall) {
  const res = runAuditAstroGate();
  if (!res.success) {
    process.exit(1);
  }
}
