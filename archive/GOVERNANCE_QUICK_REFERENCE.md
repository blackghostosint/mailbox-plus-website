# Micro-Problem Page Governance - Quick Reference

**Last Updated**: 2026-05-29
**Status**: ✅ Active Permanent Policy

---

## 📚 Documentation Index

### Core Policy Documents (Project Root)
- **[MICRO_PROBLEM_GOVERNANCE.md](./MICRO_PROBLEM_GOVERNANCE.md)** - Authoritative governance policy (READ THIS FIRST)
- **[MICRO_PROBLEM_DECISION_FLOWCHART.md](./MICRO_PROBLEM_DECISION_FLOWCHART.md)** - Step-by-step decision guide

### Configuration & Technical Docs
- **[src/config/micro-problems/README.md](./src/config/micro-problems/README.md)** - Configuration architecture
- **[src/config/micro-problems/INTENT_KEY_GUIDE.md](./src/config/micro-problems/INTENT_KEY_GUIDE.md)** - How to use intentKey

### Audit Infrastructure
- **[.agent/workflows/micro-problem-quarterly-audit.md](./.agent/workflows/micro-problem-quarterly-audit.md)** - Quarterly audit workflow
- **[scripts/audits/README.md](./scripts/audits/README.md)** - Audit tooling and process

---

## 🎯 One-Sentence Governance Rule

```
A micro-problem page must reduce real-world friction.
If it doesn't, it doesn't deserve to exist.
```

---

## ⏰ Quarterly Audit Schedule

| Quarter | Audit Date | Status |
|---------|------------|--------|
| **Q1** | March 15 | ⏳ Pending |
| **Q2** | June 15 | ⏳ Pending |
| **Q3** | September 15 | ⏳ Pending |
| **Q4** | December 15 | ⏳ Pending |

**Next Audit Due**: [Set after first audit]

---

## 🔍 Three Signals

### Signal A: Search Console Performance
- ❌ **FAIL**: 0 impressions OR impressions but 0 clicks
- ✅ **PASS**: Has both impressions and clicks

### Signal B: User Intent Reality  
- ❌ **FAIL**: Staff confusion, customer expectation mismatch, increased friction
- ✅ **PASS**: No confusion reported

### Signal C: Intent Overlap
- ❌ **FAIL**: Duplicate `intentKey` OR cannot explain difference in one sentence
- ✅ **PASS**: Unique intentKey

---

## ⚖️ Four Decision Types

| Decision | Criteria | Action |
|----------|----------|--------|
| **❌ DELETE** | Signal A FAIL + Signal C FAIL + no value | Remove config entry, no redirect |
| **🔀 MERGE** | Signal C FAIL + one performs better | Keep stronger, fold copy, delete weaker |
| **✏️ REWRITE** | Signal A PASS + Signal B FAIL | Clarify scope and limitations |
| **✅ KEEP** | Passes signals or provides value | No action needed |

---

## 🛠️ Quick Commands

```bash
# Run quarterly audit
npm run audit:micro-problems -- --search-console=scripts/audits/search-console-data/YYYY-MM-DD.csv

# Generate audit report
npm run audit:micro-problems:report -- --output=YYYY-QX-audit-report.md

# Build (validates intentKey duplicates in dev)
npm run build
```

---

## 📋 Pre-Audit Checklist

Before starting a quarterly audit:

- [ ] Export Search Console data (last 90 days) to `scripts/audits/search-console-data/`
- [ ] Compile staff feedback to `scripts/audits/staff-feedback/YYYY-QX-feedback.md`
- [ ] Review current micro-problems config files
- [ ] Clear calendar for 2-4 hours to complete audit
- [ ] Have access to Google Search Console
- [ ] Have changelog/git ready for commit

---

## 🚫 Forbidden Actions

**Never do these:**
- ❌ Keep pages "just in case"
- ❌ Chase keyword variations without unique value
- ❌ Preserve pages for vanity metrics (impressions without clicks)
- ❌ Split one intent into multiple pages
- ❌ Create redirects for deleted pages
- ❌ Override data signals with opinions

---

## 🔧 Technical Maintenance

**Last Updated**: 2026-05-29
**Owner**: Marcus "Marc" Vance (Fractional CTO)

### Dependency Management
- **Patch/Minor updates**: Monthly (low risk, security fixes)
- **Major updates**: Annually (test in `test/major-updates` branch first)
- **Current status**: 
  - ✅ Patch/minor updates completed (2026-05-29)
  - ⚠️ Major updates pending: React 19, Vite 8, TypeScript 6
  - ⚠️ 8 vulnerabilities in build tools (esbuild, vite, crypto-browserify)
    - *Note: These are build-time only, not in production bundle*

### Security Audits
```bash
# Monthly security check
npm audit

# Fix non-breaking issues
npm audit fix

# Check for outdated packages
npm outdated
```

**Vulnerability policy**: Build tool vulns (esbuild, vite, polyfills) are **low risk** for static sites — they don't ship to production.

### Audit Script Status
- **Location**: `scripts/audit-micro-problems.cjs`
- **Status**: ✅ **IMPLEMENTED** (2026-05-29)
- **Previous status**: ❌ Placeholder (non-functional)
- **Features**:
  - Parses Google Search Console CSV exports
  - Loads micro-problem config from `src/config/micro-problems/*.ts`
  - Evaluates 3 signals (A: Search Console, B: Staff feedback, C: Intent overlap)
  - Generates markdown audit reports
  - Supports `--dry-run` mode with mock data

### Technical Debt
- **Cleanup tasks**:
  - [ ] Review `src/archive/` for dead code
  - [ ] Run `npx depcheck` for unused dependencies
  - [ ] Test major dependency updates in branch

---

## 📁 File Locations

### Config Files (edit these during audit)
```
src/config/micro-problems/
├── returns.ts      # Return-related micro-problems
├── shipping.ts     # Outbound shipping micro-problems
├── packaging.ts    # Packaging micro-problems
└── misc.ts         # Catch-all (use sparingly)
```

### Audit Data
```
scripts/audits/
├── search-console-data/  # CSV exports from Google Search Console
├── staff-feedback/       # Quarterly staff feedback logs
└── reports/              # Generated audit reports
```

---

## 🔄 Audit Workflow Summary

1. **Export** Search Console data (last 90 days)
2. **Compile** staff feedback from quarter
3. **Run** audit script: `npm run audit:micro-problems`
4. **Review** generated report
5. **Apply** decision matrix to each page
6. **Edit** config files (returns.ts, shipping.ts, packaging.ts, misc.ts)
7. **Validate** build: `npm run build`
8. **Commit** changes with audit reference
9. **Deploy** to production
10. **Schedule** next audit (90 days from today)

---

## 📊 Signal Evaluation Example

### Example: "ship-breakable-products"

**Signal A** (Search Console):
- Impressions: 0
- Clicks: 0
- **Result**: ❌ FAIL

**Signal B** (Staff Feedback):
- No confusion reported
- **Result**: ✅ PASS

**Signal C** (Intent Overlap):
- intentKey: "ship-fragile-items"
- Also used by: "ship-fragile-items" page
- **Result**: ❌ FAIL (duplicate)

**Decision**: ❌ **DELETE**
- Rationale: No traffic (Signal A FAIL) + Intent overlap (Signal C FAIL) + No unique value
- Action: Remove from `src/config/micro-problems/shipping.ts`

---

## 🎓 Learning Resources

### New to Micro-Problem Governance?

**Start here**:
1. Read: `MICRO_PROBLEM_GOVERNANCE.md` (15 min)
2. Review: `MICRO_PROBLEM_DECISION_FLOWCHART.md` (10 min)
3. Practice: Run through example in section above (5 min)

### Before First Audit

**Prepare by**:
1. Understanding the three signals
2. Reviewing decision matrix
3. Checking existing micro-problems for intentKey duplicates
4. Setting up Search Console export

### After Audit

**Follow up**:
1. Document lessons learned
2. Update staff on changes
3. Monitor removed pages (should 404 naturally)
4. Schedule next quarter's audit immediately

---

## 🆘 Common Questions

### "What if a page has low traffic but staff say it's valuable?"

**Answer**: KEEP it. Signal B (staff value) overrides low traffic if there's a real-world need.

### "Can I just add a redirect instead of letting deleted pages 404?"

**Answer**: NO. Let them 404. The sitemap will automatically exclude them via config.

### "What if I can't tell which page performs better?"

**Answer**: Keep the one with clearer, more direct messaging. If still tied, keep the shorter slug.

### "What if two pages have unique intentKeys but I still can't explain the difference?"

**Answer**: That's a Signal C failure. The intentKeys are wrong. One page should be merged/deleted.

---

## 📞 Support & Questions

**For policy questions**: Review `MICRO_PROBLEM_GOVERNANCE.md`  
**For technical questions**: Review `src/config/micro-problems/README.md`  
**For audit questions**: Review `.agent/workflows/micro-problem-quarterly-audit.md`

---

## 🔒 Policy Status

**This is permanent policy.**

- ✅ Quarterly audits are **mandatory**
- ✅ Signal evaluation is **data-driven**
- ✅ Decisions follow the **decision matrix**
- ✅ Deletion is **safe and expected**

**Do not skip audits. Do not override signals with opinions.**

---

**Last Audit**: [Date]  
**Next Audit**: [Date]  
**Policy Owner**: Product/Marketing Lead
