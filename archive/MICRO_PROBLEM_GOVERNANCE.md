# Micro-Problem Page Governance Policy

**STATUS**: Permanent Policy  
**AUTHORITY**: This document defines lifecycle rules for all micro-problem pages  
**EXECUTION**: Via quarterly audit workflow (`.agent/workflows/micro-problem-quarterly-audit.md`)

---

## 🚨 NON-NEGOTIABLE PRINCIPLES

1. **Micro-problem pages exist to reduce real-world friction**
2. **SEO volume does not justify weak pages**
3. **Config is the source of truth**
4. **Deletion is safe and expected**
5. **Merging is preferred over duplication**

---

## 🎯 GOVERNANCE OBJECTIVE

Establish a **quarterly governance process** that determines whether each micro-problem page should be:

- ✅ **KEPT** - Provides clear value
- 🔀 **MERGED** - Overlaps with better-performing page
- ✏️ **REWRITTEN** - Intent unclear or mismatched
- ❌ **DELETED** - Provides no value

This process must be:

- **Repeatable** - Same process every quarter
- **Explicit** - Clear decision criteria
- **Enforceable** - Backed by data signals, not opinions

---

## 1️⃣ QUARTERLY REVIEW TRIGGER (MANDATORY)

**Frequency**: Every 90 days  
**This is not optional.**

Evaluate all micro-problem pages in:

- `src/config/micro-problems/returns.ts`
- `src/config/micro-problems/shipping.ts`
- `src/config/micro-problems/packaging.ts`
- `src/config/micro-problems/misc.ts`

**Quarterly Schedule**:

- **Q1**: March 15
- **Q2**: June 15
- **Q3**: September 15
- **Q4**: December 15

---

## 2️⃣ SIGNAL DEFINITIONS (AUTHORITATIVE)

All decisions MUST be based on these three signals:

### SIGNAL A — Search Console Performance

A page is considered **weak** if EITHER is true:

```
❌ 0 impressions in the last 90 days
❌ Impressions exist, but clicks = 0
```

**Data Source**: Google Search Console (Performance → Last 90 days)

**Interpretation**:

- **0 impressions** = Google doesn't think this page is relevant to any query
- **0 clicks** = Users see this page in results but don't find it valuable enough to click

### SIGNAL B — User Intent Reality

A page **fails** this signal if ANY are true:

```
❌ Staff reports customer confusion
❌ Customers expect a service Mailbox Plus does not offer
❌ Page increases counter friction or explanation time
```

**Data Source**: Staff feedback log, customer service reports

**Interpretation**:

- The page sets false expectations
- The page creates more work for staff
- The page confuses customers rather than helping them

### SIGNAL C — Intent Overlap

A page **fails** this signal if EITHER is true:

```
❌ Two pages rank for the same query
❌ You cannot explain the difference between two pages in one sentence
```

**Evaluation Method**:

- Compare `intentKey` across all micro-problems
- If two pages share the same `intentKey`, they overlap
- If you cannot clearly articulate why both pages exist, they overlap

**Example of FAIL**:

```typescript
// Page 1
intentKey: 'ship-fragile-items';

// Page 2
intentKey: 'ship-fragile-items';
// ❌ FAIL: Same intentKey = intent overlap
```

---

## 3️⃣ DECISION MATRIX (STRICT)

### ❌ DELETE IF (ALL MUST BE TRUE)

```
☑ No impressions (Signal A)
☑ No internal links pointing to this page
☑ No staff-reported value
☑ No unique intent (overlaps with existing page)
```

**Action**:

1. Remove the config entry from the appropriate shard file
2. **Do NOT** create a redirect
3. Allow sitemap exclusion to occur naturally via config
4. Document deletion reason in code comments

**Example**:

```typescript
// DELETED: 2025-Q1 Audit
// Page: fix-rejected-return-packaging
// Reason: 0 impressions, merged intent into ship-return-with-size-limits
// Signal A: FAIL (0 impressions)
// Signal B: N/A
// Signal C: FAIL (duplicate intentKey)
```

**Philosophy**:

> Deletion is not failure.  
> Deletion is maintenance.

---

### 🔀 MERGE IF (ALL MUST BE TRUE)

```
☑ Two pages share the same intentKey
☑ One page clearly performs better (more clicks, impressions)
☑ The weaker page adds no unique value
```

**Action**:

1. **Keep** the stronger-performing page
2. **Fold** any useful copy from the weaker page into the stronger
3. **Delete** the weaker config entry
4. **Preserve** the stronger page's slug
5. Document merge in code comments

**Example**:

```typescript
// MERGED: 2025-Q1 Audit
// INTO: ship-fragile-items (250 clicks)
// FROM: ship-breakable-products (0 clicks)
// Reason: Same intentKey, weaker page adds no unique copy
// Signal A: FAIL (0 clicks)
// Signal C: FAIL (intent overlap)
```

---

### ✏️ REWRITE IF (ALL MUST BE TRUE)

```
☑ Impressions exist (page is getting traffic)
☑ BUT intent is unclear OR customer expectations are mismatched
```

**Action**:

1. **Rewrite** `heroTitle`, `heroSubtitle`, `metaDescription` to clarify scope
2. **Clarify** what the service IS and what it IS NOT
3. **Keep** the existing slug (unless the slug itself is misleading)
4. **Do NOT** add new intent or promises
5. Document rewrite reason in code comments

**Example**:

```typescript
// REWRITTEN: 2025-Q1 Audit
// Page: ship-electronics-safely
// Reason: 180 impressions but staff reports confusion (customers expect insurance we don't offer)
// Signal B: FAIL (customer expectations mismatched)
// Changes: Clarified we pack electronics but don't provide insurance
{
  id: "ship-electronics-safely",
  // ... config ...
  heroSubtitle: "We pack electronics securely, but carriers provide insurance separately", // ← Clarified
}
```

---

### ✅ KEEP

**Default action** for pages that:

- Pass all signals, OR
- Provide clear, measurable value even with low traffic

**No action required** beyond documentation in audit report.

---

## 4️⃣ WHAT YOU MUST NOT DO

### Forbidden Actions

❌ **Do NOT keep pages "just in case"**  
 → If it fails signals, delete it

❌ **Do NOT chase keyword variations**  
 → One intent = one page

❌ **Do NOT preserve pages for vanity metrics**  
 → Impressions without value are noise

❌ **Do NOT split one intent into multiple pages**  
 → Merge instead

❌ **Do NOT create redirects for deleted pages**  
 → Let them 404 naturally

❌ **Do NOT override signals with opinions**  
 → Data decides, not feelings

---

## 5️⃣ REQUIRED OUTPUT FORMAT (WHEN AUDITING)

For **each** reviewed micro-problem, output:

```markdown
## [Page ID or Slug]

**Decision**: KEEP | MERGE INTO <id> | REWRITE | DELETE

**Signals**:

- Signal A (Performance): PASS | FAIL - [specific data]
- Signal B (Intent Reality): PASS | FAIL - [staff feedback or N/A]
- Signal C (Intent Overlap): PASS | FAIL - [intentKey comparison]

**Rationale**: [Must reference signals, not opinions]

**Action Taken**: [Specific changes made to config]
```

**Example Output**:

```markdown
## ship-gift-without-receipt

**Decision**: KEEP

**Signals**:

- Signal A (Performance): PASS - 87 impressions, 12 clicks
- Signal B (Intent Reality): PASS - No staff confusion reported
- Signal C (Intent Overlap): PASS - Unique intentKey "remove-receipt-from-gift"

**Rationale**: Page has steady traffic and unique intent. Staff confirms this is a real customer need.

**Action Taken**: None
```

---

## 6️⃣ ONE-SENTENCE GOVERNANCE RULE (LOCK THIS)

```
A micro-problem page must reduce real-world friction.
If it doesn't, it doesn't deserve to exist.
```

**Corollary**:  
SEO follows usefulness, not volume.

---

## 7️⃣ ENFORCEMENT MECHANISM

### Quarterly Audit Workflow

**Where**: `.agent/workflows/micro-problem-quarterly-audit.md`

**Who**: Product owner, marketing lead, or designated auditor

**When**: Every 90 days (mandatory)

**Output**: Audit report documenting all decisions and actions

### Rejection Criteria

Any micro-problem page addition or modification MUST answer:

1. **What real-world friction does this reduce?**
2. **How is this different from existing pages?** (one sentence)
3. **What would staff confusion look like if this page didn't exist?**

If these questions cannot be answered clearly, **reject the page**.

---

## 8️⃣ INTENTKEY FIELD (RECOMMENDED ADDITION)

To enforce Signal C programmatically, **add an `intentKey` field** to the `Service` type:

```typescript
export interface Service {
  id: string;
  category: string;
  // ... other fields ...
  intentKey?: string; // Optional, but recommended for micro-problems
}
```

**Usage**:

```typescript
{
  id: "ship-fragile-items",
  intentKey: "ship-fragile-items", // Same as ID in most cases
  // ...
}
```

**Validation**:

- Dev-time validator should check for duplicate `intentKey` values
- Flag duplicates as potential merges

---

## 9️⃣ HISTORICAL REFERENCE

### Why This Policy Exists

**Problem**: Without governance, micro-problem pages accumulate endlessly, creating:

- SEO bloat (pages that don't rank)
- Customer confusion (overlapping or misleading pages)
- Maintenance burden (too many pages to manage)
- Intent cannibalization (multiple pages competing for same query)

**Solution**: Treat micro-problem pages as **living inventory** that must be actively managed, pruned, and optimized quarterly.

---

## 🔒 FINAL LOCK

This governance process must be treated as **permanent policy**, not a one-time cleanup.

**Execute audits accordingly.**

**Never skip a quarterly audit.**

**Data-driven decisions only.**

---

## Document Control

**Created**: 2025-12-14  
**Last Updated**: 2025-12-14  
**Next Review**: 2026-03-15 (Q1 Audit)  
**Owner**: Product/Marketing Lead  
**Status**: ✅ Active Policy
