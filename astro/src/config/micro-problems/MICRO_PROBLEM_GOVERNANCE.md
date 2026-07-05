# MICRO_PROBLEM_GOVERNANCE.md

**STATUS**: Permanent Policy

**AUTHORITY**: Defines lifecycle rules and `intentKey` usage for all micro-problem pages

**EXECUTION**: Via quarterly audit workflow (`.agent/workflows/micro-problem-quarterly-audit.md`)

## 1. Non-Negotiable Principles

- **Utility First**: Micro-problem pages must reduce real-world friction.
- **Data > Opinion**: Decisions are based on performance signals, not feelings.
- **One Intent = One Page**: Intent cannibalization is prohibited; use `intentKey` to enforce this.
- **Deletion is Maintenance**: Removing low-value pages is expected and healthy.

## 2. The intentKey Protocol (Signal C)

To prevent SEO cannibalization, every micro-problem configuration **must** include an `intentKey`.

- **Rule**: Use a kebab-case string describing the core user intent (e.g., `intentKey: "ship-fragile-items"`).
- **The One-Sentence Test**: If you cannot explain the difference between two pages in one clear sentence, they share an intent and must be merged.
- **Validation**: The system automatically blocks duplicate `intentKey` values in development mode.

## 3. The Quarterly Audit (Signals)

Every 90 days (March 15, June 15, Sept 15, Dec 15), every page is evaluated against three signals:

| **Signal**   | **Name**       | **FAIL Condition**                                             |
| ------------ | -------------- | -------------------------------------------------------------- |
| **Signal A** | Performance    | 0 impressions OR 0 clicks in the last 90 days (Search Console) |
| **Signal B** | Intent Reality | Staff reports customer confusion or mismatched expectations    |
| **Signal C** | Intent Overlap | Duplicate `intentKey` found OR fails the "One-Sentence Test"   |

## 4. Decision Matrix

Apply these rules in order to determine the page's fate:

### DELETE

**Conditions (All must be true)**:

- Signal A = FAIL (No traffic).
- Signal C = FAIL (Intent overlap).
- No internal links or staff-reported value.
- **Action**: Remove from config; do **not** create a redirect.

### MERGE

**Conditions (All must be true)**:

- Signal C = FAIL (Duplicate `intentKey`).
- Another page with the same intent performs better.
- **Action**: Fold useful copy into the stronger page and delete the weaker config.

### REWRITE

**Conditions (All must be true)**:

- Signal A = PASS (Page has traffic).
- Signal B = FAIL (Staff reports confusion/mismatch).
- **Action**: Rewrite Hero title/subtitle to clarify service scope.

### KEEP

- **Condition**: Page passes all signals or provides measurable value.

---

## 5. Audit Workflow Execution

For each reviewed page, the auditor must output the following format:

Markdown

```
## [Page ID]
**Decision**: KEEP | MERGE | REWRITE | DELETE
**Signals**:
- Signal A: [PASS/FAIL] - [Data]
- Signal B: [PASS/FAIL] - [Feedback]
- Signal C: [PASS/FAIL] - [intentKey check]
**Rationale**: [Reference signals]
```
