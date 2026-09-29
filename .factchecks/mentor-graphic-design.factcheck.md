# Fact-check receipt — mentor-graphic-design (2026-09-28)

| #   | Claim                                                                       | Verdict                                                                  | Source URL                                                                                                            |
| --- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Store at 7554 Fredle Drive, Concord Township, OH 44077                      | ✅                                                                       | astro/src/config/siteConfig.ts (website repo, contact.address)                                                        |
| 2   | Hours Mon–Fri 9 AM–6 PM, Sat 9 AM–2 PM, Sun closed                          | ✅                                                                       | astro/src/config/siteConfig.ts (hours block)                                                                          |
| 3   | ~14-minute drive from central Mentor via Route 306 (~9 miles)               | ✅ (OSRM 825.6 s / 14.33 km → 13.8 min)                                  | router.project-osrm.org/route/v1/driving/-81.3380,41.6875;-81.2417,41.6650                                            |
| 4   | Store offers in-house graphic design + printing in one stop                 | ✅ (consistent with published sibling pages)                             | mailboxplusohio.com articles chardon-graphic-design, hambden-graphic-design; /copy-print/graphic-design/ service page |
| 5   | Print technicalities (bleed lines, DPI, RGB vs CMYK) cause DIY print errors | ✅ (standard prepress facts, non-controversial)                          | — general print-industry knowledge, no specific figure asserted                                                       |
| 6   | Online print marketplaces ship from afar; no in-person proof                | ⚠️ softened — described generally, no named vendor, no price/time figure | —                                                                                                                     |
| 7   | Phone 440-709-1946 (not asserted in body; CTA gives address/hours only)     | ✅                                                                       | siteConfig.ts                                                                                                         |

No pricing figures asserted in body — nothing to verify against rate sheets. All ⚠️ items softened to general statements.

### Follow-up (2026-09-28, owner correction)

| #   | Claim                                                                                                       | Verdict    | Source URL                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| 8   | In-house = B/W and color copies and printing (corrected from "everything prints here on our own equipment") | ✅         | Owner correction, Frank Schwarz, 2026-09-28 (PR #663 comment); aligns with astro/src/config/services/copy-print.ts |
| 9   | Business cards, posters, custom prints are outsourced to a third-party print partner                        | ✅         | astro/src/config/services/copy-print.ts ("a trusted print partner") + owner confirmation, 2026-09-28               |
| 10  | "Gets run again" reprint guarantee — REMOVED (no owner-approved reprint mechanism)                          | ✅ removed | Owner correction, 2026-09-28                                                                                       |
