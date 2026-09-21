# Fact-check follow-up — private-mailbox-vs-po-box Quick Answer block (PR #597)

## Diff-based claim comparison (QA block vs article body + owner approvals)

| QA claim                                                                                        | Verdict             | Basis                                                                                                                               |
| ----------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| "A PO Box receives USPS letters only — it cannot accept FedEx, UPS, or DHL packages"            | ✅ VERBATIM         | Article body: "A PO Box physically cannot accept those carriers' packages"                                                          |
| "a real street address that all 4 major carriers deliver to"                                    | ✅ OWNER-APPROVED   | Frank (owner, 2026-09-20): UPS, FedEx, USPS, DHL pick up and deliver to the store. Count corrected from draft's "3"                 |
| "handles packages securely"                                                                     | ✅ COVERED          | Article: packages "accepted and signed for", "logged on arrival"                                                                    |
| "commonly accepted on business documents — call ahead to confirm for your specific institution" | ✅ MATCHES 3b HEDGE | Owner has NOT certified third-party bank/registrar acceptance; "safe to use" (absolute) was rejected and replaced with the 3b hedge |
| "Setup takes USPS Form 1583 and 2 IDs"                                                          | ✅ VERBATIM         | Article body + USPS CMRA requirements                                                                                               |
| "a private mailbox wins / PO Box remains fine for personal letters alone"                       | ✅ VERBATIM         | Article verdict-first lead                                                                                                          |

**Zero new claims after fixes** — two draft wordings were corrected ("all 3 major carriers" → 4 per owner approval; "safe to use on registrations" → 3b hedge) before commit. Block is 79 words (gate: 40-80) and contains the required concrete figures (4 carriers, Form 1583, 2 IDs).

## Copy review

QA block is a compression of the verdict-first lead; article's last full review ≥80 stands. Block introduces no new voice or structure.

## Schema/infra files

`[slug].astro`, `article-schema.ts`, `verify.mjs`, `ARTICLE-WORKFLOW.md` changes are code/docs with no reader-facing claims — out of fact-check scope, covered by CI.
