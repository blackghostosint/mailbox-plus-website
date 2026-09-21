#!/usr/bin/env node
/**
 * Retrieval Test Runner with Gemini Embeddings
 *
 * Executes all retrieval tests using semantic similarity via Gemini text embeddings.
 *
 * STRICT RULE: One fail blocks UI rollout.
 */

// Load environment variables from .env files
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local first (highest priority), then .env
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  retrievalTests,
  FALLBACK_RESPONSE,
  getTestStats,
  type TestCase,
  type TestResult,
} from './retrieval-test-suite.js';
import {
  EMBEDDING_MODEL,
  MINIMUM_SIMILARITY,
  buildCacheKey,
  cosineSimilarity,
  calculateCandidateSimilarity,
  retrieveAnswerCore,
  type KBEntry,
  type KnowledgeBase,
  type EmbeddingCache,
  type RetrievalResult,
} from './retrieval-core.js';

// ========================================
// Mode & Gemini API Setup
// ========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const isOfflineMode = !GEMINI_API_KEY;
const allowSkip =
  process.argv.includes('--allow-skip') ||
  process.env.ALLOW_SKIP_RETRIEVAL_TESTS === 'true' ||
  process.env.ALLOW_SKIP === '1';

let genAI: GoogleGenerativeAI | null = null;
let embeddingModel: any = null;

if (!isOfflineMode) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
  embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  console.log(`✓ Gemini API initialized with ${EMBEDDING_MODEL} model`);
} else {
  console.log('ℹ GEMINI_API_KEY not set. Running in offline mode using precomputed embeddings.');
}

// ========================================
// Load Knowledge Base
// ========================================
const kbPath = join(__dirname, 'kb.entries.json');
const kb: KnowledgeBase = JSON.parse(readFileSync(kbPath, 'utf-8'));

console.log(`✓ Loaded ${kb.entries.length} FAQ entries from knowledge base`);

// ========================================
// Embedding Cache
// ========================================
const CACHE_FILE = join(__dirname, '.embedding-cache.json');
const SNAPSHOT_FILE = join(__dirname, 'embeddings.json');
let embeddingCache: EmbeddingCache = {};

function loadEmbeddingsFile(filePath: string): number {
  if (existsSync(filePath)) {
    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf-8'));
      const vectors: Record<string, number[]> = parsed.embeddings || parsed;
      let count = 0;
      for (const [key, val] of Object.entries(vectors)) {
        if (Array.isArray(val)) {
          embeddingCache[key] = val;
          count++;
        }
      }
      return count;
    } catch (err) {
      console.warn(`⚠ Could not load embedding file ${filePath}:`, err);
    }
  }
  return 0;
}

loadEmbeddingsFile(CACHE_FILE);
loadEmbeddingsFile(SNAPSHOT_FILE);

console.log(`✓ Loaded cached embeddings for ${Object.keys(embeddingCache).length} entries`);

/**
 * Generate embedding for a single text using Gemini (or return cached in offline mode)
 */
async function generateEmbedding(
  text: string,
  taskType: string = 'RETRIEVAL_DOCUMENT'
): Promise<number[]> {
  const cacheKeys = [
    buildCacheKey(taskType, text),
    buildCacheKey('RETRIEVAL_QUERY', text),
    buildCacheKey('RETRIEVAL_DOCUMENT', text),
    text,
  ];

  for (const key of cacheKeys) {
    if (embeddingCache[key]) {
      return embeddingCache[key];
    }
  }

  if (isOfflineMode) {
    throw new Error(
      `Offline mode error: Missing precomputed embedding for text: "${text.substring(0, 50)}..." (${taskType}). Run 'npm run build:embeddings' with GEMINI_API_KEY set.`
    );
  }

  try {
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text }] },
      taskType,
    });

    if (!result.embedding || !result.embedding.values) {
      throw new Error('Invalid embedding response from Gemini API');
    }

    const values = result.embedding.values;
    embeddingCache[buildCacheKey(taskType, text)] = values;
    return values;
  } catch (error) {
    console.error(`Failed to generate embedding for text: "${text.substring(0, 50)}..."`);
    throw error;
  }
}

/**
 * Verify 100% vector embedding coverage across all KB entries and test queries in offline mode
 */
function verifyVectorCoverage(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const entry of kb.entries) {
    for (const variant of entry.questionVariants) {
      const cacheKey1 = buildCacheKey(entry.id, variant);
      const cacheKey2 = buildCacheKey('RETRIEVAL_QUERY', variant);
      if (!embeddingCache[cacheKey1] && !embeddingCache[cacheKey2] && !embeddingCache[variant]) {
        missing.push(`Entry [${entry.id}] missing questionVariant embedding: "${variant}"`);
      }
    }

    const documentTexts = [entry.searchText, entry.title].filter(Boolean);
    for (const text of documentTexts) {
      const cacheKey1 = buildCacheKey(entry.id, text);
      const cacheKey2 = buildCacheKey('RETRIEVAL_DOCUMENT', text);
      if (!embeddingCache[cacheKey1] && !embeddingCache[cacheKey2] && !embeddingCache[text]) {
        missing.push(
          `Entry [${entry.id}] missing document embedding for: "${text.substring(0, 40)}..."`
        );
      }
    }
  }

  for (const testCase of retrievalTests) {
    const cacheKey1 = buildCacheKey('RETRIEVAL_QUERY', testCase.query);
    if (!embeddingCache[cacheKey1] && !embeddingCache[testCase.query]) {
      missing.push(`Benchmark test query missing embedding: "${testCase.query}"`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Pre-compute and cache embeddings for all KB entries
 */
async function buildEmbeddingCache(): Promise<void> {
  if (isOfflineMode) {
    if (Object.keys(embeddingCache).length === 0) {
      console.error(
        '❌ GEMINI_API_KEY is not set and no precomputed vector embeddings snapshot was found in embeddings.json or .embedding-cache.json.'
      );
      if (allowSkip) {
        console.warn(
          '⚠ --allow-skip flag detected. Skipping retrieval evaluation tests in offline mode.\n'
        );
        const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
        const skippedReport =
          `# Retrieval Test Report (Skipped - Offline Mode)\n\n` +
          `**Generated:** ${new Date().toISOString()}\n\n` +
          `ℹ Retrieval test suite skipped because GEMINI_API_KEY was not set and no cached vector embeddings file was found.\n`;
        writeFileSync(reportPath, skippedReport, 'utf-8');
        process.exit(0);
      } else {
        console.error(
          '❌ Skipping retrieval tests is NOT allowed without --allow-skip or ALLOW_SKIP_RETRIEVAL_TESTS=true.'
        );
        console.error('❌ Exiting with status 1.\n');
        process.exit(1);
      }
    }

    console.log('🔍 Verifying offline vector embedding coverage...');
    const coverage = verifyVectorCoverage();

    if (!coverage.valid) {
      console.error(
        `❌ Vector Embedding Drift / Incomplete Coverage Detected! (${coverage.missing.length} missing embeddings)`
      );
      coverage.missing.forEach((msg) => console.error(`   ${msg}`));

      if (allowSkip) {
        console.warn(
          '⚠ --allow-skip flag detected. Skipping retrieval evaluation tests due to incomplete vector coverage.\n'
        );
        process.exit(0);
      } else {
        console.error('\n❌ Vector coverage check failed in offline mode. Exiting with status 1.');
        console.error(
          "   Run 'npm run build:embeddings' with GEMINI_API_KEY set to generate missing embeddings.\n"
        );
        process.exit(1);
      }
    }

    console.log(
      `✓ 100% vector embedding coverage verified for all ${kb.entries.length} KB entries in offline mode.`
    );
    console.log('✓ Using precomputed vector embedding cache (offline mode)\n');
    return;
  }

  console.log('\n📦 Building/updating embedding cache...');

  let newEmbeddings = 0;

  for (const entry of kb.entries) {
    // Embed questionVariants with RETRIEVAL_QUERY taskType (they are example queries)
    for (const variant of entry.questionVariants) {
      const cacheKey = buildCacheKey(entry.id, variant);

      if (!embeddingCache[cacheKey]) {
        const embedding = await generateEmbedding(variant, 'RETRIEVAL_QUERY');
        embeddingCache[cacheKey] = embedding;
        newEmbeddings++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Embed searchText and title with RETRIEVAL_DOCUMENT taskType (they are document content)
    const documentTexts = [entry.searchText, entry.title];
    for (const text of documentTexts) {
      const cacheKey = buildCacheKey(entry.id, text);

      if (!embeddingCache[cacheKey]) {
        const embedding = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
        embeddingCache[cacheKey] = embedding;
        newEmbeddings++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // Pre-compute embeddings for benchmark test suite queries as well
  for (const testCase of retrievalTests) {
    const cacheKey = buildCacheKey('RETRIEVAL_QUERY', testCase.query);
    if (!embeddingCache[cacheKey] && !embeddingCache[testCase.query]) {
      const embedding = await generateEmbedding(testCase.query, 'RETRIEVAL_QUERY');
      embeddingCache[cacheKey] = embedding;
      newEmbeddings++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Save cache to file
  const cacheData = {
    metadata: {
      model: EMBEDDING_MODEL,
      generatedAt: new Date().toISOString(),
    },
    embeddings: embeddingCache,
  };

  writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
  console.log(`✓ Cache updated: ${newEmbeddings} new embeddings generated`);
  console.log(`✓ Total cached embeddings: ${Object.keys(embeddingCache).length}\n`);
}

// ========================================
// Semantic Similarity Function
// ========================================
/**
 * Calculate semantic similarity using Gemini embeddings and cosine similarity
 */
async function calculateSimilarity(
  query: string,
  entryId: string,
  entryTexts: string[]
): Promise<number> {
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
  const cacheKeys = entryTexts.map((text) => buildCacheKey(entryId, text));
  return calculateCandidateSimilarity(queryEmbedding, cacheKeys, embeddingCache, true);
}

// ========================================
// Retrieval Logic
// ========================================
async function retrieveAnswer(query: string): Promise<RetrievalResult> {
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
  return retrieveAnswerCore(queryEmbedding, kb.entries, embeddingCache, {
    globalMinSimilarity: MINIMUM_SIMILARITY,
    throwOnMissing: true,
  });
}

// ========================================
// Test Execution
// ========================================
interface TestExecutionResult {
  testCase: TestCase;
  actualResult: TestResult;
  actualFaqId?: string;
  confidence?: number;
  passed: boolean;
  failureReason?: string;
}

async function executeTest(testCase: TestCase): Promise<TestExecutionResult> {
  const retrieval = await retrieveAnswer(testCase.query);
  const actualResult: TestResult = retrieval.matched ? 'ACCEPT' : 'REFUSE';

  let passed = actualResult === testCase.expectedResult;
  let failureReason: string | undefined;

  // For ACCEPT cases, also verify the correct FAQ was matched
  if (passed && testCase.expectedResult === 'ACCEPT' && testCase.expectedFaqId) {
    if (retrieval.faqId !== testCase.expectedFaqId) {
      passed = false;
      failureReason = `Wrong FAQ matched: expected ${testCase.expectedFaqId}, got ${retrieval.faqId}`;
    }
  }

  return {
    testCase,
    actualResult,
    actualFaqId: retrieval.faqId,
    confidence: retrieval.confidence,
    passed,
    failureReason,
  };
}

// ========================================
// Report Generation
// ========================================
function generateMarkdownReport(results: TestExecutionResult[]): string {
  const stats = getTestStats();
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const passRate = ((passed / results.length) * 100).toFixed(1);

  let report = `# Retrieval Test Report (Gemini Embeddings)\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Embedding Model:** ${EMBEDDING_MODEL}\n`;
  report += `**Minimum Similarity Threshold:** ${MINIMUM_SIMILARITY}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Tests | ${results.length} |\n`;
  report += `| Passed | ${passed} |\n`;
  report += `| Failed | ${failed} |\n`;
  report += `| Pass Rate | ${passRate}% |\n\n`;

  // Exit Criteria
  const uiApproved = failed === 0;
  report += `## Exit Criteria\n\n`;
  if (uiApproved) {
    report += `✅ **RETRIEVAL APPROVED** - All tests passed. UI rollout may proceed.\n\n`;
  } else {
    report += `❌ **UI ROLLOUT BLOCKED** - ${failed} test(s) failed. Fix issues before proceeding.\n\n`;
  }

  // Test Category Breakdown
  report += `## Test Category Breakdown\n\n`;
  report += `| Category | Count | Should Accept | Should Refuse |\n`;
  report += `|----------|-------|---------------|---------------|\n`;

  const categories = Object.keys(stats.byCategory);
  for (const category of categories) {
    const count = stats.byCategory[category];
    const categoryTests = results.filter((r) => r.testCase.category === category);
    const accept = categoryTests.filter((r) => r.testCase.expectedResult === 'ACCEPT').length;
    const refuse = categoryTests.filter((r) => r.testCase.expectedResult === 'REFUSE').length;
    report += `| ${category} | ${count} | ${accept} | ${refuse} |\n`;
  }
  report += `\n`;

  // Detailed Results Table
  report += `## Detailed Test Results\n\n`;
  report += `| ID | Query | Expected | Actual | Pass/Fail | Confidence | Notes |\n`;
  report += `|----|-------|----------|--------|-----------|------------|-------|\n`;

  for (const result of results) {
    const { testCase, actualResult, passed, failureReason, confidence } = result;
    const passIcon = passed ? '✅' : '❌';
    const notes = failureReason || testCase.notes || '';
    const queryTrunc =
      testCase.query.length > 50 ? testCase.query.substring(0, 47) + '...' : testCase.query;
    const confStr = confidence ? `${(confidence * 100).toFixed(1)}%` : 'N/A';

    report += `| ${testCase.id} | ${queryTrunc} | ${testCase.expectedResult} | ${actualResult} | ${passIcon} | ${confStr} | ${notes} |\n`;
  }
  report += `\n`;

  // Failures Section (if any)
  const failures = results.filter((r) => !r.passed);
  if (failures.length > 0) {
    report += `## ⚠️ Failed Tests\n\n`;
    for (const failure of failures) {
      report += `### ${failure.testCase.id}: ${failure.testCase.query}\n\n`;
      report += `- **Category:** ${failure.testCase.category}\n`;
      report += `- **Expected:** ${failure.testCase.expectedResult}\n`;
      report += `- **Actual:** ${failure.actualResult}\n`;
      if (failure.actualFaqId) {
        report += `- **Matched FAQ:** ${failure.actualFaqId}\n`;
      }
      if (failure.confidence) {
        report += `- **Confidence:** ${(failure.confidence * 100).toFixed(1)}%\n`;
      }
      if (failure.failureReason) {
        report += `- **Reason:** ${failure.failureReason}\n`;
      }
      report += `\n`;
    }
  }

  // Recommendations
  report += `## Recommendations\n\n`;
  if (uiApproved) {
    report += `All tests passed! You may proceed to UI development.\n\n`;
  } else {
    report += `**Action Required:** Fix the failed tests before UI rollout.\n\n`;
    report += `**Allowed Fixes:**\n`;
    report += `1. Adjust \`minimumSimilarity\` threshold (currently ${MINIMUM_SIMILARITY})\n`;
    report += `2. Improve \`searchText\` in FAQ entries without changing answers\n\n`;
    report += `**Do NOT:**\n`;
    report += `- Rewrite answers to fit failing tests\n`;
    report += `- Remove tests to improve pass rate\n`;
    report += `- Proceed to UI with failing tests\n\n`;
  }

  return report;
}

// ========================================
// Main Execution
// ========================================
async function main() {
  console.log('🧪 Running Retrieval Test Suite with Gemini Embeddings...\n');

  // Build embedding cache first
  await buildEmbeddingCache();

  const results: TestExecutionResult[] = [];

  // Execute all tests
  for (const testCase of retrievalTests) {
    const result = await executeTest(testCase);
    results.push(result);

    const icon = result.passed ? '✅' : '❌';
    const confStr = result.confidence ? ` (${(result.confidence * 100).toFixed(1)}%)` : '';
    console.log(
      `${icon} ${testCase.id}: ${testCase.query.substring(0, 50)}${testCase.query.length > 50 ? '...' : ''}${confStr}`
    );
  }

  console.log('\n📊 Generating report...\n');

  // Generate report
  const report = generateMarkdownReport(results);

  // Write to file
  const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log(`✓ Report saved to: ${reportPath}\n`);

  // Console summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  // Category breakdown
  const categoryResults = {
    direct_match: { passed: 0, failed: 0 },
    paraphrase: { passed: 0, failed: 0 },
    ambiguous: { passed: 0, failed: 0 },
    operational: { passed: 0, failed: 0 },
    out_of_scope: { passed: 0, failed: 0 },
  };

  for (const result of results) {
    const cat = result.testCase.category;
    if (result.passed) {
      categoryResults[cat].passed++;
    } else {
      categoryResults[cat].failed++;
    }
  }

  console.log('📈 Results by Category:');
  console.log(
    `   Direct Match:    ${categoryResults.direct_match.passed}/${categoryResults.direct_match.passed + categoryResults.direct_match.failed} passed`
  );
  console.log(
    `   Paraphrase:      ${categoryResults.paraphrase.passed}/${categoryResults.paraphrase.passed + categoryResults.paraphrase.failed} passed`
  );
  console.log(
    `   Ambiguous:       ${categoryResults.ambiguous.passed}/${categoryResults.ambiguous.passed + categoryResults.ambiguous.failed} passed`
  );
  console.log(
    `   Operational:     ${categoryResults.operational.passed}/${categoryResults.operational.passed + categoryResults.operational.failed} passed`
  );
  console.log(
    `   Out-of-Scope:    ${categoryResults.out_of_scope.passed}/${categoryResults.out_of_scope.passed + categoryResults.out_of_scope.failed} passed\n`
  );

  if (failed === 0) {
    console.log('✅ ALL TESTS PASSED - UI rollout approved!\n');
    process.exit(0);
  } else {
    console.log(`❌ ${failed} TEST(S) FAILED - UI rollout blocked!\n`);
    console.log(`See ${reportPath} for details.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error running tests:', err);
  process.exit(1);
});
