# Micro-Problems Configuration Architecture

> **🚨 GOVERNANCE POLICY**: All micro-problem pages are subject to quarterly lifecycle audits.  
> See [`MICRO_PROBLEM_GOVERNANCE.md`](../../MICRO_PROBLEM_GOVERNANCE.md) for permanent policy rules.

## Overview

The micro-problems configuration has been refactored into a **sharded, domain-based structure** designed to scale to 500+ micro-problem pages while maintaining type safety, preventing conflicts, and enforcing architectural boundaries.

## Directory Structure

```
src/config/micro-problems/
├── index.ts          # Aggregation layer (public export)
├── returns.ts        # Returns-related micro-problems
├── shipping.ts       # Outbound shipping micro-problems
├── packaging.ts      # Packaging-related micro-problems
└── misc.ts           # Catch-all (use sparingly)
```

## Domain Classification Rules

### returns.ts
- Returns processing
- Return label printing
- Drop-offs related to returns
- Return packaging requirements
- Rejected return fixes

### shipping.ts
- Outbound shipping of items
- Carrier selection and rules
- Fragile item shipping
- Heavy/oversized items
- Electronics and valuables
- Time-sensitive shipments

### packaging.ts
- Box selection
- Repacking services
- Label attachment
- Multiple item consolidation
- Packaging without original materials

### misc.ts
- **Use sparingly**
- Only for items that don't fit other domains
- Requires justification in code comments

## Usage

### Import micro-problems (✅ Correct)

```typescript
// From the public aggregation layer
import { microProblems } from "@/config/micro-problems";
// Or the backward-compatible path
import { microProblems } from "@/config/services/micro-problems";
```

### Do NOT import shards directly (❌ Incorrect)

```typescript
// ESLint will error on these imports
import { returnMicroProblems } from "@/config/micro-problems/returns";
import { shippingMicroProblems } from "@/config/micro-problems/shipping";
```

## Adding New Micro-Problems

1. **Determine the domain** (returns, shipping, or packaging)
2. **Edit only ONE shard file**
3. **Add the new Service object to the appropriate array**
4. **No changes needed to `index.ts`** - it auto-aggregates

### Example: Adding a new return-related micro-problem

```typescript
// Edit: src/config/micro-problems/returns.ts

export const returnMicroProblems: Service[] = [
  // ... existing problems
  {
    id: "my-new-return-problem",
    category: "micro-problem",
    city: "Concord Township",
    serviceName: "My New Return Problem",
    slug: "/my-new-return-problem",
    // ... rest of config
  }
];
```

## Validation

The system includes a **dev-only runtime validator** that checks for:

- Duplicate `id` values
- Duplicate `slug` values
- **Duplicate `intentKey` values** (prevents intent cannibalization)
- Missing required fields (`id`, `slug`, `serviceName`, `heroTitle`)

**Validator runs automatically in development mode** (`import.meta.env.DEV`)

**Validator is stripped from production builds** for performance

### Intent Key Validation

To prevent SEO cannibalization and customer confusion, the validator checks for duplicate `intentKey` values.

**See**: [`INTENT_KEY_GUIDE.md`](./INTENT_KEY_GUIDE.md) for detailed usage instructions.

**Example Error**:
```
Error: Duplicate intent detected: "ship-fragile-items"
Conflicts:
- ship-fragile-items
- ship-breakable-products
```

This means you have two pages targeting the same user intent. One should be merged or deleted during the quarterly governance audit.

## ESLint Enforcement

Custom ESLint rules prevent:

1. **Direct shard imports** outside the config layer
2. **Importing deprecated `ServicePage`** (enforces `ServicePageV2`)
3. **Circular imports** in the config layer

## Architecture Benefits

### Scale to 500+ pages
- Small, focused shard files
- Parallel editing without conflicts
- Clear domain boundaries

### Maintainability
- One file to edit per change
- No mega-files to navigate
- Clear ownership by domain

### Safety
- Runtime validation catches duplicates
- ESLint prevents boundary violations
- TypeScript ensures type safety

### AI-Friendly
- Clear instructions can target specific shards
- Minimal blast radius for changes
- Self-documenting structure

## Migration Notes

All existing consumers continue to work without modification. The old path:

```typescript
import { microProblems } from "@/config/services/micro-problems";
```

...now re-exports from the new location, maintaining full backward compatibility.

## Design Authority

**ServicePageV2** remains the sole design authority for all micro-problem pages. This refactor only affects configuration structure, not page rendering or routing.
