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

