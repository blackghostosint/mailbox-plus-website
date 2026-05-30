# Product Requirements Document (PRD)

## Mailbox Plus Website — V2 Design System & Aesthetic Specification

Version: 1.0
Audience: Designers, developers, contract UI teams, internal contributors
Purpose: Define the visual language, components, motion, spacing, and patterns required so all pages match the ServicePageV2 premium style.

---

# 1. Overview

Mailbox Plus V2 is a premium, hybrid-modern UI system inspired by:

- Apple design (glassmorphism, soft blurs, refined shadows)
- Stripe.com (clean typography, premium gradients, elegant depth)
- Linear.app (minimalism, modern motion, consistent spacing)

This PRD establishes the rules needed to create any new page, section, or component so that it matches the unified V2 look and feel.

All pages (hero pages, service pages, content pages, local SEO pages, and landing pages) must follow the styles defined here.

---

# 2. Aesthetic Principles

2.1 Clean, minimal, elegant

- Avoid visual clutter
- Maximize whitespace
- Large headings and structured spacing hierarchy
- Prefer opacity and blur over solid color blocks
- Light-mode focus only

  2.2 Soft, premium depth

- Subtle elevation
- No heavy shadows
- Use layered cards to create hierarchy, not hard borders

  2.3 Gentle gradients

- Long, subtle blue gradient flows
- No harsh transitions
- No neon or rainbow colors

  2.4 Glassmorphism

- Blur between 15–30px
- Opacity 60%–85%
- Soft white overlays
- Subtle gradient borders
- No harsh frost or noise textures

  2.5 Motion is calm and purposeful

- Smooth ease-out transitions
- No exaggerated or bouncy animation
- Only controlled vertical reveal animations

---

# 3. Core Color Palette

Primary Brand Blue:

- #0855B1 (core brand identity)
  Used for key text, CTAs, icons, and accents.

Hero Gradient Background (standard):

- #0B4BB6 → #1A6DFF → #021B4A

Surface Colors:

- Pure White: #FFFFFF
- Glass White: rgba(255,255,255,0.70)
- Light Background: #F8FAFC (Tailwind slate-50)

Accent Colors:

- Blue Glow: rgba(80,120,255,0.25)
- Light Border Slate: rgba(255,255,255,0.60)
- Subtle Shadow Slate: rgba(15,23,42,0.10)

Prohibited Colors:

- Orange
- Hard reds
- Neon greens
- Harsh pure black backgrounds

All pages must maintain a blue-based monochromatic palette.

---

# 4. Shape and Layout Specification

4.1 Border Radius

- Icon containers: 12–16px
- Standard cards: 24–26px
- Features, content blocks, FAQ containers: 26–30px
- CTA panels: 30px or above

  4.2 Section Spacing
  Vertical spacing requirements:

- Standard sections: 80px
- Major sections (hero to first content block): 120px
- Card groups: 60px

  4.3 Typography

- Modern sans-serif such as Inter or SF Pro
- Hero headings: 3.5–4.5rem
- Section headings: 2–3rem
- Body text: 1–1.125rem
- Avoid heavy bolding for large blocks of text

Typography hierarchy (descending order):

1. Hero heading
2. Section heading
3. Sub-heading or overline
4. Body text
5. Labels / footnotes

4.4 Grid System

- Maximum width: 1200px
- Two-column or three-column layouts preferred depending on content
- Centered content for hero and CTA blocks
- Never stretch text full-width

  4.5 List Formatting Standards

All lists in content sections must use structured HTML with premium visual styling:

**Standard List Template:**

```html
<ul class="space-y-4 my-6">
  <li class="flex items-start gap-4">
    <div class="mt-1 bg-blue-50 p-1.5 rounded-full text-blue-600 shrink-0 border border-blue-100">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
    <div class="text-gray-700 leading-relaxed">
      <strong class="text-gray-900">Feature Name:</strong> Description text.
    </div>
  </li>
</ul>
```

**Prohibited:**

- Manual bullet characters (`•`, `-`, `*`) in paragraph text
- Plain text lists without visual structure
- Lists without proper vertical spacing

**Required:**

- Premium SVG checkmark icons in rounded blue badges
- Proper flex layout with `gap-4` for icon-text alignment
- Vertical spacing using `space-y-4`
- Bold headings followed by descriptive text
- Responsive design that maintains hierarchy on all screen sizes

---

# 5. Glass Components Specification

All glassmorphism components must follow:

background: rgba(255,255,255,0.70)
backdrop-filter: blur(24px)
border: 1px solid rgba(255,255,255,0.70)
box-shadow: 0 18px 45px rgba(15,23,42,0.20)
border-radius: 26px

Applies to:

- Intro cards
- Feature cards
- Content text blocks
- FAQ container
- CTA container

---

# 6. Feature Card Specification

Required characteristics:

- Glassmorphic white background
- Rounded 24–26px corners
- Soft elevation with subtle shadow
- Premium icon container
- Gradient overlay fade on hover
- Clean title and body text

Icon container specification:

width: 48px
height: 48px
border-radius: 16px
background: linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,50,255,0.10))

Hover elevation:

transform: translateY(-4px);
box-shadow: 0 12px 30px rgba(15,23,42,0.12);

---

# 7. Motion Guidelines

Scroll reveal animation parameters:

initial: { opacity: 0, y: 32 }
whileInView: { opacity: 1, y: 0 }
transition: { duration: 0.55, ease: "easeOut" }
viewport: { once: true }

Applies to:

- Intro card
- Feature cards
- Content blocks
- FAQ
- CTA panel

Hover animation requirements:

- Vertical lift of 2–6px
- Scale of 1.01 maximum
- Tension-free transition (0.2–0.3s)

Prohibited animations:

- Bounce
- Spring
- Rotation
- Over-scaling

---

# 8. Hero Section Standard

The hero section for all pages must include:

- Full-bleed gradient background
- Blended hero image using mix-blend-soft-light
- Optional rating pill with blur + translucent background
- Large heading using white text
- Subtitle using blue-100
- Primary call-to-action using the “secondary” CTA button style
- 24–32px soft fade at bottom transitioning into the background

Hero spacing:

- Padding top: 90–120px
- Padding bottom: 150–180px
- First section overlaps hero via -16px to -28px negative margin

---

# 9. CTA Panel Requirements

CTA panels must include:

- Blue gradient shell matching brand
- Inner glass overlay panel
- Border radius of 28–32px
- White text throughout
- One primary CTA button
- Subtle glow or elevation matching ServicePageV2 CTA

CTA typography:

- Title: 2.25–2.75rem
- Subtitle: 1–1.25rem

---

# 10. FAQ Panel Requirements

FAQ panels must always include:

- Light slate gradient background band
- Glass interior FAQ container
- Rounded corners of 28–32px
- Soft borders and minimal shadows
- Clean, left-aligned accordion pattern
- Blue-colored question text

---

# 11. Required Page Structure

All service pages and most content pages must follow this sequence:

1. Breadcrumbs
2. Hero
3. Floating intro card
4. Features block
5. Alternating content panels
6. FAQ
7. Call-to-action block
8. Carrier logos
9. Competitor alternative content

Exceptions require approval.

---

# 12. Developer Requirements

Developers must:

- Use Tailwind spacing and color tokens consistently
- Maintain the border radius and motion rules defined
- Use the approved gradient palette
- Follow the established vertical spacing rhythm
- Build components using reusable patterns matching ServicePageV2

Prohibited:

- Introducing new color palettes
- Redefining shadows
- Creating new gradient types
- Changing radii without approval

---

# 13. Designer Checklist (Summary)

Before delivering a design, ensure:

- All shapes use the standard radius range
- All sections use the spacing rhythm
- Typography matches established scale hierarchy
- Hero layout follows the gradient + image + fade convention
- Feature cards look identical to the V2 patterns
- CTA block uses gradient shell + inner glass
- FAQ uses correct background band and container styling
- Colors remain on-brand within the blue-slate-white system
- Motion is minimal, smooth, and consistent

If any content visually deviates from V2 styling, the design must be revised.

---

# 14. Deliverables

All approved pages or components must include:

- Full responsiveness
- Matching depth, blur, gradients, and spacing
- Correct typography hierarchy
- Proper color palette usage
- Clean animations following the V2 reveal pattern
- Exact layout matching the ServicePageV2 premium aesthetic
