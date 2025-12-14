---
description: Quarterly Micro-Problem Page Governance Audit
---

# Micro-Problem Page Quarterly Governance Audit

**STATUS**: Permanent Policy  
**FREQUENCY**: Every 90 days (mandatory)  
**AUTHORITY**: This workflow defines lifecycle rules for all micro-problem pages  
**GOVERNED BY**: `MICRO_PROBLEM_GOVERNANCE.md` (root)

## Execution Trigger

This audit MUST run every 90 days without exception.

Set a recurring calendar reminder for:
- Q1: March 15
- Q2: June 15  
- Q3: September 15
- Q4: December 15

## Prerequisites

Before beginning the audit, ensure you have access to:

1. **Google Search Console** - Last 90 days of data
2. **Staff feedback log** - Customer confusion reports
3. **Micro-problems config** - `src/config/micro-problems/*.ts`

## Audit Process

### Step 1: Export Search Console Data

// turbo
1. Log into Google Search Console
2. Navigate to Performance → Search Results
3. Set date range: Last 90 days
4. Add filter: "Page contains: /services/" (or appropriate micro-problem URL pattern)
5. Export to CSV: `search-console-YYYY-MM-DD.csv`
6. Save to: `scripts/audits/search-console-data/`

### Step 2: Run Signal Analysis Script

// turbo
2. Navigate to the scripts directory and run the audit script:

```bash
npm run audit:micro-problems -- --search-console=scripts/audits/search-console-data/search-console-YYYY-MM-DD.csv
```

This script will:
- Load all micro-problems from config
- Cross-reference with Search Console data
- Identify pages with 0 impressions
- Identify pages with impressions but 0 clicks
- Flag potential intent overlaps (duplicate `intentKey`)
- Generate an audit report

### Step 3: Manual Review - Staff Feedback

3. Review staff feedback log for the past 90 days:

**Check for:**
- Customer confusion about services
- Mismatch between page promise and actual service capability
- Increased counter friction or explanation time

**Document findings** in: `scripts/audits/staff-feedback/YYYY-QX-feedback.md`

### Step 4: Apply Decision Matrix

For EACH micro-problem page, evaluate against the three signals:

#### SIGNAL A — Search Console Performance

```
FAIL if:
- 0 impressions in last 90 days, OR
- Impressions > 0 AND clicks = 0
```

#### SIGNAL B — User Intent Reality

```
FAIL if ANY:
- Staff reports customer confusion
- Customers expect service we don't offer
- Page increases counter friction
```

#### SIGNAL C — Intent Overlap

```
FAIL if EITHER:
- Two pages share same intentKey
- Cannot explain difference in one sentence
```

### Step 5: Apply Decision Rules

#### ❌ DELETE IF (ALL MUST BE TRUE)

```
☑ No impressions (Signal A)
☑ No internal links
☑ No staff-reported value
☑ No unique intent
```

**Action:**
- Remove config entry from appropriate shard file
- Do NOT add redirect
- Let sitemap exclusion happen naturally
- Document in audit report

**Example:**
```typescript
// DELETED: Fix a Micro-Problem Nobody Searches For
// Reason: 0 impressions, 0 internal links, no unique intent
// Date: 2025-Q1 Audit
```

#### 🔀 MERGE IF (ALL MUST BE TRUE)

```
☑ Two pages share same intentKey
☑ One clearly performs better
☑ Weaker page adds no unique value
```

**Action:**
- Keep stronger performing page
- Fold useful copy from weaker page into stronger
- Delete weaker config entry
- Preserve stronger slug
- Document merge in audit report

**Example:**
```typescript
// MERGED INTO: ship-fragile-items
// FROM: ship-breakable-products (0 clicks vs 45 clicks)
// Date: 2025-Q1 Audit
```

#### ✏️ REWRITE IF (ALL MUST BE TRUE)

```
☑ Impressions exist
☑ Intent unclear OR customer expectations mismatched
```

**Action:**
- Rewrite `heroTitle`, `heroSubtitle`, `metaDescription`
- Clarify scope and limitations in content
- Keep existing slug (unless misleading)
- Do NOT add new intent
- Document rewrite in audit report

**Example:**
```typescript
// REWRITTEN: 2025-Q1 Audit
// Reason: 120 impressions but staff reports customer confusion
// Changed: Clarified we don't offer expedited overnight service
```

#### ✅ KEEP

All other pages that pass signals or provide clear value.

### Step 6: Generate Audit Report

// turbo
6. Generate the final audit report:

```bash
npm run audit:micro-problems:report -- --output=YYYY-QX-audit-report.md
```

Output format for EACH reviewed page:

```markdown
## [Page ID]

**Decision**: KEEP | MERGE INTO <id> | REWRITE | DELETE

**Signals**:
- Signal A (Performance): PASS | FAIL - [reason]
- Signal B (Intent Reality): PASS | FAIL - [reason]  
- Signal C (Intent Overlap): PASS | FAIL - [reason]

**Rationale**: [Reference signals, not opinions]

**Action Taken**: [Specific changes made]
```

### Step 7: Execute Changes

7. Make all approved changes to config files:

```bash
# Edit appropriate shard files
# src/config/micro-problems/returns.ts
# src/config/micro-problems/shipping.ts
# src/config/micro-problems/packaging.ts
# src/config/micro-problems/misc.ts
```

### Step 8: Validate and Deploy

// turbo
8. Validate changes don't break the build:

```bash
npm run build
```

// turbo
9. Run tests if available:

```bash
npm run test
```

10. Commit changes with audit reference:

```bash
git add .
git commit -m "chore: YYYY-QX micro-problem governance audit

- Deleted: X pages (0 impressions, no value)
- Merged: Y pages (intent overlap)
- Rewrote: Z pages (customer confusion)

Audit report: scripts/audits/YYYY-QX-audit-report.md"
```

11. Deploy to production

## Forbidden Actions

**DO NOT:**
- ❌ Keep pages "just in case"
- ❌ Chase keyword variations
- ❌ Preserve pages for vanity metrics
- ❌ Split one intent into multiple pages
- ❌ Add redirects for deleted pages (let them 404)
- ❌ Override signals with opinions

## Governance Rule (Permanent)

```
A micro-problem page must reduce real-world friction.
If it doesn't, it doesn't deserve to exist.
```

**SEO follows usefulness, not volume.**

## Next Audit Date

After completing this audit, schedule the next one 90 days from today.

**Calendar reminder**: [Date 90 days from audit completion]

---

**Last Audit**: [Date]  
**Next Audit Due**: [Date]  
**Auditor**: [Name]
