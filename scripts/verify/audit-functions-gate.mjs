#!/usr/bin/env node
// Netlify functions dependency audit gate with scoped allowlist.
// Allows advisories named in AUDIT_ALLOW env (space-separated GHSA ids).
// Any high advisory NOT in the allowlist fails the gate.
import { execSync } from 'node:child_process';

const ALLOW = (process.env.AUDIT_ALLOW || '').split(/\s+/).filter(Boolean);

let raw;
try {
  raw = execSync('npm audit --json --audit-level=high', {
    cwd: new URL('../../netlify/functions/', import.meta.url).pathname,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  });
} catch (e) {
  raw = e.stdout || '';
}

let data;
try {
  data = JSON.parse(raw);
} catch {
  data = { vulnerabilities: {} };
}

const offenders = [];
for (const [name, v] of Object.entries(data.vulnerabilities || {})) {
  if (v.severity !== 'high') continue;
  let hasAdvisoryUrl = false;
  for (const a of v.via || []) {
    if (typeof a === 'object' && a.url) {
      hasAdvisoryUrl = true;
      const id = a.url.split('/').pop();
      if (!ALLOW.includes(id)) {
        offenders.push(`${id} (${name})`);
      }
    }
  }
  if (!hasAdvisoryUrl && !ALLOW.includes(name)) {
    offenders.push(`${name}`);
  }
}

if (offenders.length) {
  console.error('❌ high advisories NOT in allowlist: ' + offenders.join(', '));
  process.exit(1);
}
console.log(
  '✅ netlify/functions audit: high advisories present are all in allowlist (' +
    (ALLOW.join(', ') || 'none') +
    ')'
);
