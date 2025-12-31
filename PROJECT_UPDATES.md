## 2025-12-30 — Fix Premier Signup Modal Persistence Issue

**Summary**
Fixed QR code popup that kept reappearing after user dismissal. The close button ("X") now properly persists the dismissal state, starting a 7-day cooldown. Added session-based guard to prevent multiple showings during the same browsing session. Ensured registered members never see the popup.

**Scope**
- `src/constants/storage.ts` - Added session storage key
- `src/hooks/usePremierGating.ts` - Enhanced gating logic with session guard
- `src/components/ui/PremierSignupModal.tsx` - Fixed close button behavior
- `src/types/siteConfig.ts` - Added missing TypeScript type

**Notes**
- Clicking "X" now starts 7-day cooldown (Option A approach)
- "Don't show again" still provides permanent dismissal
- Session guard prevents re-triggers during scroll/navigation within same session
- TypeScript lint error resolved for `premierSignupUrl` property
