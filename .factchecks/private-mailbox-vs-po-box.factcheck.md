# Fact-check receipt — private-mailbox-vs-po-box (FULL-VOICE rewrite 2026-09-20)

Method: whole article rewritten from scratch (same slug, subject, title intent). pubDate
preserved; lastModified 2026-09-20. Title/description unchanged (already match "private
mailbox vs po box" comparison queries at pos 9-11). Diagnosis: 140 impressions, 0 clicks,
pos 9.2 — comparison queries, old draft buried the verdict below 4 sections of scene.

| Claim                                                                                                                                                                 | Verdict               | Source                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PO Boxes cannot receive FedEx/UPS/DHL packages; only USPS delivers to them                                                                                            | ✅ VERIFIED (general) | Universal carrier policy — UPS/FedEx do not deliver to PO Boxes (USPS-only delivery per postal regulation); consistent with carrier guidance; no figure claimed                                                                                        |
| Private mailbox = CMRA (Commercial Mail Receiving Agency) street address                                                                                              | ✅ VERIFIED           | USPS definition — CMRA is the formal term for authorized mail-receiving businesses; Form 1583 authorizes delivery                                                                                                                                      |
| USPS Form 1583 + two forms of ID required to authorize a CMRA to receive mail                                                                                         | ✅ VERIFIED           | USPS Form 1583 (ps.usps.gov) — requires signed authorization and identification; protects against unauthorized mail receipt                                                                                                                            |
| Carriers can deny damage claims when packaging fails published guidelines                                                                                             | ✅ VERIFIED           | UPS Packaging Guidelines (ups.com) — carried from prior receipts                                                                                                                                                                                       |
| ~~"LLC registrations with Ohio Secretary of State" / "bank accounts" / "Amazon Seller Central" / "driver's license and vehicle registration" all accept PMB address~~ | ❌ REPLACED           | Old draft asserted blanket acceptance across institutions — unverified and institution-dependent. New draft: "a few institutions have their own rules… ask 'do you accept a CMRA street address?'" + honest caveat, links to why-po-boxes-get-rejected |
| ~~"fifteen to forty-five minutes per trip" / "two to three packages per week" / "one to two hours every week"~~                                                       | ❌ REMOVED            | Invented statistics; no source                                                                                                                                                                                                                         |
| ~~"PO Box was invented in the 1800s… mail meant letters and parcels in a coach"~~                                                                                     | ❌ REMOVED            | Unverified history; not load-bearing                                                                                                                                                                                                                   |
| "PO Box is cheaper than a private mailbox"                                                                                                                            | ✅ KEPT (concession)  | Standard market positioning; explicitly conceded to keep the comparison honest                                                                                                                                                                         |
| "CMRA counts as real address for USPS Change of Address"                                                                                                              | ❌ REMOVED            | Specific claim not re-verified this pass; replaced with generic "address you can put on public documents" + ask-us guidance                                                                                                                            |

No narrative prices or clock times in the new draft. All internal links verified live routes:
/articles/why-po-boxes-get-rejected-street-address/, /private-mailbox-rental/,
/articles/what-is-a-private-mailbox-pmb/, /articles/mailbox-rental-cost-comparison/, /contact-us/.

# Fact-check follow-up — private-mailbox-vs-po-box (compliance pass 2026-09-20)

L3 review on PR #593 flagged 4 items; all fixed in this pass:

| #   | Item                                                      | Fix                                                                                                                                                                                 |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Missing `status: 'published'` frontmatter                 | Restored                                                                                                                                                                            |
| 2   | Scene opener replaced required direct lead                | Verdict is now the first line of the lead; the door-chime scene moved after the answer, reframed as "here is what we tell everyone"                                                 |
| 3a  | "One address, all four carriers, no exceptions" (blanket) | Scoped: "One address covers the major carriers we handle daily — UPS, FedEx, USPS, and DHL — and if a carrier you use isn't on that list, ask us at the counter before you commit." |
| 3b  | "Works for business registrations: Yes" (absolute)        | "Commonly accepted — a street address meets most banks' and registrars' requirements, but call ahead to confirm for your specific institution"                                      |
| 3c  | "accepts everything" (blanket)                            | "a real street address that handles the carriers you ship with"                                                                                                                     |

Carrier set (UPS/FedEx/USPS/DHL) verified against the store's existing service pages
(/pack-ship/package-drop-offs/, /pack-ship/ups-authorized-shipper-outlet/, /pack-ship/dhl-express/).
Business-registration acceptance remains an institution-by-institution question — deliberately
counter-scoped, not asserted. The verdict-first structure and identity-stakes section are unchanged
(review called both keepers).

| 2026-09-20 | Carrier delivery / authorized-shipper claims (3a, 3c) | OWNER APPROVED — Frank (owner): UPS, FedEx, USPS, DHL pick up and deliver to the store; authorized shipper for all four; CMRA for USPS. Strong carrier claims scoped to these four are owner-certified. Business-registration acceptance (3b) stays hedged — not owner-certified. | Owner statement, PR #595 comment 5752478806 |
