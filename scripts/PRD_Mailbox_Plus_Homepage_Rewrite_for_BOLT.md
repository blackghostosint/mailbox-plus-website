# PRD: Mailbox Plus Homepage Rewrite for BOLT

## 1. Purpose

The goal of this project is to **redesign the Mailbox Plus homepage** to:

- Create a **“wow factor”** with stronger visuals and storytelling.
- Drive **local SEO impact** with Concord Township, Lake County, Mentor, Painesville, Eastlake targeting.
- Provide a **dynamic, future-proof architecture** that pulls from `services.ts` (avoiding duplicate content).
- Increase **conversion** (calls, visits, service inquiries) with clear CTAs and trust-building sections.

------

## 2. Objectives

- **Improve UX**: Visitors should quickly understand what services are offered and where the store is located.
- **Enhance Local SEO**: Add structured content blocks that naturally include local community references.
- **Trust Signals**: Display reviews, guarantees, and recognizable carrier logos (FedEx, UPS, USPS, DHL).
- **Dynamic Content**: Services grid should auto-populate from `services.ts`.
- **Mobile-first**: Optimized for fast loading and one-tap actions (call, directions).

------

## 3. Scope

### In Scope

- Homepage hero redesign (visual + messaging).
- Dynamic services highlights section.
- Local SEO block (communities served + map embed).
- Customer trust block (reviews, insurance badge, logos).
- Community storytelling carousel.
- Strong call-to-action (CTA) footer.
- Responsive design across mobile, tablet, desktop.
- Framer Motion animations for subtle wow factor.

### Out of Scope

- Backend changes beyond current React/TS stack.
- Full redesign of inner service pages (handled separately).
- Custom quote calculator (future phase).

------

## 4. Functional Requirements

### 4.1 Hero Section

- **Background:** Use `heroImage` from flagship service (Pack & Ship).
- **Text:** H1 with local anchor keyword (e.g., “Pack & Ship in Concord Township, Ohio”).
- **Subtext:** Rotating slider cycling through major service categories.
- **CTA Buttons:** “View Services” and “Get Directions”.

------

### 4.2 Services Highlights Grid

- Pull top-level services dynamically from `services.ts`.
- Display:
  - Thumbnail (`heroImage`)
  - `serviceName`
  - `heroSubtitle`
  - “Learn More” link to `slug`.
- Grid layout: 4-up on desktop, 2-up on tablet, 1-up mobile.
- Hover effects with lift + shadow.

------

### 4.3 Local SEO Section

- Static headline: “Proudly Serving Lake County Communities”.
- Subtext: mention Concord Township, Mentor, Painesville, Eastlake.
- Add embedded Google Map with store pin.
- Mini FAQ block (pull 2–3 Q&As from `services.ts`).

------

### 4.4 Trust Signals Section

- **Peace of Mind Badge:** reference Marsh insurance coverage for shipments.
- **Carrier Logos:** FedEx, UPS, USPS, DHL row for instant recognition.

------

### 4.5 Community Stories

- Carousel or cards with local customer stories:
  - “We shipped artwork for a local artist to New York.”
  - “We helped a Mentor business save $200 on bulk mail.”
- Each story includes photo, headline, short description.

------

### 4.6 Call-To-Action Footer

- Big headline: “Visit Us in Concord Township Today”.
- Subtext: *“Next to Pub Frato in Gristmill Village — serving all of Lake County.”*
- Buttons:
  - Primary: “Get Directions” (links to Google Maps).
  - Secondary: “Call Now (440) 709-1946”.

------

## 5. Non-Functional Requirements

- **Performance:** Page should load in < 2s on 4G.
- **Accessibility:** WCAG AA compliance (alt text, ARIA roles, color contrast).
- **SEO:** Metadata (`pageTitle`, `metaDescription`, `keywords`) pulled from config.
- **Responsive:** Fully functional across breakpoints (mobile-first).

------

## 6. Suggested Enhancements

- **Add Schema.org Markup**: LocalBusiness + FAQ + Product schema for rich results.
- **Integrate Google Reviews API** (instead of hardcoding).
- **Add a Quote Form CTA** in future phase (optional for shipping).
- **Sticky Header** with phone number visible on scroll.
- **A/B Testing**: Track CTA clicks via GTM (e.g., “Directions” vs. “Call”).

------

## 7. Deliverables

- Final React/TSX homepage code using Tailwind + Framer Motion.
- Updated assets: hero images, trust badge, carrier logos.
- Documentation on how to update `services.ts` to refresh homepage grid.

------

## 8. Timeline & Roles

- **Design Phase:** Wireframes + UI mockups
- **Dev Phase:** Code implementation + testing
- **Review & Launch:** Content QA, SEO review, deploy 

------

✅ **My Suggestions to You:**

- Decide **which 4–6 services** you want to feature on homepage (not all 20+). Too many = clutter.
  - Mailbox Rental
  - Golf Club Shipping
  - package Receiving
  - Package Drop-Offs
- Approve 3–5 **customer stories** to use in carousel. Create place-holder info for now.
- Provide **storefront photo** for hero background (https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/mailbox_plus_storefront_hero_image.jpg)  (stock images won’t “wow” locals).

