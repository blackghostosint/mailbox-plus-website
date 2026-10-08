#!/usr/bin/env node
// Astro dependency audit gate with scoped allowlist.
// GHSA-vfj7-8cjw-p6xm (braces <=3.0.3, stack-exhaustion DoS) has NO upstream fix
// (3.0.3 is the latest published version). Until braces 3.0.4 ships, allow ONLY
// advisories named in AUDIT_ALLOW env (space-separated GHSA ids). Any high
// advisory NOT in the allowlist fails the gate.
// TODO(2026-10): remove allowlist once braces 3.0.4 is published.
import { execSync } from 'node:child_process';

const ALLOW = (process.env.AUDIT_ALLOW || '').split(/\s+/).filter(Boolean);

let raw;
try {
  raw = execSync('npm audit --json --audit-level=high', {
    cwd: new URL('../../astro/', import.meta.url).pathname,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  });
} catch (e) {
  raw = e.stdout || '';
}

if (!raw || typeof raw !== 'string' || !raw.trim()) {
  console.error('❌ astro audit gate failed: empty stdout from npm audit');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error('❌ astro audit gate failed: unable to parse JSON output from npm audit');
  process.exit(1);
}

if (!data || typeof data !== 'object' || data.error) {
  console.error(
    '❌ astro audit gate failed: invalid audit payload or npm audit error (' +
      (data?.error?.summary || data?.error?.code || 'unknown') +
      ')'
  );
  process.exit(1);
}

if (!data.vulnerabilities || typeof data.vulnerabilities !== 'object') {
  console.error('❌ astro audit gate failed: missing vulnerabilities object');
  process.exit(1);
}

const offenders = [];
for (const [name, v] of Object.entries(data.vulnerabilities)) {
  if (v.severity !== 'high' && v.severity !== 'critical') continue;
  for (const a of v.via || []) {
    if (typeof a === 'object' && a?.url) {
      const id = a.url.split('/').pop();
      if (!ALLOW.includes(id)) offenders.push(`${id} (${name})`);
    }
  }
}

if (offenders.length) {
  console.error('❌ high advisories NOT in allowlist: ' + offenders.join(', '));
  process.exit(1);
}
console.log(
  '✅ astro audit: high advisories present are all in allowlist (' +
    (ALLOW.join(', ') || 'none') +
    ')'
);
