#!/usr/bin/env node
// Root dependency audit gate with scoped allowlist.
// Allows advisories named in AUDIT_ALLOW env (space-separated GHSA ids) or DEFAULT_ROOT_AUDIT_ALLOW.
// Any high or critical advisory NOT in the allowlist fails the gate.
import { fileURLToPath } from 'node:url';
import { evaluateAuditData, runAuditGate } from './audit-utils.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

export { evaluateAuditData };

export const DEFAULT_ROOT_AUDIT_ALLOW = [
  'GHSA-q3jh-wrc6-jgq8',
  'GHSA-8r9p-f939-6h3c',
  'GHSA-f88m-g3jw-g9cj',
  'GHSA-rgj7-g3m4-5g8c',
  'GHSA-wq5f-xc86-pv6w',
];

export function parseAllowList(allowInput) {
  if (!allowInput) return [];
  if (Array.isArray(allowInput)) {
    return allowInput
      .filter((id) => typeof id === 'string' && id.trim().length > 0)
      .map((id) => id.trim());
  }
  if (typeof allowInput === 'string') {
    return allowInput.trim().split(/\s+/).filter(Boolean);
  }
  return [];
}

export function runAuditRootGate(options = {}) {
  const cwd = fileURLToPath(new URL('../../', import.meta.url));
  const allowList =
    options.allowList !== undefined
      ? parseAllowList(options.allowList)
      : process.env.AUDIT_ALLOW !== undefined
        ? parseAllowList(process.env.AUDIT_ALLOW)
        : DEFAULT_ROOT_AUDIT_ALLOW;

  return runAuditGate({
    cwd,
    gateName: 'root audit',
    allowList,
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
