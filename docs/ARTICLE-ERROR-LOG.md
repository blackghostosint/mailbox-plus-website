# Article PR Error Log

Owner-side ledger of recurring failures on article/content PRs. Purpose: repeated
errors get turned into **mechanical fixes** (preflight checks, CI gates), not
ad-hoc comments. Every entry = one pattern; if a pattern appears twice, it must
get a check.

Article PRs are an **internal process** — never assigned to or waited on by
external agents. Owner-side (Hermes) writes, fixes, and merges them.

| Date       | PR              | Failure                                                            | Fix now mechanical?                                         |
| ---------- | --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| 2026-09-22 | #620            | LLM feeds not regenerated after copy edits (`audit:quality` drift) | ✅ `npm run preflight:article` step 1                       |
| 2026-09-23 | #638            | Same feed drift (recurred — proof a check was needed)              | ✅ preflight step 1                                         |
| 2026-09-23 | #636/#638 chain | Copy review below 80 gate at merge state (68→78→99)                | ✅ preflight step 2 runs `audit:copy` pre-submission        |
| 2026-09-22 | #620            | Missing/underspecified fact-check receipt                          | ✅ preflight step 3 checks `.factchecks/`                   |
| 2026-09-24 | #657            | ✅ Clean submission — feeds included, no CI round-trip             | proof the workflow works when preflight habits are followed |

| 2026-09-29 | #664 | Fact-check receipt verdict marker missing / placed in wrong column (claims gate needs ✅/⚠️/owner-verified in the VERDICT column) | ✅ preflight step 3c (scripts/preflight-verify-verdicts.mjs) — column-aware scan |
| 2026-09-29 | #663 | Duplicate fact-check receipt in `content/drafts/` + `.factchecks/` confuses gate resolution | ✅ preflight step 3b auto-removes the drafts copy |
| 2026-09-29 | (audit) | 4 legacy receipts on main lack verdict markers (`private-mailbox-vs-po-box`, `pack-ship-painesville-city`, `ship-fragile-items-safely-*`, `what-is-a-private-mailbox-pmb`) — predate the claims gate | ⚠️ open: do NOT batch-mark ✅ (rule 3). Next edit to any of these articles must include a real verdict pass; preflight now blocks it until then |
| 2026-10-02 | #683 + #684 | Body store photo on CDN but missing from `content/store-photos.json` manifest (bot hand-rolled rclone upload, skipped `process_store_photos.py publish`) — CI `image:body` hard-fail twice in two days | ✅ 2-strike rule enforced: writer SOUL.md step 6b + workflow skill + nightly cron prompt — publish command is the ONLY body-photo path; hand uploads forbidden |
| 2026-10-05 | repo-wide | `braces` GHSA-vfj7-8cjw-p6xm (stack-exhaustion DoS, transitive prod dep of Tailwind 3) fails astro audit gate — NO upstream fix (3.0.3 latest; 3.0.4 unpublished) | ⚠️ scoped allowlist: scripts/verify/audit-astro-gate.mjs allows ONLY that GHSA id; all other highs still fail. REMOVE allowlist when braces 3.0.4 ships — weekly check TODO |

## Process

1. **Before opening** an article PR: run `npm run preflight:article` on the branch. Fix everything it flags. CI failure on an article PR should be considered a preflight miss, not bad luck.
2. **After merge**: if a gate failed anyway, append a row above. Second occurrence of any pattern = owner task to add a preflight/CI check for it.
3. **Comments on article PRs** are internal notes, never addressed to external agents.
