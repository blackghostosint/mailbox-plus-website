/**
 * Shared Source-of-Truth (`content/facts.json`) rule compiler and scanner.
 *
 * Used by both local preflight (`scripts/verify/check-source-of-truth.mjs`) and
 * CI article verification (`scripts/verify/claims-gate.js`) so regex compilation,
 * frontmatter stripping, and context guards never drift.
 */
import nodeFs from 'node:fs';
import nodePath from 'node:path';

export const NEGATION_PREFIX =
  /\b(?:no|not|never|don't|do not|cannot|can't|won't|will not|doesn't|does not|without|aren't|are not|isn't|is not|exclude[sd]?|unlike|instead of|stop saying)\b/i;

export function isNegatedBeforeMatch(line, matchIndex) {
  const windowStart = Math.max(0, matchIndex - 50);
  const before = line.slice(windowStart, matchIndex);
  // Stop at clause boundaries so an unrelated earlier negation (e.g. "no annual contract and 24/7 access")
  // cannot mask a violation in the next clause.
  const clauseParts = before.split(/[.,;—]|\s--\s|\b(?:and|but|or)\b/i);
  const currentClause = clauseParts[clauseParts.length - 1] || '';
  return NEGATION_PREFIX.test(currentClause);
}

export const KIRTLAND_CONTEXT =
  /\b(?:kirtland(?:\s+hills)?|chillicothe|baldwin\s+(?:rd|road)|holden\s+arboretum)\b/i;

export const BUSINESS_CONTEXT = /\b(?:business|llc|dba|commercial|company)\b/i;

export const CONTEXT_GUARDS = {
  none: null,
  negation: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
  kirtland_or_negation: (line, ctx) =>
    KIRTLAND_CONTEXT.test(line) || isNegatedBeforeMatch(line, ctx.matchIndex),
  business_context: (line, ctx) =>
    BUSINESS_CONTEXT.test(line) || BUSINESS_CONTEXT.test(ctx.heading || ''),
};

export function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function stripFrontmatter(text) {
  if (typeof text !== 'string' || !text.startsWith('---')) {
    return { body: String(text ?? ''), startLine: 1 };
  }
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!match) {
    // Handle empty frontmatter `---\n---` as well
    const emptyMatch = text.match(/^---\r?\n---(?:\r?\n|$)/);
    if (!emptyMatch) return { body: text, startLine: 1 };
    const prefixLines = emptyMatch[0].split(/\r?\n/);
    const startLine = emptyMatch[0].endsWith('\n') ? prefixLines.length : prefixLines.length;
    return { body: text.slice(emptyMatch[0].length), startLine };
  }
  const rawPrefix = match[0];
  // Count newlines consumed in prefix so line numbers in body map 1:1 to original file
  let newlineCount = 0;
  for (let i = 0; i < rawPrefix.length; i++) {
    if (rawPrefix[i] === '\n') newlineCount++;
  }
  return {
    body: text.slice(rawPrefix.length),
    startLine: 1 + newlineCount,
  };
}

/**
 * Compile `forbidden[]` entries from `content/facts.json` into executable rules.
 * @param {Array<Record<string, unknown>>} entries
 */
export function compileFactsRules(entries = []) {
  const list = Array.isArray(entries) ? entries : [];
  return list.map((entry, idx) => {
    const id = String(entry.id || `forbidden-${idx}`);
    const pattern = String(entry.pattern || '');
    const source = entry.regex ? String(entry.regex) : escapeRegExp(pattern);
    const re = new RegExp(source, 'gi');
    const defaultGuard = /306/i.test(pattern) ? 'kirtland_or_negation' : 'negation';
    const guardKey = String(entry.context || defaultGuard);
    const allowLine = Object.prototype.hasOwnProperty.call(CONTEXT_GUARDS, guardKey)
      ? CONTEXT_GUARDS[guardKey]
      : CONTEXT_GUARDS.negation;
    return {
      id,
      pattern,
      re,
      context: guardKey,
      allowLine,
      message: String(entry.reason || `Forbidden pattern "${pattern}"`),
    };
  });
}

/**
 * Read and parse `content/facts.json` from `root`.
 * @param {string} root
 * @param {{ fs?: typeof nodeFs, path?: typeof nodePath }} [deps]
 */
export function loadFactsJson(root, { fs = nodeFs, path = nodePath } = {}) {
  const factsPath = path.join(root, 'content', 'facts.json');
  if (typeof fs.existsSync === 'function' && !fs.existsSync(factsPath)) {
    throw new Error(`Missing canonical facts file: ${factsPath}`);
  }
  return JSON.parse(fs.readFileSync(factsPath, 'utf8'));
}

/**
 * Load and compile Source-of-Truth forbidden rules from `content/facts.json`.
 * @param {string} root
 * @param {{ fs?: typeof nodeFs, path?: typeof nodePath }} [deps]
 */
export function loadFactsRules(root, deps = {}) {
  const parsed = loadFactsJson(root, deps);
  return compileFactsRules(parsed?.forbidden);
}

/**
 * Scan text against compiled `content/facts.json` rules.
 * Strips YAML frontmatter when `filePath` is `.md` or `.mdx`.
 *
 * @param {string} filePath
 * @param {string} content
 * @param {ReturnType<typeof compileFactsRules>} rules
 */
export function scanTextForFactsViolations(filePath, content, rules) {
  const normalizedPath = String(filePath || '');
  const isMarkdown = normalizedPath.endsWith('.md') || normalizedPath.endsWith('.mdx');
  const { body, startLine } = isMarkdown
    ? stripFrontmatter(content)
    : { body: String(content ?? ''), startLine: 1 };
  const lines = body.split(/\r?\n/);
  const violations = [];
  let currentHeading = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isMarkdown && /^#{1,6}\s+/.test(line)) {
      currentHeading = line;
    }
    const lineNum = startLine + i;
    for (const rule of rules) {
      const flags = rule.re.flags.includes('g') ? rule.re.flags : `${rule.re.flags}g`;
      const lineRe = new RegExp(rule.re.source, flags);
      let m;
      while ((m = lineRe.exec(line)) !== null) {
        if (m[0].length === 0) {
          lineRe.lastIndex++;
          continue;
        }
        if (
          rule.allowLine &&
          rule.allowLine(line, {
            heading: currentHeading,
            filePath: normalizedPath,
            matchIndex: m.index,
          })
        ) {
          continue;
        }
        violations.push({
          file: normalizedPath,
          line: lineNum,
          ruleId: rule.id,
          pattern: rule.pattern,
          match: m[0],
          message: rule.message,
        });
        break;
      }
    }
  }
  return violations;
}
