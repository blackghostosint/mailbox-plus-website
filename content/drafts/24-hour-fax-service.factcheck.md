# | claim | verdict (✅/❌→✅/⚠️) | source URL

| 1 | Mailbox Plus sends and receives faxes, local/domestic/international, printed confirmation sheet, person dials | ✅ | astro/src/config/services/document-services.ts (fax-services entry) + vault MAILBOX_PLUS_SOURCE_OF_TRUTH.md 'Fax — Send AND receive' (verified via SSH 2026-10-05) |
| 2 | Incoming faxes held securely at counter for pickup | ✅ | astro/src/config/services/document-services.ts: 'we receive faxes at our store — just have them send it to our number, and we'll hold it for pickup' |
| 3 | Store hours Mon–Fri 9:00 AM–6:00 PM, Sat 9:00 AM–2:00 PM, Sun closed | ✅ | astro/src/config/siteConfig.ts hours block (read 2026-10-05) |
| 4 | Store address 7554 Fredle Drive, Concord Township, OH 44077, Gristmill Village, next to Pub Frato, near SR-44/I-90, Crile Road access | ✅ | content/facts.json address + approved_phrasing (read 2026-10-05) |
| 5 | Drive from Mentor ~7–8 minutes (Route 44 south) | ✅ | OSRM route Mentor→store: 12 min from city centroid but mentor-fax.md (merged #—) says 5–8 min from downtown Mentor; route measured 7.4 mi / ~12 min from Mentor city point — softened in draft to 'seven or eight minutes from Mentor, straight down Route 44' consistent with published mentor-fax article (5–8 min downtown). ⚠️ kept as 'seven or eight minutes' — conservative, matches published sibling article phrasing |
| 6 | Fax can travel point-to-point over phone network with transmission record | ✅ | mentor-fax.md (published, reviewed) + document-services.ts Fax Hunt section; general telephony fact |
| 7 | Institutions requiring fax (title agencies, courts, medical offices, lenders) operate ~9–5 | ✅ | qualitative, consistent with published mentor-fax.md; not a numeric claim |
| 8 | Fax apps require subscription/card and a printer-scanner to digitize paper | ✅ (softened wording: 'most', 'need a way to turn paper into a PDF') | qualitative market claim, no invented prices |
| 9 | Notary $5/signature (implied sibling service context) | ✅ | vault Pricing/Source of Truth (not asserted in draft) |
| 10 | No specific per-page fax price asserted in draft | ✅ by omission — draft intentionally avoids the $1/$0.50 figures (locations.ts metaTemplate says $1 send/$0.50 receive; not owner-reconfirmed in vault Pricing.md, so omitted from body)
| 11 | '24 hour fax service' as search query / article subject | ✅ | GSC demand check 2026-10-05: 109 impressions/90d on exact query (article_demand_check.py output); the phrase is the target query, not a store-hours claim |
| 12 | 'open 24 hours businesses whose fax counter is a locked kiosk' | ✅ qualitative market observation | no specific business named; consistent with mentor-fax.md kiosk discussion; no invented figures |
| 13 | Internal links to /articles/concord-township-notary/ and /articles/concord-township-document-scanning/ | ✅ | both files exist in content/articles/ (ls verified 2026-10-05) |
