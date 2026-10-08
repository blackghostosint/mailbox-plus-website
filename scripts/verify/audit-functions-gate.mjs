#!/usr/bin/env node
// Netlify functions dependency audit gate with scoped allowlist.
// Allows advisories named in AUDIT_ALLOW env (space-separated GHSA ids).
// Any high or critical advisory NOT in the allowlist fails the gate.
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Evaluates parsed npm audit JSON data against an allowlist.
 * Throws an error if data is missing, malformed, or indicates an audit execution error.
 * @param {object} data - Parsed npm audit JSON payload.
 * @param {string[]} allowList - Array of allowed GHSA IDs.
 * @returns {string[]} Array of unhandled offender strings formatted as "ID (pkg)".
 */
export function evaluateAuditData(data, allowList = []) {
  if (!data || typeof data !== 'object') {
    throw new Error('Audit payload is invalid or empty');
  }
  if (data.error) {
    throw new Error(
      `npm audit execution error: ${data.error.summary || data.error.code || JSON.stringify(data.error)}`
    );
  }
  if (!data.vulnerabilities || typeof data.vulnerabilities !== 'object') {
    throw new Error('Audit payload missing vulnerabilities object');
  }

  const offenders = [];
  for (const [name, v] of Object.entries(data.vulnerabilities)) {
    if (v.severity !== 'high' && v.severity !== 'critical') continue;
    for (const a of v.via || []) {
      if (typeof a === 'object' && a?.url) {
        const id = a.url.split('/').pop();
        if (!allowList.includes(id)) {
          offenders.push(`${id} (${name})`);
        }
      }
    }
  }

  return offenders;
}

export function runAuditFunctionsGate(options = {}) {
  const allowList =
    options.allowList ?? (process.env.AUDIT_ALLOW || '').split(/\s+/).filter(Boolean);

  let raw;
  if (options.mockRaw !== undefined) {
    raw = options.mockRaw;
  } else if (process.env.AUDIT_MOCK_RAW !== undefined) {
    raw = process.env.AUDIT_MOCK_RAW;
  } else {
    try {
      raw = execSync('npm audit --json --audit-level=high', {
        cwd: new URL('../../netlify/functions/', import.meta.url).pathname,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 64,
      });
    } catch (e) {
      raw = e.stdout || '';
    }
  }

  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    console.error('❌ netlify/functions audit gate failed: empty stdout from npm audit');
    return { success: false, offenders: [], error: 'Empty audit output' };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(
      '❌ netlify/functions audit gate failed: unable to parse JSON output from npm audit'
    );
    return { success: false, offenders: [], error: err.message };
  }

  let offenders;
  try {
    offenders = evaluateAuditData(data, allowList);
  } catch (err) {
    console.error('❌ netlify/functions audit gate failed: ' + err.message);
    return { success: false, offenders: [], error: err.message };
  }

  if (offenders.length) {
    console.error('❌ high/critical advisories NOT in allowlist: ' + offenders.join(', '));
    return { success: false, offenders };
  }

  console.log(
    '✅ netlify/functions audit: high advisories present are all in allowlist (' +
      (allowList.join(', ') || 'none') +
      ')'
  );
  return { success: true, offenders: [] };
}

const isDirectCall = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectCall) {
  const res = runAuditFunctionsGate();
  if (!res.success) {
    process.exit(1);
  }
}
