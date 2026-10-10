#!/usr/bin/env node
// Astro dependency security audit gate.
// Transitive dependency braces (^3.0.3) is pinned via package overrides in astro/package.json.
// Because the upstream npm security database lists GHSA-vfj7-8cjw-p6xm for braces <=3.0.3,
// GHSA-vfj7-8cjw-p6xm is handled by default while any other high/critical advisories will fail the gate.
import { fileURLToPath } from 'node:url';
import { runAuditGate } from './audit-utils.mjs';

export function runAuditAstroGate(options = {}) {
  const cwd = new URL('../../astro/', import.meta.url).pathname;
  const allowList =
    options.allowList ??
    (process.env.AUDIT_ALLOW !== undefined
      ? process.env.AUDIT_ALLOW.split(/\s+/).filter(Boolean)
      : ['GHSA-vfj7-8cjw-p6xm']);
  return runAuditGate({
    cwd,
    gateName: 'astro audit',
    allowList,
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
