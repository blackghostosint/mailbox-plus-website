#!/usr/bin/env node
/**
 * Shared npm audit utilities.
 * Handles npm audit JSON parsing, vulnerability evaluation, severity filtering, and allowlist checking.
 * Uses Node.js core modules only.
 */
import { execSync } from 'node:child_process';

/**
 * Parses and validates raw stdout string or object from npm audit --json.
 * @param {string|object} raw - Raw JSON stdout string or parsed object from npm audit.
 * @returns {object} Parsed audit payload object.
 */
export function parseAuditPayload(raw) {
  if (raw === null || raw === undefined || raw === '') {
    throw new Error('Audit payload is invalid or empty');
  }

  let data;
  if (typeof raw === 'object') {
    data = raw;
  } else if (typeof raw === 'string') {
    if (!raw.trim()) {
      throw new Error('Audit payload is invalid or empty');
    }
    try {
      data = JSON.parse(raw);
    } catch (err) {
      throw new Error(`unable to parse JSON output from npm audit`);
    }
  } else {
    throw new Error('Audit payload is invalid or empty');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Audit payload is invalid or empty');
  }

  if (data.error) {
    const errorMsg = data.error.summary || data.error.code || JSON.stringify(data.error);
    throw new Error(`npm audit execution error: ${errorMsg}`);
  }

  if (!data.vulnerabilities || typeof data.vulnerabilities !== 'object') {
    throw new Error('Audit payload missing vulnerabilities object');
  }

  return data;
}

/**
 * Evaluates parsed npm audit JSON data against an allowlist and target severities.
 * @param {object|string} data - Parsed npm audit JSON payload or raw string.
 * @param {string[]} [allowList=[]] - Array of allowed GHSA IDs.
 * @param {string[]} [severities=['high', 'critical']] - Severity levels to filter on.
 * @returns {string[]} Array of unhandled offender strings formatted as "ID (pkg)".
 */
export function evaluateAuditData(data, allowList = [], severities = ['high', 'critical']) {
  const parsed = parseAuditPayload(data);

  const offenders = [];
  for (const [name, v] of Object.entries(parsed.vulnerabilities || {})) {
    if (!severities.includes(v.severity)) continue;
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

/**
 * Runs an audit gate command or evaluates mock output.
 * @param {object} [options]
 * @param {string} [options.cwd] - Directory path to execute npm audit in.
 * @param {string[]} [options.allowList] - Array of allowed advisory IDs.
 * @param {string} [options.mockRaw] - Raw JSON stdout for testing.
 * @param {string} [options.gateName='audit'] - Label for log messages.
 * @returns {{ success: boolean, offenders: string[], error?: string }}
 */
export function runAuditGate(options = {}) {
  const gateName = options.gateName || 'audit';
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
        cwd: options.cwd,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 64,
      });
    } catch (e) {
      raw = e.stdout || '';
    }
  }

  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    console.error(`❌ ${gateName} gate failed: empty stdout from npm audit`);
    return { success: false, offenders: [], error: 'Empty audit output' };
  }

  let data;
  try {
    data = parseAuditPayload(raw);
  } catch (err) {
    console.error(`❌ ${gateName} gate failed: ${err.message}`);
    return { success: false, offenders: [], error: err.message };
  }

  const offenders = evaluateAuditData(data, allowList, options.severities);

  if (offenders.length) {
    console.error(`❌ high/critical advisories NOT in allowlist: ${offenders.join(', ')}`);
    return { success: false, offenders };
  }

  console.log(
    `✅ ${gateName}: high advisories present are all in allowlist (${allowList.join(', ') || 'none'})`
  );
  return { success: true, offenders: [] };
}
