## What this changes

Full-voice rewrite of `wine-alcohol-delivery-receiving` (deep-track, GSC segmentation REWRITE bucket). Same slug, same subject, fresh draft — no inherited prose. Article word count ~1,300.

**Diagnosis (GSC 90d, 2026-08-27 → 2026-11-25):** 378 impressions / 0 clicks / avg position 6.5. The page surfaces for "do wine deliveries require an adult signature?" at **pos 4.4** and never wins the click — the legacy title was a statement ("Someone Over 21 Has to Sign for It"), not an answer. "shipping wine to ohio" ranks pos 81 — never addressed. Class: click-intent (pos 5–8, not snippet-capped) → title surgery + quickAnswer + question-answer body shape.

**Changes:**

- Title retargeted to the head query ("Do Wine Deliveries Require an Adult Signature? Yes — Here's How to Never Miss One"); keywords updated to the real query cluster.
- New `quickAnswer` frontmatter (snippet/AI-citation block, ~78 words) — Quick Answer gate.
- Body rebuilt: why the signature exists (carrier licensing chain) → what happens when nobody's home (FedEx reattempt; UPS returns unsigned wine to shipper) → Ohio receiving angle (UPS Addendum A) → counter-signing fix → pricing.
- Store claims updated to current SoT: non-holder walk-in receiving **$10.00/package** (owner-confirmed 2026-11-21, supersedes the W8 P5 "ask at the counter" fail-closed row), "no term commitment, cancel anytime" phrasing, `#`/`PMB` address formatting.
- Outbound consumer-shipping-alcohol angle links to the sibling `can-you-ship-alcohol-in-ohio-fedex-ups` article instead of re-explaining it (avoids cannibalization).
- Legacy unverified claims REMOVED: "temperature-controlled facility", "our own insurance", "No door tag" promise (PR #1002), unverified porch-theft stat.

## Scope checklist

- [ ] Touches `netlify/functions/`? No
- [ ] Dependency changes? No
- [x] Business facts → sourced in `.factchecks/wine-alcohol-delivery-receiving.factcheck.md` (26 rows, all verified 2026-11-25 from zero: fedex.com alcohol page, ups.com wine page, usps.com shipping restrictions, UPS Addendum A July 2026, docs/SOURCE_OF_TRUTH.md, content/facts.json, content/approved-store-claims.json)
- [x] Rule-3 business claims → ledger below
- [x] One concern only; branched from origin/main @ 310a0424 today
- [ ] Labels: leave for the watcher

## Endpoint Authentication Models (rule 7)

Not applicable — no `netlify/functions/` changes.

## Business Claims — Rule 3 (owner sign-off required)

- ✅ approved 2026-11-21 SoT facts — inbound alcohol receiving + we sign if required; $25/$40 +10 tiers (10 pkgs/mo incl., $5 overage); non-holder walk-in receiving $10.00/package; "no term commitment, cancel anytime"; `#`/`PMB` formatting; store address/hours
- ⚠️ not offered (SoT §2) — outbound consumer alcohol shipping; article does not offer it and links to the sibling article for the shipping-alcohol question

## Mechanical receipt

- Authorship: article-writer-bot (in-house)
  authorship: article-writer-bot (in-house)
- In-session repairs: quickAnswer trimmed 90→86→78 words to fit the 40–80 gate; 6 additional numeric tokens registered in sources.json; "no door tag" promise replaced with compliant phrasing; "ten packages" compound token registered.
- Fact-check receipt: `.factchecks/wine-alcohol-delivery-receiving.factcheck.md` (26 rows; 19 ✅ / 7 ⚠️ removals-softenings) + `.factchecks/wine-alcohol-delivery-receiving.sources.json` (23 pre-registered numeric claims).
- Strict gate: ALL 57 CHECKS PASSED; `npm run prebuild` feeds committed (llms.txt + llms-full.txt).
- Copy review (deepseek/deepseek-v4.1-flash): **77/100 PASS** (floor 70). Honest remaining critiques per the 70-77 proceed rule (owner ruling 2026-11-19): villain_legitimacy (quickAnswer carrier-blur on reattempt-vs-return), fluff_density x2, one_person_ear, identity_stakes (CTA lacks permission slip).
- Ledger: entry + 3 blind predictions appended to vault `Content-Ledger.md` (baseline 378 imp / 0 clicks / pos 6.5), verified by readback.
- pre-review: pending (draft PR; Runa private review before ready).

## Blind predictions

1. "do wine deliveries require an adult signature?" from pos 4.4 to top-3 @ D30.
2. Page clicks 5-15 total @ D30 (from 0).
3. "shipping wine to ohio" from pos 81 to <50 @ D30.

## Suggested internal links

- [x] `/articles/can-you-ship-alcohol-in-ohio-fedex-ups/` (sibling, outbound angle) — linked in body
- [x] `/articles/what-is-a-private-mailbox-pmb/` — linked in body
- [x] `/articles/package-receiving-service-ebay/` — linked in body
