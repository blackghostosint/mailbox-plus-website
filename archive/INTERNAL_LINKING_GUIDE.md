# Internal Linking System Guide

We have implemented a structured, data-driven internal linking system to improve SEO and site navigation.

## 1. Data Source (`src/data/`)

- **`siteStructure.json`**: Defines the hierarchy (Homepage -> Pillars -> Services).
- **`internalLinks.json`**: Defines parent-child relationships and "related" cross-links.
- **`anchorText.json`**: Contains SEO-optimized anchor text variations (Exact, LSI, Geo).
- **`localPages.json`**: Defines local landing pages and their priority services.

## 2. Components (`src/components/ui/`)

### `<InternalLink />`

Use this component to create SEO-optimized links. It automatically selects anchor text if none is provided.

```tsx
import { InternalLink } from '../components/ui/InternalLink';

// Auto-selects anchor text based on ID
<InternalLink to="/pack-ship/fedex-shipping" />

// With specific variant
<InternalLink to="/pack-ship/fedex-shipping" variant="geo" />

// Custom text (still gets SEO benefits if expanded later)
<InternalLink to="/pack-ship/fedex-shipping">
  Ship with FedEx
</InternalLink>
```

### `<AutoBreadcrumbs />`

Place this at the top of page templates. It automatically generates Schema.org compliant breadcrumbs based on the URL path and `siteStructure.json`.

```tsx
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';

export const PageTemplate = () => (
  <>
    <AutoBreadcrumbs />
    {/* Page Content */}
  </>
);
```

### `<ServiceGrid />`

Use this on Pillar pages to list child services automatically.

```tsx
import { ServiceGrid } from '../components/sections/ServiceGrid';

// On /pack-ship page
<ServiceGrid pillarId="pack-ship" />;
```

## 3. Utility Functions (`src/utils/internal-links.ts`)

- `getInternalLink(id)`: Get metadata for a service.
- `getAnchorText(id, variant)`: Get a random anchor text variant.
- `getRelatedServices(id)`: Get a list of related services for cross-linking.
- `getLocalPriorityServices(citySlug)`: Get priority services for a specific city.

## 4. Validation

Run the validation script to check for orphan pages or missing anchors.

```bash
node scripts/validate-links.cjs
```
