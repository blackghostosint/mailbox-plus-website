# Retrieval Test Report

**Generated:** 2026-01-03T03:18:16.662Z

**Minimum Similarity Threshold:** 0.78

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 24 |
| Passed | 18 |
| Failed | 6 |
| Pass Rate | 75.0% |

## Exit Criteria

❌ **UI ROLLOUT BLOCKED** - 6 test(s) failed. Fix issues before proceeding.

## Test Category Breakdown

| Category | Count | Should Accept | Should Refuse |
|----------|-------|---------------|---------------|
| direct_match | 6 | 6 | 0 |
| paraphrase | 6 | 6 | 0 |
| ambiguous | 3 | 0 | 3 |
| operational | 5 | 0 | 5 |
| out_of_scope | 4 | 0 | 4 |

## Detailed Test Results

| ID | Query | Expected | Actual | Pass/Fail | Notes |
|----|-------|----------|--------|-----------|-------|
| direct-01 | Which carriers do you work with? | ACCEPT | ACCEPT | ✅ | Exact match from questionVariants |
| direct-02 | Will I receive tracking information? | ACCEPT | ACCEPT | ✅ | Exact match from questionVariants |
| direct-03 | Do you offer shipping insurance? | ACCEPT | ACCEPT | ✅ | Exact match from questionVariants |
| direct-04 | Can you ship internationally? | ACCEPT | ACCEPT | ✅ | Exact match from questionVariants |
| direct-05 | Can you pack fragile items? | ACCEPT | ACCEPT | ✅ | Exact match from questionVariants |
| direct-06 | Do you accept Amazon returns? | ACCEPT | ACCEPT | ✅ | Exact match from questionVariants |
| paraphrase-01 | What shipping companies can I choose from? | ACCEPT | REFUSE | ❌ | Same intent as "Which carriers do you work with?" |
| paraphrase-02 | Will you give me a tracking number? | ACCEPT | REFUSE | ❌ | Same intent as "Will I receive tracking information?" |
| paraphrase-03 | Can you send packages to other countries? | ACCEPT | REFUSE | ❌ | Same intent as "Can you ship internationally?" |
| paraphrase-04 | Do you handle delicate or breakable items? | ACCEPT | REFUSE | ❌ | Same intent as "Can you pack fragile items?" |
| paraphrase-05 | Can I return Amazon purchases at your location? | ACCEPT | REFUSE | ❌ | Same intent as "Do you accept Amazon returns?" |
| paraphrase-06 | How much time does delivery usually take? | ACCEPT | REFUSE | ❌ | Same intent as "How long will shipping take?" |
| ambiguous-01 | What business services do you offer? | REFUSE | REFUSE | ✅ | Spans multiple FAQs - too broad to answer safely |
| ambiguous-02 | What can you help me with? | REFUSE | REFUSE | ✅ | Extremely broad - would require listing multiple services |
| ambiguous-03 | What services does Mailbox Plus provide? | REFUSE | REFUSE | ✅ | Covers entire service catalog - ambiguous intent |
| operational-01 | Where is my package? | REFUSE | REFUSE | ✅ | Requires real-time tracking data - operational query |
| operational-02 | Can you track my shipment right now? | REFUSE | REFUSE | ✅ | Real-time status request - cannot be answered from FAQ |
| operational-03 | Is my mailbox available? | REFUSE | REFUSE | ✅ | Account-specific operational query |
| operational-04 | Can you guarantee my package will arrive tomorrow? | REFUSE | REFUSE | ✅ | Operational promise - FAQ cannot make guarantees |
| operational-05 | Can you notarize this document for me today? | REFUSE | REFUSE | ✅ | Real-time availability question - operational |
| out_of_scope-01 | What are your prices? | REFUSE | REFUSE | ✅ | Pricing not in FAQ scope |
| out_of_scope-02 | Are you cheaper than UPS Store? | REFUSE | REFUSE | ✅ | Comparative pricing - out of scope |
| out_of_scope-03 | Should I ship FedEx or UPS? | REFUSE | REFUSE | ✅ | Advice/recommendation - out of scope |
| out_of_scope-04 | Is this legal in Ohio? | REFUSE | REFUSE | ✅ | Legal advice - completely out of scope |

## ⚠️ Failed Tests

### paraphrase-01: What shipping companies can I choose from?

- **Category:** paraphrase
- **Expected:** ACCEPT
- **Actual:** REFUSE

### paraphrase-02: Will you give me a tracking number?

- **Category:** paraphrase
- **Expected:** ACCEPT
- **Actual:** REFUSE

### paraphrase-03: Can you send packages to other countries?

- **Category:** paraphrase
- **Expected:** ACCEPT
- **Actual:** REFUSE

### paraphrase-04: Do you handle delicate or breakable items?

- **Category:** paraphrase
- **Expected:** ACCEPT
- **Actual:** REFUSE

### paraphrase-05: Can I return Amazon purchases at your location?

- **Category:** paraphrase
- **Expected:** ACCEPT
- **Actual:** REFUSE

### paraphrase-06: How much time does delivery usually take?

- **Category:** paraphrase
- **Expected:** ACCEPT
- **Actual:** REFUSE

## Recommendations

**Action Required:** Fix the failed tests before UI rollout.

**Allowed Fixes:**
1. Adjust `minimumSimilarity` threshold (currently 0.78)
2. Improve `searchText` in FAQ entries without changing answers

**Do NOT:**
- Rewrite answers to fit failing tests
- Remove tests to improve pass rate
- Proceed to UI with failing tests

