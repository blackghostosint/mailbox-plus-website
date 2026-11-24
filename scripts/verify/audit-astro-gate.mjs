#!/usr/bin/env node
// Astro dependency audit gate with scoped allowlist.
// GHSA-vfj7-8cjw-p6xm (braces <=3.0.3, stack-exhaustion DoS) has NO upstream fix
// (3.0.3 is the latest published version). Until braces 3.0.4 ships, allow ONLY
// advisories named in AUDIT_ALLOW env (space-separated GHSA ids). Any high
// advisory NOT in the allowlist fails the gate.
// TODO(2026-10): remove allowlist once braces 3.0.4 is published.
import { runAuditGate } from './audit-utils.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

export function runAuditAstroGate(options = {}) {
  const cwd = new URL('../../astro/', import.meta.url).pathname;
  return runAuditGate({
    cwd,
    gateName: 'astro audit',
    allowList: options.allowList,
    mockRaw: options.mockRaw,
  });
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  const res = runAuditAstroGate();
  if (!res.success) {
    process.exit(1);
  }
}
