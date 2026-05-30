# Retrieval Test Specification

**Objective:** Verify that the chatbot answers correctly when a matching FAQ exists, selects the best answer when phrasing varies, refuses safely when information is missing or out of scope, never hallucinates or combines answers, and does not drift into operational or advisory behavior.

**Rule:** Only after this passes do we build UI.

---

## 1️⃣ Retrieval Contract

For any user query, the system must do **exactly one** of the following:

### ✅ ACCEPT

Return one FAQ entry when:

- Similarity ≥ `minimumSimilarity` (0.78)
- No competing entry scores similarly
- Intent is informational

**Response Format:**

- Return the FAQ answer verbatim
- Include source URL reference
- No modification or summarization

### ❌ REFUSE

Return the fallback response when:

- No entry meets similarity threshold
- Two or more entries compete (ambiguous)
- Question implies action, policy, or exception
- Question exceeds FAQ scope

**Fallback Response:**

```
"I don't have that information. Please contact the store directly or visit us in person."
```

**There is no third option.**

---

## 2️⃣ Test Matrix

The test suite contains 24 test cases across 5 categories:

### A. Direct Match Tests (should answer)

**Count:** 6 tests  
**Expected Behavior:** ACCEPT

Questions nearly identical to FAQ `questionVariants`:

- "Which carriers do you work with?"
- "Will I receive tracking information?"
- "Do you offer shipping insurance?"
- "Can you ship internationally?"
- "Can you pack fragile items?"
- "Do you accept Amazon returns?"

**Success Criteria:**

- ✅ One clear match
- ✅ Correct answer returned
- ✅ Correct source URL referenced

---

### B. Paraphrase Tests (should still answer)

**Count:** 6 tests  
**Expected Behavior:** ACCEPT

Change phrasing, not meaning:

- "What shipping companies can I choose from?"
- "Will you give me a tracking number?"
- "Can you send packages to other countries?"
- "Do you handle delicate or breakable items?"
- "Can I return Amazon purchases at your location?"
- "How much time does delivery usually take?"

**Success Criteria:**

- ✅ Same FAQ matched as direct version
- ✅ No fallback triggered
- ✅ No merged answers

---

### C. Ambiguous Tests (must refuse)

**Count:** 3 tests  
**Expected Behavior:** REFUSE

Questions that span multiple entries:

- "What business services do you offer?"
- "What can you help me with?"
- "What services does Mailbox Plus provide?"

**Success Criteria:**

- ✅ Refusal triggered
- ✅ Fallback message returned
- ✅ No partial listing
- ✅ No summarization

**This is intentional.** Ambiguity is dangerous.

---

### D. Operational Tests (must refuse)

**Count:** 5 tests  
**Expected Behavior:** REFUSE

Questions the FAQ corpus cannot safely answer:

- "Where is my package?"
- "Can you track my shipment right now?"
- "Is my mailbox available?"
- "Can you guarantee my package will arrive tomorrow?"
- "Can you notarize this document for me today?"

**Success Criteria:**

- ✅ Refusal triggered
- ✅ Fallback message returned
- ✅ No attempt to help with operational queries

**This is where most chatbots fail. Yours must not.**

---

### E. Out-of-Scope Tests (must refuse)

**Count:** 4 tests  
**Expected Behavior:** REFUSE

Questions outside FAQ domain:

- "What are your prices?"
- "Are you cheaper than UPS Store?"
- "Should I ship FedEx or UPS?"
- "Is this legal in Ohio?"

**Success Criteria:**

- ✅ Refusal triggered
- ✅ No advice given
- ✅ No speculation

---

## 3️⃣ Scoring Rules (Strict)

Each query is logged with:

| Query                         | Result   | Pass/Fail | Notes         |
| ----------------------------- | -------- | --------- | ------------- |
| "Which carriers do you use?"  | Answered | ✅ Pass   | Correct       |
| "Can you track my package?"   | Refused  | ✅ Pass   | Correct       |
| "What services do you offer?" | Refused  | ✅ Pass   | Correct       |
| "Is mailbox rental legal?"    | Answered | ❌ Fail   | Should refuse |

**One fail blocks UI rollout.**

---

## 4️⃣ Similarity Threshold Validation

During testing, watch for:

- ❌ Wrong FAQ being selected
- ❌ Two FAQs competing
- ❌ Overly eager matches

### Allowed Fixes

If issues occur, you have **only two** allowed fixes:

1. **Slightly raise `minimumSimilarity`**  
   Example: 0.78 → 0.82
2. **Improve `searchText` without changing answers**  
   Add relevant keywords to help matching

### Forbidden Actions

- ❌ Do NOT rewrite FAQ answers
- ❌ Do NOT remove failing tests
- ❌ Do NOT lower similarity threshold
- ❌ Do NOT proceed with failing tests

---

## 5️⃣ Fallback Copy

For now, use this exact fallback:

```
"I don't have that information. Please contact the store directly or visit us in person."
```

**Do not soften it yet.**  
We test correctness before friendliness.

---

## 6️⃣ Exit Criteria

You may proceed to UI **only if**:

- ✅ All direct + paraphrase tests answer correctly
- ✅ All ambiguous questions refuse
- ✅ All operational questions refuse
- ✅ All out-of-scope questions refuse
- ✅ No hallucinated content observed
- ✅ No merged answers observed

**If all pass → Retrieval Approved**  
**If any fail → Fix before UI rollout**

---

## Running the Tests

```bash
npm run test:retrieval
```

This will:

1. Load all 24 test cases
2. Execute retrieval logic against `kb.entries.json`
3. Generate `RETRIEVAL_TEST_REPORT.md` with results
4. Exit with code 0 (success) or 1 (failure)

---

## Test Report Location

After running tests, view the detailed report at:

```
knowledge/RETRIEVAL_TEST_REPORT.md
```

The report includes:

- Pass/fail summary
- Detailed test results table
- Failed test analysis
- Recommendations for fixes
- Exit criteria validation

---

## Maintenance

- **Adding Tests:** Add new `TestCase` objects to `retrieval-test-suite.ts`
- **Updating Threshold:** Modify `MINIMUM_SIMILARITY` constant
- **Changing Fallback:** Update `FALLBACK_RESPONSE` constant

**All changes must preserve the strict retrieval contract.**
