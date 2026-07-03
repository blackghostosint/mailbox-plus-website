# Mailbox Plus Design System — Warm/Gold Aesthetic

**Date:** June 24, 2026
**Status:** Current — supersedes all previous design system documents

## Overview

The Mailbox Plus brand is defined by a **warm, premium, boutique feel** — cream paper backgrounds, deep navy anchors, and a two-tone accent system that pairs gold against dark sections with deep terracotta against light sections. The aesthetic is approachable but elevated: think independent bookstore, boutique hotel, or a well-appointed local shop — not corporate, not cold, not brassy.

**Design philosophy:** Warmth is the carrier. The cream backgrounds do most of the work. Accents are deliberate and restrained.

---

## Color System

### Primary Brand — Deep Navy (Anchors)

Dark, grounded, trustworthy. Used for navigation, section headers, and as the canvas for gold CTAs.

| Token                    | Value     | Usage                                              |
| ------------------------ | --------- | -------------------------------------------------- |
| `--color-primary`        | `#285a8e` | Nav background, brand anchor, dark section headers |
| `--color-primary-dark`   | `#1f3f63` | Hover/active states on dark elements               |
| `--color-primary-deeper` | `#1a3554` | Gradient middle stop                               |
| `--color-primary-deep`   | `#162c45` | Gradient end stop, deepest navy                    |

### Two-Tone Accent System

The key design decision: **one accent does not fit all backgrounds.** Gold pops on navy but is invisible on cream. Terracotta reads clearly on cream but fades on navy. Rather than compromise on a single color, the system uses two purpose-built accents.

**Gold** — for dark navy backgrounds (heroes, CTA bands, dark sections)

| Token                       | Value     | WCAG on deep navy | Usage                                                             |
| --------------------------- | --------- | ----------------- | ----------------------------------------------------------------- |
| `--color-accent-gold`       | `#f7c82a` | 8.95:1 ✅ AA      | Filled CTAs on dark, gold badges, decorative accents against navy |
| `--color-accent-gold-light` | `#f7d46a` | —                 | Hover glow, lighter gold highlights on dark                       |

> **In practical terms:** The gold is your "hero action" button. It lives on navy backgrounds — hero sections, "Get Started" bands, pricing tiers. It should never appear as text on a cream or white background (1.36:1 — invisible).

**Deep Terracotta** — for warm paper/cream backgrounds (content areas, service cards, light sections)

| Token                       | Value     | WCAG on warm paper | Usage                                                           |
| --------------------------- | --------- | ------------------ | --------------------------------------------------------------- |
| `--color-accent-warm`       | `#a45c40` | 4.30:1 ✅ AA       | Filled CTAs on light, links, active states, warm accent borders |
| `--color-accent-warm-light` | `#b8734d` | 3.25:1 AA (lg)     | Hover states, softer accent on light                            |

> **In practical terms:** The terracotta is your everyday action color. It lives on the cream backgrounds — "Learn More" on a service card, "Drop Off a Return" button, "See All Services" links. It reads as warm, premium, and intentional.

### Backgrounds — Warm Paper

The foundation of the look. These substitute for the corporate whites and grays.

| Token                  | Value     | Usage                                |
| ---------------------- | --------- | ------------------------------------ |
| `--color-bg-primary`   | `#f2ede4` | Main page background                 |
| `--color-bg-secondary` | `#ebe4d8` | Card backgrounds, section alternates |
| `--color-bg-warm-tint` | `#e6e0d6` | Tinted sections, slight depth        |

**Removed tokens** (no longer used):

- `--color-bg-blue-tint` — replaced by warm tints
- `--color-bg-cyan-tint` — replaced by warm tints

### Text — Charcoal Navy + Warm Slate

All text colors retain WCAG AA against all background variants.

| Token                    | Value     | Usage                       | Contrast on warm paper |
| ------------------------ | --------- | --------------------------- | ---------------------- |
| `--color-text-primary`   | `#1f2933` | Headings, body text         | 14.2:1 ✅              |
| `--color-text-secondary` | `#4a5568` | Subheadings, secondary text | 7.1:1 ✅               |
| `--color-text-muted`     | `#667085` | Muted labels, captions      | 4.8:1 ✅               |

### Surface / Borders — Gentle Warm Gray

| Token                   | Value     | Usage                                                        |
| ----------------------- | --------- | ------------------------------------------------------------ |
| `--color-border`        | `#e6e0d6` | Default borders, dividers, section separators                |
| `--color-border-strong` | `#d4c9b8` | Emphasized borders, input fields, focus rings, card outlines |

**Removed tokens:**

- `--color-border-blue` — replaced by warm border variants

### Gradient Stops — Deep Navy (Heroes, CTA Bands)

```
--color-gradient-start: #285a8e  →  --color-gradient-mid: #1f3f63  →  --color-gradient-end: #162c45
```

Standard gradient: `bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)]`

---

## Shadows & Depth

| Token         | Value                             | Usage                       |
| ------------- | --------------------------------- | --------------------------- |
| `--shadow-sm` | `0 10px 30px rgba(31,41,51,0.04)` | Subtle card elevation       |
| `--shadow-md` | `0 10px 30px rgba(31,41,51,0.08)` | Interactive elements, hover |
| `--shadow-lg` | `0 18px 45px rgba(31,41,51,0.10)` | Panels, modals              |
| `--shadow-xl` | `0 26px 65px rgba(31,41,51,0.25)` | CTA sections, hero overlays |

Shadows use dark charcoal (`#1f2933`) at low opacity — warm and soft, not harsh black.

## Surface Tints

Used for glass/overlay effects with `backdrop-blur`.

| Token              | Value                      | Usage                |
| ------------------ | -------------------------- | -------------------- |
| `--surface-subtle` | `rgba(255, 255, 255, 0.5)` | Light glass overlay  |
| `--surface-medium` | `rgba(255, 255, 255, 0.6)` | Medium glass overlay |
| `--surface-strong` | `rgba(255, 255, 255, 0.7)` | Strong glass cards   |
| `--surface-heavy`  | `rgba(255, 255, 255, 0.8)` | Heavy glass panels   |

## Border Radius Scale

| Token          | Value    | Usage                             |
| -------------- | -------- | --------------------------------- |
| `rounded-sm`   | `12px`   | Small elements, tags, badges      |
| `rounded-md`   | `20px`   | Inputs, small cards               |
| `rounded-lg`   | `26px`   | Standard cards (most common)      |
| `rounded-xl`   | `30px`   | Large panels, CTA sections        |
| `rounded-2xl`  | `40px`   | Section wrappers, hero containers |
| `rounded-full` | `9999px` | Pills, circular elements          |

## Typography

### Font Stack

| Role     | Font                      | Fallback                             | Weight Scale         |
| -------- | ------------------------- | ------------------------------------ | -------------------- |
| Body     | **DM Sans**               | system-ui, -apple-system, sans-serif | 400, 500, 600, 700   |
| Headings | **DM Sans** (same family) | system-ui, -apple-system, sans-serif | 600, 700 (font-bold) |

**Rationale:** DM Sans gives a warm, clean, slightly rounded feel that pairs naturally with the cream backgrounds and gold accents. It has excellent readability at small sizes and a premium feel at display sizes. Using a single family (DM Sans for both body and headings) simplifies the typographic system and reduces HTTP requests.

**Previous fonts replaced:**

- Poppins (headings) → DM Sans
- Open Sans (body) → DM Sans

### Size Scale (Tailwind defaults, no custom overrides)

```
text-xs → text-sm → text-base → text-lg → text-xl → text-2xl → text-3xl → text-4xl → text-5xl
```

### CLS Mitigation

DM Sans is self-hosted as a variable font in `/public/fonts/dmsans-regular.woff2`. A fallback `@font-face` in `src/index.css` prevents layout shift:

```css
@font-face {
  font-family: 'DM Sans Fallback';
  src: local('system-ui');
  size-adjust: 96%;
  ascent-override: 90%;
  descent-override: 25%;
  line-gap-override: 0%;
}
```

---

## CTA Button Styles

**Two-tone system — background determines accent:**

| Button Location   | Background                     | Text                       | Accent Used |
| ----------------- | ------------------------------ | -------------------------- | ----------- |
| On navy/dark      | `var(--color-accent-gold)`     | `#162c45` (deep navy text) | Gold        |
| On warm paper     | `var(--color-accent-warm)`     | `#ffffff` (white text)     | Terracotta  |
| On navy (outline) | Transparent, gold border       | Gold                       | Gold        |
| On warm (outline) | Transparent, terracotta border | Terracotta                 | Terracotta  |

### Primary CTA copy conventions

- Always action-oriented: `→ Get Started`, `→ See Your Options`, `→ Get Your Address`
- Include risk reversal where applicable: `— 30-Day Risk-Free`
- Arrow prefix (`→`) signals forward motion

---

## Border System

Cards, input fields, form containers, stat boxes, and section blocks get **1px `--color-border-strong`** (`#d4c9b8`) for definition against the warm paper background.

Dividers, section separators, and subtle rules use the lighter `--color-border` (`#e6e0d6`).

**Why:** Cream-on-cream needs a visible border to define interactive elements. `#d4c9b8` provides clear hit areas without harshness.

---

## SB7 Integration (StoryBrand Avatars)

Every page serves a specific hero segment (SB7 Face). The design system supports each face through intentional CTA placement, content hierarchy, and emotional tone.

### Page-to-Face Mapping

| Page                         | Primary Face                                     | Secondary Face | Rationale                                                        |
| ---------------------------- | ------------------------------------------------ | -------------- | ---------------------------------------------------------------- |
| Home                         | All (A–E, R1–R2, S1–S2)                          | —              | Front door — orients all visitors before directing to their path |
| Mailbox Rental               | **A** (Online Seller)                            | B, E           | Core differentiated product — seller privacy is the hero story   |
| Pack & Ship pages            | **S2** (Rate Shopper), **S1** (Valuable Shipper) | —              | Searcher intent — they want to ship something now                |
| Returns pages                | **R1** (Multi-Carrier), **R2** (Errand-Runner)   | —              | Searcher intent — they're already holding a return label         |
| Notary / Printing / Document | **B** (Small Business)                           | —              | Business customers needing supporting services                   |
| Contact Us                   | **B** (Small Business)                           | All            | Walk-in visitors and business inquiries                          |
| About Us                     | **All**                                          | —              | Brand trust — speaks to every segment                            |
| Tracking                     | **S2**, **R1**                                   | —              | Transactional — they just want to know where their package is    |

### Design Choices by SB7 Position

The two-tone accent system maps naturally to the SB7 story arc:

| SB7 Position            | Design Treatment                                         | Accent                | Why                                                          |
| ----------------------- | -------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| **Character / Problem** | Navy hero with emotional headline, gold CTA              | Gold on dark          | Creates stakes, grabs attention, feels urgent                |
| **Guide (Empathy)**     | Warm paper section with warm-toned body copy             | None (text-secondary) | Warmth and approachability — no hard sell                    |
| **Guide (Authority)**   | Navy band or tinted card with stats/badges               | Gold highlights       | Trust signals pop against dark background                    |
| **Plan**                | Warm paper cards with clear numbered steps               | Terracotta CTAs       | Clean, actionable, no pressure                               |
| **CTA (Direct)**        | Gold filled button on navy or terracotta filled on cream | Per background        | The action moment — accent matches the canvas                |
| **CTA (Transitional)**  | Ghost/outline button                                     | Same accent as direct | Lower commitment, same visual language                       |
| **Stakes**              | Navy section with loss-aversion copy, gold CTAs          | Gold on dark          | Heightened emotion, urgency without panic                    |
| **Success**             | Warm paper or light section with aspirational imagery    | Terracotta            | Warm resolution, comfortable, the transformation is complete |

### Face-Tailored CTA Copy

The CTA language shifts per face while using the same visual button styles:

| Face                            | Direct CTA Example                                | Transitional CTA Example             |
| ------------------------------- | ------------------------------------------------- | ------------------------------------ |
| **A** (Online Seller)           | → Get Your Lake County Address — 30-Day Risk-Free | Stop by and see your mailbox options |
| **B** (Small Business)          | → Get Your Business Address                       | See how it works for your business   |
| **C** (RVer)                    | → Keep Your Ohio Address While You Travel         | Learn about our traveler plans       |
| **D** (Mover)                   | → One Address That Moves With You                 | Stop by and see your options         |
| **E** (Privacy Seller)          | → Protect Your Home Address Today                 | See how the address pipeline works   |
| **S1** (Valuable Shipper)       | → Get a Quote for Your Package                    | See our packing options              |
| **S2** (Rate Shopper)           | → Compare Carrier Rates                           | Drop off at our counter              |
| **R1** (Multi-Carrier Returner) | → Drop Off Your Return                            | See our return desk hours            |

### Depth Layer Alignment

The warm/gold design system intentionally supports SB7 depth layers through visual hierarchy:

- **Layer 3 (Story Gap):** Navy hero with a question or provocative statement — the dark background says "pay attention"
- **Layer 5 (Loss Aversion):** Stakes section in navy — visual weight communicates seriousness
- **Layer 7 (Aspirational Identity):** Warm paper success section — the cream background says "you've arrived"
- **Layer 15 (Scaffolding Hidden):** Framework labels (Villain, Guide, Plan, etc.) are internal tools only — never appear in rendered copy. The design carries the story weight visually.

---

## Usage Examples

### Hero section with gold CTA

```tsx
<section className="bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] min-h-[80vh]">
  <h1 className="text-white font-bold text-4xl lg:text-5xl max-w-2xl">
    Your home address is on every package you ship.
  </h1>
  <button className="bg-[var(--color-accent-gold)] text-[var(--color-primary-deep)] font-semibold px-8 py-4 rounded-lg">
    → Get Your Address — 30-Day Risk-Free
  </button>
  <a className="text-[var(--color-accent-gold)] underline underline-offset-4">See your options →</a>
</section>
```

### Service card on warm paper with terracotta CTA

```tsx
<div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 border border-[var(--color-border-strong)]">
  <h2 className="text-[var(--color-text-primary)] font-semibold">Ship a Package</h2>
  <p className="text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL — we compare rates.</p>
  <button className="bg-[var(--color-accent-warm)] text-white font-semibold px-6 py-3 rounded-md">
    → Get Started
  </button>
</div>
```

### Form input

```tsx
<input
  className="w-full px-4 py-3 rounded-md border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-3 focus:ring-[var(--color-border-strong)]/25"
  type="text"
  placeholder="Your name"
/>
```

---

## Token Cleanup Checklist

These CSS tokens exist in `src/index.css` but are remnants of the old blue design system. They are currently aliased to warm equivalents for backward compatibility:

| Token                          | Current state                       | Status                             |
| ------------------------------ | ----------------------------------- | ---------------------------------- |
| `--color-bg-blue-tint`         | Aliased to `--color-bg-warm-tint`   | Migrate callers, then remove alias |
| `--color-bg-cyan-tint`         | Aliased to `--color-bg-warm-tint`   | Migrate callers, then remove alias |
| `--color-border-blue`          | Aliased to `--color-border-strong`  | Migrate callers, then remove alias |
| Poppins + Open Sans font files | Replaced with DM Sans variable font | ✅ Done (PR #177)                  |

## Document Inventory

The following docs are superseded by this document and have been archived out of the repo (preserved in git history):

- `docs/plans/design-tokens.md` — mapped the old blue system
- `docs/plans/phase-5-design-system.md` — implementation plan for the old system
- `archive/` (directory) — pre-redesign planning documents
- `STRATEGIC_ROADMAP.md` — aspirational plan, not current direction
- `AUDIT_REPORT_2026-05-30.md` — month-old audit, out of date
- `PERFORMANCE_STRATEGY_DRAFT.md` — draft status, not current
