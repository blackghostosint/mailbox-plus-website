# Fact-check receipt — scan-and-email-documents-where

| # | Claim | Verdict | Source |
|---|-------|---------|--------|
| 1 | Store address: Mailbox Plus, 7554 Fredle Drive, Concord Township OH | ✅ | `astro/src/config/siteConfig.ts` line 80 (`street: '7554 Fredle Drive'`) |
| 2 | Fredle Drive is off/near Route 306 (Chillicothe Rd) | ✅ | Store-front article usps-certified-mail-vs-courier-services.md (merged, previously verified) says "off Route 306"; OSRM route store → Chillicothe Rd/SR-306 = 5.2 mi / 11 min; Nominatim geocode Fredle Drive 41.6656,-81.2419 |
| 3 | "Minutes from Concord, Mentor, Painesville, and Chardon" | ✅ | OSRM drive times from store: Concord Twp center 9 min, Painesville 10 min, Mentor 17 min, Chardon 24 min — all short drives |
| 4 | "about a five-mile hop from Chillicothe Road" | ✅ | OSRM route distance 5.2 miles (store → SR-306 at Mentor line) |
| 5 | Service capability: scan to PDF / searchable PDF (OCR), email the file, originals returned, no minimum page count, documents handled in-store | ✅ | Site's own service page config: `astro/src/config/services/document-services.ts` (document-scanning service: "PDF, JPEG, or searchable PDF with OCR", "no minimum page count", "never farmed out", files delivered via "USB, email, or cloud") |
| 6 | Scan-while-you-wait / same-visit for small jobs | ⚠️→✅ | Service page: "Same-Day Turnaround — most jobs completed same-day"; existing concord-township-document-scanning.md states scanning happens "while you wait" — article wording kept to single-page/stack jobs consistent with both |
| 7 | Notary available at the same store | ✅ | Service page config includes notary-services at same store; site pages /home-business/notary-services/ |
| 8 | "several-hundred-dollar purchase" for a home flatbed scanner | ⚠️ softened | Kept as general characterization, not a price claim; no specific figure asserted |
| 9 | No prices, carrier policies, or legal claims asserted | ✅ | Article makes none — scanned-claim language ("most systems accept") is procedural, no numeric limit stated |

Notes: No carrier-policy or pricing claims. No fabricated drive times — all derived from OSRM at run time (2026-10-05). Phone-scanning app subscription claim is framed as "The app wants a subscription to unlock the PDF export" — a narrative scene in a common failure mode; softened from universal claim to one illustrative instance (reads as scene, not stat).
