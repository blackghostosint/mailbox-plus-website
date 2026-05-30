# Mailbox Plus Site Guide

This comprehensive guide is designed for developers and content editors to understand the structure, workflows, and standards of the Mailbox Plus website.

## 1. Project Overview & Tech Stack

The Mailbox Plus website is a modern, static site generator (SSG) style application built with React and Vite. It focuses on performance, SEO, and user experience.

*   **Frontend Framework:** [React](https://react.dev/) (v18) with TypeScript
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** [React Router](https://reactrouter.com/en/main)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Storage (Images):** [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
*   **Deployment:** [Netlify](https://www.netlify.com/)

### Key Directory Structure

*   `src/pages/`: All page components (Services, Landing pages, etc.)
*   `src/components/`: Reusable UI components
*   `src/config/`: Data-driven configuration (Services, FAQs, Metadata)
*   `src/data/`: JSON data for internal linking and routing
*   `public/`: Static assets (images, robots.txt, _redirects)

---

## 2. Content & SEO Workflow

### Adding a New Service Page

To add a new service (e.g., "Drone Delivery"), follow these steps:

1.  **Create the Page Component:**
    Create a new file in `src/pages/DroneDelivery.tsx`. Use the `ServicePage` component as a wrapper.

    ```tsx
    import React from 'react';
    import { ServicePage } from '../components/ServicePage';

    const DroneDelivery = () => {
      return (
        <ServicePage
          title="Drone Delivery Services"
          // ... other props
        >
          {/* Page Content */}
        </ServicePage>
      );
    };

    export default DroneDelivery;
    ```

2.  **Register the Service Configuration:**
    Add the service details to the appropriate category file in `src/config/services/` (e.g., `pack-ship.ts`).

    ```typescript
    export const packShipServices: Service[] = [
      // ... existing services
      {
        slug: "/pack-ship/drone-delivery",
        serviceName: "Drone Delivery",
        title: "Drone Delivery Services",
        shortDescription: "Fast air delivery...",
        icon: Plane, // Import from lucide-react
        heroImage: "/images/services/drone-delivery.jpg" // See Image Management
      }
    ];
    ```
    *Note: `src/config/services.ts` aggregates these automatically.*

3.  **Add the Route:**
    *   **`src/App.tsx`:** Import the component (lazy load recommended) and add a `<Route>` entry.
    *   **`src/data/routes.json`:** Add the new path `"/pack-ship/drone-delivery"` to this list for sitemap generation.

4.  **Configure Metadata:**
    The metadata is automatically generated from the service config in `src/config/pageMeta.ts`. If you need custom overrides, you can edit that file directly.

5.  **Update Sitemap:**
    By adding the path to `src/data/routes.json` in step 3, the `vite-plugin-sitemap` will automatically include the new page in `sitemap.xml` during the next build. No manual XML editing is required.

### Metadata Rules & SEO Standards

*   **Title Length:** Must be **55–60 characters** to ensure full visibility in SERPs.
*   **Description Length:** Must be **150–160 characters**. Descriptions longer than this may be truncated.
*   **Overwriting Defaults:** While `pageMeta.ts` generates defaults, always provide a custom `title` and `metaDescription` in the service config if the auto-generated one is generic.
*   **Canonical URLs:** The system automatically generates self-referencing canonical URLs to prevent duplicate content issues. Do not manually override `canonical` unless pointing to a different source.
*   **JSON-LD Schemas:** Schemas are auto-generated via `src/utils/schema.ts`.
    *   **Service Schema:** Automatically added for all service pages.
    *   **FAQ Schema:** Added if the `faqs` prop is present.
    *   **Product Schema:** Use `JsonLd` component manually if selling specific physical items.

---

## 3. Local SEO Configuration

Our Local SEO strategy relies on structured data (Schema.org) generated from a central configuration file.

### `src/config/siteConfig.ts`

This is the source of truth for all business information. Updates here automatically propagate to the website footer, contact page, and JSON-LD schema.

*   **Business Details:** Name, description, phone, email, address.
*   **Hours:** Operating hours for each day.
*   **Geo:** Latitude/Longitude coordinates for map integration.
*   **Area Served:** List of cities/regions we service (e.g., "Concord Township", "Mentor").
*   **Knows About:** A critical list of keywords and services (e.g., "USPS shipping", "notary public") that populates the `knowsAbout` property in our LocalBusiness schema.

**To update business hours:**
Modify the `hours` object in `src/config/siteConfig.ts`. The `src/utils/schema.ts` utility will automatically format this into `OpeningHoursSpecification` for search engines.

---

## 4. Page Structure & Components

We use a modular component system to maintain consistency and speed up development.

### Mandatory Page Sections Checklist
Every service page **must** include the following elements:
*   [ ] **Hero Section:** High-quality image with H1 title and subtitle.
*   [ ] **Overview Paragraph:** Clear, local introduction to the service.
*   [ ] **Features Grid:** "Why Choose Us" or specific service benefits.
*   [ ] **FAQ Section:** At least 3-5 relevant questions.
*   [ ] **CTA Section:** Strong call to action at the bottom.
*   [ ] **Internal Links:** Minimum 3 links to related services.
*   [ ] **Local SEO Elements:** Mentions of "Concord Township", "Lake County", etc.
*   [ ] **Images:** At least one hero image meeting optimization standards.

### Component Use Rules
*   **`ServiceGrid`**: Use **only** on pillar pages (e.g., `/pack-ship`) to list child services.
*   **`CompetitorAlternativeSection`**: Use **only** on pages targeting competitors (e.g., "UPS Store Alternative").
*   **`CTASection`**: Use the `brand` variant as the default for service pages.
*   **Feature Blocks**: Must follow the existing layout and design defined in `ServicePage`.
*   **New UI Components**: Create in `src/components/ui` or `src/components/sections`.
*   **Icons**: Must import from `lucide-react`.
*   **Animations**: All entrance animations must use `framer-motion`.

### The `ServicePage` Template
Located at `src/components/ServicePage.tsx`, this is the core wrapper for all service pages. It handles:
*   **Hero Section:** Displays the `heroImage` with a gradient overlay and animated title (`heroTitle`, `heroSubtitle`).
*   **Metadata & Schema:** Automatically generates `<Meta>` tags and `JSON-LD` structured data based on the service config.
*   **FAQ Section:** Automatically renders an accordion of FAQs passed via the `faqs` prop and generates associated FAQPage schema.
*   **Features Grid:** Renders a "Why Choose Us" grid from the `features` prop.
*   **Dynamic Content:** Renders the `content` array (see below).

### Content Blocks
The `content` prop in `ServicePage` accepts an array of content blocks. This allows for flexible layouts without writing new JSX.

```typescript
content: [
  {
    heading: "Full Width Section",
    body: "This content spans the full width...",
    isFullWidth: true
  },
  {
    heading: "Grid Card 1",
    body: "This content appears in a 2-column grid..."
  },
  {
    heading: "Grid Card 2",
    body: "This is the second card..."
  }
]
```

### Specialized Sections
*   **`CTASection`**: A configurable Call-to-Action block. Supports `brand` (blue), `neutral`, and `ghost` variants.
    *   *Usage:* `src/components/sections/CTA.tsx`
*   **`CompetitorAlternativeSection`**: Specifically designed for SEO pages targeting competitors (e.g., "UPS Store Alternative"). Displays a grid of internal links to our services.
    *   *Usage:* `src/components/sections/CompetitorAlternative.tsx`
*   **`ServiceGrid`**: Used on pillar pages (e.g., `/pack-ship`) to display a grid of child services.
    *   *Usage:* `src/components/sections/ServiceGrid.tsx`

### Design System & Styling
*   **Brand Color:** We use a specific shade of blue: `#0855B1`. Use the Tailwind class `text-[#0855B1]` or `bg-[#0855B1]`.
*   **Rounded Aesthetics:** Components generally use `rounded-xl` or `rounded-2xl` for a soft, modern look.
*   **Animations:** We use `framer-motion` for subtle entrance animations (fade-in, slide-up) on hero text and content blocks.

---

## 5. Content Writing Standards

### Tone & Voice
*   **Neighborly & Helpful:** We are a local, family-owned business. Use "we," "us," and "our."
*   **No Hard Sales:** Avoid aggressive sales language ("Buy Now!", "Best Prices Ever!"). Focus on **solutions** and **convenience**.
*   **Local Focus:** Consistently mention "Concord Township," "Mentor," "Painesville," and "Lake County."

### Formatting & Ordering
*   **Paragraph Length:** Keep paragraphs short (3-4 sentences max).
*   **Section Ordering:**
    1.  Hero (Headline + Subheadline)
    2.  Overview / "What is it?"
    3.  Benefits / "Why Choose Us?"
    4.  Detailed Services / Process
    5.  FAQs
    6.  CTA
*   **Compliance:**
    *   **Authorized Shipper:** When mentioning FedEx/UPS/USPS/DHL, ensure we are referred to as an "Authorized Ship Center" or "Approved Provider."
    *   **No Price Guarantees:** Do not promise specific delivery dates or guaranteed lowest prices (carriers control these).

---

## 5. Content Writing Standards

### Tone & Voice
*   **Neighborly & Helpful:** We are a local, family-owned business. Use "we," "us," and "our."
*   **No Hard Sales:** Avoid aggressive sales language ("Buy Now!", "Best Prices Ever!"). Focus on **solutions** and **convenience**.
*   **Local Focus:** Consistently mention "Concord Township," "Mentor," "Painesville," and "Lake County."

### Formatting & Ordering
*   **Paragraph Length:** Keep paragraphs short (3-4 sentences max).
*   **Section Ordering:**
    1.  Hero (Headline + Subheadline)
    2.  Overview / "What is it?"
    3.  Benefits / "Why Choose Us?"
    4.  Detailed Services / Process
    5.  FAQs
    6.  CTA
*   **Compliance:**
    *   **Authorized Shipper:** When mentioning FedEx/UPS/USPS/DHL, ensure we are referred to as an "Authorized Ship Center" or "Approved Provider."
    *   **No Price Guarantees:** Do not promise specific delivery dates or guaranteed lowest prices (carriers control these).

---

## 6. Link Management

We maintain strict standards for both internal and external linking to maximize SEO authority and user safety.

### Internal Link Strategy & Rules
*   **Quantity:** Each service page must have **3-5 internal links**.
*   **Direction:**
    *   **Upward:** Link back to the parent Pillar Page (e.g., from *FedEx* to *Pack & Ship*).
    *   **Downward:** Link to specific child services if applicable.
    *   **Horizontal:** Link to related services (e.g., *Packing* -> *Shipping*, *Notary* -> *Fingerprinting*).
*   **Anchor Text:**
    *   **Exact Match:** "FedEx Shipping" (Use sparingly)
    *   **LSI/Contextual:** "ship your package," "international delivery options"
    *   **Geo-Modified:** "shipping in Concord Township"
*   **Prohibited:** Do NOT use generic anchors like "click here" or "learn more."
*   **Strict Component Rule:** All internal links **must** use `<InternalLink>`. **Do NOT use `<a>` or `<Link>`.**
*   **Content Blocks:** Links inside content blocks must also use `<InternalLink>` or inline standard anchors *only if* technical limitations prevent component usage (but prefer components).

#### The `<InternalLink>` Component
**Always** use this component instead of standard `<a>` or `<Link>` tags for internal text links. It ensures consistency and allows for data-driven anchor text optimization.

```tsx
import { InternalLink } from '../components/ui/InternalLink';

// ✅ Auto-selects SEO-friendly anchor text based on the ID
<InternalLink to="/pack-ship/fedex-shipping" />

// ✅ With a specific anchor text variant (exact, lsi, geo)
<InternalLink to="/pack-ship/fedex-shipping" variant="geo" />

// ✅ With custom text
<InternalLink to="/pack-ship/fedex-shipping">Ship via FedEx</InternalLink>
```

### Configuration

*   **`src/data/anchorText.json`:** Defines variations of anchor text (keywords) for each page.
*   **`src/data/internalLinks.json`:** Defines parent/child relationships and "related services" for cross-linking.

#### Validation
Run the validation script to check for orphan pages or missing anchor text definitions:
```bash
node scripts/validate-links.cjs
```

### Outbound (External) Links

When linking to external sites (partners, carriers, resources), follow these security and performance best practices:

1.  **Open in New Tab:** Use `target="_blank"` to keep users on our site.
2.  **Security Attributes:** **Always** add `rel="noopener noreferrer"` to prevent security vulnerabilities and performance issues.

```tsx
// ✅ Correct External Link
<a 
  href="https://www.fedex.com" 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-blue-600 hover:underline"
>
  Visit FedEx
</a>
```

---

## 6. Image Management

We use **Cloudflare R2** to host hero images for service pages. This ensures fast, global delivery of assets.

### Hero Images

*   **Location:** Cloudflare R2 Bucket
*   **Base URL:** Configured via `VITE_R2_PUBLIC_BASE_URL` in your `.env` file.
*   **Naming Convention:** `[service-slug-name].jpg` (e.g., `fedex-shipping.jpg`)
*   **Recommended Size:** 1200x400px
*   **Format:** JPEG (quality 80-85%) or WebP

### How to Add an Image

1.  **Upload:** Upload the image to your Cloudflare R2 bucket.
2.  **Config:** In `src/config/services/[category].ts`, add the `heroImage` property to the service object.
    ```typescript
    // The system automatically prepends VITE_R2_PUBLIC_BASE_URL
    heroImage: getServiceImageUrl("drone-delivery.jpg")
    ```
    *Note: The helper function `getServiceImageUrl` handles the URL construction.*

### Local Development
The application is configured to pull images from the R2 bucket even during local development, provided the `.env` file contains the correct `VITE_R2_PUBLIC_BASE_URL`.

---

## 7. Deployment & Updates

The site is deployed on **Netlify**.

### Automatic Deployment
*   **Push to `main`:** Any commit pushed to the `main` branch automatically triggers a new production build and deployment.
*   **Pull Requests:** Netlify automatically creates a "Deploy Preview" for any open Pull Request, allowing you to test changes before merging.

### Configuration
*   **`public/_redirects`:** Handles 301 redirects and SPA fallback (essential for React Router).
*   **`public/_headers`:** Configures security headers and caching policies.

### Build Command
The build command runs the following:
```bash
npm run build
```
This compiles the React app, generates the sitemap, and optimizes assets.

---

## 8. Quality Assurance

Before committing code, ensure it meets our quality standards.

### Linting & Formatting
We use ESLint to catch errors and enforce code style.

```bash
# Run linting
npm run lint

# Run accessibility check (a11y)
npm run lint:a11y
```

### Accessibility (a11y)
*   **Images:** All images must have meaningful `alt` text.
*   **Buttons:** Must have accessible labels or text content.
*   **Semantic HTML:** Use proper heading levels (`h1` -> `h2` -> `h3`).

---

## 10. Common Issues & Troubleshooting

*   **Missing from Sitemap:** Did you add the path to `src/data/routes.json`?
*   **Broken Hero Section:** Check `heroImage` filename in config. Does it match R2 exactly?
*   **A11y Failure:** You likely missed an `alt` prop on an image or an `aria-label` on a button.
*   **Broken Internal Links:** Did you use `<Link>` instead of `<InternalLink>`?
*   **Large Bundle Size:** Ensure you are using lazy loading in `src/App.tsx`.
*   **Missing Menu Item:** Did you update `src/components/layout/Header.tsx` after adding a new service category?
*   **404 on Refresh:** Check `public/_redirects` for the SPA fallback rule (`/* /index.html 200`).

---

## 11. Getting Started & Onboarding

1.  **Clone Project:** `git clone [repo-url]`
2.  **Install Dependencies:** `npm install`
3.  **Environment Setup:**
    *   Create a `.env` file in the root.
    *   Add: `VITE_R2_PUBLIC_BASE_URL=https://[your-r2-domain]`
    *   *Reference `.env.example` for all required variables.*
4.  **Start Dev Server:** `npm run dev`
5.  **Validation:** Run `npm run lint` and `node scripts/validate-links.cjs` to ensure a clean state.
6.  **Preview:** Check the local server at `http://localhost:5173`.

---

## 12. Quick Reference

| Task | File(s) to Edit |
| :--- | :--- |
| **Add Service** | `src/config/services/*.ts`, `src/App.tsx`, `src/data/routes.json` |
| **Update Menu** | `src/components/layout/Header.tsx` |
| **Change Phone/Hours** | `src/config/siteConfig.ts` |
| **Update FAQs** | `src/config/faqs/*.ts` |
| **Add SEO Landing Page** | `src/pages/[new-page].tsx`, `src/App.tsx`, `src/data/routes.json` |
| **Check Internal Links** | Terminal: `node scripts/validate-links.cjs` |
| **Check Linting** | Terminal: `npm run lint` |
| **Upload Image** | Cloudflare Dashboard -> R2 -> Bucket |

---

*For further assistance, please contact the development team lead.*