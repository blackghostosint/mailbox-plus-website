# Mailbox Plus Design System

## Overview

The design system is built on CSS custom properties (design tokens) defined in `src/index.css` and exposed as Tailwind utility classes via `tailwind.config.js`.

## Color Tokens

### Primary Brand

| Token                    | Value     | Usage                            |
| ------------------------ | --------- | -------------------------------- |
| `--color-primary`        | `#0855b1` | Main brand color, buttons, links |
| `--color-primary-dark`   | `#064a9b` | Hover states                     |
| `--color-primary-deeper` | `#064080` | Active states                    |
| `--color-primary-deep`   | `#06408a` | Alternate dark                   |

**Tailwind classes:** `primary`, `primary-dark`, `primary-deeper`, `primary-deep`

### Secondary Accent

| Token                  | Value     | Usage                 |
| ---------------------- | --------- | --------------------- |
| `--color-accent`       | `#1a6dff` | CTAs, highlights      |
| `--color-accent-light` | `#2f7cfb` | Gradient stops, hover |
| `--color-alt-accent`   | `#2da0ed` | Alternate accent      |

**Tailwind classes:** `accent`, `accent-light`, `accent-alt`

### Backgrounds

| Token                  | Value     | Usage                |
| ---------------------- | --------- | -------------------- |
| `--color-bg-primary`   | `#f9fafb` | Page background      |
| `--color-bg-secondary` | `#f8fafc` | Card backgrounds     |
| `--color-bg-blue-tint` | `#f0f7ff` | Blue-tinted sections |
| `--color-bg-cyan-tint` | `#e0f2fe` | Cyan-tinted sections |

**Tailwind classes:** `bg-primary`, `bg-secondary`, `bg-blue-tint`, `bg-cyan-tint`

### Text

| Token                    | Value     | Usage                    | Contrast Ratio   |
| ------------------------ | --------- | ------------------------ | ---------------- |
| `--color-text-primary`   | `#111827` | Headings, body           | 16.75:1 on white |
| `--color-text-secondary` | `#4b5563` | Subheadings, captions    | 7.46:1 on white  |
| `--color-text-muted`     | `#64748b` | Muted text, placeholders | 5.74:1 on white  |

All text colors pass WCAG AA for normal text (4.5:1 minimum).

**Tailwind classes:** `text-primary`, `text-secondary`, `text-muted`

### Surface / Borders

| Token                 | Value     | Usage                            |
| --------------------- | --------- | -------------------------------- |
| `--color-border`      | `#e2e8f0` | Default borders                  |
| `--color-border-blue` | `#b2d3eb` | Blue-tinted borders, focus rings |

**Tailwind classes:** `border`, `border-blue`

### Gradient Stops

| Token                    | Value     | Usage                      |
| ------------------------ | --------- | -------------------------- |
| `--color-gradient-start` | `#0b4bb6` | Gradient start (hero, CTA) |
| `--color-gradient-mid`   | `#021b4a` | Gradient middle            |
| `--color-gradient-end`   | `#02152f` | Gradient end               |

## Shadow Tokens

| Token         | Value                             | Usage                   |
| ------------- | --------------------------------- | ----------------------- |
| `--shadow-sm` | `0 10px 30px rgba(0,0,0,0.04)`    | Cards, subtle elevation |
| `--shadow-md` | `0 10px 30px rgba(0,0,0,0.08)`    | Interactive elements    |
| `--shadow-lg` | `0 18px 45px rgba(15,23,42,0.10)` | Panels, modals          |
| `--shadow-xl` | `0 26px 65px rgba(15,23,42,0.25)` | Hero sections, CTA      |

**Tailwind classes:** `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

## Surface Tint Tokens

Used for glassmorphic effects (`bg-white/N` pattern):

| Token              | Value                   | Usage                |
| ------------------ | ----------------------- | -------------------- |
| `--surface-subtle` | `rgba(255,255,255,0.5)` | Light glass overlay  |
| `--surface-medium` | `rgba(255,255,255,0.6)` | Medium glass overlay |
| `--surface-strong` | `rgba(255,255,255,0.7)` | Strong glass cards   |
| `--surface-heavy`  | `rgba(255,255,255,0.8)` | Heavy glass panels   |

## Border Radius Scale

| Token          | Value    | Usage                        |
| -------------- | -------- | ---------------------------- |
| `rounded-sm`   | `12px`   | Small elements, tags         |
| `rounded-md`   | `20px`   | Accent cards, inputs         |
| `rounded-lg`   | `26px`   | Standard cards (most common) |
| `rounded-xl`   | `30px`   | Large panels, CTA sections   |
| `rounded-2xl`  | `40px`   | Section wrappers             |
| `rounded-full` | `9999px` | Pills, circular elements     |

## Usage Examples

```tsx
// Primary button with focus ring
<Button variant="primary">Get Started</Button>

// Glass card with shadow
<div className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-lg shadow-lg p-6">
  Card content
</div>

// Gradient hero section
<section className="bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-accent)] to-[var(--color-gradient-mid)]">
  <h1 className="text-white">Page Title</h1>
</section>
```

## Adding New Tokens

1. Add the CSS custom property to `src/index.css` in the `:root` block
2. Register it in `tailwind.config.js` under `theme.extend.colors` or the appropriate key
3. Document it in this file
