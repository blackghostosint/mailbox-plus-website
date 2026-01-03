## 2026-01-03 — Add 10 Service Discovery FAQ Entries

**Summary**
Created 10 new FAQ entries to answer general service discovery questions using customer-language patterns ("Do you...?", "Can you...?"). Each entry follows strict non-promissory formatting with factual answers that confirm service availability without making guarantees about timing, pricing, or staff availability.

**Scope**
- `knowledge/kb.entries.json`: Added 10 new FAQ entries for service discovery queries

**Notes**
- Services covered: Flyers/Brochures, Graphic Design, Postcard Printing, Document Printing, Business Mailbox Address, Document Scanning, Fax Services, Document Shredding, Digital Fingerprinting, and Notary Services
- All entries use standardized answer pattern: "Yes, we offer [service]. You can bring your items into the store and we'll help you with this service."
- Each entry includes 2 question variants using natural customer phrasing
- All entries reference verified service page URLs on mailboxplusohio.com
- minimumSimilarity set to exactly 0.78 for all entries
- Total knowledge base size: 119 entries

## 2026-01-03 — Update FAQ Question Variants and Fix JSON Syntax

**Summary**
Added missing `questionVariants` to shipping-related FAQ entries (`faq-shipping-carriers` and `faq-shipping-tracking`) to improve customer-language coverage for the chatbot. Also fixed a pre-existing JSON syntax error in `kb.entries.json` that was causing the retrieval test runner to fail.

**Scope**
- `knowledge/kb.entries.json`: Added variants to `faq-shipping-carriers` and `faq-shipping-tracking`; fixed syntax in `faq-shipping-cost`.

**Notes**
- Added variants verbatim as requested by user.
- Fixed a duplicate variant issue during the update process.
- JSON syntax fix resolved a missing comma and extra quotes in the `faq-shipping-cost` entry.

## 2026-01-02 — Create Retrieval Test Suite for Chatbot Knowledge Base

**Summary**
Created comprehensive authoritative test suite to validate chatbot retrieval behavior before UI implementation. System tests correct answering when FAQs exist, proper refusal when information is missing/out-of-scope, and prevents hallucination or operational drift. Test suite implements strict pass/fail criteria where one fail blocks UI rollout.

**Scope**
- Added `knowledge/retrieval-test-suite.ts` - 24 test cases across 5 categories (direct match, paraphrase, ambiguous, operational, out-of-scope)
- Added `knowledge/retrieval-test-runner.ts` - Test execution engine with simple string similarity matching, result validation, and markdown report generation
- Added `knowledge/RETRIEVAL_TEST_SPEC.md` - Complete documentation of retrieval contract, test matrix, scoring rules, and exit criteria
- Updated `package.json` - Added `test:retrieval` npm script and `tsx` dev dependency
- Generated `knowledge/RETRIEVAL_TEST_REPORT.md` - Auto-generated test results with pass/fail summary and recommendations

**Notes**
- Implements strict retrieval contract: ACCEPT (return FAQ verbatim) vs REFUSE (return fallback message)
- Exit criteria requires 100% pass rate: all direct/paraphrase tests must answer correctly, all ambiguous/operational/out-of-scope tests must refuse
- Initial test run: 18/24 passed (75%) - paraphrase tests failed as expected with simple string similarity (need semantic embeddings for production)
- Test infrastructure working correctly - failures demonstrate proper validation of retrieval logic
- Fallback response: "I don't have that information. Please contact the store directly or visit us in person."
- Tests loaded all 109 FAQ entries from `kb.entries.json` successfully
- Allowed fixes: adjust minimumSimilarity threshold or improve searchText (do NOT rewrite answers)

## 2026-01-01 — Remove Unused Dependency (dotenv)

**Summary**
Removed `dotenv` from dependencies as it is unnecessary in Vite projects (Vite handles `.env` files natively). Initially removed `@radix-ui/react-accordion` and `clsx` as well, but these were actually in use and had to be reinstalled to fix Netlify build failure.

**Scope**
- Updated `package.json` - Removed `dotenv` only
- Initially removed `@radix-ui/react-accordion` and `clsx`, but reinstalled them after build failure
- Ran `npm install` to update lock file

**Notes**
- `dotenv` was correctly identified as unused (zero imports found)
- `@radix-ui/react-accordion` is used by `accordion.tsx` component (used in 4 pages: PickupHours, fedex-easy-returns, ask-mailbox-plus, AmazonReturnGuide)
- `clsx` is used by `src/lib/utils.ts` for the `cn()` className utility function
- Initial grep search failed to detect these imports due to search pattern limitations
- Netlify build error revealed the dependencies were needed: "Rollup failed to resolve import"
- Local build now passes successfully after reinstalling both packages


## 2026-01-01 — Upgrade ESLint from Version 8 to Version 9


**Summary**
Resolved `package.json` dependency conflicts by upgrading ESLint from v8.56.0 to v9.17.0. Migrated configuration from deprecated `.eslintrc.*` format to new ESLint 9 flat config (`eslint.config.js`). All linting rules, custom restrictions, and plugin configurations successfully migrated and verified working.

**Scope**
- Updated `package.json`: ESLint (8.56.0 → 9.17.0), eslint-plugin-react (7.34.3 → 7.37.2), eslint-plugin-react-hooks (5.1.0-rc.0 → 5.1.0 stable)
- Created `eslint.config.js` using ESLint 9 flat config format with explicit parser configuration
- Migrated all rules from `.eslintrc.cjs` (TypeScript rules, custom import restrictions, deprecated component warnings) and `.eslintrc.json` (jsx-a11y rules)
- Removed deprecated files: `.eslintrc.cjs`, `.eslintrc.json`, `.eslintignore`
- Moved ignore patterns from `.eslintignore` into `eslint.config.js` ignores array

**Notes**
- Resolution prevents red underline errors in VS Code caused by ESLint 8/9 incompatibility
- TypeScript ESLint v8.x requires ESLint v9 (not v8) to function properly
- Initial config attempts using `tseslint.config()` helper caused TypeScript rule loading errors; resolved by using plain array format with explicit `tseslint.parser` and `tseslint.plugin` declarations
- `.eslintignore` no longer supported in ESLint 9 (generates deprecation warnings)
- All existing lint rules preserved: React JSX scope, import restrictions for micro-problem shards, ServicePage deprecation warning, jsx-a11y accessibility rules
- Linting successfully identifies existing code issues (12 jsx-a11y errors found during verification)
- Clean dependency install completed: added 11 packages, removed 19 packages, changed 10 packages

## 2026-01-01 — Create "Ship with Guaranteed Proof & Tracking" Micro-Problem Page from Reddit Complaint

**Summary**
Created new micro-problem page targeting customers fearful of lost receipts and unresponsive stores, based on Reddit complaint analysis. Page emphasizes Mailbox Plus' guaranteed tracking, printed receipts, digital record-keeping, and responsive customer service as differentiators from big-box franchise stores.

**Scope**
- Added configuration to `src/config/micro-problems/shipping.ts` (intentKey: `ship-with-guaranteed-proof`)
- Added route `/ship-with-guaranteed-proof-and-tracking-concord-township` to `src/data/routes.json`
- Added React Router route to `src/App.tsx` (required for page accessibility)

**Notes**
- Source: Reddit thread about customer with lost UPS Store receipt, no tracking, unresponsive store
- Governance validation: Signal A (addresses real friction), Signal B (staff differentiator), Signal C (unique intentKey, no overlaps)
- Checked all 14 existing shipping micro-problem pages - confirmed NO conflicts
- Messaging uses customer pain language: "lost receipt", "package never showed up in tracking", "store won't answer"
- Competitive positioning: Local business reliability vs. franchise unresponsiveness
- intentKey validation passed (no duplicates in system)

## 2026-01-01 — Move Micro-Problem GEMINI.md to Subdirectory

**Summary**
Moved `GEMINI.md - Micro-Problem Governance & Architecture.md` from project root to `src/config/micro-problems/GEMINI.md` to leverage hierarchical context system. This allows the AI agent to receive micro-problem-specific directives when working in this directory, supplementing the root-level `Gemini.md` project-wide context.

**Scope**
- Moved `GEMINI.md - Micro-Problem Governance & Architecture.md` → `src/config/micro-problems/GEMINI.md`

**Notes**
- Hierarchical context system: more specific GEMINI.md files (subdirectories) override/supplement general context (root)
- When working in `src/config/micro-problems/`, AI now receives both project-wide AND micro-problem-specific governance rules
- File renamed to standard `GEMINI.md` format for proper context detection
- Content unchanged - focus on PRAR workflow, Signal A/B/C audits, and intentKey validation

## 2025-12-31 — Redesign Testimonials Section for Improved Readability

**Summary**
Completely redesigned testimonials section to improve readability and visual appeal. Moved "trusted by hundreds" text above testimonial cards, created clean card-based layout with images on top and quotes below (eliminating previous overlay design), implemented responsive 3-column grid for desktop and single-column stack for mobile. Text now clearly readable against white card backgrounds instead of overlaid on images.

**Scope**
- `public/MailboxPlusSalesPage.html` - Redesigned testimonials section (lines 1250-1325) with new card structure, responsive grid CSS, and improved typography

**Notes**
- Previous design had quotes overlaid on background images causing readability issues
- New design uses clean white cards with soft shadows and brand-colored borders
- Images (customers_collage_local_businesses.webp, mailbox_plus_team_photo.webp, customer_receiving_mailbox.webp) now serve as headers for each card
- Responsive grid: 3 columns on desktop (>=768px), 1 column on mobile
- "Trusted by hundreds" header moved from overlaid position to dedicated header above cards
- Typography: Italic quotes at 1.1rem, blue attribution text for visual hierarchy
- Browser verified: Desktop 3-column grid and mobile stacking both work correctly

## 2025-12-31 — Add Business Owners Section to Sales Page

**Summary**
Added comprehensive business owners section targeting work-from-home professionals and service business owners. Section includes 4 sub-sections with split layouts, professional messaging about privacy and business infrastructure, bullet lists highlighting benefits, and strategic CTA. Positioned between second pricing section and testimonials to convert business users after pricing exposure.

**Scope**
- `public/MailboxPlusSalesPage.html` - Added 94-line business section (lines 1158-1251) with intro, professional/privacy benefits, delivery reliability, and infrastructure CTA

**Notes**
- Section uses existing CSS classes (`.split`, `.section--white`, `.section--alt`) for consistency
- Three images integrated: homebasedbusinesssecurity.webp, customer_receiving_mailbox.webp, keep_out.webp
- Initial implementation used placeholder images; fixed by replacing with existing CDN assets
- Messaging emphasizes "real street address" vs PO Box, privacy protection, and business infrastructure positioning
- CTA links to existing `#reserve` form anchor with analytics tracking
- Browser verified: all images load correctly, layout matches existing sections

## 2025-12-31 — Improve Limited Availability Section Readability

**Summary**
Enhanced readability of the sales page "Limited Availability" section by implementing 8 design improvements: added dark overlay (65% opacity) for better text contrast, increased font sizes (alert: 2.3rem, body: 1.25rem), consolidated two paragraphs into one focused message, removed redundant "Free setup • Free notifications" line, changed text colors to white with shadow for visibility, and enhanced button styling with larger size and stronger shadow.

**Scope**
- `public/MailboxPlusSalesPage.html` - CSS styles (lines 166-495) and HTML content (lines 1192-1211)

**Notes**
- Initial implementation used dark overlay but kept dark text colors, causing readability issues
- Browser verification revealed contrast problem, fixed by changing text to white (#fff)
- Visual hierarchy now follows: Alert Box → Heading → One Paragraph → CTA Button
- All improvements verified in browser with before/after screenshots

## 2025-12-31 — Remove 6-Month Plan Promotional Text

**Summary**
Removed the promotional description "2 months free - pay for 4, get 6! Save $50 compared to monthly." from the 6-Month Prepay pricing card to streamline messaging.

**Scope**
- `public/MailboxPlusSalesPage.html` - Cleared content from two instances of `pricing-description` paragraph (lines 805 and 926)

**Notes**
- Text appeared in two separate "Mailbox Rental Plans" sections on the sales page
- Pricing structure and other details remain intact
- Empty paragraph elements retained to preserve page layout
- Root version (`MailboxPlusSalesPage.html`) synced with public version for consistency

## 2025-12-30 — Fix Internal Link Violations in AmazonReturnGuide

**Summary**
Replaced 3 hardcoded `<a>` tags with `<InternalLink>` components in AmazonReturnGuide.tsx to comply with Gemini.md engineering standards. This ensures all internal links follow SEO optimization patterns and are tracked by the internal linking strategy.

**Scope**
- `src/pages/AmazonReturnGuide.tsx` - Updated lines 526, 529, and 532

**Notes**
- Violations discovered during Gemini.md verification audit
- Changes align with documented standard: "All internal links MUST use `<InternalLink>` component"
- Links now participate in anchor text optimization and validation checking
- InternalLink component was already imported in the file

## 2025-12-30 — Create Gemini.md Core Directives

**Summary**
Created comprehensive `Gemini.md` documentation that defines core project directives and operating protocols for AI-assisted development. This living document establishes mission, technical stack, engineering standards, workflows, and testing strategies aligned with the existing project architecture.

**Scope**
- `Gemini.md` - New file containing project identity, architecture, standards, and AI persona protocols

**Notes**
- Follows the outline: Project Identity, Technical Stack, Engineering Standards, Operating Protocols, Testing Strategy, Security & Deployment, Known Issues
- Documents React + Vite + Tailwind stack with Netlify deployment
- Establishes PRAR workflow (Perceive, Reason, Act, Refine)
- Captures known issues including Premier Signup Modal fix and micro-problem governance
- Serves as AI context for future development work

## 2025-12-30 — Fix Premier Signup Modal Re-Trigger Issue (FINAL)

**Summary**
Fixed critical bug where the Premier Signup popup kept reappearing ~2 seconds after dismissal. Root cause: `markAsShown()` updated localStorage/sessionStorage but didn't update the `shouldShow` state, causing the `useEffect` timer to re-trigger. Solution: Added `setShouldShow(false)` to `markAsShown()` to immediately update the state and prevent re-triggers.

**Scope**
- `src/constants/storage.ts` - Added session storage key
- `src/hooks/usePremierGating.ts` - Enhanced gating logic with session guard and state update in `markAsShown()`
- `src/components/ui/PremierSignupModal.tsx` - Fixed close button behavior
- `src/types/siteConfig.ts` - Added missing TypeScript type

**Notes**
- Clicking "X" now starts 7-day cooldown and prevents immediate re-triggers
- "Don't show again" still provides permanent dismissal
- Session guard prevents re-triggers during scroll/navigation within same session
- Verified with 11+ second wait periods, scroll events, and page reloads
- TypeScript lint error resolved for `premierSignupUrl` property
