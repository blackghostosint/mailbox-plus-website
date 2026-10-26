#!/usr/bin/env node
// Netlify functions dependency audit gate with scoped allowlist.
// Allows advisories named in AUDIT_ALLOW env (space-separated GHSA ids).
// Any high or critical advisory NOT in the allowlist fails the gate.
import { fileURLToPath } from 'node:url';
import { evaluateAuditData, runAuditGate } from './audit-utils.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

export { evaluateAuditData };

export function runAuditFunctionsGate(options = {}) {
  const cwd = new URL('../../netlify/functions/', import.meta.url).pathname;
  return runAuditGate({
    cwd,
    gateName: 'netlify/functions audit',
    allowList: options.allowList,
    mockRaw: options.mockRaw,
  });
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  const res = runAuditFunctionsGate();
  if (!res.success) {
    process.exit(1);
  }
}
