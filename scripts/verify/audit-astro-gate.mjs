#!/usr/bin/env node
// Astro dependency audit gate with scoped allowlist.
// GHSA-vfj7-8cjw-p6xm (braces <=3.0.3, stack-exhaustion DoS) has NO upstream fix
// (3.0.3 is the latest published version). Until braces 3.0.4 ships, allow ONLY
// advisories named in AUDIT_ALLOW env (space-separated GHSA ids). Any high
// advisory NOT in the allowlist fails the gate.
// TODO(2026-10): remove allowlist once braces 3.0.4 is published.
import { fileURLToPath } from 'node:url';
import { parseAuditPayload, runAuditGate } from './audit-utils.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

/**
 * Parses space-separated string or array into array of allowed GHSA IDs.
 * @param {string|string[]} [allowInput]
 * @returns {string[]}
 */
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

/**
 * Parses and validates raw stdout string or object from npm audit --json.
 * @param {string|object} raw
 * @returns {object}
 */
export function parseAuditReport(raw) {
  return parseAuditPayload(raw);
}

/**
 * Evaluates parsed audit report data against an allowlist and target severities.
 * @param {object|string} data - Parsed npm audit JSON payload or raw string.
 * @param {string[]|string} [allowInput=[]] - Array or string of allowed GHSA IDs.
 * @param {string[]} [severities=['high', 'critical']] - Severity levels to filter on.
 * @returns {string[]} Array of unhandled offender strings formatted as "ID (pkg)".
 */
export function evaluateAuditVulnerabilities(
  data,
  allowInput = [],
  severities = ['high', 'critical']
) {
  const parsed = parseAuditReport(data);
  const allowList = parseAllowList(allowInput);

  const offenders = [];
  const vulnerabilities = parsed.vulnerabilities || {};

  for (const [name, v] of Object.entries(vulnerabilities)) {
    if (!v || typeof v !== 'object') continue;
    if (!severities.includes(v.severity)) continue;

    const viaList = Array.isArray(v.via) ? v.via : [];
    for (const a of viaList) {
      if (a && typeof a === 'object' && typeof a.url === 'string') {
        const id = a.url.split('/').pop();
        if (id && !allowList.includes(id)) {
          offenders.push(`${id} (${name})`);
        }
      }
    }
  }

  return offenders;
}

export function runAuditAstroGate(options = {}) {
  const cwd = fileURLToPath(new URL('../../astro/', import.meta.url));
  const allowList =
    options.allowList !== undefined
      ? parseAllowList(options.allowList)
      : parseAllowList(process.env.AUDIT_ALLOW);

  return runAuditGate({
    cwd,
    gateName: 'astro audit',
    allowList,
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
