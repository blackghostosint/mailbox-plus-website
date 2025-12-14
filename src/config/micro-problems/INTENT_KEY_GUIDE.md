# Intent Key Usage Guide

**Purpose**: The `intentKey` field is used to detect and prevent intent cannibalization between micro-problem pages.

**Authority**: `MICRO_PROBLEM_GOVERNANCE.md` (Signal C)

---

## What is Intent Cannibalization?

Intent cannibalization occurs when two or more pages compete for the same user intent, diluting SEO value and confusing customers.

**Example**:
- ❌ **BAD**: Two pages both target "ship fragile items" intent
- ✅ **GOOD**: One page for "ship fragile items", distinct from "ship electronics"

---

## How to Use intentKey

### Rule

**Every micro-problem page SHOULD have an intentKey that describes its core user intent.**

```typescript
{
  id: "ship-fragile-items",
  intentKey: "ship-fragile-items", // Usually same as ID
  // ... rest of config
}
```

### When intentKey Differs from ID

The `intentKey` can differ from `id` when:
1. You're renaming a page but want to preserve intent tracking
2. Multiple historical IDs map to the same intent (migration scenario)

**Example**:
```typescript
{
  id: "ship-breakables-safely", // New ID
  intentKey: "ship-fragile-items", // Core intent
  // ... rest of config
}
```

---

## Validation

The system automatically validates `intentKey` uniqueness in **development mode**.

If duplicates are found, you'll see an error:

```
Error: Duplicate intent detected: "ship-fragile-items"
Conflicts:
- ship-fragile-items
- ship-breakables-safely
```

**This means**: You have two pages targeting the same intent. One should be deleted or merged.

---

## Signal C Evaluation

During quarterly audits, Signal C checks for intent overlap:

**PASS**: Unique intentKey  
**FAIL**: Duplicate intentKey OR cannot explain difference in one sentence

---

## Examples

### ✅ GOOD: Clear, Unique Intents

```typescript
// Page 1
{
  id: "ship-electronics-safely",
  intentKey: "ship-electronics",
  serviceName: "Ship Electronics Safely",
}

// Page 2
{
  id: "ship-fragile-items",
  intentKey: "ship-fragile-items",
  serviceName: "Ship Fragile Items",
}

// Page 3
{
  id: "ship-artwork",
  intentKey: "ship-artwork-collectibles",
  serviceName: "Ship Artwork or Collectibles",
}
```

**Why this works**: Each page has a distinct user intent.

---

### ❌ BAD: Intent Overlap

```typescript
// Page 1
{
  id: "ship-fragile-items",
  intentKey: "ship-fragile-items",
  serviceName: "Ship Fragile Items",
}

// Page 2
{
  id: "ship-breakable-products",
  intentKey: "ship-fragile-items", // ❌ Duplicate!
  serviceName: "Ship Breakable Products",
}
```

**Why this fails**: Both pages target the same intent. One should be deleted.

**Resolution**: Keep the better-performing page, delete the other.

---

### 🔀 MERGE Scenario

**Before Merge** (Intent overlap detected):
```typescript
// Page 1: 250 clicks/month
{
  id: "ship-fragile-items",
  intentKey: "ship-fragile-items",
}

// Page 2: 0 clicks/month
{
  id: "ship-breakable-products",
  intentKey: "ship-fragile-items", // ❌ Duplicate
}
```

**After Merge** (Resolved):
```typescript
// Kept stronger page
{
  id: "ship-fragile-items",
  intentKey: "ship-fragile-items",
  // Folded useful copy from ship-breakable-products
}

// Deleted: ship-breakable-products
```

---

## One-Sentence Test

If you cannot explain the difference between two pages in **one clear sentence**, they likely have the same intent.

**Example**:
- **Question**: "What's the difference between 'Ship Fragile Items' and 'Ship Breakable Products'?"
- **Answer**: "Uh... they're basically the same thing."
- **Result**: ❌ **FAIL** - Merge them!

**Correct Example**:
- **Question**: "What's the difference between 'Ship Electronics' and 'Ship Fragile Items'?"
- **Answer**: "Electronics specifically need anti-static packaging and secure data considerations."
- **Result**: ✅ **PASS** - Different intents!

---

## Adding intentKey to Existing Pages

If a micro-problem page doesn't have an `intentKey`:

1. Determine its core user intent
2. Add `intentKey: "intent-description"` to the config
3. Check for overlaps with existing pages
4. If overlap exists, consider merging

**Default Pattern**: Use the page `id` as the `intentKey` unless there's a specific reason not to.

---

## Quarterly Audit Impact

During quarterly audits, pages with duplicate `intentKey` values will automatically be flagged for:
- **MERGE** (if one performs better)
- **DELETE** (if both perform poorly)

**This is intentional governance enforcement.**

---

## Summary

| Aspect | Rule |
|--------|------|
| **Required?** | Optional, but strongly recommended |
| **Format** | kebab-case string describing core intent |
| **Uniqueness** | Must be unique across all micro-problems |
| **Validation** | Automated in dev mode |
| **Audit Signal** | Signal C (Intent Overlap) |

**Remember**: One intent = One page. If two pages share an intent, one must go.
