# Phase 5: Design System Modernization

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Create a feature branch `feat/design-system` from clean `main`. Each subagent commits its own work. Open a PR when all tasks are done.

**Goal:** Replace 38 hardcoded color values with a unified design token system, standardize component patterns, fix responsive issues, and improve accessibility.

**Architecture:** CSS custom properties (design tokens) defined in `src/index.css`, referenced via Tailwind's `theme.extend.colors`. Single source of truth for all colors, spacing, and typography.

**Tech Stack:** Tailwind CSS 3.x, CSS custom properties, Vite, React 19, TypeScript

---

## Task 1: Audit & extract design tokens from existing colors

**Objective:** Map all 38 hardcoded colors to a semantic design token system.

**Files:**

- Read: all `.tsx` files in `src/` containing hardcoded colors
- Create: `docs/plans/design-tokens.md` with the full mapping

**Step 1: Create the token mapping document**

Map the existing colors to semantic tokens:

```
Primary Brand:
- #0855B1 → --color-primary (main brand blue)
- #064A9B → --color-primary-dark (hover/active state)
- #064080 → --color-primary-darker (dark variant)
- #06408A → --color-primary-deep (alternate deep)

Secondary Accent:
- #1A6DFF → --color-accent (light blue accent)
- #2F7CFB → --color-accent-light
- #2DA0ED → --color-alt-accent (alternate, used once)

Backgrounds:
- #F9FAFB → --color-bg-primary (light gray bg)
- #F8FAFC → --color-bg-secondary
- #F0F7FF → --color-bg-blue-tint
- #E0F2FE → --color-bg-cyan-tint

Text:
- #111827 → --color-text-primary (near-black headings)
- #4B5563 → --color-text-secondary (body text gray)
- #64748b → --color-text-muted (muted text)

Surface/Borders:
- #e2e8f0 → --color-border
- #B2D3EB → --color-border-blue

Dark Gradients:
- #0B4BB6 → --color-gradient-primary-start
- #021B4A → --color-gradient-primary-mid
- #02152F → --color-gradient-primary-end

Overlay/RGBA patterns:
- rgba(15,23,42,N) → --color-overlay (with varying opacity)
- rgba(8,85,177,N) → --color-overlay-blue (with varying opacity)
- rgba(0,0,0,N) → --color-shadow (with varying opacity)
```

**Step 2: Save the document**

Write `docs/plans/design-tokens.md` with the full mapping and rationale.

**Step 3: Commit**

```bash
git add docs/plans/design-tokens.md
git commit -m "docs: add design token mapping for Phase 5"
```

---

## Task 2: Define CSS custom properties in index.css

**Objective:** Add all design tokens as CSS custom properties.

**Files:**

- Modify: `src/index.css`

**Step 1: Add design tokens**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Primary Brand */
    --color-primary: #0855b1;
    --color-primary-dark: #064a9b;
    --color-primary-deeper: #064080;
    --color-primary-deep: #06408a;

    /* Secondary Accent */
    --color-accent: #1a6dff;
    --color-accent-light: #2f7cfb;
    --color-alt-accent: #2da0ed;

    /* Backgrounds */
    --color-bg-primary: #f9fafb;
    --color-bg-secondary: #f8fafc;
    --color-bg-blue-tint: #f0f7ff;
    --color-bg-cyan-tint: #e0f2fe;

    /* Text */
    --color-text-primary: #111827;
    --color-text-secondary: #4b5563;
    --color-text-muted: #64748b;

    /* Surface/Borders */
    --color-border: #e2e8f0;
    --color-border-blue: #b2d3eb;

    /* Gradient Stops */
    --color-gradient-start: #0b4bb6;
    --color-gradient-mid: #021b4a;
    --color-gradient-end: #02152f;
  }
}
```

**Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat(design-system): add CSS custom properties for design tokens"
```

---

## Task 3: Register tokens in Tailwind config

**Objective:** Make design tokens available as Tailwind utility classes.

**Files:**

- Modify: `tailwind.config.js`

**Step 1: Extend theme.colors**

Add all custom colors to Tailwind's theme so they can be used as `bg-primary`, `text-secondary`, etc.

**Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(design-system): register design tokens in Tailwind config"
```

---

## Task 4: Replace hardcoded colors -- Button component

**Objective:** Replace all hardcoded colors in Button.tsx with design tokens.

**Files:**

- Modify: `src/components/ui/Button.tsx`

**Step 1: Replace hex values with token references**

Replace all `#0855B1`, `#064A9B`, `#B2D3EB`, `#F0F7FF` with `bg-primary`, `bg-primary-dark`, `bg-blue-tint`, `border-border-blue`, etc.

**Step 2: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat(design-system): replace hardcoded colors in Button"
```

---

## Task 5: Replace hardcoded colors -- Header component

**Objective:** Replace hardcoded colors in Header.tsx.

**Files:**

- Modify: `src/components/layout/Header.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(design-system): replace hardcoded colors in Header"
```

---

## Task 6: Replace hardcoded colors -- Footer component

**Objective:** Replace hardcoded colors in Footer.tsx.

**Files:**

- Modify: `src/components/layout/Footer.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(design-system): replace hardcoded colors in Footer"
```

---

## Task 7: Replace hardcoded colors -- Layout component

**Objective:** Replace hardcoded colors in Layout.tsx.

**Files:**

- Modify: `src/components/layout/Layout.tsx`

**Step 1: Replace `#F9FAFB` with `bg-bg-primary`**

**Step 2: Commit**

```bash
git add src/components/layout/Layout.tsx
git commit -m "feat(design-system): replace hardcoded colors in Layout"
```

---

## Task 8: Replace hardcoded colors -- ServicePageV2 component

**Objective:** Replace hardcoded colors in ServicePageV2.tsx (largest file with most colors).

**Files:**

- Modify: `src/components/ServicePageV2.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

This is the most color-heavy component. Replace all ~20 color values.

**Step 2: Commit**

```bash
git add src/components/ServicePageV2.tsx
git commit -m "feat(design-system): replace hardcoded colors in ServicePageV2"
```

---

## Task 9: Replace hardcoded colors -- MailbotPlusChat component

**Objective:** Replace hardcoded colors in MailbotPlusChat.

**Files:**

- Modify: `src/components/MailbotPlusChat/index.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/components/MailbotPlusChat/index.tsx
git commit -m "feat(design-system): replace hardcoded colors in MailbotPlusChat"
```

---

## Task 10: Replace hardcoded colors -- Home page

**Objective:** Replace hardcoded colors in Home.tsx.

**Files:**

- Modify: `src/pages/Home.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat(design-system): replace hardcoded colors in Home page"
```

---

## Task 11: Replace hardcoded colors -- Services page

**Objective:** Replace hardcoded colors in Services.tsx.

**Files:**

- Modify: `src/pages/Services.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/Services.tsx
git commit -m "feat(design-system): replace hardcoded colors in Services page"
```

---

## Task 12: Replace hardcoded colors -- ContactUs page

**Objective:** Replace hardcoded colors in ContactUs.tsx.

**Files:**

- Modify: `src/pages/ContactUs.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/ContactUs.tsx
git commit -m "feat(design-system): replace hardcoded colors in ContactUs page"
```

---

## Task 13: Replace hardcoded colors -- AboutUs page

**Objective:** Replace hardcoded colors in AboutUs.tsx.

**Files:**

- Modify: `src/pages/AboutUs.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/AboutUs.tsx
git commit -m "feat(design-system): replace hardcoded colors in AboutUs page"
```

---

## Task 14: Replace hardcoded colors -- Tracking page

**Objective:** Replace hardcoded colors in Tracking.tsx.

**Files:**

- Modify: `src/pages/Tracking.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/Tracking.tsx
git commit -m "feat(design-system): replace hardcoded colors in Tracking page"
```

---

## Task 15: Replace hardcoded colors -- PickupHours page

**Objective:** Replace hardcoded colors in PickupHours.tsx.

**Files:**

- Modify: `src/pages/PickupHours.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/PickupHours.tsx
git commit -m "feat(design-system): replace hardcoded colors in PickupHours page"
```

---

## Task 16: Replace hardcoded colors -- Privacy page

**Objective:** Replace hardcoded colors in Privacy.tsx.

**Files:**

- Modify: `src/pages/Privacy.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/Privacy.tsx
git commit -m "feat(design-system): replace hardcoded colors in Privacy page"
```

---

## Task 17: Replace hardcoded colors -- Terms page

**Objective:** Replace hardcoded colors in Terms.tsx.

**Files:**

- Modify: `src/pages/Terms.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/Terms.tsx
git commit -m "feat(design-system): replace hardcoded colors in Terms page"
```

---

## Task 18: Replace hardcoded colors -- ShippingPartners page

**Objective:** Replace hardcoded colors in ShippingPartners.tsx.

**Files:**

- Modify: `src/pages/ShippingPartners.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/ShippingPartners.tsx
git commit -m "feat(design-system): replace hardcoded colors in ShippingPartners page"
```

---

## Task 19: Replace hardcoded colors -- StoreHours page

**Objective:** Replace hardcoded colors in StoreHours.tsx.

**Files:**

- Modify: `src/pages/StoreHours.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/StoreHours.tsx
git commit -m "feat(design-system): replace hardcoded colors in StoreHours page"
```

---

## Task 20: Replace hardcoded colors -- NotFound page

**Objective:** Replace hardcoded colors in NotFound.tsx.

**Files:**

- Modify: `src/pages/NotFound.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/NotFound.tsx
git commit -m "feat(design-system): replace hardcoded colors in NotFound page"
```

---

## Task 21: Replace hardcoded colors -- fedex-easy-returns page

**Objective:** Replace hardcoded colors in fedex-easy-returns.tsx.

**Files:**

- Modify: `src/pages/fedex-easy-returns.tsx`

**Step 1: Replace all hex values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/fedex-easy-returns.tsx
git commit -m "feat(design-system): replace hardcoded colors in fedex-easy-returns page"
```

---

## Task 22: Replace hardcoded colors -- ask-mailbox-plus page

**Objective:** Replace hardcoded colors in ask-mailbox-plus.tsx.

**Files:**

- Modify: `src/pages/ask-mailbox-plus.tsx`

**Step 1: Replace all hex/rgba values with design tokens**

**Step 2: Commit**

```bash
git add src/pages/ask-mailbox-plus.tsx
git commit -m "feat(design-system): replace hardcoded colors in ask-mailbox-plus page"
```

---

## Task 23: Replace hardcoded colors -- UI components

**Objective:** Replace hardcoded colors in remaining UI components.

**Files:**

- Modify: `src/components/ui/AutoBreadcrumbs.tsx`
- Modify: `src/components/ui/Breadcrumbs.tsx`
- Modify: `src/components/ui/InternalLink.tsx`
- Modify: `src/components/ui/PremierSignupModal.tsx`
- Modify: `src/components/ui/SearchBox.tsx`
- Modify: `src/components/ui/accordion.tsx`
- Modify: `src/components/sections/CTA.tsx`
- Modify: `src/components/sections/ServiceGrid.tsx`

**Step 1: Replace all hex values in each file with design tokens**

**Step 2: Commit each file separately**

---

## Task 24: Replace hardcoded colors -- config files

**Objective:** Replace hardcoded colors in service config files.

**Files:**

- Modify: `src/config/services/mailbox-rentals.ts`
- Modify: `src/config/services/pack-ship/amazon-returns.ts`
- Modify: `src/config/services/pack-ship/packing-services.ts`

**Step 1: Replace hex values with design tokens**

**Step 2: Commit**

```bash
src/config/services/mailbox-rentals.ts src/config/services/pack-ship/amazon-returns.ts src/config/services/pack-ship/packing-services.ts
git commit -m "feat(design-system): replace hardcoded colors in service configs"
```

---

## Task 25: Responsive design audit and fixes

**Objective:** Fix responsive breakpoints and mobile layout issues across key pages.

**Pages to audit:** Home, Services, ContactUs, AboutUs, PickupHours

**Common fixes:**

- Ensure all sections use `flex-col md:flex-row` pattern consistently
- Fix overflow issues on small screens
- Ensure text sizes scale properly (`text-xl md:text-2xl` pattern)
- Test that no horizontal scrollbar appears at 320px width

**Files:**

- Modify: pages with responsive issues

**Step 1: Audit each page for responsive issues**

**Step 2: Fix issues and commit**

---

## Task 26: Accessibility improvements

**Objective:** Fix accessibility issues found in audit scope.

**Files:** All components modified above

**Common fixes:**

- Ensure all interactive elements have visible focus states
- Add missing `aria-label` attributes
- Ensure color contrast meets WCAG AA (4.5:1 for body text)
- Add `role` attributes where semantic HTML is insufficient
- Ensure all images have meaningful `alt` text

**Step 1: Audit and fix each component**

**Step 2: Commit**

---

## Task 27: Build verification and visual QA

**Objective:** Ensure the build passes and all pages render correctly.

**Step 1: Full build**

```bash
npm run build
```

**Step 2: Type check**

```bash
npx tsc --noEmit
```

**Step 3: Lint**

```bash
npm run lint
```

**Step 4: Fix any issues**

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(phase5): complete Design System Modernization"
```

---

## Task 28: Open PR

**Objective:** Create PR and request review.

```bash
git checkout feat/design-system
git push -u origin feat/design-system
gh pr create --base main --title "feat(design-system): Phase 5 Design System Modernization" --body "..."
```

---

## Notes for Subagents

- **ALWAYS** read the current file content before editing
- **ALWAYS** verify exact line numbers and context when using patch
- **ALWAYS** use `read_file` first, then `patch` with exact old_string matching
- Colors inside Tailwind class strings: use `bg-[var(--color-primary)]` pattern for arbitrary values
- Colors in inline styles: use `style={{ backgroundColor: 'var(--color-primary)' }}`
- Gradient classes: replace `from-[#0B4BB6]` with `from-[var(--color-gradient-start)]`
- **DO NOT** change any layout/structure -- only replace color values
- **DO NOT** introduce new dependencies
