# Micro-Problem Governance Audit Infrastructure

This directory contains all tooling and data for quarterly micro-problem page governance audits.

**Authority**: `MICRO_PROBLEM_GOVERNANCE.md` (project root)  
**Workflow**: `.agent/workflows/micro-problem-quarterly-audit.md`

## Directory Structure

```
scripts/audits/
├── README.md (this file)
├── search-console-data/    # CSVs exported from Google Search Console
├── staff-feedback/          # Quarterly staff feedback logs
└── reports/                 # Generated audit reports
```

## Quarterly Audit Process

### 1. Export Search Console Data

**When**: At the start of each quarter  
**Where**: Google Search Console > Performance > Search Results

**Steps**:

1. Set date range: Last 90 days
2. Add filter: "Page" → "contains" → your micro-problem URL pattern
3. Export to CSV
4. Save to: `scripts/audits/search-console-data/YYYY-MM-DD.csv`

### 2. Collect Staff Feedback

**When**: Ongoing, compiled quarterly  
**Where**: `scripts/audits/staff-feedback/YYYY-QX-feedback.md`

Use the template: `staff-feedback/TEMPLATE.md`

### 3. Run Audit Script

```bash
npm run audit:micro-problems -- --search-console=scripts/audits/search-console-data/YYYY-MM-DD.csv
```

This will:

- Analyze all micro-problems against governance signals
- Generate a detailed audit report
- Recommend actions (DELETE, MERGE, REWRITE, KEEP)

### 4. Review and Execute

1. Review the generated report in `scripts/audits/reports/`
2. Make config changes to appropriate shard files
3. Commit with reference to audit report

## Signals Evaluated

### Signal A: Search Console Performance

- **FAIL**: 0 impressions OR impressions > 0 but clicks = 0
- **Source**: Google Search Console CSV

### Signal B: User Intent Reality

- **FAIL**: Staff confusion, customer mismatched expectations, increased friction
- **Source**: Staff feedback log

### Signal C: Intent Overlap

- **FAIL**: Duplicate `intentKey` OR cannot explain difference in one sentence
- **Source**: Config analysis

## Action Types

| Action      | Criteria                                     | Result                         |
| ----------- | -------------------------------------------- | ------------------------------ |
| **DELETE**  | Fails Signal A + no value + no unique intent | Remove config entry            |
| **MERGE**   | Intent overlap + one performs better         | Consolidate into stronger page |
| **REWRITE** | Has traffic but unclear intent               | Clarify copy and scope         |
| **KEEP**    | Passes signals or provides clear value       | No action                      |

## Files

- `search-console-data/*.csv` - Raw Search Console exports
- `staff-feedback/YYYY-QX-feedback.md` - Quarterly staff observations
- `reports/YYYY-MM-DD-QX-micro-problem-audit.md` - Generated audit reports

## Governance Rule

```
A micro-problem page must reduce real-world friction.
If it doesn't, it doesn't deserve to exist.
```

SEO follows usefulness, not volume.
