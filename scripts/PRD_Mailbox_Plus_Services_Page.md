# PRD: Mailbox Plus Services Page (Dynamic From `services.ts`)

## 1. Purpose

The Services Page serves as a **central directory** for all offerings at Mailbox Plus. It should provide a **clear, organized overview** of services grouped by category, while maintaining design consistency with the homepage. Unlike the homepage, this page is meant to be **straightforward, scannable, and navigational** rather than storytelling-heavy.

------

## 2. Objectives

- Dynamically display services from the central config file `services.ts`.
- Organize services by category (`pack-ship`, `copy-print`, `home-business`, `specialty`).
- Provide short summaries with links to detail pages.
- Ensure brand and UI consistency (colors, icons, animations).
- Enhance SEO with structured metadata and internal linking.

------

## 3. Scope

### In Scope

- Hero section with a concise services-focused headline.
- Dynamic service directory grouped by category.
- Each service: title, subtitle/description, image/icon, “Learn More” link.
- Optional simple FAQ for common service questions.
- CTA footer with “Contact Us” and “Call Now.”

### Out of Scope

- Deep storytelling (belongs to homepage and service detail pages).
- Testimonials, reviews, or insurance details (covered elsewhere).
- Custom interactive tools (future phase).

------

## 4. Functional Requirements

### 4.1 Hero Section

- **Headline:** “Our Services”
- **Subtext:** “From shipping and printing to mailbox rentals and fingerprinting — Mailbox Plus is your one-stop business solution in Lake County.”
- **Visual:** Clean image or abstract background.
- **CTA:** One button — “Contact Us”

------

### 4.2 Service Directory (Dynamic)

- Services pulled from `services.ts`.
- Group by `category`. Each category block should include:
  - Category title (e.g., “Pack & Ship”)
  - Grid of service cards (2–3 columns desktop, 1 mobile)

**Each Service Card should display:**

- Thumbnail (`heroImage`) or icon.
- Service name (`serviceName`).
- Short description (`heroSubtitle`).
- “Learn More →” link (`slug`).

👉 Optional: If `popular: true`, show a “Featured” badge.

------

### 4.3 Category Dividers

- Before each service group, show a short tagline. Example:
  - “📦 Pack & Ship — Shipping with FedEx, UPS, USPS, and DHL made easy.”
- Helps scanning, improves keyword density for SEO.

------

### 4.4 Optional FAQ Block

- Simple **2–3 FAQs** relevant across services (not per service). Example:
  - “Do you accept Amazon returns?”
  - “Do I need an appointment for fingerprinting?”
  - “Can you ship fragile artwork?”

👉 Implement FAQ schema for SEO.

------

### 4.5 CTA Footer

- Consistent with homepage styling.
- **Headline:** “Have Questions About Our Services?”
- **Buttons:**
  - “Contact Us” → `/contact-us`
  - “Call (440) 709-1946” (click-to-call)

------

## 5. Non-Functional Requirements

- **Performance:** Optimize service images (WebP, lazy loading).
- **SEO:**
  - Title: “Mailbox Plus Services in Concord Township, Lake County, Ohio”
  - MetaDescription: “Explore shipping, printing, mailbox rentals, fingerprinting, and more services from Mailbox Plus in Lake County, Ohio.”
  - Use keywords from `services.ts`.
- **Accessibility:** Icons labeled, alt tags required on all images.

------

## 6. Suggested Enhancements

- Add a **filter/search bar** for services (future phase).
- Highlight **popular services** automatically using the `popular: true` property.
- Consider a **“featured service of the month”** row (future marketing idea).

------

## 7. Deliverables

- React/TypeScript Services Page powered by `services.ts`.
- Layout:
  1. Hero
  2. Services grouped by category
  3. (Optional) FAQ
  4. CTA Footer
- Fully responsive and styled with Tailwind + Framer Motion.

------

✅ **Summary:**
 The Services Page becomes a **dynamic, easy-to-maintain directory** where everything pulls from `services.ts`. It’s cleaner than the homepage, focuses on navigation, and supports SEO/local visibility without repeating all the storytelling.