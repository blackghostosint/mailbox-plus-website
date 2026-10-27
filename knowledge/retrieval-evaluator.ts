/**
 * Knowledge Base Retrieval Evaluator Core Module
 *
 * Provides core embedding loading, vector coverage verification,
 * answer retrieval, test execution, and markdown report generation.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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
  EMBEDDING_DIMENSION,
  MINIMUM_SIMILARITY,
  buildCacheKey,
  cosineSimilarity,
  calculateCandidateSimilarity,
  retrieveAnswerCore,
  validateVector,
  validateEmbeddingSnapshot,
  type KBEntry,
  type KnowledgeBase,
  type EmbeddingCache,
  type RetrievalResult,
} from './retrieval-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local first (highest priority), then .env
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const isOfflineMode = !GEMINI_API_KEY;
export const allowSkip =
  process.argv.includes('--allow-skip') ||
  process.env.ALLOW_SKIP_RETRIEVAL_TESTS === 'true' ||
  process.env.ALLOW_SKIP === '1';

let genAI: GoogleGenerativeAI | null = null;
let embeddingModel: any = null;

if (!isOfflineMode) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
  embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
}

export const kbPath = join(__dirname, 'kb.entries.json');
export function loadKB(): KnowledgeBase {
  if (existsSync(kbPath)) {
    return JSON.parse(readFileSync(kbPath, 'utf-8'));
  }
  return { entries: [] };
}

export const kb: KnowledgeBase = loadKB();

export const CACHE_FILE = join(__dirname, '.embedding-cache.json');
export const SNAPSHOT_FILE = join(__dirname, 'embeddings.json');
export const embeddingCache: EmbeddingCache = {};

export function loadEmbeddingsFile(filePath: string): number {
  if (existsSync(filePath)) {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(fileContent);
      const validation = validateEmbeddingSnapshot(parsed, filePath);
      if (!validation.valid) {
        console.error(`❌ Embedding snapshot validation failed for ${filePath}:`);
        validation.errors.forEach((err) => console.error(`   - ${err}`));
        throw new Error(
          `Embedding snapshot validation failed for ${filePath}:\n` +
            validation.errors.map((err) => `  - ${err}`).join('\n')
        );
      }
      let count = 0;
      for (const [key, val] of Object.entries(validation.vectors)) {
        embeddingCache[key] = val;
        count++;
      }
      return count;
    } catch (err: any) {
      console.error(`❌ Failed to load or validate embedding file ${filePath}: ${err.message}`);
      throw err;
    }
  }
  return 0;
}

export function loadAllEmbeddings(): number {
  const c1 = loadEmbeddingsFile(CACHE_FILE);
  const c2 = loadEmbeddingsFile(SNAPSHOT_FILE);
  return Object.keys(embeddingCache).length;
}

export async function generateEmbedding(
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
    const check = validateVector(values, buildCacheKey(taskType, text), 'Gemini API Response');
    if (!check.valid) {
      throw new Error(`Invalid embedding vector returned from Gemini API: ${check.error}`);
    }

    embeddingCache[buildCacheKey(taskType, text)] = values;
    return values;
  } catch (error) {
    console.error(`Failed to generate embedding for text: "${text.substring(0, 50)}..."`);
    throw error;
  }
}

export function verifyVectorCoverage(
  kbData: KnowledgeBase = kb,
  tests: TestCase[] = retrievalTests,
  cache: EmbeddingCache = embeddingCache
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  const checkKeys = (cacheKeys: string[], label: string) => {
    const foundKey = cacheKeys.find((k) => cache[k] !== undefined);
    if (!foundKey) {
      missing.push(label);
      return;
    }
    const vec = cache[foundKey];
    const check = validateVector(vec, foundKey);
    if (!check.valid) {
      missing.push(`${label} (invalid vector: ${check.error})`);
    }
  };

  for (const entry of kbData.entries) {
    for (const variant of entry.questionVariants) {
      const cacheKey1 = buildCacheKey(entry.id, variant);
      const cacheKey2 = buildCacheKey('RETRIEVAL_QUERY', variant);
      checkKeys(
        [cacheKey1, cacheKey2, variant],
        `Entry [${entry.id}] missing questionVariant embedding: "${variant}"`
      );
    }

    const documentTexts = [entry.searchText, entry.title].filter(Boolean);
    for (const text of documentTexts) {
      const cacheKey1 = buildCacheKey(entry.id, text);
      const cacheKey2 = buildCacheKey('RETRIEVAL_DOCUMENT', text);
      checkKeys(
        [cacheKey1, cacheKey2, text],
        `Entry [${entry.id}] missing document embedding for: "${text.substring(0, 40)}..."`
      );
    }
  }

  for (const testCase of tests) {
    const cacheKey1 = buildCacheKey('RETRIEVAL_QUERY', testCase.query);
    checkKeys(
      [cacheKey1, testCase.query],
      `Benchmark test query missing embedding: "${testCase.query}"`
    );
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export async function buildEmbeddingCache(): Promise<void> {
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
        return;
      } else {
        throw new Error(
          'Skipping retrieval tests is NOT allowed without --allow-skip or ALLOW_SKIP_RETRIEVAL_TESTS=true.'
        );
      }
    }

    const coverage = verifyVectorCoverage();
    if (!coverage.valid) {
      if (allowSkip) {
        console.warn(
          '⚠ --allow-skip flag detected. Skipping retrieval evaluation tests due to incomplete vector coverage.\n'
        );
        return;
      } else {
        throw new Error(
          `Vector coverage check failed in offline mode (${coverage.missing.length} missing embeddings):\n` +
            coverage.missing.map((m) => `  - ${m}`).join('\n')
        );
      }
    }
    return;
  }

  let newEmbeddings = 0;
  for (const entry of kb.entries) {
    for (const variant of entry.questionVariants) {
      const cacheKey = buildCacheKey(entry.id, variant);
      if (!embeddingCache[cacheKey]) {
        const embedding = await generateEmbedding(variant, 'RETRIEVAL_QUERY');
        embeddingCache[cacheKey] = embedding;
        newEmbeddings++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const documentTexts = [entry.searchText, entry.title].filter(Boolean);
    for (const text of documentTexts) {
      const cacheKey = buildCacheKey(entry.id, text);
      if (!embeddingCache[cacheKey]) {
        const embedding = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
        embeddingCache[cacheKey] = embedding;
        newEmbeddings++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  for (const testCase of retrievalTests) {
    const cacheKey = buildCacheKey('RETRIEVAL_QUERY', testCase.query);
    if (!embeddingCache[cacheKey] && !embeddingCache[testCase.query]) {
      const embedding = await generateEmbedding(testCase.query, 'RETRIEVAL_QUERY');
      embeddingCache[cacheKey] = embedding;
      newEmbeddings++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  const cacheData = {
    metadata: {
      model: EMBEDDING_MODEL,
      generatedAt: new Date().toISOString(),
    },
    embeddings: embeddingCache,
  };

  writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
}

export async function calculateSimilarity(
  query: string,
  entryId: string,
  entryTexts: string[]
): Promise<number> {
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
  const cacheKeys = entryTexts.map((text) => buildCacheKey(entryId, text));
  return calculateCandidateSimilarity(queryEmbedding, cacheKeys, embeddingCache, true);
}

export async function retrieveAnswer(query: string): Promise<RetrievalResult> {
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
  return retrieveAnswerCore(queryEmbedding, kb.entries, embeddingCache, {
    globalMinSimilarity: MINIMUM_SIMILARITY,
    throwOnMissing: true,
  });
}

export interface TestExecutionResult {
  testCase: TestCase;
  actualResult: TestResult;
  actualFaqId?: string;
  confidence?: number;
  passed: boolean;
  failureReason?: string;
}

export async function executeTest(
  testCase: TestCase,
  retrieveFn: (query: string) => Promise<RetrievalResult> = retrieveAnswer
): Promise<TestExecutionResult> {
  const retrieval = await retrieveFn(testCase.query);
  const actualResult: TestResult = retrieval.matched ? 'ACCEPT' : 'REFUSE';

  let passed = actualResult === testCase.expectedResult;
  let failureReason: string | undefined;

  if (!passed) {
    failureReason = `Expected ${testCase.expectedResult}, got ${actualResult}`;
  } else if (testCase.expectedResult === 'ACCEPT' && testCase.expectedFaqId) {
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

export function generateMarkdownReport(results: TestExecutionResult[]): string {
  const stats = getTestStats(results.map((r) => r.testCase));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const passRate = results.length > 0 ? ((passed / results.length) * 100).toFixed(1) : '0.0';

  let report = `# Retrieval Test Report (Gemini Embeddings)\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Embedding Model:** ${EMBEDDING_MODEL}\n`;
  report += `**Minimum Similarity Threshold:** ${MINIMUM_SIMILARITY}\n\n`;

  report += `## Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Tests | ${results.length} |\n`;
  report += `| Passed | ${passed} |\n`;
  report += `| Failed | ${failed} |\n`;
  report += `| Pass Rate | ${passRate}% |\n\n`;

  const uiApproved = failed === 0;
  report += `## Exit Criteria\n\n`;
  if (uiApproved) {
    report += `✅ **RETRIEVAL APPROVED** - All tests passed. UI rollout may proceed.\n\n`;
  } else {
    report += `❌ **UI ROLLOUT BLOCKED** - ${failed} test(s) failed. Fix issues before proceeding.\n\n`;
  }

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

  report += `## Recommendations\n\n`;
  if (uiApproved) {
    report += `All tests passed! You may proceed to UI development.\n\n`;
  } else {
    report += `**Action Required:** Fix the failed tests before UI rollout.\n\n`;
  }

  return report;
}

export async function evaluateAllTests(): Promise<{
  results: TestExecutionResult[];
  report: string;
  passed: number;
  failed: number;
}> {
  loadAllEmbeddings();
  await buildEmbeddingCache();

  const results: TestExecutionResult[] = [];
  for (const testCase of retrievalTests) {
    const result = await executeTest(testCase);
    results.push(result);
  }

  const report = generateMarkdownReport(results);
  const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
  writeFileSync(reportPath, report, 'utf-8');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return { results, report, passed, failed };
}
