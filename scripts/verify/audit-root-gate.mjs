#!/usr/bin/env node
// Root dependency audit gate with scoped allowlist.
// Mirrors audit-astro-gate.mjs (same evaluateAuditVulnerabilities engine).
// GHSA-fc5q-39xc-vjpf (picomatch <=4.0.7, ReDoS via single-branch repeated
// extglobs) has NO upstream fix — 4.0.7 is the latest published version.
// Risk context: picomatch runs at BUILD time matching glob patterns authored in
// this repo; no untrusted input reaches it, so exploitation requires repo write
// access. Until a patched picomatch ships, allow ONLY advisories named in the
// AUDIT_ALLOW env (space-separated GHSA ids). Any OTHER high/critical advisory
// fails the gate. Scoped allowlist — removal TODO once picomatch >=4.0.8 ships.
// TODO(2026-11): remove GHSA-fc5q-39xc-vjpf from the allowlist when the patched
// version is published and the lockfile picks it up.
import { runAuditGate } from './audit-utils.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';
import { parseAllowList } from './audit-astro-gate.mjs';

export function runAuditRootGate(options = {}) {
  const cwd = new URL('../../', import.meta.url).pathname;
  const allowList =
    options.allowList !== undefined
      ? parseAllowList(options.allowList)
      : parseAllowList(process.env.AUDIT_ALLOW);

  return runAuditGate({
    cwd,
    gateName: 'root audit',
    allowList,
    // Match the CI root audit step exactly: prod-only, root workspace excluded
    // (workspaces are audited by their own gates — astro by audit-astro-gate).
    npmArgs: ['audit', '--json', '--audit-level=high', '--omit=dev', '--workspaces=false'],
    mockRaw: options.mockRaw,
  });
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  const res = runAuditRootGate();
  if (!res.success) {
    process.exit(1);
  }
}
