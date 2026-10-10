import { describe, it, expect, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// End-to-end guard for the content/drafts/ receipt fallback, driven against the REAL repo
// tree (verify.mjs anchors on its own __dirname and skips anything outside the real
// content/articles/, so a temp-dir fixture would be skipped, not verified — the harness
// can't be faked, only the real scenario can).
//
// The bot historically wrote fact-check receipts to content/drafts/ while CI sets
// ARTICLE_DRAFTS_DIR=.factchecks/ — so gates:factcheck + claims:receipt-coverage hard-failed
// on article PRs whose receipt demonstrably existed in-repo (recurring manual fix, 5+ PRs,
// most recently PR 693). The gates now fall back to content/drafts/ as a last resort. This
// pins BOTH sides: a drafts-only receipt must satisfy the receipt gates, and a genuinely
// missing receipt must STILL FAIL (the fallback must not mask a missing receipt).
//
// Assertions target the RECEIPT gates only (gates:factcheck, claims:receipt-coverage,
// claims:verdicts). A canary article intentionally fails OTHER gates (image:body, etc.) —
// those are irrelevant to this fix and must not gate the test.

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, '..', '..', '..');
const VERIFY_CLI = path.join(REPO_ROOT, 'scripts', 'verify', 'verify.mjs');

// A slug guaranteed not to exist in the real repo, so the test owns every file it touches.
const SLUG = 'zz-fallback-canary-slug';
const ARTICLE_REL = path.join('content', 'articles', 'pack-ship', `${SLUG}.md`);
const ARTICLE_ABS = path.join(REPO_ROOT, ARTICLE_REL);
const DRAFTS_ABS = path.join(REPO_ROOT, 'content', 'drafts', `${SLUG}.factcheck.md`);
const FACTCHECKS_ABS = path.join(REPO_ROOT, '.factchecks', `${SLUG}.factcheck.md`);

// >200 bytes so the stub-size threshold in gates:factcheck doesn't fail it for the wrong reason.
const RECEIPT = [
  '| Row | Claim | Verdict | Source |',
  '|---|---|---|---|',
  '| 1 | Ground Advantage takes 10 days to reach Alaska | ✅ | https://example.com/ga |',
  '| 2 | Priority Mail stretches to 2-4 days | ⚠️ | https://example.com/pm |',
  '| 3 | Sub-pound parcels now move by surface | owner-verified | https://example.com/surface |',
  '',
  'End-to-end canary receipt for the content/drafts/ fallback regression test.',
].join('\n');

const ARTICLE_BODY = [
  '---',
  'title: Canary',
  'description: Canary',
  `slug: ${SLUG}`,
  'category: pack-ship',
  'intentKey: canary',
  'pubDate: 2026-01-01',
  'status: published',
  'image: /canary.webp',
  'imageAlt: canary',
  'keywords: [canary]',
  'relatedServices: []',
  'author: test',
  '---',
  '',
  'Ground Advantage takes 10 days to reach Alaska. Priority Mail stretches to 2-4 days.',
  '',
].join('\n');

function ensureArticle() {
  mkdirSync(path.dirname(ARTICLE_ABS), { recursive: true });
  writeFileSync(ARTICLE_ABS, ARTICLE_BODY, 'utf8');
}

function runVerify(): string {
  try {
    return execFileSync(
      process.execPath,
      ['--import', 'tsx', VERIFY_CLI, 'article', ARTICLE_REL, '--strict', '--offline'],
      {
        encoding: 'utf8',
        cwd: REPO_ROOT,
        // CI's env: ARTICLE_DRAFTS_DIR points at .factchecks/, NOT content/drafts/.
        env: { ...process.env, ARTICLE_DRAFTS_DIR: path.join(REPO_ROOT, '.factchecks') },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
  } catch (e: any) {
    // Non-zero exit still carries the gate lines on stdout; receipts may pass while other
    // gates (image:body) fail. We assert on the receipt gate lines, not the exit code.
    return String(e.stdout || '') + String(e.stderr || '');
  }
}

afterAll(() => {
  for (const f of [ARTICLE_ABS, DRAFTS_ABS, FACTCHECKS_ABS]) {
    if (existsSync(f)) rmSync(f, { force: true });
  }
});

// Between-test hygiene: the receipt stores are shared real-repo paths, so test 2's
// "no receipt anywhere" precondition only holds if test 1's files are removed first.
function cleanupReceipts() {
  for (const f of [DRAFTS_ABS, FACTCHECKS_ABS]) {
    if (existsSync(f)) rmSync(f, { force: true });
  }
}

describe('gates:factcheck content/drafts fallback (PR 693 regression)', () => {
  it('satisfies the receipt gates when the receipt exists only in content/drafts/', () => {
    cleanupReceipts();
    ensureArticle();
    writeFileSync(DRAFTS_ABS, RECEIPT, 'utf8');
    expect(existsSync(FACTCHECKS_ABS)).toBe(false); // drafts-only: no .factchecks copy

    const out = runVerify();
    // Found the drafts receipt and passed the size threshold.
    expect(out).toMatch(new RegExp(`gates:factcheck.*content/drafts/${SLUG}\\.factcheck\\.md`));
    // Not the "missing" failure line.
    expect(out).not.toMatch(/gates:factcheck — no /);
    // The downstream claims gates consume the drafts receipt and pass.
    expect(out).toMatch(new RegExp(`claims:receipt-coverage.*all covered by receipt`));
    expect(out).not.toMatch(/claims:receipt-coverage — no fact-check/);
    expect(out).toMatch(/claims:verdicts.*all 3 receipt rows carry/);
  });

  it('STILL FAILS the receipt gates when no receipt exists in either store', () => {
    cleanupReceipts();
    ensureArticle();
    expect(existsSync(DRAFTS_ABS)).toBe(false);
    expect(existsSync(FACTCHECKS_ABS)).toBe(false);

    const out = runVerify();
    expect(out).toMatch(new RegExp(`gates:factcheck — no ${SLUG}\\.factcheck\\.md`));
    expect(out).toMatch(/claims:receipt-coverage — no fact-check/);
  });
});
