import { describe, it, expect, beforeAll } from 'vitest';
import { retrievalTests } from '../retrieval-test-suite.js';
import {
  loadAllEmbeddings,
  buildEmbeddingCache,
  verifyVectorCoverage,
  executeTest,
  isOfflineMode,
  allowSkip,
} from '../retrieval-evaluator.js';

describe('Knowledge Retrieval Evaluator Suite', () => {
  beforeAll(async () => {
    loadAllEmbeddings();
    if (isOfflineMode) {
      const coverage = verifyVectorCoverage();
      if (!coverage.valid && !allowSkip) {
        throw new Error(
          `Vector coverage check failed in offline mode (${coverage.missing.length} missing embeddings):\n` +
            coverage.missing.map((m) => `  - ${m}`).join('\n')
        );
      }
    } else {
      await buildEmbeddingCache();
    }
  });

  describe.each(retrievalTests)('Test case [$id]: $query', (testCase) => {
    it(`should evaluate with expected result: ${testCase.expectedResult}`, async () => {
      const result = await executeTest(testCase);

      expect(result.actualResult).toBe(testCase.expectedResult);
      if (testCase.expectedResult === 'ACCEPT' && testCase.expectedFaqId) {
        expect(result.actualFaqId).toBe(testCase.expectedFaqId);
      }
      expect(result.passed).toBe(true);
    });
  });
});
