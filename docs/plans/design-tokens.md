# Design Token Mapping for Phase 5

## Source: 38 unique hardcoded colors across 27 files

## Token Definitions

### Primary Brand Colors

| Token                    | Hex       | Usage                                                   |
| ------------------------ | --------- | ------------------------------------------------------- |
| `--color-primary`        | `#0855B1` | Main brand blue -- buttons, links, accents, backgrounds |
| `--color-primary-dark`   | `#064A9B` | Hover/active state for primary                          |
| `--color-primary-deeper` | `#064080` | Dark variant (Services page specific)                   |
| `--color-primary-deep`   | `#06408A` | Deep blue (Tracking page specific)                      |

### Secondary Accent Colors

| Token                  | Hex       | Usage                                             |
| ---------------------- | --------- | ------------------------------------------------- |
| `--color-accent`       | `#1A6DFF` | Light blue accent -- gradient end, CTA highlights |
| `--color-accent-light` | `#2F7CFB` | Lighter accent variant                            |
| `--color-alt-accent`   | `#2DA0ED` | Alternate accent (packing-services.ts only)       |

### Background Colors

| Token                  | Hex       | Usage                                    |
| ---------------------- | --------- | ---------------------------------------- |
| `--color-bg-primary`   | `#F9FAFB` | Light gray page background               |
| `--color-bg-secondary` | `#F8FAFC` | Slightly lighter bg (chat widget)        |
| `--color-bg-blue-tint` | `#F0F7FF` | Blue-tinted background (cards, sections) |
| `--color-bg-cyan-tint` | `#E0F2FE` | Cyan-tinted background (StoreHours)      |

### Text Colors

| Token                    | Hex       | Usage                    |
| ------------------------ | --------- | ------------------------ |
| `--color-text-primary`   | `#111827` | Near-black headings      |
| `--color-text-secondary` | `#4B5563` | Body text gray           |
| `--color-text-muted`     | `#64748b` | Muted text (chat widget) |

### Border/Surface Colors

| Token                 | Hex       | Usage                |
| --------------------- | --------- | -------------------- |
| `--color-border`      | `#e2e8f0` | Default border color |
| `--color-border-blue` | `#B2D3EB` | Blue-tinted border   |

### Gradient Colors

| Token                    | Hex       | Usage                          |
| ------------------------ | --------- | ------------------------------ |
| `--color-gradient-start` | `#0B4BB6` | Gradient start (hero sections) |
| `--color-gradient-mid`   | `#021B4A` | Gradient middle                |
| `--color-gradient-end`   | `#02152F` | Gradient end (darkest)         |

### Overlay/RGBA Patterns

These use the same base colors with varying opacity:

- `rgba(15,23,42,N)` → `--color-overlay` base `#0f172a` (slate-900)
- `rgba(8,85,177,N)` → `--color-overlay-blue` base `#0855B1` (primary)
- `rgba(0,0,0,N)` → `--color-shadow` base `#000000`

## Replacement Pattern

In Tailwind class strings, use arbitrary value syntax:

- `bg-[#0855B1]` → `bg-[var(--color-primary)]`
- `text-[#111827]` → `text-[var(--color-text-primary)]`
- `from-[#0B4BB6]` → `from-[var(--color-gradient-start)]`
- `rgba(15,23,42,0.15)` → use opacity modifier: `bg-[var(--color-overlay)]/15`

## Files Requiring Changes (27 total)

### High Priority (most colors)

1. ServicePageV2.tsx (~20 color values)
2. Tracking.tsx (~11 color values)
3. Services.tsx (~10 color values)
4. ContactUs.tsx (~10 color values)
5. AboutUs.tsx (~8 color values)
6. ShippingPartners.tsx (~9 color values)
7. PickupHours.tsx (~7 color values)
8. StoreHours.tsx (~7 color values)
9. fedex-easy-returns.tsx (~8 color values)
10. Home.tsx (~6 color values)

### Medium Priority

11. MailbotPlusChat/index.tsx (~11 color values)
12. Privacy.tsx (~6 color values)
13. Terms.tsx (~6 color values)
14. ask-mailbox-plus.tsx (~5 color values)
15. Button.tsx (~4 color values)
16. Footer.tsx (~4 color values)
17. Header.tsx (~3 color values)
18. NotFound.tsx (~4 color values)

### Low Priority (1-2 colors each)

19. Layout.tsx, CTA.tsx, ServiceGrid.tsx, AutoBreadcrumbs.tsx
20. Breadcrumbs.tsx, InternalLink.tsx, PremierSignupModal.tsx
21. SearchBox.tsx, accordion.tsx
22. mailbox-rentals.ts, amazon-returns.ts, packing-services.ts
23. ServiceAreaIndex.tsx, CopyingServices.tsx
