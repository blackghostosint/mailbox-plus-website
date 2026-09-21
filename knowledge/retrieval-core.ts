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
export const EMBEDDING_DIMENSION = 768;
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

export interface SnapshotValidationResult {
  valid: boolean;
  errors: string[];
  vectors: Record<string, number[]>;
}

/**
 * Validates a single vector embedding: must be an array of exactly EMBEDDING_DIMENSION (768) finite numbers.
 */
export function validateVector(
  vector: unknown,
  key: string,
  fileContext?: string
): { valid: boolean; error?: string } {
  const ctx = fileContext ? ` in ${fileContext}` : '';
  if (!Array.isArray(vector)) {
    return {
      valid: false,
      error: `Invalid vector for key "${key}"${ctx}: expected Array, got ${typeof vector}`,
    };
  }
  if (vector.length !== EMBEDDING_DIMENSION) {
    return {
      valid: false,
      error: `Invalid vector dimension for key "${key}"${ctx}: expected ${EMBEDDING_DIMENSION}, got ${vector.length}`,
    };
  }
  for (let i = 0; i < vector.length; i++) {
    const val = vector[i];
    if (typeof val !== 'number' || !Number.isFinite(val)) {
      const displayVal = typeof val === 'string' ? `"${val}"` : String(val);
      return {
        valid: false,
        error: `Invalid vector element for key "${key}" at index ${i}${ctx}: expected finite number, got ${displayVal}`,
      };
    }
  }
  return { valid: true };
}

/**
 * Validates snapshot JSON structure, metadata model, and every vector embedding.
 */
export function validateEmbeddingSnapshot(
  parsed: unknown,
  fileContext?: string
): SnapshotValidationResult {
  const errors: string[] = [];
  const ctx = fileContext || 'embedding snapshot';

  if (!parsed || typeof parsed !== 'object') {
    return {
      valid: false,
      errors: [`Invalid snapshot JSON structure in ${ctx}: expected object`],
      vectors: {},
    };
  }

  const obj = parsed as Record<string, any>;

  if (obj.metadata !== undefined) {
    if (!obj.metadata || typeof obj.metadata !== 'object') {
      errors.push(`Invalid metadata in ${ctx}: expected object`);
    } else if (obj.metadata.model !== EMBEDDING_MODEL) {
      errors.push(
        `Invalid embedding model in ${ctx}: expected "${EMBEDDING_MODEL}", got "${obj.metadata.model}"`
      );
    }
  } else if ('embeddings' in obj) {
    errors.push(`Missing metadata in ${ctx}: expected metadata.model === "${EMBEDDING_MODEL}"`);
  }

  const rawVectors = obj.embeddings || ('metadata' in obj ? {} : obj);
  if (!rawVectors || typeof rawVectors !== 'object') {
    errors.push(`Invalid embeddings container in ${ctx}: expected object`);
    return { valid: false, errors, vectors: {} };
  }

  const validatedVectors: Record<string, number[]> = {};

  for (const [key, val] of Object.entries(rawVectors)) {
    if (key === 'metadata') continue;
    const check = validateVector(val, key, ctx);
    if (!check.valid && check.error) {
      errors.push(check.error);
    } else if (check.valid) {
      validatedVectors[key] = val as number[];
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    vectors: validatedVectors,
  };
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

export interface RetrievalOptions {
  globalMinSimilarity?: number;
  ambiguityGapThreshold?: number;
  honorEntryThreshold?: boolean;
  throwOnMissing?: boolean;
}

/**
 * Calculates max similarity between a query vector and candidate embeddings in cache
 */
export function calculateCandidateSimilarity(
  queryEmbedding: number[],
  cacheKeys: string[],
  embeddingCache: EmbeddingCache,
  throwOnMissing: boolean = false
): number {
  let maxSimilarity = 0;
  let foundKey = false;

  for (const cacheKey of cacheKeys) {
    const entryEmbedding = embeddingCache[cacheKey];
    if (!entryEmbedding) continue;

    foundKey = true;
    const similarity = cosineSimilarity(queryEmbedding, entryEmbedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  if (throwOnMissing && !foundKey && cacheKeys.length > 0) {
    throw new Error(`Missing cached embedding for: ${cacheKeys[0]}`);
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
  ambiguityGapThreshold: number = AMBIGUITY_GAP_THRESHOLD,
  honorEntryThreshold: boolean = false
): RetrievalResult {
  if (candidates.length === 0) {
    return {
      matched: false,
      refusalReason: 'No entry meets similarity threshold',
    };
  }

  // Sort candidates by similarity score descending.
  // Note: Array.prototype.sort is stable in V8/Node.js, preserving original iteration order for candidates with tied scores.
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const bestMatch = sorted[0];
  const secondBestScore = sorted[1]?.score ?? 0;

  const effectiveMin = honorEntryThreshold
    ? (bestMatch.entry.confidence?.minimumSimilarity ?? globalMinSimilarity)
    : globalMinSimilarity;

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
  optionsOrMinSimilarity: number | RetrievalOptions = MINIMUM_SIMILARITY
): RetrievalResult {
  const options: RetrievalOptions =
    typeof optionsOrMinSimilarity === 'number'
      ? { globalMinSimilarity: optionsOrMinSimilarity }
      : optionsOrMinSimilarity;

  const globalMinSimilarity = options.globalMinSimilarity ?? MINIMUM_SIMILARITY;
  const ambiguityGapThreshold = options.ambiguityGapThreshold ?? AMBIGUITY_GAP_THRESHOLD;
  const honorEntryThreshold = options.honorEntryThreshold ?? false;
  const throwOnMissing = options.throwOnMissing ?? false;

  const candidates: Array<{ entry: KBEntry; score: number }> = [];

  for (const entry of kbEntries) {
    const entryTexts = [...entry.questionVariants, entry.searchText, entry.title].filter(Boolean);

    let maxEntrySimilarity = 0;

    for (const text of entryTexts) {
      // Primary runner cache key `${entry.id}::${text}` followed by taskType cache key fallback
      const primaryKey = buildCacheKey(entry.id, text);
      const isQueryText = entry.questionVariants.includes(text);
      const fallbackTaskTypeKey = isQueryText
        ? buildCacheKey('RETRIEVAL_QUERY', text)
        : buildCacheKey('RETRIEVAL_DOCUMENT', text);

      const candidateKeys = [primaryKey, fallbackTaskTypeKey];
      const similarity = calculateCandidateSimilarity(
        queryEmbedding,
        candidateKeys,
        embeddingCache,
        throwOnMissing
      );

      if (similarity > maxEntrySimilarity) {
        maxEntrySimilarity = similarity;
      }
    }

    candidates.push({ entry, score: maxEntrySimilarity });
  }

  return evaluateRetrievalCandidates(
    candidates,
    globalMinSimilarity,
    ambiguityGapThreshold,
    honorEntryThreshold
  );
}
