import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';
import { retrievalTests } from '../retrieval-test-suite.js';
import {
  loadAllEmbeddings,
  buildEmbeddingCache,
  verifyVectorCoverage,
  executeTest,
  generateMarkdownReport,
  isOfflineMode,
  allowSkip,
  embeddingCache,
  type TestExecutionResult,
} from '../retrieval-evaluator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPORT_PATH = join(__dirname, '..', 'RETRIEVAL_TEST_REPORT.md');

// Load embeddings to determine skip status upfront
loadAllEmbeddings();
const isCacheEmpty = Object.keys(embeddingCache).length === 0;
const isCoverageInvalid = !isCacheEmpty && !verifyVectorCoverage().valid;
const shouldSkip = isOfflineMode && allowSkip && (isCacheEmpty || isCoverageInvalid);

if (shouldSkip) {
  await buildEmbeddingCache();
}

describe('Knowledge Retrieval Evaluator Suite', () => {
  const executionResults: TestExecutionResult[] = [];

  beforeAll(async () => {
    loadAllEmbeddings();
    await buildEmbeddingCache();
  });

  afterAll(() => {
    if (executionResults.length > 0) {
      const report = generateMarkdownReport(executionResults);
      writeFileSync(REPORT_PATH, report, 'utf-8');
    }
  });

  describe.each(retrievalTests)('Test case [$id]: $query', (testCase) => {
    it.skipIf(shouldSkip)(
      `should evaluate with expected result: ${testCase.expectedResult}`,
      async () => {
        const result = await executeTest(testCase);
        executionResults.push(result);

        expect(result.actualResult).toBe(testCase.expectedResult);
        if (testCase.expectedResult === 'ACCEPT' && testCase.expectedFaqId) {
          expect(result.actualFaqId).toBe(testCase.expectedFaqId);
        }
        expect(result.passed).toBe(true);
      }
    );
  });
});
