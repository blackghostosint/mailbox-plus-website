#!/usr/bin/env node
/**
 * SEO STATIC REDIRECTS INTEGRITY CHECK
 * =====================================
 * Validates Netlify static redirects in public/_redirects:
 *
 *  1. CATCH-ALL PLACEMENT — Ensures wildcard catch-all rules (/* -> /404.html)
 *     sit at the bottom of the file so they do not shadow explicit rules.
 *  2. RULE SHADOWING — Detects explicit or subpath rules that are placed below
 *     prefix wildcard rules or earlier matching rules.
 *  3. CIRCULAR LOOPS — Traces redirect paths top-to-bottom to catch direct or
 *     multi-hop redirect loops.
 *
 * Usage: node scripts/seo/check-redirects.mjs
 * Exit code 0 = pass, 1 = fail.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
export const DEFAULT_REDIRECTS_PATH = path.join(ROOT_DIR, 'public/_redirects');

/**
 * Determines whether a pattern is a site-wide wildcard catch-all.
 */
export function isCatchAllRule(fromPattern) {
  return fromPattern === '/*' || fromPattern === '/*/';
}

/**
 * Parses raw _redirects content into structured rule objects.
 */
export function parseRedirects(content) {
  const lines = content.split(/\r?\n/);
  const rules = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return;

    const from = parts[0];
    const to = parts[1];
    const rawStatus = parts[2] || '301';
    const isForced = rawStatus.endsWith('!');
    const status = rawStatus.replace(/!$/, '');

    rules.push({
      lineNum: idx + 1,
      from,
      to,
      status,
      isForced,
      rawStatus,
      raw: trimmed,
    });
  });

  return rules;
}

/**
 * Converts a Netlify _redirects "from" pattern into a Regular Expression.
 */
export function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp('^' + escaped + '$');
}

/**
 * Generates a representative sample path for testing wildcard pattern matches.
 */
export function getSamplePath(fromPattern) {
  if (fromPattern.endsWith('*')) {
    return fromPattern.slice(0, -1) + 'sample-subpath';
  }
  if (fromPattern.includes('*')) {
    return fromPattern.replace(/\*/g, 'sample-subpath');
  }
  return fromPattern;
}

/**
 * Verifies that no wildcard catch-all (/*) sits above explicit rules.
 */
export function checkCatchAllPlacement(rules) {
  const errors = [];
  let catchAllRule = null;

  for (const rule of rules) {
    if (isCatchAllRule(rule.from)) {
      if (!catchAllRule) {
        catchAllRule = rule;
      }
    } else if (catchAllRule) {
      errors.push(
        `Rule at line ${rule.lineNum} ("${rule.from}") sits below wildcard catch-all at line ${catchAllRule.lineNum} ("${catchAllRule.from}")`
      );
    }
  }

  return errors;
}

/**
 * Detects rules that are shadowed by earlier matching rules or prefix wildcards.
 */
export function checkShadowedRules(rules) {
  const errors = [];

  for (let i = 0; i < rules.length; i++) {
    const ruleB = rules[i];
    // Domain rules start with http:// or https:// - skip checking against relative path rules
    if (ruleB.from.startsWith('http://') || ruleB.from.startsWith('https://')) {
      continue;
    }

    const samplePathB = getSamplePath(ruleB.from);

    for (let j = 0; j < i; j++) {
      const ruleA = rules[j];
      if (ruleA.from.startsWith('http://') || ruleA.from.startsWith('https://')) {
        continue;
      }

      const regexA = patternToRegex(ruleA.from);
      if (regexA.test(samplePathB)) {
        errors.push(
          `Rule at line ${ruleB.lineNum} ("${ruleB.from}") is shadowed by earlier rule at line ${ruleA.lineNum} ("${ruleA.from}")`
        );
        break;
      }
    }
  }

  return errors;
}

/**
 * Resolves the next target path for a given path against Netlify rules (first-match wins).
 */
export function resolveNext(currentPath, rules) {
  for (const rule of rules) {
    if (rule.from.startsWith('http://') || rule.from.startsWith('https://')) {
      continue;
    }

    const pattern = rule.from;
    const target = rule.to;

    if (pattern === currentPath) {
      return { target, rule };
    }

    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (currentPath.startsWith(prefix)) {
        const splat = currentPath.slice(prefix.length);
        const resolvedTarget = target.includes(':splat') ? target.replace(':splat', splat) : target;
        return { target: resolvedTarget, rule };
      }
    }
  }
  return null;
}

/**
 * Detects circular redirect loops in the rule set.
 */
export function checkCircularLoops(rules) {
  const errors = [];
  const checkedStarts = new Set();

  for (const rule of rules) {
    if (rule.from.startsWith('http://') || rule.from.startsWith('https://')) {
      continue;
    }

    const startPath = getSamplePath(rule.from);
    if (checkedStarts.has(startPath)) continue;
    checkedStarts.add(startPath);

    const visited = new Set();
    const chain = [];

    let curr = startPath;
    visited.add(curr);
    chain.push(curr);

    while (true) {
      const nextMatch = resolveNext(curr, rules);
      if (!nextMatch) break;

      const { target, rule: matchedRule } = nextMatch;

      // Stop tracing if target rule is a non-redirect (e.g. 404 or 200)
      if (matchedRule.status === '404' || matchedRule.status === '200') {
        break;
      }

      const targetPath = getSamplePath(target);

      if (visited.has(targetPath)) {
        chain.push(targetPath);
        errors.push(
          `Circular redirect loop detected starting at line ${rule.lineNum} ("${startPath}"): ${chain.join(' -> ')}`
        );
        break;
      }

      if (chain.length > 25) {
        errors.push(
          `Redirect chain length exceeded 25 hops starting at line ${rule.lineNum} ("${startPath}"): ${chain.join(' -> ')}`
        );
        break;
      }

      visited.add(targetPath);
      chain.push(targetPath);
      curr = targetPath;
    }
  }

  return errors;
}

/**
 * Audits raw _redirects content.
 */
export function auditRedirects(content) {
  const rules = parseRedirects(content);
  const catchAllErrors = checkCatchAllPlacement(rules);
  const shadowedErrors = checkShadowedRules(rules);
  const loopErrors = checkCircularLoops(rules);

  const errors = [...catchAllErrors, ...shadowedErrors, ...loopErrors];

  return {
    success: errors.length === 0,
    rulesCount: rules.length,
    errors,
    catchAllErrors,
    shadowedErrors,
    loopErrors,
  };
}

/**
 * Audits a _redirects file on disk.
 */
export function checkRedirectsFile(filePath = DEFAULT_REDIRECTS_PATH) {
  console.log('==================================================');
  console.log('    SEO STATIC REDIRECTS INTEGRITY CHECK          ');
  console.log('==================================================\n');

  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ FAIL: Redirects file not found at "${relPath}"\n`);
    return {
      success: false,
      rulesCount: 0,
      errors: [`Redirects file not found at "${relPath}"`],
      catchAllErrors: [],
      shadowedErrors: [],
      loopErrors: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const result = auditRedirects(content);

  console.log(`ℹ️ Audited ${result.rulesCount} redirect rules from "${relPath}"`);

  if (result.success) {
    console.log('✅ OK: All redirect rules are properly ordered, unshadowed, and non-circular.');
    console.log('\n🎉 SEO static redirects check PASSED successfully!');
    console.log('==================================================\n');
  } else {
    console.error(`\n❌ FAIL: Found ${result.errors.length} redirect validation error(s):\n`);
    for (const err of result.errors) {
      console.error(`   - ${err}`);
    }
    console.log('\n==================================================\n');
  }

  return result;
}

export function main() {
  const result = checkRedirectsFile();
  if (!result.success) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
