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

