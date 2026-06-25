# Mailbox Plus — Design Vision & Implementation Scope

**Date:** June 24, 2026
**Status:** Living document — the single source of truth for all visual and experiential changes to mailboxplusohio.com

---

## Document Structure

This document is organized in three layers:

1. **Foundation** [reference only] — color, typography, and token system (defined in `docs/DESIGN_SYSTEM.md`)
2. **Motion & Micro-Interactions** — animation patterns, transitions, hover effects
3. **Page-by-Page Scope** — what changes on each page, in priority order

---

# Layer 1: Foundation

> Refer to `docs/DESIGN_SYSTEM.md` for the complete token system. Only summary values included here.

| Token                    | Value                 | Role                                        |
| ------------------------ | --------------------- | ------------------------------------------- |
| `--color-bg-primary`     | `#f2ede4`             | Warm paper page background                  |
| `--color-bg-secondary`   | `#ebe4d8`             | Card / section backgrounds                  |
| `--color-accent-gold`    | `#f7c82a`             | CTAs on navy backgrounds                    |
| `--color-accent-warm`    | `#a45c40`             | Deep terracotta — CTAs on light backgrounds |
| `--color-primary` (navy) | `#285a8e`             | Brand anchor, nav, section headers          |
| Gradient                 | `#285a8e` → `#162c45` | Heroes, CTA bands                           |
| Body font                | DM Sans 400/500       | Warm, clean, slightly rounded               |
| Heading font             | DM Sans 600/700       | Same family, simplifies system              |

---

# Layer 2: Motion & Micro-Interactions

## Philosophy

Motion should feel **warm and deliberate** — not flashy, not fast, not gimmicky. Every animation has a purpose: guide attention, communicate hierarchy, or add tactile feedback. Timings are relaxed (0.3s–0.8s) to match the premium-boutique feel.

## 2.1 Entry / Scroll Animations

### Section Reveal (site-wide)

As the user scrolls, each major section fades in with a gentle upward slide.

| Property      | Value                                 |
| ------------- | ------------------------------------- |
| Animation     | `fade-in-up`                          |
| Duration      | 0.6s                                  |
| Easing        | `ease-out`                            |
| Y-offset      | 30px → 0                              |
| Trigger       | Intersection Observer at 85% viewport |
| Stagger delay | 100ms between child elements          |

**Implementation:** Use the existing `useInView` hook (already in `Services.tsx`) and the existing `animate-fade-in-up` CSS animation class (already in `src/index.css`). Extend to all pages — every `<section>` gets `animate-fade-in-up` on scroll entry.

### Card Grid Stagger

Service cards, article cards, and any grid of items reveal one-by-one with a stagger.

```css
/* Per-card stagger — parent sets stagger container, children cascade */
.stagger-group > * {
  opacity: 0;
  animation: fade-in-up 0.5s ease-out forwards;
}
.stagger-group.in-view > *:nth-child(1) {
  animation-delay: 0ms;
}
.stagger-group.in-view > *:nth-child(2) {
  animation-delay: 100ms;
}
.stagger-group.in-view > *:nth-child(3) {
  animation-delay: 200ms;
}
/* ... up to ~10 items maximum — beyond that, group in batches */
```

**Max stagger delay per group:** 600ms (do not keep users waiting to see content).

### Page Transition (optional, requires Layout wrapper)

A subtle crossfade between route changes.

| Property  | Value                |
| --------- | -------------------- |
| Animation | `fade` (opacity 0→1) |
| Duration  | 0.3s                 |
| Timing    | `ease-in-out`        |

Can be done via a CSS transition on the `<main>` wrapper in `Layout.tsx` with React Router's `useLocation` key to trigger. This is low priority — leave for last.

## 2.2 Hover / Interaction Animations

### Primary CTA Button (Gold on Navy)

| Trigger  | Effect                                                                      | Duration | Easing   |
| -------- | --------------------------------------------------------------------------- | -------- | -------- |
| Hover    | Scale 1.03 + subtle gold glow (box-shadow: `0 0 20px rgba(247,200,42,0.3)`) | 0.2s     | ease-out |
| Active   | Scale 0.98                                                                  | 0.1s     | ease-in  |
| Disabled | Opacity 0.5, cursor not-allowed                                             | —        | —        |

### Secondary CTA Button (Terracotta on Cream)

| Trigger | Effect                                                     | Duration | Easing   |
| ------- | ---------------------------------------------------------- | -------- | -------- |
| Hover   | Scale 1.03 + shadow deepen (`--shadow-md` → `--shadow-lg`) | 0.2s     | ease-out |
| Active  | Scale 0.98                                                 | 0.1s     | ease-in  |

### Ghost / Outline CTA

| Trigger | Effect                                                   | Duration | Easing   |
| ------- | -------------------------------------------------------- | -------- | -------- |
| Hover   | Background tint fills to 10% opacity of the accent color | 0.2s     | ease-out |

### Service / Info Card

| Trigger | Effect                                                | Duration | Easing   |
| ------- | ----------------------------------------------------- | -------- | -------- |
| Hover   | Y-offset -4px, shadow `md` → `lg`, border accent tint | 0.25s    | ease-out |

### Nav Link (Header)

| Trigger               | Effect                                                                                                                       | Duration | Easing   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| Hover                 | Underline slides in from left (thin gold or terracotta underline depending on nav background), or text color shift to accent | 0.2s     | ease-out |
| Active (current page) | Persistent underline or accent dot indicator                                                                                 | —        | —        |

### Header Background on Scroll

On pages with a tall hero, the header starts transparent (or with a glass-tint overlay) and gains a solid background as the user scrolls past the hero.

| State                 | Background                                            | Shadow        |
| --------------------- | ----------------------------------------------------- | ------------- |
| Top of page (on hero) | Transparent / `--surface-subtle` with `backdrop-blur` | None          |
| Scrolled past hero    | `--color-bg-primary` (warm paper)                     | `--shadow-sm` |

### Gold CTA "Pulse" on Hero Load

When the hero first renders, the gold CTA button gets a single attention pulse:

```css
@keyframes cta-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(247, 200, 42, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(247, 200, 42, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(247, 200, 42, 0);
  }
}
```

Runs once, 1.5s after page load, 1.5s duration. Subtle — not a repeating strobe.

## 2.3 Loading States

### Skeleton Loading

Warm-toned skeleton placeholders for content that loads asynchronously (chat widget, dynamic content). Use `--color-bg-secondary` (`#ebe4d8`) with a shimmer animation:

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.skeleton {
  background: linear-gradient(90deg, #ebe4d8 25%, #e6e0d6 50%, #ebe4d8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

## 2.4 Priority: Motion Work

| Priority | Item                        | Effort | Notes                                                   |
| -------- | --------------------------- | ------ | ------------------------------------------------------- |
| P0       | Section reveal (fade-in-up) | Small  | CSS + useInView hook already exist, just wire site-wide |
| P0       | CTA button hover effects    | Small  | Update `Button.tsx` with new hover CSS                  |
| P0       | Card hover effects          | Small  | Add to card components                                  |
| P1       | Stagger card reveal         | Small  | CSS + JS toggle class on stagger-group parent           |
| P1       | Header scroll transition    | Medium | Requires scroll listener + state in Header.tsx          |
| P2       | Gold hero CTA pulse         | Tiny   | One-time CSS animation                                  |
| P2       | Skeleton loading states     | Small  | For async-loaded sections only                          |
| P3       | Page transition fade        | Medium | Requires Layout wrapper update                          |

---

# Layer 3: Page-by-Page Scope

## Phase Ordering

| Phase       | Scope                                   | What Changes                                                        |
| ----------- | --------------------------------------- | ------------------------------------------------------------------- |
| **Phase A** | Token swap + globally shared components | CSS tokens, Tailwind config, fonts, Button, Layout, Header, Footer  |
| **Phase B** | High-traffic pages                      | Home, Services, Contact Us, About Us                                |
| **Phase C** | Service page template                   | ServicePageV2 (drives 40+ service pages), individual service pages  |
| **Phase D** | Low-traffic / utility pages             | Tracking, Privacy, Terms, Store Hours, Pickup Hours, NotFound, etc. |
| **Phase E** | Micro-animations                        | Wire up scroll reveals, hover effects, stagger across all pages     |

---

## Phase A: Token Swap + Global Components

### `src/index.css`

- [ ] Update `--color-bg-primary` to `#f2ede4`
- [ ] Update `--color-bg-secondary` to `#ebe4d8`
- [ ] Add `--color-accent-gold: #f7c82a` (replaces existing `--color-accent: #f4c542`)
- [ ] Add `--color-accent-warm: #a45c40` (new)
- [ ] Add `--color-accent-warm-light: #b8734d`
- [ ] Remove `--color-bg-blue-tint`, `--color-bg-cyan-tint`
- [ ] Remove `--color-border-blue`, add `--color-border-warm: #d4c9b8`
- [ ] Update `--color-accent-light` to `--color-accent-gold-light: #f7d46a`
- [ ] Add DM Sans `@font-face` fallback override
- [ ] Remove Poppins / Open Sans fallback overrides
- [ ] Add `@keyframes cta-pulse` and `.animate-cta-pulse` utility
- [ ] Add `@keyframes shimmer` and `.animate-shimmer` utility

### `tailwind.config.js`

- [ ] Swap `fontFamily.sans` to `['DM Sans', 'DM Sans Fallback', ...]`
- [ ] Swap `fontFamily.heading` to same DM Sans stack (or remove heading font entirely)
- [ ] Add `accent: { gold: '...', goldLight: '...', warm: '...', warmLight: '...' }` to extended colors
- [ ] Remove `bg-blue-tint`, `bg-cyan-tint` from bg colors
- [ ] Remove `border-blue` from border colors
- [ ] Add `border-warm` to border colors

### `Button.tsx`

- [ ] `variant="primary"` — maps to **terracotta** filled (CTA on light backgrounds)
- [ ] `variant="secondary"` — outline style with terracotta border
- [ ] New `variant="gold"` — gold filled button for navy backgrounds
- [ ] New `variant="gold-outline"` — gold outline for navy backgrounds
- [ ] Add hover scale + shadow CSS classes
- [ ] Remove old blue color references

### `Layout.tsx`

- [ ] Ensure `<main>` wrapper has `bg-[var(--color-bg-primary)]` (likely already does)
- [ ] Optional: page transition fade wrapper

### `Header.tsx`

- [ ] Swap nav background to `--color-primary` (navy) — may already be correct
- [ ] Update nav link hover/active indicators to gold accent
- [ ] Add scroll-transition behavior (transparent → solid on scroll past hero)
- [ ] Mobile hamburger menu — use terracotta or gold accents
- [ ] Remove any references to old blue accent colors

### `Footer.tsx`

- [ ] Swap to warm paper background (`--color-bg-secondary` or `--color-bg-primary`)
- [ ] Update link colors to nav-style or muted warm
- [ ] Remove old blue accent references

---

## Phase B: High-Traffic Pages

### `Home.tsx` — HIGHEST priority

**SB7 Face:** All (A–E, R1–R2, S1–S2) — front door orients all visitors

**Current state:** Navy gradient hero, four service cards on warm bg, service area list, Google review CTA.

**Changes:**

- [ ] Hero: keep navy gradient, update CTA to gold button (variant="gold")
- [ ] Hero headline — consider tighter copy (currently 3 lines — "Shipping, returns, private mailboxes, notary")
- [ ] Swap four service cards' CTA text to use the sales-page style: `→ Get Started`, `→ Learn More`, `→ See Options`
- [ ] Review service card CTAs — should use terracotta on warm bg
- [ ] Remove any blue tint sections, replace with `--color-bg-secondary` or `--color-bg-warm-tint`
- [ ] Add scroll-triggered fade-in-up to each section
- [ ] Add stagger to service area chips/tags
- [ ] Review overall content density — does it feel sparse or crowded?

### `Services.tsx`

**SB7 Face:** All (S2, S1, B, R1–R2) — service catalog for every visitor type

**Current state:** Category-filtered card grid of ~30–35 services, each card with icon + title + description + link. Hidden-from-grid set controls visible cards.

**Changes:**

- [ ] Card background: `--color-bg-secondary` (`#ebe4d8`) with terracotta links
- [ ] Card hover: y-offset lift + shadow transition
- [ ] Category tabs/buttons: terracotta active state
- [ ] Stagger card reveal on filter change (reset stagger when category changes)
- [ ] Each card CTA: terracotta text or terracotta outline button
- [ ] Remove old blue tint backgrounds

### `ContactUs.tsx`

**SB7 Face:** B (Small Business), All — walk-in visitors and business inquiries

**Current state:** Contact form + store info.

**Changes:**

- [ ] Form styling — warm inputs with `--color-border` borders
- [ ] Submit button → terracotta filled
- [ ] Form focus states — warm border highlight (not blue)
- [ ] Info section — terracotta accent icons
- [ ] Remove blue tint backgrounds

### `AboutUs.tsx`

**SB7 Face:** All — brand trust speaks to every segment

**Current state:** About content.

**Changes:**

- [ ] Swap to warm bg, terracotta accent headers/CTAs
- [ ] Section fade-in-up reveals
- [ ] Remove blue references

---

## Phase C: Service Page Template

### `ServicePageV2.tsx`

**This is critical** — it's the template for ~40+ service pages (UPS, FedEx, Notary, Printing, etc.). Every change here cascades to dozens of pages.

**SB7 Face:** Varies by page type — S2 (rate shopper) for shipping, S1 (valuable shipper) for packing, B (small business) for printing/notary, R1–R2 for returns. CTA and hero must match the page's target face.

**Current state:** Navy hero with service title, content body with hardcoded blue values (~20 color references), blue CTA buttons.

**Changes:**

- [ ] Hero section: navy gradient, CTA → gold variant
- [ ] Body background: warm paper (`--color-bg-primary`)
- [ ] Card/feature sections: `--color-bg-secondary`
- [ ] All CTAs in content body → terracotta variant
- [ ] All `bg-[#...]` and old blue references → design tokens
- [ ] Section fade-in-up reveals
- [ ] Carrier logos (UPS, FedEx, etc.) — add `aspect-ratio` containers (CLS mitigation)
- [ ] Headings: DM Sans, navy or warm tone

### Individual service pages (40+ files in `src/pages/`)

Most share the ServicePageV2 template — they'll update automatically when the template changes. Any with hardcoded inline styles need individual review.

---

## Phase D: Low-Traffic / Utility Pages

### `Tracking.tsx`

**SB7 Face:** S2 (Rate Shopper), R1 (Multi-Carrier Returner) — transactional, just want to know where the package is

- [ ] Card/panel backgrounds → `--color-bg-secondary`
- [ ] Input fields → warm styling with `--color-border`
- [ ] Track button → terracotta filled
- [ ] Remove blue accents

### `StoreHours.tsx` / `PickupHours.tsx`

- [ ] Background → warm paper
- [ ] Accent highlights → terracotta or gold depending on section bg
- [ ] Remove cyan-tint references

### `Privacy.tsx` / `Terms.tsx`

- [ ] Content body → warm paper
- [ ] Section headers → navy or text-primary
- [ ] Remove blue references

### `NotFound.tsx`

- [ ] Background → warm paper
- [ ] CTA → terracotta

### Other utility pages (ServiceAreaIndex, ServiceAreaPage, ArticlesIndex, ArticlePage, etc.)

- [ ] Universal: bg → warm paper, CTAs → terracotta, headings → navy/DM Sans
- [ ] Article content: ensure `@tailwindcss/typography` prose classes work with warm backgrounds
- [ ] Remove any hardcoded old blue values

---

## Phase E: Wire Up Micro-Animations

After all pages have the correct tokens and colors:

- [ ] Wire `useInView` hook site-wide on all `<section>` elements with `animate-fade-in-up`
- [ ] Add `.stagger-group` CSS and JS toggle to card grids (Services, service features, etc.)
- [ ] Add hero CTA gold pulse to Home and ServicePageV2
- [ ] Add hover animation classes to Button.tsx
- [ ] Add card hover effect to service cards
- [ ] Add header scroll transition
- [ ] Add skeleton shimmer animations (if applicable)
- [ ] Page transition fade (optional, Phase E last)

---

# Change Log

| Date       | Change                                                                               |
| ---------- | ------------------------------------------------------------------------------------ |
| 2026-06-24 | Initial document — warm/gold palette, two-tone CTAs, DM Sans, micro-interaction spec |

---

# Appendix: Color Reference for Dev

For quick reference during implementation — the eight colors that do all the work:

```css
/* Warm canvas */
--color-bg-primary: #f2ede4;
--color-bg-secondary: #ebe4d8;

/* Deep anchor */
--color-primary: #285a8e; /* nav, headers */
--color-primary-dark: #1f3f63; /* hover, mid-gradient */

/* Two-tone actions */
--color-accent-gold: #f7c82a; /* CTAs on dark */
--color-accent-warm: #a45c40; /* CTAs on light */
--color-accent-warm-light: #b8734d; /* warm hover */

/* Warm gray text */
--color-text-primary: #1f2933; /* headings / body */
--color-text-secondary: #4a5568; /* secondary text */
```
