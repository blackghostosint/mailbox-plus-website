/**
 * Shared Core Retrieval Module
 *
 * Centralized model configurations, cache key builders, cosine similarity,
 * and candidate threshold evaluation logic shared across test runner,
 * build scripts, and serverless handlers.
 */

// ========================================
// Model Constants & Configurations
// ========================================

export const EMBEDDING_MODEL = 'text-embedding-004';
export const MODEL_NAME = EMBEDDING_MODEL;
export const MINIMUM_SIMILARITY = 0.78;
export const MAX_QUESTION_LENGTH = 500;
export const AMBIGUITY_GAP_THRESHOLD = 0.1;

export const FALLBACK_RESPONSE =
  "I don't have that information. Please contact the store directly or visit us in person.";

// ========================================
// Interfaces
// ========================================

export interface KBEntry {
  id: string;
  intent?: string;
  title: string;
  questionVariants: string[];
  answer: string;
  searchText: string;
  confidence?: {
    minimumSimilarity?: number;
    requiresExactMatch?: boolean;
  };
  sources?: Array<{
    type: string;
    url: string;
    lastVerified: string;
  }>;
}

export interface KnowledgeBase {
  entries: KBEntry[];
}

export interface EmbeddingCache {
  [key: string]: number[];
}

export interface RetrievalResult {
  matched: boolean;
  faqId?: string;
  answer?: string;
  sourceUrl?: string;
  confidence?: number;
  effectiveMin?: number;
  gap?: number;
  refusalReason?: string;
}

// ========================================
// Cache Key Builder
// ========================================

/**
 * Builds a deterministic cache key for an embedding text entry
 */
export function buildCacheKey(prefixOrTaskType: string, text: string): string {
  return `${prefixOrTaskType}::${text}`;
}

// ========================================
// Vector Similarity Math
// ========================================

/**
 * Calculate cosine similarity between two embedding vectors
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
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
 * Calculates max similarity between a query vector and candidate embeddings in cache
 */
export function calculateCandidateSimilarity(
  queryEmbedding: number[],
  cacheKeys: string[],
  embeddingCache: EmbeddingCache
): number {
  let maxSimilarity = 0;

  for (const cacheKey of cacheKeys) {
    const entryEmbedding = embeddingCache[cacheKey];
    if (!entryEmbedding) continue;

    const similarity = cosineSimilarity(queryEmbedding, entryEmbedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  return maxSimilarity;
}

// ========================================
// Candidate Thresholding & Retrieval Logic
// ========================================

/**
 * Evaluates candidate entries against confidence thresholds and ambiguity gap rules.
 */
export function evaluateRetrievalCandidates(
  candidates: Array<{ entry: KBEntry; score: number }>,
  globalMinSimilarity: number = MINIMUM_SIMILARITY,
  ambiguityGapThreshold: number = AMBIGUITY_GAP_THRESHOLD
): RetrievalResult {
  if (candidates.length === 0) {
    return {
      matched: false,
      refusalReason: 'No entry meets similarity threshold',
    };
  }

  // Sort candidates by similarity score descending
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const bestMatch = sorted[0];
  const secondBestScore = sorted[1]?.score ?? 0;

  const effectiveMin = bestMatch.entry.confidence?.minimumSimilarity ?? globalMinSimilarity;

  // Threshold check
  if (bestMatch.score < effectiveMin) {
    return {
      matched: false,
      faqId: bestMatch.entry.id,
      confidence: bestMatch.score,
      effectiveMin,
      refusalReason: 'No entry meets similarity threshold',
    };
  }

  // Ambiguity check
  const scoreGap = bestMatch.score - secondBestScore;
  if (scoreGap < ambiguityGapThreshold && secondBestScore >= effectiveMin) {
    return {
      matched: false,
      faqId: bestMatch.entry.id,
      confidence: bestMatch.score,
      effectiveMin,
      gap: scoreGap,
      refusalReason: 'Two or more entries compete',
    };
  }

  return {
    matched: true,
    faqId: bestMatch.entry.id,
    answer: bestMatch.entry.answer,
    sourceUrl: bestMatch.entry.sources?.[0]?.url,
    confidence: bestMatch.score,
    effectiveMin,
  };
}

/**
 * Pure function to execute answer retrieval for a query vector against KB entries and cache.
 */
export function retrieveAnswerCore(
  queryEmbedding: number[],
  kbEntries: KBEntry[],
  embeddingCache: EmbeddingCache,
  globalMinSimilarity: number = MINIMUM_SIMILARITY
): RetrievalResult {
  const candidates: Array<{ entry: KBEntry; score: number }> = [];

  for (const entry of kbEntries) {
    const cacheKeys: string[] = [];

    // Check questionVariants under both RETRIEVAL_QUERY and entryId prefixes
    for (const variant of entry.questionVariants) {
      cacheKeys.push(buildCacheKey('RETRIEVAL_QUERY', variant));
      cacheKeys.push(buildCacheKey(entry.id, variant));
    }

    // Check searchText under RETRIEVAL_DOCUMENT and entryId prefixes
    if (entry.searchText) {
      cacheKeys.push(buildCacheKey('RETRIEVAL_DOCUMENT', entry.searchText));
      cacheKeys.push(buildCacheKey(entry.id, entry.searchText));
    }

    // Check title under RETRIEVAL_DOCUMENT and entryId prefixes
    if (entry.title) {
      cacheKeys.push(buildCacheKey('RETRIEVAL_DOCUMENT', entry.title));
      cacheKeys.push(buildCacheKey(entry.id, entry.title));
    }

    const score = calculateCandidateSimilarity(queryEmbedding, cacheKeys, embeddingCache);
    candidates.push({ entry, score });
  }

  return evaluateRetrievalCandidates(candidates, globalMinSimilarity);
}
