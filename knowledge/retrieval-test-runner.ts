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

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  retrievalTests,
  FALLBACK_RESPONSE,
  MINIMUM_SIMILARITY,
  getTestStats,
  type TestCase,
  type TestResult,
} from './retrieval-test-suite.js';

// ========================================
// Gemini API Setup (with Offline Fallback)
// ========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let embeddingModel: any = null;
const isOfflineMode = !GEMINI_API_KEY;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  console.log('✓ Gemini API initialized with text-embedding-004 model');
} else {
  console.log('\n================================================================');
  console.log('⚠️  NOTICE: GEMINI_API_KEY is not set.');
  console.log('⚠️  Running in OFFLINE MODE using pre-cached vector embeddings.');
  console.log('⚠️  Results do NOT test live model embeddings.');
  console.log('================================================================\n');
}

// ========================================
// Load Knowledge Base
// ========================================
interface KBEntry {
  id: string;
  intent: string;
  title: string;
  questionVariants: string[];
  answer: string;
  searchText: string;
  confidence: {
    minimumSimilarity: number;
    requiresExactMatch: boolean;
  };
}

interface KnowledgeBase {
  entries: KBEntry[];
}

const kbPath = join(__dirname, 'kb.entries.json');
const kb: KnowledgeBase = JSON.parse(readFileSync(kbPath, 'utf-8'));

console.log(`✓ Loaded ${kb.entries.length} FAQ entries from knowledge base`);

// ========================================
// Embedding Cache
// ========================================
interface EmbeddingCache {
  [key: string]: number[];
}

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
 * Generate embedding for a single text using Gemini API or offline cache
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

    return result.embedding.values;
  }

  // Offline lookup in embeddingCache
  const cachedKeys = [
    `query::${text}`,
    `RETRIEVAL_QUERY::${text}`,
    `RETRIEVAL_DOCUMENT::${text}`,
    text,
  ];

  for (const key of cachedKeys) {
    if (embeddingCache[key]) {
      return embeddingCache[key];
    }
  }

  // Broad scan fallback matches keys ending in "::<text>" regardless of taskType prefix
  // (e.g. entryId::text vs taskType::text). While harmless for offline test verification,
  // exact key match is preferred when available.
  for (const [key, vec] of Object.entries(embeddingCache)) {
    if (key.endsWith(`::${text}`) || key === text) {
      return vec;
    }
  }

  throw new Error(
    `GEMINI_API_KEY is not set and no cached vector embedding exists for: "${text}". ` +
      `Please run "GEMINI_API_KEY=<key> npm run test:retrieval" to generate live embeddings and update the cache.`
  );
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Pre-compute and cache embeddings for all KB entries
 */
async function buildEmbeddingCache(): Promise<boolean> {
  if (!GEMINI_API_KEY) {
    const cachedCount = Object.keys(embeddingCache).length;
    if (cachedCount === 0) {
      console.log('\n================================================================');
      console.log('⚠️  NOTICE: GEMINI_API_KEY is not set and no vector cache was found.');
      console.log('⚠️  Skipping AI retrieval evaluation suite.');
      console.log('⚠️  Provide GEMINI_API_KEY or restore knowledge/.embedding-cache.json to run tests.');
      console.log('================================================================\n');

      const skippedReport = `# Retrieval Test Report (Skipped)\n\n` +
        `> ⚠️ **EVALUATION SKIPPED**: \`GEMINI_API_KEY\` environment variable is not set and no pre-cached vector embeddings file (\`knowledge/.embedding-cache.json\`) was found.\n\n` +
        `**Generated:** ${new Date().toISOString()}\n\n` +
        `To run retrieval evaluation, provide \`GEMINI_API_KEY\` or generate/restore \`knowledge/.embedding-cache.json\`.\n`;
      const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
      writeFileSync(reportPath, skippedReport, 'utf-8');
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
      const cacheKey = `${entry.id}::${variant}`;

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
      const cacheKey = `${entry.id}::${text}`;

      if (!embeddingCache[cacheKey]) {
        const embedding = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
        embeddingCache[cacheKey] = embedding;
        newEmbeddings++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // Save cache to file
  writeFileSync(CACHE_FILE, JSON.stringify(embeddingCache, null, 2), 'utf-8');
  console.log(`✓ Cache updated: ${newEmbeddings} new embeddings generated`);
  console.log(`✓ Total cached embeddings: ${Object.keys(embeddingCache).length}\n`);
  return true;
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
  // Generate embedding for query (using RETRIEVAL_QUERY task type)
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');

  // Find best match among all entry texts
  let maxSimilarity = 0;

  for (const text of entryTexts) {
    const cacheKey = `${entryId}::${text}`;
    let entryEmbedding = embeddingCache[cacheKey];

    if (!entryEmbedding) {
      entryEmbedding = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
    }

    if (!entryEmbedding) {
      throw new Error(`Missing cached embedding for: ${cacheKey}`);
    }

    const similarity = cosineSimilarity(queryEmbedding, entryEmbedding);
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }

  return maxSimilarity;
}

// ========================================
// Retrieval Logic
// ========================================
interface RetrievalResult {
  matched: boolean;
  faqId?: string;
  answer?: string;
  confidence?: number;
  refusalReason?: string;
}

async function retrieveAnswer(query: string): Promise<RetrievalResult> {
  let bestMatch: { entry: KBEntry; score: number } | null = null;
  let secondBestScore = 0;

  // Find best matching FAQ using semantic similarity
  for (const entry of kb.entries) {
    // Texts to check against
    const textsToCheck = [...entry.questionVariants, entry.searchText, entry.title];

    const score = await calculateSimilarity(query, entry.id, textsToCheck);

    if (score > (bestMatch?.score || 0)) {
      secondBestScore = bestMatch?.score || 0;
      bestMatch = { entry, score };
    } else if (score > secondBestScore) {
      secondBestScore = score;
    }
  }

  // Apply retrieval contract
  if (!bestMatch || bestMatch.score < MINIMUM_SIMILARITY) {
    return {
      matched: false,
      refusalReason: 'No entry meets similarity threshold',
    };
  }

  // Check for competing entries
  const scoreGap = bestMatch.score - secondBestScore;
  if (scoreGap < 0.1 && secondBestScore >= MINIMUM_SIMILARITY) {
    return {
      matched: false,
      refusalReason: 'Two or more entries compete',
    };
  }

  return {
    matched: true,
    faqId: bestMatch.entry.id,
    answer: bestMatch.entry.answer,
    confidence: bestMatch.score,
  };
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
  if (isOfflineMode) {
    report += `> ⚠️ **OFFLINE EVALUATION MODE**: Running against pre-cached vector embeddings because \`GEMINI_API_KEY\` was not set in the environment.\n\n`;
  }
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Embedding Model:** text-embedding-004\n`;
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
  const cacheReady = await buildEmbeddingCache();
  if (!cacheReady) {
    console.log('⚠️ Retrieval test suite skipped cleanly (no API key / cache).\n');
    process.exit(0);
  }

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
