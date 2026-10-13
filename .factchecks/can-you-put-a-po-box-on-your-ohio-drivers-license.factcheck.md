# Fact-Check Receipt — can-you-put-a-po-box-on-your-ohio-drivers-license.md

Verified 2026-10-13 by independent verification subagent (fresh context) against directly fetched official pages: bmv.ohio.gov dl-identity-documents, OAC 4501:1-1-21 (rule amended by the 4501:1-1-2022 FYR PDF), BMV Form 5756 (official PDF), USPS PS Form 1583, USPS DMM 508.1.8.3; in-repo content/facts.json + astro/src/pages/private-mailbox-rental.astro. Result: zero ❌; two minor ⚠️ nuances noted (insurance-type generalization; "#" allowed but "PMB" is USPS-preferred designator). Review scores: 81/100 pass 1, 80/100 pass 2 (gate 90, hard cap 2 passes reached).

| # | Claim | Verdict | Source URL |
| --- | --- | --- | --- |
| 1 | Ohio credential requires the street address of the person's principal residence in Ohio | ✅ verbatim | https://codes.ohio.gov/ohio-administrative-code/rule-4501:1-1-21 (OAC 4501:1-1-21(J)(4)) |
| 2 | "A post office box or other mail box address is not acceptable" as proof of residential street address | ✅ verbatim | https://codes.ohio.gov/ohio-administrative-code/rule-4501:1-1-21 (OAC 4501:1-1-21(J)) |
| 3 | Compliant Card requires TWO documents, from different sources, proving Ohio street address | ✅ verbatim | https://www.bmv.ohio.gov/dl-identity-documents.aspx |
| 4 | Compliant Card works as REAL ID at airport security | ✅ | https://www.bmv.ohio.gov/dl-real-id.aspx |
| 5 | Acceptable proof docs include bank statement issued within last sixty days; current insurance policy or card; BMV change-of-address card | ✅ | OAC 4501:1-1-21(J)(2)/(6)/(1) — https://codes.ohio.gov/ohio-administrative-code/rule-4501:1-1-21 |
| 6 | BMV Form 5756 residence block prints "WHERE YOU LIVE; YOUR PERMANENT HOME ADDRESS" | ✅ verbatim | https://dam.assets.ohio.gov/image/upload/publicsafety.ohio.gov/bmv5756.pdf |
| 7 | BMV 5756 mailing line prints "STREET OR P.O. BOX" with permanent/temporary options and date fields | ✅ verbatim | same PDF |
| 8 | BMV change-of-address doubles as voter registration notification (42 U.S.C. § 1973gg-3, ORC 3503.11) | ✅ verbatim | same PDF footer |
| 9 | USPS Form 1583 requires two IDs: one government photo ID + one proof of address | ✅ | https://about.usps.com/forms/ps1583.pdf |
| 10 | PMB/# box-number designation per USPS standards | ✅ | USPS DMM 508.1.8.3; Pub 28 |
| 11 | Private mailbox accepts USPS mail + UPS/FedEx deliveries behind a lock; $15/month start; $5 refundable key deposit; month-to-month | ✅ (site pricing source of truth) | astro/src/pages/private-mailbox-rental.astro (in-repo) |
| 12 | Store: 7554 Fredle Drive, Concord Township; "just off Crile Road, minutes from SR-44 and I-90" | ✅ | content/facts.json approved_phrasing (in-repo) |
| 13 | Residence line determines county of residence; jury/voter/LE records tie | ⚠️→✅ (framing: general, no specific statute asserted) | bmv.ohio.gov pages |
| 14 | "insurance policy or card" generalizes rule's three named insurance types | ⚠️ accepted generalization | OAC 4501:1-1-21(J)(6) — https://codes.ohio.gov/ohio-administrative-code/rule-4501:1-1-21 |
