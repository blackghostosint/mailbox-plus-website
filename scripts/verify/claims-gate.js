// ---------- claims:verify — Layer A deterministic claim-verification gate ----------
// Frank, 2026-09-15: article drafts produced wrong location/price claims because
// website copy and stale configs were treated as verification. This gate makes
// every load-bearing claim in an article traceable to its fact-check receipt row
// and cross-checks known-canonical facts against content/facts.json.
// Exported as a factory; verify.mjs calls runClaimsGate(slug, content, fcText, check, headStatus, SKIP_NETWORK, ROOT, DRAFTS_DIR).

const FACTS_PATH_REL = ['content', 'facts.json'];

export function makeClaimsGate(fs, path) {
  function loadFacts(ROOT) {
    try {
      return JSON.parse(fs.readFileSync(path.join(ROOT, ...FACTS_PATH_REL), 'utf8'));
    } catch {
      return null;
    }
  }

  function parseReceipt(fcText) {
    const rows = [];
    for (const line of fcText.split('\n')) {
      const m = line.match(/^\s*\|\s*\d+\s*\|(.*?)\|(.*?)\|(.*?)\|/);
      if (!m) continue;
      const claim = m[1].trim();
      const verdict = m[2].trim();
      let source = m[3].trim();
      const urlMatch = source.match(/https?:\/\/[^\s|)]+/);
      if (urlMatch) source = urlMatch[0];
      rows.push({ claim, verdict, source });
    }
    return rows;
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

    // ---- A1: canonical forbidden phrases ----
    const kirtlandRe = /kirtland|chillicothe|baldwin road|holden arboretum/i;
    let forbiddenHits = [];
    for (const f of facts.forbidden || []) {
      const re = new RegExp(f.pattern, 'gi');
      let m;
      while ((m = re.exec(content)) !== null) {
        const lineStart = content.lastIndexOf('\n', m.index) + 1;
        const lineEnd = content.indexOf('\n', m.index);
        const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
        if (/306/i.test(f.pattern) && kirtlandRe.test(line)) continue; // Kirtland-area exemption
        forbiddenHits.push({ pattern: f.pattern, reason: f.reason });
      }
    }
    check(
      'claims:forbidden-phrases',
      forbiddenHits.length === 0,
      forbiddenHits.length === 0
        ? 'no forbidden location/fact phrases'
        : forbiddenHits.map((h) => `"${h.pattern}": ${h.reason}`).join(' | '),
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
    const receiptRows = parseReceipt(fcText);
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

    // ---- A5: verdict column sanity ----
    const badVerdicts = receiptRows.filter(
      (r) => r.verdict && !/✅|⚠️|owner-verified/i.test(r.verdict)
    );
    check(
      'claims:verdicts',
      badVerdicts.length === 0,
      badVerdicts.length === 0
        ? `all ${receiptRows.length} receipt rows carry ✅/⚠️/owner-verified verdicts`
        : `rows without valid verdict: ${badVerdicts
            .slice(0, 2)
            .map((r) => r.claim.slice(0, 50))
            .join(' | ')}`,
      badVerdicts.length
        ? 'mark each receipt row ✅ (verified), ⚠️ (softened), or owner-verified'
        : undefined
    );
  }

  return { runClaimsGate };
}

// CLI entry: node claims-gate.js --slug <slug> --article <path.md> --root <repoRoot> --drafts <draftsDir> [--offline]
// Prints a JSON array of { name, pass, detail, fix } to stdout.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

if (process.argv[1] && process.argv[1].endsWith('claims-gate.js')) {
  const arg = (name) => {
    const i = process.argv.indexOf(name);
    return i === -1 ? undefined : process.argv[i + 1];
  };
  const slug = arg('--slug');
  const articlePath = arg('--article');
  const ROOT = arg('--root');
  const DRAFTS_DIR = arg('--drafts');
  const SKIP_NETWORK = process.argv.includes('--offline');

  const results = [];
  const check = (name, pass, detail, fix) => results.push({ name, pass: !!pass, detail, fix });
  const headStatus = (url) => {
    try {
      return execSync(`curl -sI -o /dev/null -w "%{http_code}" --max-time 10 "${url}"`)
        .toString()
        .trim();
    } catch {
      return 'ERR';
    }
  };

  const { runClaimsGate } = makeClaimsGate(fs, path);
  const content = fs.readFileSync(articlePath, 'utf8');
  const fcCandidates = [
    path.join(DRAFTS_DIR, `${slug}.factcheck.md`),
    path.join(path.dirname(articlePath), `${slug}.factcheck.md`),
  ];
  const fc = fcCandidates.find((f) => fs.existsSync(f));
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
