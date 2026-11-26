// ---------- claims:verify — Layer A deterministic claim-verification gate ----------
// Frank, 2026-09-15: article drafts produced wrong location/price claims because
// website copy and stale configs were treated as verification. This gate makes
// every load-bearing claim in an article traceable to its fact-check receipt row
// and cross-checks known-canonical facts against content/facts.json.
// Exported as a factory; verify.mjs calls runClaimsGate(slug, content, fcText, check, headStatus, SKIP_NETWORK, ROOT, DRAFTS_DIR).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';
import { compileFactsRules, scanTextForFactsViolations } from './lib/facts-rules.mjs';
import { parseReceiptContent } from './lib/receipt-parser.mjs';
import { resolveFactcheckPath } from './lib/artifact-paths.mjs';

const FACTS_PATH_REL = ['content', 'facts.json'];

export function makeClaimsGate(fsDep, pathDep) {
  function loadFacts(ROOT) {
    try {
      return JSON.parse(fsDep.readFileSync(pathDep.join(ROOT, ...FACTS_PATH_REL), 'utf8'));
    } catch {
      return null;
    }
  }

  function extractClaims(body) {
    const claims = [];
    const patterns = [
      { kind: 'price', re: /\$\d+(?:\.\d{1,2})?/g },
      { kind: 'distance', re: /\b\d+(?:\.\d+)?\s*(?:miles?|mi)\b/gi },
      { kind: 'time', re: /\b\d+(?:-\d+)?\s*(?:minutes?|min|hours?|hr)\b/gi },
      { kind: 'stat', re: /\b\d{1,3}%\b/g },
    ];
    for (const { kind, re } of patterns) {
      let m;
      while ((m = re.exec(body)) !== null) {
        const start = body.lastIndexOf('.', m.index) + 1;
        const end = body.indexOf('.', m.index + m[0].length);
        claims.push({
          kind,
          text: m[0],
          context: body
            .slice(start, end === -1 ? undefined : end + 1)
            .trim()
            .slice(0, 200),
        });
      }
    }
    return claims;
  }

  function runClaimsGate(slug, content, fcText, check, headStatus, SKIP_NETWORK, ROOT, DRAFTS_DIR) {
    const facts = loadFacts(ROOT);
    if (!facts) {
      check(
        'claims:facts-json',
        false,
        'content/facts.json missing or unparseable',
        'restore content/facts.json (canonical store facts)'
      );
      return;
    }
    check('claims:facts-json', true, 'content/facts.json loaded');

    // ---- A1: canonical forbidden phrases (shared with check-source-of-truth.mjs) ----
    const forbiddenRules = compileFactsRules(facts.forbidden || []);
    const forbiddenHits = scanTextForFactsViolations(`${slug}.md`, content, forbiddenRules);
    check(
      'claims:forbidden-phrases',
      forbiddenHits.length === 0,
      forbiddenHits.length === 0
        ? 'no forbidden location/fact phrases'
        : forbiddenHits.map((h) => `"${h.pattern || h.match}": ${h.message}`).join(' | '),
      forbiddenHits.length
        ? 'replace with approved phrasing (see content/facts.json approved_phrasing)'
        : undefined
    );

    // ---- A2: canonical value contradictions (notary fee) ----
    const notaryFeeMentions =
      content.match(
        /notar(?:y|ization)[^.]*?\$\d+(?:\.\d{1,2})?|\$\d+(?:\.\d{1,2})?[^.]*?notar(?:y|ization)/gi
      ) || [];
    const badNotaryFees = notaryFeeMentions.filter((s) => !/\$5\b|\$?five dollars?/i.test(s));
    check(
      'claims:notary-fee',
      badNotaryFees.length === 0,
      badNotaryFees.length === 0
        ? notaryFeeMentions.length
          ? `notary fee mentions OK (${notaryFeeMentions.length})`
          : 'no notary fee mentioned'
        : `non-canonical notary fee: "${badNotaryFees[0].trim().slice(0, 120)}"`,
      badNotaryFees.length ? 'Ohio caps in-person notarial acts at $5 — fix the amount' : undefined
    );

    // ---- A3: every numeric claim must map to a receipt row ----
    if (!fcText) {
      check(
        'claims:receipt-coverage',
        false,
        'no fact-check receipt found',
        'run the Fact-Check Gate first (gates:factcheck)'
      );
      return;
    }
    const parsedReceipt = parseReceiptContent(fcText);
    const receiptRows = parsedReceipt.rows;
    const receiptBlob = receiptRows
      .map((r) => r.claim)
      .join(' || ')
      .toLowerCase();

    const claims = extractClaims(content);
    const whitelist = [
      /\b7554\b/,
      /\b44077\b/,
      /\b440[\s-]?709[\s-]?1946\b/,
      /\b9:00\b/,
      /\b6:00\b/,
      /\b2:00\b/,
      /\$1(?:\.00)?\b/,
      /\$5\b/,
      /\b90 seconds\b/i,
      /\bP-4\b/,
      /\bBCI\b/,
      /\bFBI\b/,
      /\bLive Scan\b/i,
      /\bRoute (2|20|44|84|6|608|91)\b/,
      /\bI-?90\b/,
      /\bSR-?44\b/,
      /\bSR-?2\b/,
    ];
    const unmatched = [];
    for (const c of claims) {
      if (whitelist.some((w) => w.test(c.text))) continue;
      const num = c.text.replace(/[^\d.]/g, '');
      const keyTokens = (c.context.toLowerCase().match(/[a-z]{4,}/g) || []).slice(0, 8);
      const matched = receiptBlob.includes(num) || keyTokens.some((t) => receiptBlob.includes(t));
      if (!matched) unmatched.push(c);
    }
    check(
      'claims:receipt-coverage',
      unmatched.length === 0,
      unmatched.length === 0
        ? `${claims.length} numeric claims all covered by receipt`
        : `uncovered claims: ${unmatched
            .slice(0, 3)
            .map((c) => `"${c.text}" (${c.context.slice(0, 60)}…)`)
            .join(' | ')}`,
      unmatched.length
        ? `add each claim to ${DRAFTS_DIR}/${slug}.factcheck.md with a source URL, or remove the claim`
        : undefined
    );

    // ---- A4: receipt source URLs resolve ----
    if (!SKIP_NETWORK) {
      const badSources = [];
      for (const r of receiptRows) {
        if (!/^https?:\/\//.test(r.source)) continue;
        const st = headStatus(r.source);
        if (!['200', '206', '301', '302', '403'].includes(st)) {
          badSources.push(`${r.source} → ${st}`);
        }
      }
      check(
        'claims:sources-resolve',
        badSources.length === 0,
        badSources.length === 0
          ? `${receiptRows.filter((r) => /^https?:\/\//.test(r.source)).length} source URLs resolve`
          : `unreachable sources: ${badSources.slice(0, 3).join(' | ')}`,
        badSources.length ? 'fix or replace dead source URLs in the factcheck receipt' : undefined
      );
    }

    // ---- A5: verdict column sanity (shared with preflight-verify-verdicts.mjs) ----
    if (receiptRows.length === 0) {
      check(
        'claims:verdicts',
        false,
        'no claim rows found in fact-check receipt',
        'add a Markdown table with Claim, Verdict (✅ / ⚠️ / owner-verified), and Source columns'
      );
    } else {
      const badVerdicts = receiptRows.filter((r) => !r.validVerdict);
      check(
        'claims:verdicts',
        badVerdicts.length === 0,
        badVerdicts.length === 0
          ? `all ${receiptRows.length} receipt rows carry ✅/⚠️/owner-verified verdicts`
          : `rows without valid verdict: ${badVerdicts
              .slice(0, 2)
              .map((r) => r.claim.slice(0, 50) || '(unnamed claim)')
              .join(' | ')}`,
        badVerdicts.length
          ? 'mark each receipt row ✅ (verified), ⚠️ (softened), or owner-verified'
          : undefined
      );
    }
  }

  return { runClaimsGate };
}

// CLI entry: node claims-gate.js --slug <slug> --article <path.md> --root <repoRoot> --drafts <draftsDir> [--offline]
// Prints a JSON array of { name, pass, detail, fix } to stdout.
if (isMainModule(import.meta.url)) {
  const { values } = parseScriptArgs({
    options: {
      slug: { type: 'string' },
      article: { type: 'string' },
      root: { type: 'string' },
      drafts: { type: 'string' },
      offline: { type: 'boolean', default: false },
    },
    strict: false,
  });

  const slug = values.slug;
  const articlePath = values.article;
  const ROOT = values.root;
  const DRAFTS_DIR = values.drafts;
  const SKIP_NETWORK = Boolean(values.offline);

  const results = [];
  const check = (name, pass, detail, fix) => results.push({ name, pass: !!pass, detail, fix });
  const headStatus = (url) => {
    try {
      return execFileSync('curl', [
        '-sI',
        '-o',
        '/dev/null',
        '-w',
        '%{http_code}',
        '--max-time',
        '25',
        url,
      ])
        .toString()
        .trim();
    } catch {
      return 'ERR';
    }
  };

  const { runClaimsGate } = makeClaimsGate(fs, path);
  const content = fs.readFileSync(articlePath, 'utf8');
  const fc = resolveFactcheckPath(
    { slug, draftsDir: DRAFTS_DIR, articlePath, root: ROOT },
    { fs, path }
  );
  runClaimsGate(
    slug,
    content,
    fc ? fs.readFileSync(fc, 'utf8') : null,
    check,
    headStatus,
    SKIP_NETWORK,
    ROOT,
    DRAFTS_DIR
  );
  console.log(JSON.stringify(results, null, 0));
}
