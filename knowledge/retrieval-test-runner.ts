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

import { readFileSync, writeFileSync, existsSync, statSync, appendFileSync } from 'fs';
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
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
// Custom Cache Miss Error
// ========================================
class CacheMissError extends Error {
  constructor(public text: string) {
    super(`No cached vector embedding exists for: "${text}"`);
    this.name = 'CacheMissError';
  }
}

// ========================================
// Gemini API Setup (with Offline Fallback)
// ========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let embeddingModel: GenerativeModel | null = null;
const isOfflineMode = !GEMINI_API_KEY;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  console.log(`✓ Gemini API initialized with ${EMBEDDING_MODEL} model`);
} else {
  console.log('\n================================================================');
  console.log(
    '⚠️  OFFLINE MODE — retrieval results are against CACHED embeddings, not live API vectors. Results are not comparable to live runs.'
  );
  console.log('================================================================\n');
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
let embeddingCache: EmbeddingCache = {};

// Load existing cache if available
if (existsSync(CACHE_FILE)) {
  try {
    embeddingCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    console.log(`✓ Loaded cached embeddings for ${Object.keys(embeddingCache).length} entries`);
  } catch (err) {
    console.warn('⚠ Could not load embedding cache, will rebuild if API key is set');
  }
}

/**
 * Generate embedding for a single text using Gemini API or offline cache.
 * When GEMINI_API_KEY is present, live API errors throw immediately without fallback.
 * When GEMINI_API_KEY is absent, missing cache entries throw CacheMissError.
 */
async function generateEmbedding(
  text: string,
  taskType: string = 'RETRIEVAL_DOCUMENT'
): Promise<number[]> {
  // If API key is available, generate live embedding and fail loudly on API errors
  if (embeddingModel) {
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text }] },
      taskType,
    });

    if (!result.embedding || !result.embedding.values) {
      throw new Error(
        `Invalid embedding response from Gemini API for text: "${text.substring(0, 50)}..."`
      );
    }

    const values = result.embedding.values;
    const primaryKey = `${taskType}::${text}`;
    embeddingCache[primaryKey] = values;

    return values;
  }

  // Offline lookup in embeddingCache.
  // We look up by taskType prefix (`RETRIEVAL_QUERY::` or `RETRIEVAL_DOCUMENT::`)
  // plus legacy `query::` prefix for query tasks. Cross-matching query embeddings with
  // document embeddings is disallowed to ensure taskType integrity.
  const primaryKey = `${taskType}::${text}`;
  const cachedKeys = taskType === 'RETRIEVAL_QUERY' ? [primaryKey, `query::${text}`] : [primaryKey];

  for (const key of cachedKeys) {
    if (embeddingCache[key]) {
      return embeddingCache[key];
    }
  }

  throw new CacheMissError(text);
}

/**
 * Pre-compute and cache embeddings for all KB entries and retrieval test suite queries when GEMINI_API_KEY is present
 */
async function buildEmbeddingCache(): Promise<boolean> {
  if (!GEMINI_API_KEY) {
    const cachedCount = Object.keys(embeddingCache).length;
    if (cachedCount === 0) {
      console.warn(
        '⚠️  OFFLINE MODE NOTICE: GEMINI_API_KEY is not set and vector cache (.embedding-cache.json) is missing or empty.'
      );
      console.warn(
        '⚠️  Retrieval evaluation skipped. Set GEMINI_API_KEY to generate embeddings or restore .embedding-cache.json.\n'
      );
      return false;
    }
    const stats = existsSync(CACHE_FILE) ? statSync(CACHE_FILE) : null;
    const cacheAgeInfo = stats ? ` (cache modified: ${stats.mtime.toISOString()})` : '';
    console.log(
      `✓ Offline mode: using pre-cached vector embeddings (${cachedCount} cached entries)${cacheAgeInfo}\n`
    );
    return true;
  }

  console.log('\n📦 Building/updating embedding cache...');

  let newEmbeddings = 0;

  for (const entry of kb.entries) {
    // Embed questionVariants with RETRIEVAL_QUERY taskType (they are example queries)
    for (const variant of entry.questionVariants) {
      const cacheKey = buildCacheKey(entry.id, variant);
      const taskKey = `RETRIEVAL_QUERY::${variant}`;

      if (!embeddingCache[cacheKey] || !embeddingCache[taskKey]) {
        const embedding = await generateEmbedding(variant, 'RETRIEVAL_QUERY');
        embeddingCache[cacheKey] = embedding;
        embeddingCache[taskKey] = embedding;
        newEmbeddings++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Embed searchText and title with RETRIEVAL_DOCUMENT taskType (they are document content)
    const documentTexts = [entry.searchText, entry.title];
    for (const text of documentTexts) {
      const cacheKey = buildCacheKey(entry.id, text);
      const taskKey = `RETRIEVAL_DOCUMENT::${text}`;

      if (!embeddingCache[cacheKey] || !embeddingCache[taskKey]) {
        const embedding = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
        embeddingCache[cacheKey] = embedding;
        embeddingCache[taskKey] = embedding;
        newEmbeddings++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // Pre-cache embeddings for all test suite queries
  for (const testCase of retrievalTests) {
    const taskKey = `RETRIEVAL_QUERY::${testCase.query}`;

    if (!embeddingCache[taskKey]) {
      const embedding = await generateEmbedding(testCase.query, 'RETRIEVAL_QUERY');
      embeddingCache[taskKey] = embedding;
      newEmbeddings++;

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Save cache to file
  writeFileSync(CACHE_FILE, JSON.stringify(embeddingCache, null, 2), 'utf-8');
  console.log(`✓ Cache updated: ${newEmbeddings} new embeddings generated`);
  console.log(`✓ Total cached embeddings: ${Object.keys(embeddingCache).length}\n`);
  return true;
}

// ========================================
// Retrieval Logic
// ========================================
async function retrieveAnswer(query: string): Promise<RetrievalResult & { isMiss?: boolean }> {
  try {
    const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
    return retrieveAnswerCore(queryEmbedding, kb.entries, embeddingCache, {
      globalMinSimilarity: MINIMUM_SIMILARITY,
      throwOnMissing: isOfflineMode ? false : true,
    });
  } catch (err) {
    if (err instanceof CacheMissError) {
      return {
        matched: false,
        isMiss: true,
        refusalReason: 'no vector — skipped (offline mode)',
      };
    }
    throw err;
  }
}

// ========================================
// Test Execution
// ========================================
interface TestExecutionResult {
  testCase: TestCase;
  actualResult: TestResult | 'MISS';
  actualFaqId?: string;
  confidence?: number;
  passed: boolean;
  isMiss?: boolean;
  failureReason?: string;
}

async function executeTest(testCase: TestCase): Promise<TestExecutionResult> {
  const retrieval = await retrieveAnswer(testCase.query);

  if (retrieval.isMiss) {
    return {
      testCase,
      actualResult: 'MISS',
      passed: false,
      isMiss: true,
      failureReason: 'no vector — skipped (offline mode)',
    };
  }

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
function generateMarkdownReport(
  results: TestExecutionResult[],
  misses: number,
  missRate: number,
  missThreshold: number
): string {
  const stats = getTestStats();
  const nonMissResults = results.filter((r) => !r.isMiss);
  const passed = nonMissResults.filter((r) => r.passed).length;
  const failed = nonMissResults.filter((r) => !r.passed).length;
  const total = results.length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  let report = `# Retrieval Test Report (Gemini Embeddings)\n\n`;
  if (isOfflineMode) {
    report += `**Mode:** OFFLINE (cached vectors)\n\n`;
    report += `> ⚠️ **OFFLINE MODE — retrieval results are against CACHED embeddings, not live API vectors. Results are not comparable to live runs.**\n\n`;
  } else {
    report += `**Mode:** LIVE (Gemini text-embedding-004 API)\n\n`;
  }

  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Embedding Model:** text-embedding-004\n`;
  report += `**Minimum Similarity Threshold:** ${MINIMUM_SIMILARITY}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Mode | ${isOfflineMode ? 'OFFLINE (cached vectors)' : 'LIVE (Gemini text-embedding-004 API)'} |\n`;
  report += `| Total Tests | ${total} |\n`;
  report += `| Passed | ${passed} |\n`;
  report += `| Skipped (MISS) | ${misses} |\n`;
  report += `| Failed | ${failed} |\n`;
  report += `| Miss Rate | ${(missRate * 100).toFixed(1)}% |\n`;
  report += `| Pass Rate | ${passRate}% |\n\n`;

  // Exit Criteria
  report += `## Exit Criteria\n\n`;
  if (missRate > missThreshold) {
    report += `❌ **RUN FAILED** - Cache miss rate is ${(missRate * 100).toFixed(1)}% (${misses}/${total}), exceeding threshold of ${(missThreshold * 100).toFixed(0)}%. Run with \`GEMINI_API_KEY\` set to regenerate vector cache.\n\n`;
  } else if (failed > 0) {
    report += `❌ **UI ROLLOUT BLOCKED** - ${failed} test(s) failed. Fix issues before proceeding.\n\n`;
  } else if (isOfflineMode) {
    report += `⚠️ **RETRIEVAL APPROVED (OFFLINE MODE)** - All evaluated tests passed against pre-cached vector embeddings. Note: validates cached vectors, not live model behavior.\n\n`;
  } else {
    report += `✅ **RETRIEVAL APPROVED** - All tests passed. UI rollout may proceed.\n\n`;
  }

  // Test Category Breakdown
  report += `## Test Category Breakdown\n\n`;
  report += `| Category | Count | Passed | Failed | Skipped (MISS) | Should Accept | Should Refuse |\n`;
  report += `|----------|-------|--------|--------|----------------|---------------|---------------|\n`;

  const categories = Object.keys(stats.byCategory);
  for (const category of categories) {
    const count = stats.byCategory[category];
    const categoryTests = results.filter((r) => r.testCase.category === category);
    const catPassed = categoryTests.filter((r) => r.passed && !r.isMiss).length;
    const catFailed = categoryTests.filter((r) => !r.passed && !r.isMiss).length;
    const catMisses = categoryTests.filter((r) => r.isMiss).length;
    const accept = categoryTests.filter((r) => r.testCase.expectedResult === 'ACCEPT').length;
    const refuse = categoryTests.filter((r) => r.testCase.expectedResult === 'REFUSE').length;
    report += `| ${category} | ${count} | ${catPassed} | ${catFailed} | ${catMisses} | ${accept} | ${refuse} |\n`;
  }
  report += `\n`;

  // Detailed Test Results Table
  report += `## Detailed Test Results\n\n`;
  report += `| ID | Query | Expected | Actual | Pass/Fail | Confidence | Notes |\n`;
  report += `|----|-------|----------|--------|-----------|------------|-------|\n`;

  for (const result of results) {
    const { testCase, actualResult, passed, failureReason, confidence, isMiss } = result;
    const passIcon = isMiss ? '⚠️ MISS' : passed ? '✅' : '❌';
    const notes = failureReason || testCase.notes || '';
    const queryTrunc =
      testCase.query.length > 50 ? testCase.query.substring(0, 47) + '...' : testCase.query;
    const confStr = confidence ? `${(confidence * 100).toFixed(1)}%` : 'N/A';

    report += `| ${testCase.id} | ${queryTrunc} | ${testCase.expectedResult} | ${actualResult} | ${passIcon} | ${confStr} | ${notes} |\n`;
  }
  report += `\n`;

  // Failures & Misses Section (if any)
  const failures = results.filter((r) => !r.passed);
  if (failures.length > 0) {
    report += `## ⚠️ Failed Tests & Cache Misses\n\n`;
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
  const uiApproved = failed === 0 && misses === 0;
  if (uiApproved) {
    report += `All tests passed! You may proceed to UI development.\n\n`;
  } else {
    report += `**Action Required:** Fix the failed tests or missing vector embeddings before UI rollout.\n\n`;
    report += `**Allowed Fixes:**\n`;
    report += `1. Adjust \`minimumSimilarity\` threshold (currently ${MINIMUM_SIMILARITY})\n`;
    report += `2. Improve \`searchText\` in FAQ entries without changing answers\n`;
    report += `3. Supply \`GEMINI_API_KEY\` to generate missing vector embeddings\n\n`;
    report += `**Do NOT:**\n`;
    report += `- Rewrite answers to fit failing tests\n`;
    report += `- Remove tests to improve pass rate\n`;
    report += `- Proceed to UI with failing tests or un-embedded vectors\n\n`;
  }

  return report;
}

// ========================================
// Main Execution
// ========================================
async function main() {
  if (isOfflineMode) {
    console.log('================================================================');
    console.log(
      '⚠️  OFFLINE MODE — retrieval results are against CACHED embeddings, not live API vectors. Results are not comparable to live runs.'
    );
    console.log('================================================================\n');
  }

  console.log('🧪 Running Retrieval Test Suite with Gemini Embeddings...\n');

  const cacheBuilt = await buildEmbeddingCache();
  if (!cacheBuilt) {
    const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
    const skippedReport = `# Retrieval Test Report (Skipped Execution)

**Generated:** ${new Date().toISOString()}

> ⚠️ **SKIPPED — GEMINI_API_KEY is not set in the environment and no pre-cached vector embeddings (.embedding-cache.json) exist.**
> To run retrieval evaluation, set \`GEMINI_API_KEY\` or populate the vector cache via GitHub Actions cache / local run.
`;
    writeFileSync(reportPath, skippedReport, 'utf-8');
    if (process.env.GITHUB_STEP_SUMMARY) {
      try {
        appendFileSync(
          process.env.GITHUB_STEP_SUMMARY,
          `## AI Knowledge Base Retrieval Evaluation\n\n> ⚠️ **SKIPPED**: \`GEMINI_API_KEY\` is not set and vector cache is missing.\n`,
          'utf-8'
        );
      } catch (err) {
        // ignore
      }
    }
    console.log(
      '⚠️  SKIPPED: GEMINI_API_KEY is not set and vector cache is missing. Exiting cleanly.\n'
    );
    process.exit(0);
  }

  const results: TestExecutionResult[] = [];

  // Execute all tests
  for (const testCase of retrievalTests) {
    const result = await executeTest(testCase);
    results.push(result);

    if (result.isMiss) {
      console.log(
        `⚠️ MISS ${testCase.id}: ${testCase.query.substring(0, 50)}... (no vector — skipped)`
      );
    } else {
      const icon = result.passed ? '✅' : '❌';
      const confStr = result.confidence ? ` (${(result.confidence * 100).toFixed(1)}%)` : '';
      console.log(
        `${icon} ${testCase.id}: ${testCase.query.substring(0, 50)}${testCase.query.length > 50 ? '...' : ''}${confStr}`
      );
    }
  }

  const total = results.length;
  const misses = results.filter((r) => r.isMiss).length;
  const missRate = misses / total;
  const missThreshold = 0.1; // 10% threshold

  const nonMissResults = results.filter((r) => !r.isMiss);
  const passed = nonMissResults.filter((r) => r.passed).length;
  const failed = nonMissResults.filter((r) => !r.passed).length;

  console.log('\n📊 Generating report...\n');

  // Generate report
  const report = generateMarkdownReport(results, misses, missRate, missThreshold);

  // Write to file
  const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log(`✓ Report saved to: ${reportPath}\n`);

  // Console summary
  if (isOfflineMode) {
    console.log('Mode: OFFLINE (cached vectors)');
  } else {
    console.log('Mode: LIVE (Gemini text-embedding-004 API)');
  }
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Skipped (MISS): ${misses}`);
  console.log(`Failed: ${failed}`);
  console.log(`Miss Rate: ${(missRate * 100).toFixed(1)}%\n`);

  // Category breakdown console output
  console.log('📈 Results by Category:');
  const categoryResults: Record<
    string,
    { total: number; passed: number; failed: number; misses: number }
  > = {
    direct_match: { total: 0, passed: 0, failed: 0, misses: 0 },
    paraphrase: { total: 0, passed: 0, failed: 0, misses: 0 },
    ambiguous: { total: 0, passed: 0, failed: 0, misses: 0 },
    operational: { total: 0, passed: 0, failed: 0, misses: 0 },
    out_of_scope: { total: 0, passed: 0, failed: 0, misses: 0 },
  };

  for (const result of results) {
    const cat = result.testCase.category;
    if (categoryResults[cat]) {
      categoryResults[cat].total++;
      if (result.isMiss) {
        categoryResults[cat].misses++;
      } else if (result.passed) {
        categoryResults[cat].passed++;
      } else {
        categoryResults[cat].failed++;
      }
    }
  }

  for (const [cat, res] of Object.entries(categoryResults)) {
    console.log(
      `   ${cat.padEnd(16)} ${res.passed}/${res.total} passed (${res.failed} failed, ${res.misses} misses)`
    );
  }
  console.log();

  if (misses > 0) {
    console.log('⚠️  Summary of Cache Misses (Offline Mode):');
    const missResults = results.filter((r) => r.isMiss);
    for (const m of missResults) {
      console.log(`  • [${m.testCase.id}] "${m.testCase.query}"`);
    }
    console.log();
  }

  // Write step summary to GITHUB_STEP_SUMMARY if running in GitHub Actions CI
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      let summaryContent = `## AI Knowledge Base Retrieval Evaluation\n\n`;
      if (isOfflineMode) {
        summaryContent += `Mode: OFFLINE (cached vectors)\n\n`;
        summaryContent += `> ⚠️ **OFFLINE MODE — retrieval results are against CACHED embeddings, not live API vectors. Results are not comparable to live runs.**\n\n`;
      } else {
        summaryContent += `Mode: LIVE (Gemini text-embedding-004 API)\n\n`;
      }
      summaryContent += `| Total Tests | Passed | Skipped (MISS) | Failed | Miss Rate |\n`;
      summaryContent += `|-------------|--------|----------------|--------|-----------|\n`;
      summaryContent += `| ${total} | ${passed} | ${misses} | ${failed} | ${(missRate * 100).toFixed(1)}% |\n\n`;

      if (missRate > missThreshold) {
        summaryContent += `❌ **RUN FAILED**: Cache miss rate is ${(missRate * 100).toFixed(1)}% (${misses}/${total}), exceeding threshold of ${(missThreshold * 100).toFixed(0)}%. Please run with \`GEMINI_API_KEY\` set to regenerate the vector cache.\n`;
      } else if (failed > 0) {
        summaryContent += `❌ **UI ROLLOUT BLOCKED** - ${failed} test(s) failed.\n`;
      } else if (isOfflineMode) {
        summaryContent += `⚠️ **RETRIEVAL APPROVED (OFFLINE MODE)** - All evaluated tests passed against pre-cached vector embeddings. Note: validates cached vectors, not live model behavior.\n`;
      } else {
        summaryContent += `✅ **RETRIEVAL APPROVED** - All tests passed. UI rollout may proceed.\n`;
      }
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryContent, 'utf-8');
      console.log('✓ Written summary to GITHUB_STEP_SUMMARY\n');
    } catch (err) {
      console.warn('⚠ Could not write to GITHUB_STEP_SUMMARY:', err);
    }
  }

  // Check miss rate threshold exceedance
  if (missRate > missThreshold) {
    console.error(
      `❌ RUN FAILED: Cache miss rate is ${(missRate * 100).toFixed(1)}% (${misses}/${total}), exceeding threshold.`
    );
    console.error(
      `❌ Please run with GEMINI_API_KEY set to regenerate the vector cache (locally or via CI cache flow).\n`
    );
    process.exit(1);
  }

  if (failed > 0) {
    console.log(`❌ ${failed} TEST(S) FAILED - UI rollout blocked!\n`);
    console.log(`See ${reportPath} for details.\n`);
    process.exit(1);
  }

  if (!isOfflineMode && Object.keys(embeddingCache).length > 0) {
    try {
      writeFileSync(CACHE_FILE, JSON.stringify(embeddingCache, null, 2), 'utf-8');
      console.log(
        `✓ Updated ${CACHE_FILE} with ${Object.keys(embeddingCache).length} cached vectors`
      );
    } catch (err) {
      console.warn('⚠ Could not write updated embedding cache:', err);
    }
  }

  if (isOfflineMode) {
    console.log(
      '⚠️  ALL EVALUATED TESTS PASSED (OFFLINE MODE - validating cached vectors, not live model behavior)\n'
    );
  } else {
    console.log('✅ ALL TESTS PASSED - UI rollout approved!\n');
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running tests:', err);
  try {
    const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
    const errReport = `# Retrieval Test Report (Failed Execution)\n\n**Generated:** ${new Date().toISOString()}\n\n❌ **RUN FAILED**: ${err instanceof Error ? err.message : String(err)}\n`;
    writeFileSync(reportPath, errReport, 'utf-8');
  } catch (e) {
    // Ignore report write error in fatal handler
  }
  process.exit(1);
});
