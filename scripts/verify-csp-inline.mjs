// verify-csp-inline.mjs — postbuild guard (2026-10-21 incident).
// Astro islands rely on INLINE bootstrap scripts. If the CSP script-src hashes
// in netlify.toml drift from the built HTML (e.g. an Astro upgrade changes the
// bootstrap), every island silently stops hydrating — mobile hamburger, nav,
// and any React island die with no error surfaced to users.
// This fails the build when an inline script is not covered by the CSP.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';
import { walkFiles } from './lib/fs-traversal.ts';

export function verifyCspInline() {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const tomlPath = path.join(rootDir, 'netlify.toml');

  const toml = fs.readFileSync(tomlPath, 'utf8');
  const cspMatch = toml.match(/Content-Security-Policy\s*=\s*"""([\s\S]*?)"""/);
  if (!cspMatch) {
    console.error('❌ No Content-Security-Policy found in netlify.toml');
    process.exit(1);
  }
  const scriptSrc = cspMatch[1].match(/script-src([^;]*);/)?.[1] ?? '';
  const allowed = new Set([...scriptSrc.matchAll(/'sha256-([^']+)'/g)].map((m) => m[1]));

  const uncovered = new Map();
  let scanned = 0;
  for (const file of walkFiles(distDir, { extensions: ['.html'], ignoreDirs: [] })) {
    scanned++;
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
      const [, attrs, body] = m;
      if (!body.trim()) continue;
      if (/application\/ld\+json/.test(attrs)) continue; // data, never executed
      const hash = crypto.createHash('sha256').update(body).digest('base64');
      if (!allowed.has(hash)) {
        const rel = path.relative(distDir, file);
        if (!uncovered.has(hash))
          uncovered.set(hash, { count: 0, head: body.trim().slice(0, 70), files: [] });
        const u = uncovered.get(hash);
        u.count++;
        if (u.files.length < 3) u.files.push(rel);
      }
    }
  }

  if (uncovered.size > 0) {
    console.error(
      '❌ CSP inline-script coverage FAILED — these inline scripts are NOT allowed by the netlify.toml CSP:'
    );
    for (const [hash, { count, head, files }] of uncovered) {
      console.error(`   sha256-${hash} (${count} page(s)) e.g. ${files.join(', ')}`);
      console.error(`     head: ${head}`);
    }
    console.error(
      '\n   Astro islands will NOT hydrate on blocked pages (mobile hamburger/nav dies silently).'
    );
    console.error(
      '   Fix: compute sha256 of the new inline script(s) and add them to script-src in netlify.toml.'
    );
    process.exit(1);
  }

  console.log(
    `✅ CSP inline-script coverage OK (${scanned} pages, ${allowed.size} allowed hashes)`
  );
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  verifyCspInline();
}
