## What this changes

Full-voice GSC-driven rewrite of `home-business-real-street-address` (rewrite #2 of Frank's approved segmentation list, next after fedex-demand-surcharges-2026 / PR #880). Same slug, same subject per GSC queries, fresh prose — no inherited sentences. Article word count 1,878.

**Diagnosis (GSC 90d, 2026-08-05 → 2026-11-02):** 315 impressions / 0 clicks / avg position 7.0. Head query "street address for business" ranked pos 18 — the legacy title ("Your Home Business Deserves a Real Street Address (Here's Why)") targets no query; "street address required" (pos 6.5) and "public business address" (pos 5.0) earned 0 clicks (title/hook CTR loss); "street address and po box" (pos 31.5) is a comparison tail the old page never served. Class: click-intent (pos 5–15, not snippet-capped) → title surgery + comparison verdict shape.

**Changes:**
- Title retargeted to the head query ("Street Address for Business: How to Get a Real One Without a PO Box or Your Home"); keywords updated to the real query cluster.
- Verdict-in-paragraph-one + four-option side-by-side table (PO box / home / office lease / PMB) with an explicit "where the losers still win" concession.
- New `quickAnswer` frontmatter (snippet/AI-citation block, 72 words) — Quick Answer gate.
- Legacy unverified specifics REMOVED: Oracle partner-application exact wording, Amazon seller-address behavior, "about ten minutes" setup time.
- Legacy DMM defect FIXED: the old copy called the PMB a "suite number" — DMM 508.1.8.3 requires PMB/# designators; the rewrite teaches the correct PMB designation instead.
- Frontmatter `lastModified: 2026-11-03` added; `pubDate` unchanged (2026-08-19). Verified in dist: `dateModified":"2026-11-03T09:00:00-05:00"` + sitemap `lastmod 2026-11-03T14:00:00.000Z`.

## Scope checklist

- [ ] Touches `netlify/functions/`? No
- [ ] Dependency changes? No
- [x] Business facts → sourced in `.factchecks/home-business-real-street-address.factcheck.md` (15 rows, all verified 2026-11-03 from zero: eCFR 31 CFR 1020.220, Ohio SOS Forms 610/521 PDFs, Google Business Profile guidelines, USPS DMM 508 + Form 1583, site pricing/address/hours)
- [x] Rule-3 business claims → ledger below
- [x] One concern only; rebased on current main (branched from origin/main @ 5af90640 today)
- [ ] Labels: leave for the watcher

## Endpoint Authentication Models (rule 7)

Not applicable — no `netlify/functions/` changes.

## Business Claims — Rule 3 (owner sign-off required)

- ⚠️ softened/cut — "Cheapest of the four" (PO box row of the comparison table) → replaced with "Varies by post office" (unverifiable relative-price superlative, scrubbed per standing ruling)
- ✅ approved 2026-11-03 site-config facts — pricing ($15/$25/$30/$40 personal tiers, $35/$50 business plans, month-to-month), address (7554 Fredle Drive, Concord Township OH 44077), hours, four-carrier delivery, 4-hour arrival notification — all verified against the site's own pricing/service pages (receipt rows 1–4, 14)
- ✅ approved 2026-11-03 cited-source facts — bank CIP rule 31 CFR 1020.220, Ohio Form 610 PO-box/CMRA prohibition + $99 filing fee, Google Business Profile address guidelines (quoted verbatim), Form 1583 two-ID requirement, PMB/# designator rule — all verified at the issuing sources (receipt rows 5–13)

## Mechanical receipt

- Authorship: written in-session by the Hermes article-rewrite agent (bot pipeline, `blackghostosint` writer lane).
- In-session repairs: quickAnswer trimmed 97→81→72 words to fit the 40–80 gate; suite wording replaced per scope rule; 6 additional numeric tokens registered in sources.json; Google support URLs replaced with archive snapshots in the receipt (their HEAD endpoint 404s unauthenticated).
- Fact-check receipt: `.factchecks/home-business-real-street-address.factcheck.md` (15 rows; 14 ✅ / 1 ⚠️ removals row) + `.factchecks/home-business-real-street-address.sources.json` (24 pre-registered numeric claims).
- Strict gate: 51/51 PASS; build page count FLAT (379 → 379); sitemap + seo-gates PASS; `npm run prebuild` feeds committed.
- Copy review (deepseek/deepseek-v4.1-flash, median of 3): **79/100 PASS** (runs: 79 / 84 / 74; run 1 pre-fix was 80 with 4 quoted fixes applied — quickAnswer overclaim, CTA link-dump, meta heading, abstract scene anchor). One K2.6 rescore returned 54 on the K2.6 scale — recorded per the scale-separation ruling (K2.6 anchors run ~15–20 pts harsher; flash median is the gate score); flagged for the pending owner recalibration.
- pre-review: pending (draft PR; Runa private review before ready).

## Suggested internal links

- [ ] (none auto-proposed — existing relatedServices links retained; Jev nominations re-run post-consolidation)
