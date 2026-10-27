#!/usr/bin/env node
/**
 * Retrieval Test Runner - CLI Entrypoint & Compatibility Layer
 *
 * Re-exports core functions from knowledge/retrieval-evaluator.ts.
 */

import { fileURLToPath } from 'url';
import { resolve } from 'path';
import {
  loadEmbeddingsFile,
  verifyVectorCoverage,
  embeddingCache,
  generateEmbedding,
  executeTest,
  evaluateAllTests,
  generateMarkdownReport,
} from './retrieval-evaluator.js';

async function main() {
  console.log('🧪 Running Retrieval Test Suite with Gemini Embeddings...\n');
  const { results, passed, failed } = await evaluateAllTests();

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    const confStr = result.confidence ? ` (${(result.confidence * 100).toFixed(1)}%)` : '';
    console.log(
      `${icon} ${result.testCase.id}: ${result.testCase.query.substring(0, 50)}${result.testCase.query.length > 50 ? '...' : ''}${confStr}`
    );
  }

  if (failed === 0) {
    console.log('\n✅ ALL TESTS PASSED - UI rollout approved!\n');
    process.exit(0);
  } else {
    console.log(`\n❌ ${failed} TEST(S) FAILED - UI rollout blocked!\n`);
    process.exit(1);
  }
}

export {
  loadEmbeddingsFile,
  verifyVectorCoverage,
  embeddingCache,
  generateEmbedding,
  executeTest,
  evaluateAllTests,
  generateMarkdownReport,
  main,
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('Error running tests:', err);
    process.exit(1);
  });
}
