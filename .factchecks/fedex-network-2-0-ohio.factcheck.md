# Fact-Check Receipt: fedex-network-2-0-ohio

Verified 2026-11-05 against the Supply Chain Dive report of FedEx's Q3 FY2026 earnings call (published Nov. 3, 2026) and the repo site config. Numeric claims registered in `.factchecks/fedex-network-2-0-ohio.sources.json`.

| #   | Claim                                                                                         | Verdict | Source URL                                                                                                      |
| --- | --------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Network 2.0 combines FedEx's historically separate Ground and Express networks                | ✅      | https://www.supplychaindive.com/news/fedex-network-20-headed-to-los-angeles-other-markets-post-holidays/873453/ |
| 2   | Overhaul complete in Dallas, San Francisco, Phoenix and Washington D.C.                       | ✅      | same as #1 (earnings-call report)                                                                               |
| 3   | 65% of eligible volume through roughly 630 optimized stations entering peak season            | ✅      | same as #1                                                                                                      |
| 4   | Up from 45% and nearly 490 stations at end of June 2026                                       | ✅      | same as #1                                                                                                      |
| 5   | More than 260 stations shuttered so far; overall goal over 475 closures                       | ✅      | same as #1                                                                                                      |
| 6   | Slated to wrap up in 2027; $2 billion cumulative savings expected by end of 2027              | ✅      | same as #1                                                                                                      |
| 7   | FedEx pauses Network 2.0 during peak season; LA, Oklahoma City, Charlotte next after holidays | ✅      | same as #1                                                                                                      |
| 8   | No Northeast Ohio market wave announced                                                       | ✅      | same as #1 (only LA/OKC/Charlotte named as next)                                                                |
| 9   | Mailbox Plus address 7554 Fredle Drive, Concord Township, OH 44077                            | ✅      | astro/src/config/siteConfig.ts                                                                                  |
| 10  | Hours Mon-Fri 9:00 AM - 6:00 PM, Sat 9:00 AM - 2:00 PM, Sun closed                            | ✅      | astro/src/config/siteConfig.ts                                                                                  |
| 11  | Phone 440-709-1946                                                                            | ✅      | astro/src/config/siteConfig.ts                                                                                  |
| 12  | Store is independent and multi-carrier (FedEx, UPS, USPS)                                     | ✅      | repo service pages (/pack-ship/) — no carrier-endorsement claim made                                            |
| 13  | Location phrasing "just off Route 306, next to Pub Frato"                                     | ✅      | content/facts.json approved_phrasing                                                                            |

Softening notes:

- No claim made that any specific Ohio FedEx station has closed or will close.
- No categorical claim that FedEx accepts packages at the store "always" — framed as counter handoff, availability subject to carrier policies.
- No "under 3 minutes" or other timing guarantees in copy.
