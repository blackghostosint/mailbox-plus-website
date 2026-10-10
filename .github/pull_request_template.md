<!--
PR template. Delete sections that don't apply — but if this PR adds or modifies
anything under netlify/functions/, the "Endpoint Authentication Models" section
is REQUIRED and must name who may call each endpoint and how identity is proven.
"The endpoint validates its input" is not an auth model. PRs modifying functions
without this section are rejected on sight (AGENTS.md rule 7).
-->

## What this changes

<!-- One or two sentences. -->

## Scope checklist

- [ ] Touches `netlify/functions/`? If yes → Auth Model section below is required
- [ ] Dependency changes (`package.json` / `package-lock.json`)? If yes → state them + owner sign-off (rule 2)
- [ ] Business facts (prices, claims, guarantees)? If yes → source them (rule 3)
- [ ] Rule-3 business claims (superlatives, experience figures, third-party categoricals, packing guidance)? If yes → "Business Claims" ledger below is required (CI-enforced: `scripts/verify/check-owner-claims.mjs`)
- [ ] One concern only (rule 6); rebased on current `main` (rule 9)
- [ ] Labels: leave for the watcher — it syncs `status: *` every 15 min (rule 10)

## Endpoint Authentication Models (rule 7 — required if functions touched)

<!-- For EACH endpoint touched, state: who may call it, how identity is proven
     (token / session / signed request / public), and rate limiting. Example:

- **sendEmail** — caller must present a valid reCAPTCHA token, verified
  server-side (`verifyRecaptchaToken`), plus per-IP rate limiting (5/min).
- **csp-report** — public browser CSP sink; no caller identity; rate-limited 10/min.
-->

## Business Claims — Rule 3 (owner sign-off required)

<!-- Required when the changed article copy contains Rule-3 claims: superlatives
     ("best", "cheapest", "#1"), experience figures ("thousands of shipments"),
     categorical claims about third parties ("the post office does not..."),
     or packing guidance ("we pack..."). CI gate: scripts/verify/check-owner-claims.mjs
     — missing, hollow, or under-marked section = build-and-test fails.
     One line PER detected claim, each carrying a status marker. Example:

- "the best pack and ship counter in Concord Township" [superlative] — ⏳ awaiting Frank
- "packed thousands of shipments" [experience-figure] — ⚠️ softened to "packed shipments every week since 2019"
- "Unlike the UPS Store, we inspect every box" [third-party-categorical] — ✅ approved 2026-10-09 (counter observation)

Statuses: ⏳ awaiting Frank | ✅ approved <date> | ⚠️ softened/cut. If the article
uses NO Rule-3 claims, write: "No Rule-3 business claims in this article." -->
