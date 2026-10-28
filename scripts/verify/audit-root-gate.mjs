#!/usr/bin/env node
// Root dependency audit gate with scoped allowlist.
// Allows advisories named in AUDIT_ALLOW env (space-separated GHSA ids).
// Any high or critical advisory NOT in the allowlist fails the gate.
import { evaluateAuditData, runAuditGate } from './audit-utils.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

export { evaluateAuditData };

export function runAuditRootGate(options = {}) {
  const cwd = new URL('../../', import.meta.url).pathname;
  return runAuditGate({
    cwd,
    gateName: 'root audit',
    allowList: options.allowList,
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
