# Micro-Problem Quarterly Governance Audit Workflow

**Status**: Permanent Operational Workflow  
**Authority**: `astro/src/config/micro-problems/MICRO_PROBLEM_GOVERNANCE.md`  
**Tooling**: `scripts/audit-micro-problems.cjs`, `scripts/generate-route-registry.ts`  
**Execution Cadence**: Quarterly (March 15, June 15, September 15, December 15)

---

## 1. Overview & Objectives

Micro-problem pages address specific, high-friction shipping and packaging scenarios. To prevent content rot, search intent cannibalization, and maintenance drift, every micro-problem page configuration in `astro/src/config/micro-problems/` is audited every 90 days against empirical performance data and front-counter staff feedback.

This workflow specifies the end-to-end execution process for auditors and autonomous agents.

---

## 2. Core Governance Principles

1. **Utility First**: A micro-problem page must reduce real-world customer friction at the store counter or online.
2. **Data > Opinion**: Decisions are made based on Search Console metrics and logged staff feedback, never intuition.
3. **One Intent = One Page**: Intent cannibalization is strictly prohibited. Every page must define a unique `intentKey`.
4. **Deletion is Healthy Maintenance**: Eliminating dead or unhelpful pages protects search authority and prevents customer confusion.
5. **Single-Source Parity**: TypeScript configuration files under `astro/src/config/micro-problems/*.ts` are the authoritative source of truth. Manifests (`siteStructure.json`, `internalLinks.json`) are automatically derived, never manually edited.

---

## 3. Preparation & Inputs

### Step 1: Export Google Search Console Data

1. Navigate to **Google Search Console** > **Performance** > **Search Results**.
2. Select Date Range: **Last 90 days**.
3. Add Page Filter: Filter for micro-problem paths or download the full export.
4. Export as CSV (must include columns: `Page`, `Clicks`, `Impressions`, `CTR`, `Position`).
5. Save the file to: `scripts/audits/search-console-data/YYYY-MM-DD.csv`.

### Step 2: Compile Front-Counter Staff Feedback

1. Collect feedback entries recorded during the quarter in `scripts/audits/staff-feedback/`.
2. Each JSON feedback record contains:
   ```json
   {
     "pageId": "print-return-label-without-printer",
     "feedback": "negative",
     "confusion": true,
     "falseExpectations": false,
     "notes": "Customers confused about QR code dropoffs vs label printing."
   }
   ```

---

## 4. Audit Execution

### Dry Run (Mock Validation)

To verify script discovery and signal logic without production Search Console data:

```bash
npm run audit:micro-problems
```

_(Runs `node scripts/audit-micro-problems.cjs --dry-run` across all 42 micro-problem configs)_

### Production Quarterly Run

Execute with the exported Search Console CSV:

```bash
node scripts/audit-micro-problems.cjs --search-console=scripts/audits/search-console-data/YYYY-MM-DD.csv
```

### Script Execution Logic & Signals

The audit script automatically scans all `.ts` files in `astro/src/config/micro-problems/` (excluding `index.ts`) and evaluates three signals:

- **Signal A (Search Performance)**:
  - **FAIL**: 0 impressions OR (impressions > 0 but 0 clicks) in the 90-day window.
- **Signal B (User Intent Reality)**:
  - **FAIL**: Staff feedback indicates customer confusion, false expectations, or increased counter friction.
- **Signal C (Intent Overlap)**:
  - **FAIL**: Duplicate `intentKey` detected or fails the "One-Sentence Test" against existing services.

---

## 5. Decision Matrix & Action Protocol

| Decision    | Trigger Conditions                                                                                 | Required Action                                                                                                                   |
| :---------- | :------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **DELETE**  | Signal A FAIL (0 impressions) OR (0 clicks AND Signal B FAIL) OR (Signal A FAIL AND Signal C FAIL) | Remove the config object from its `astro/src/config/micro-problems/*.ts` shard file. Do **not** add a redirect unless authorized. |
| **MERGE**   | Signal C FAIL (Duplicate `intentKey`) where a companion page performs better                       | Consolidate unique copy/features into the stronger page's config, then delete the weaker config object.                           |
| **REWRITE** | Signal A FAIL with impressions > 0 but 0 clicks, OR Signal A PASS with Signal B FAIL               | Rewrite `heroTitle`, `heroSubtitle`, and `metaDescription` in the config file to align expectations with actual customer intent.  |
| **KEEP**    | Passes all signals with traffic and positive/neutral feedback                                      | Retain configuration as-is.                                                                                                       |

---

## 6. Manifest Parity & CI Verification

After implementing any config deletions, merges, or additions in `astro/src/config/micro-problems/*.ts`:

1. **Regenerate Site Manifests**:

   ```bash
   npm run prebuild
   ```

   This automatically runs `scripts/generate-route-registry.ts` to scan `astro/src/config/micro-problems/*.ts` and updates `siteStructure.json` and `internalLinks.json`, followed immediately by `npm run seo:check-links`.

2. **Verify Internal Link Strategy & Routing**:

   ```bash
   npm run seo:check-links
   npm run test:verify
   ```

3. **Verify Build & Accessibility**:

   ```bash
   npm run build
   npm run seo:check-routes
   npm run audit:quality
   ```

4. **Commit & Pull Request**:
   - Reference the generated report in `scripts/audits/reports/YYYY-MM-DD-QX-micro-problem-audit.md`.
   - Adhere to `AGENTS.md` and repository pull request templates.
