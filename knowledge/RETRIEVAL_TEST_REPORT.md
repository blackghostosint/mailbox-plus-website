# Retrieval Test Report (Gemini Embeddings)

**Generated:** 2026-01-04T13:00:08.818Z

**Embedding Model:** text-embedding-004
**Minimum Similarity Threshold:** 0.78

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 24 |
| Passed | 24 |
| Failed | 0 |
| Pass Rate | 100.0% |

## Exit Criteria

✅ **RETRIEVAL APPROVED** - All tests passed. UI rollout may proceed.

## Test Category Breakdown

| Category | Count | Should Accept | Should Refuse |
|----------|-------|---------------|---------------|
| direct_match | 6 | 6 | 0 |
| paraphrase | 6 | 6 | 0 |
| ambiguous | 3 | 0 | 3 |
| operational | 5 | 0 | 5 |
| out_of_scope | 4 | 0 | 4 |

## Detailed Test Results

| ID | Query | Expected | Actual | Pass/Fail | Confidence | Notes |
|----|-------|----------|--------|-----------|------------|-------|
| direct-01 | Which carriers do you work with? | ACCEPT | ACCEPT | ✅ | 100.0% | Exact match from questionVariants |
| direct-02 | Will I receive tracking information? | ACCEPT | ACCEPT | ✅ | 100.0% | Exact match from questionVariants |
| direct-03 | Do you offer shipping insurance? | ACCEPT | ACCEPT | ✅ | 100.0% | Exact match from questionVariants |
| direct-04 | Can you ship internationally? | ACCEPT | ACCEPT | ✅ | 100.0% | Exact match from questionVariants |
| direct-05 | Can you pack fragile items? | ACCEPT | ACCEPT | ✅ | 100.0% | Exact match from questionVariants |
| direct-06 | Do you accept Amazon returns? | ACCEPT | ACCEPT | ✅ | 100.0% | Exact match from questionVariants |
| paraphrase-01 | What shipping companies can I choose from? | ACCEPT | ACCEPT | ✅ | 90.6% | Same intent as "Which carriers do you work with?" |
| paraphrase-02 | Will you give me a tracking number? | ACCEPT | ACCEPT | ✅ | 100.0% | Same intent as "Will I receive tracking information?" |
| paraphrase-03 | Can you send packages to other countries? | ACCEPT | ACCEPT | ✅ | 93.7% | Same intent as "Can you ship internationally?" |
| paraphrase-04 | Do you handle delicate or breakable items? | ACCEPT | ACCEPT | ✅ | 90.4% | Same intent as "Can you pack fragile items?" |
| paraphrase-05 | Can I return Amazon purchases at your location? | ACCEPT | ACCEPT | ✅ | 83.0% | Same intent as "Do you accept Amazon returns?" |
| paraphrase-06 | How much time does delivery usually take? | ACCEPT | ACCEPT | ✅ | 95.5% | Same intent as "How long will shipping take?" |
| ambiguous-01 | What business services do you offer? | REFUSE | REFUSE | ✅ | N/A | Spans multiple FAQs - too broad to answer safely |
| ambiguous-02 | What can you help me with? | REFUSE | REFUSE | ✅ | N/A | Extremely broad - would require listing multiple services |
| ambiguous-03 | What services does Mailbox Plus provide? | REFUSE | REFUSE | ✅ | N/A | Covers entire service catalog - ambiguous intent |
| operational-01 | Where is my package? | REFUSE | REFUSE | ✅ | N/A | Requires real-time tracking data - operational query |
| operational-02 | Can you track my shipment right now? | REFUSE | REFUSE | ✅ | N/A | Real-time status request - cannot be answered from FAQ |
| operational-03 | Is my mailbox available? | REFUSE | REFUSE | ✅ | N/A | Account-specific operational query |
| operational-04 | Can you guarantee my package will arrive tomorrow? | REFUSE | REFUSE | ✅ | N/A | Operational promise - FAQ cannot make guarantees |
| operational-05 | Can you notarize this document for me today? | REFUSE | REFUSE | ✅ | N/A | Real-time availability question - operational |
| out_of_scope-01 | What are your prices? | REFUSE | REFUSE | ✅ | N/A | Pricing not in FAQ scope |
| out_of_scope-02 | Are you cheaper than UPS Store? | REFUSE | REFUSE | ✅ | N/A | Comparative pricing - out of scope |
| out_of_scope-03 | Should I ship FedEx or UPS? | REFUSE | REFUSE | ✅ | N/A | Advice/recommendation - out of scope |
| out_of_scope-04 | Is this legal in Ohio? | REFUSE | REFUSE | ✅ | N/A | Legal advice - completely out of scope |

## Recommendations

All tests passed! You may proceed to UI development.

