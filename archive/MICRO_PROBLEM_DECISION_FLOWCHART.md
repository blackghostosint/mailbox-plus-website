# Micro-Problem Page Decision Flowchart

**Use this flowchart during quarterly audits to make consistent, data-driven decisions.**

---

## START: Evaluate Each Micro-Problem Page

For each page in the config, answer these questions in order:

---

### STEP 1: Signal A - Search Console Performance

**Question**: Does this page have 0 impressions in the last 90 days?

```
┌─────────────────────────────────┐
│ Impressions in last 90 days?   │
└─────────────────────────────────┘
          │
          ├─── YES, has impressions ──────► Go to STEP 1B
          │
          └─── NO, 0 impressions ─────────► Mark: Signal A = FAIL
                                             │
                                             Go to STEP 2
```

---

### STEP 1B: Signal A (continued)

**Question**: Does this page have any clicks?

```
┌─────────────────────────────────┐
│ Clicks in last 90 days?         │
└─────────────────────────────────┘
          │
          ├─── YES, has clicks ───────────► Mark: Signal A = PASS
          │                                  Go to STEP 2
          │
          └─── NO, 0 clicks ──────────────► Mark: Signal A = FAIL
                                             Go to STEP 2
```

---

### STEP 2: Signal C - Intent Overlap

**Question**: Does this page's `intentKey` match any other page?

```
┌─────────────────────────────────┐
│ Duplicate intentKey detected?   │
└─────────────────────────────────┘
          │
          ├─── YES, duplicate found ──────► Mark: Signal C = FAIL
          │                                  Record which page(s) overlap
          │                                  Go to STEP 3
          │
          └─── NO, unique intentKey ──────► Mark: Signal C = PASS
                                             Go to STEP 3
```

---

### STEP 3: Signal B - User Intent Reality

**Question**: Check staff feedback log - any confusion reported for this page?

```
┌─────────────────────────────────┐
│ Staff reports customer          │
│ confusion or expectation        │
│ mismatch?                       │
└─────────────────────────────────┘
          │
          ├─── YES, confusion reported ───► Mark: Signal B = FAIL
          │                                  Go to DECISION MATRIX
          │
          └─── NO, no issues reported ────► Mark: Signal B = PASS
                                             Go to DECISION MATRIX
```

---

## DECISION MATRIX

Now apply the decision rules based on signal results:

---

### PATH 1: DELETE Evaluation

**Check ALL of these conditions:**

```
┌─────────────────────────────────┐
│ ALL of these true?              │
│ ☐ Signal A = FAIL (0 impressions) │
│ ☐ Signal C = FAIL (intent overlap) │
│ ☐ No internal links to this page  │
│ ☐ No staff-reported value         │
└─────────────────────────────────┘
          │
          ├─── ALL TRUE ──────────────────► ❌ DELETE
          │                                  │
          │                                  Action: Remove config entry
          │                                  NO redirect needed
          │
          └─── NOT ALL TRUE ──────────────► Go to PATH 2
```

---

### PATH 2: MERGE Evaluation

**Check ALL of these conditions:**

```
┌─────────────────────────────────┐
│ ALL of these true?              │
│ ☐ Signal C = FAIL (duplicate    │
│   intentKey with another page)  │
│ ☐ Other page performs better    │
│   (more clicks/impressions)     │
│ ☐ This page adds no unique value│
└─────────────────────────────────┘
          │
          ├─── ALL TRUE ──────────────────► 🔀 MERGE
          │                                  │
          │                                  Action: Keep stronger page
          │                                  Fold copy into it
          │                                  Delete this config
          │
          └─── NOT ALL TRUE ──────────────► Go to PATH 3
```

---

### PATH 3: REWRITE Evaluation

**Check ALL of these conditions:**

```
┌─────────────────────────────────┐
│ ALL of these true?              │
│ ☐ Signal A = PASS (has traffic) │
│ ☐ Signal B = FAIL (confusion    │
│   or expectation mismatch)      │
└─────────────────────────────────┘
          │
          ├─── ALL TRUE ──────────────────► ✏️ REWRITE
          │                                  │
          │                                  Action: Clarify scope
          │                                  Rewrite hero copy
          │                                  Address expectation mismatch
          │
          └─── NOT ALL TRUE ──────────────► Go to PATH 4
```

---

### PATH 4: KEEP (Default)

```
┌─────────────────────────────────┐
│ None of the above paths apply  │
└─────────────────────────────────┘
          │
          └─────────────────────────────► ✅ KEEP
                                           │
                                           Action: No changes needed
                                           Document as KEEP in audit
```

---

## Quick Reference Table

| Signal A | Signal B | Signal C | Other Conditions   | Decision    |
| -------- | -------- | -------- | ------------------ | ----------- |
| FAIL     | -        | FAIL     | No links, no value | **DELETE**  |
| -        | -        | FAIL     | Other page better  | **MERGE**   |
| PASS     | FAIL     | -        | -                  | **REWRITE** |
| PASS     | PASS     | PASS     | -                  | **KEEP**    |

---

## Example Walkthrough

### Page: "ship-breakable-products"

**STEP 1**: Check Search Console

- Impressions: 0 in last 90 days
- **Signal A = FAIL** ❌

**STEP 2**: Check intentKey

- `intentKey: "ship-fragile-items"`
- Also found on page "ship-fragile-items"
- **Signal C = FAIL** ❌

**STEP 3**: Check staff feedback

- No confusion reported
- **Signal B = PASS** ✅

**DECISION MATRIX**:

PATH 1 (DELETE):

- ☑ Signal A = FAIL (0 impressions)
- ☑ Signal C = FAIL (duplicate intentKey)
- ☑ No internal links
- ☑ No staff-reported value

**Result**: ❌ **DELETE** this page

**Action**: Remove from `src/config/micro-problems/shipping.ts`

---

## Remember

1. **Data decides, not opinions**
2. **All conditions must be true for DELETE or MERGE**
3. **When in doubt, KEEP and revisit next quarter**
4. **Document your reasoning in the audit report**

---

## Enforcement

This flowchart implements the governance policy defined in:

- `MICRO_PROBLEM_GOVERNANCE.md` (root)
- `.agent/workflows/micro-problem-quarterly-audit.md`

**These decisions are binding. Follow the data.**
