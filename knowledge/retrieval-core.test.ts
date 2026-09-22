import { describe, expect, it } from 'vitest';
import {
  AMBIGUITY_GAP_THRESHOLD,
  EMBEDDING_DIMENSION,
  EMBEDDING_MODEL,
  FALLBACK_RESPONSE,
  MAX_QUESTION_LENGTH,
  MINIMUM_SIMILARITY,
  MODEL_NAME,
  buildCacheKey,
  calculateCandidateSimilarity,
  cosineSimilarity,
  evaluateRetrievalCandidates,
  retrieveAnswerCore,
  validateEmbeddingSnapshot,
  validateVector,
  type KBEntry,
  type EmbeddingCache,
} from './retrieval-core';

describe('knowledge/retrieval-core', () => {
  describe('Constants Contracts', () => {
    it('exports expected retrieval constants and default configurations', () => {
      expect(EMBEDDING_MODEL).toBe('text-embedding-004');
      expect(EMBEDDING_DIMENSION).toBe(768);
      expect(MODEL_NAME).toBe('text-embedding-004');
      expect(MINIMUM_SIMILARITY).toBe(0.78);
      expect(MAX_QUESTION_LENGTH).toBe(500);
      expect(AMBIGUITY_GAP_THRESHOLD).toBe(0.1);
      expect(FALLBACK_RESPONSE).toBe(
        "I don't have that information. Please contact the store directly or visit us in person."
      );
    });
  });

  describe('validateVector', () => {
    it('validates correct 768-dimension vector of finite numbers', () => {
      const validVector = new Array(768).fill(0.123);
      const result = validateVector(validVector, 'key-1');
      expect(result).toEqual({ valid: true });
    });

    it('rejects non-array vector inputs with and without fileContext', () => {
      const resultWithoutCtx = validateVector('not-an-array', 'key-1');
      expect(resultWithoutCtx.valid).toBe(false);
      expect(resultWithoutCtx.error).toBe(
        'Invalid vector for key "key-1": expected Array, got string'
      );

      const resultWithCtx = validateVector(12345, 'key-2', 'test-snapshot.json');
      expect(resultWithCtx.valid).toBe(false);
      expect(resultWithCtx.error).toBe(
        'Invalid vector for key "key-2" in test-snapshot.json: expected Array, got number'
      );
    });

    it('rejects arrays with length not equal to EMBEDDING_DIMENSION (768)', () => {
      const shortVec = new Array(767).fill(0.1);
      const longVec = new Array(769).fill(0.1);

      const shortRes = validateVector(shortVec, 'short-key', 'ctx');
      expect(shortRes.valid).toBe(false);
      expect(shortRes.error).toBe(
        'Invalid vector dimension for key "short-key" in ctx: expected 768, got 767'
      );

      const longRes = validateVector(longVec, 'long-key');
      expect(longRes.valid).toBe(false);
      expect(longRes.error).toBe(
        'Invalid vector dimension for key "long-key": expected 768, got 769'
      );
    });

    it('rejects non-finite number elements (string, boolean, NaN, Infinity)', () => {
      const vecString = new Array(768).fill(0.1);
      vecString[10] = 'invalid' as unknown as number;

      const resString = validateVector(vecString, 'str-key', 'ctx.json');
      expect(resString.valid).toBe(false);
      expect(resString.error).toBe(
        'Invalid vector element for key "str-key" at index 10 in ctx.json: expected finite number, got "invalid"'
      );

      const vecBool = new Array(768).fill(0.1);
      vecBool[5] = true as unknown as number;

      const resBool = validateVector(vecBool, 'bool-key');
      expect(resBool.valid).toBe(false);
      expect(resBool.error).toBe(
        'Invalid vector element for key "bool-key" at index 5: expected finite number, got true'
      );

      const vecNaN = new Array(768).fill(0.1);
      vecNaN[0] = NaN;

      const resNaN = validateVector(vecNaN, 'nan-key');
      expect(resNaN.valid).toBe(false);
      expect(resNaN.error).toBe(
        'Invalid vector element for key "nan-key" at index 0: expected finite number, got NaN'
      );

      const vecInf = new Array(768).fill(0.1);
      vecInf[100] = Infinity;

      const resInf = validateVector(vecInf, 'inf-key');
      expect(resInf.valid).toBe(false);
      expect(resInf.error).toBe(
        'Invalid vector element for key "inf-key" at index 100: expected finite number, got Infinity'
      );
    });
  });

  describe('validateEmbeddingSnapshot', () => {
    const validVector = new Array(768).fill(0.05);

    it('validates correct snapshot structure and metadata', () => {
      const snapshot = {
        metadata: {
          model: 'text-embedding-004',
          dimension: 768,
        },
        embeddings: {
          'doc-1': validVector,
          'doc-2': validVector,
        },
      };

      const result = validateEmbeddingSnapshot(snapshot, 'custom-file.json');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(Object.keys(result.vectors)).toEqual(['doc-1', 'doc-2']);
      expect(result.vectors['doc-1']).toHaveLength(768);
    });

    it('uses default context string when fileContext is omitted', () => {
      const snapshot = null;
      const result = validateEmbeddingSnapshot(snapshot);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual([
        'Invalid snapshot JSON structure in embedding snapshot: expected object',
      ]);
    });

    it('rejects non-object parsed inputs', () => {
      expect(validateEmbeddingSnapshot('string-input', 'test.json')).toEqual({
        valid: false,
        errors: ['Invalid snapshot JSON structure in test.json: expected object'],
        vectors: {},
      });

      expect(validateEmbeddingSnapshot(undefined, 'test.json')).toEqual({
        valid: false,
        errors: ['Invalid snapshot JSON structure in test.json: expected object'],
        vectors: {},
      });
    });

    it('validates metadata object and model field', () => {
      const invalidMetaType = {
        metadata: 'invalid-meta-type',
        embeddings: { 'doc-1': validVector },
      };
      const resMetaType = validateEmbeddingSnapshot(invalidMetaType, 'test.json');
      expect(resMetaType.valid).toBe(false);
      expect(resMetaType.errors).toContain('Invalid metadata in test.json: expected object');

      const invalidModel = {
        metadata: { model: 'wrong-model-name' },
        embeddings: { 'doc-1': validVector },
      };
      const resModel = validateEmbeddingSnapshot(invalidModel, 'test.json');
      expect(resModel.valid).toBe(false);
      expect(resModel.errors).toContain(
        'Invalid embedding model in test.json: expected "text-embedding-004", got "wrong-model-name"'
      );

      const missingMetaWithEmbeddings = {
        embeddings: { 'doc-1': validVector },
      };
      const resMissingMeta = validateEmbeddingSnapshot(missingMetaWithEmbeddings, 'test.json');
      expect(resMissingMeta.valid).toBe(false);
      expect(resMissingMeta.errors).toContain(
        'Missing metadata in test.json: expected metadata.model === "text-embedding-004"'
      );
    });

    it('rejects invalid embeddings container structures', () => {
      const nullEmbeddings = {
        metadata: { model: 'text-embedding-004' },
        embeddings: null,
      };
      const resNull = validateEmbeddingSnapshot(nullEmbeddings, 'test.json');
      expect(resNull.valid).toBe(false);
      expect(resNull.errors).toContain(
        'Invalid embeddings container in test.json: expected a non-empty object record keyed by document id'
      );

      const arrayEmbeddings = {
        metadata: { model: 'text-embedding-004' },
        embeddings: [validVector],
      };
      const resArray = validateEmbeddingSnapshot(arrayEmbeddings, 'test.json');
      expect(resArray.valid).toBe(false);
      expect(resArray.errors).toContain(
        'Invalid embeddings container in test.json: expected a non-empty object record keyed by document id'
      );

      const emptyEmbeddings = {
        metadata: { model: 'text-embedding-004' },
        embeddings: {},
      };
      const resEmpty = validateEmbeddingSnapshot(emptyEmbeddings, 'test.json');
      expect(resEmpty.valid).toBe(false);
      expect(resEmpty.errors).toContain(
        'Invalid embeddings container in test.json: expected a non-empty object record keyed by document id'
      );
    });

    it('reports vector validation errors and isolates valid vectors', () => {
      const invalidVec = [0.1, 0.2]; // wrong dimension
      const snapshot = {
        metadata: { model: 'text-embedding-004' },
        embeddings: {
          'good-doc': validVector,
          'bad-doc': invalidVec,
        },
      };

      const result = validateEmbeddingSnapshot(snapshot, 'mixed.json');
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain(
        'Invalid vector dimension for key "bad-doc" in mixed.json'
      );
      expect(Object.keys(result.vectors)).toEqual(['good-doc']);
    });
  });

  describe('buildCacheKey', () => {
    it('builds cache keys with deterministic separator', () => {
      expect(buildCacheKey('prefix', 'text')).toBe('prefix::text');
      expect(buildCacheKey('faq-123', 'How do I rent a mailbox?')).toBe(
        'faq-123::How do I rent a mailbox?'
      );
    });

    it('handles special characters, whitespace, and Unicode in key strings', () => {
      const key = buildCacheKey('RETRIEVAL_QUERY', 'What & where? #1 !@#$%^&*() 📦');
      expect(key).toBe('RETRIEVAL_QUERY::What & where? #1 !@#$%^&*() 📦');
    });
  });

  describe('cosineSimilarity', () => {
    it('calculates similarity for identical, orthogonal, and opposite vectors', () => {
      const v1 = [1, 2, 3];
      const v2 = [1, 2, 3];
      expect(cosineSimilarity(v1, v2)).toBeCloseTo(1.0, 5);

      const vOrthogonal1 = [1, 0, 0];
      const vOrthogonal2 = [0, 1, 0];
      expect(cosineSimilarity(vOrthogonal1, vOrthogonal2)).toBeCloseTo(0.0, 5);

      const vOpposite1 = [1, 0, 0];
      const vOpposite2 = [-1, 0, 0];
      expect(cosineSimilarity(vOpposite1, vOpposite2)).toBeCloseTo(-1.0, 5);
    });

    it('handles zero-magnitude vectors gracefully without division by zero errors', () => {
      const zeroVec = [0, 0, 0];
      const nonZeroVec = [1, 2, 3];
      expect(cosineSimilarity(zeroVec, nonZeroVec)).toBe(0);
      expect(cosineSimilarity(zeroVec, zeroVec)).toBe(0);
    });

    it('throws error on vector length mismatch', () => {
      const v1 = [1, 2, 3];
      const v2 = [1, 2];
      expect(() => cosineSimilarity(v1, v2)).toThrow('Vectors must have the same length');
    });
  });

  describe('calculateCandidateSimilarity', () => {
    const vec1 = [1, 0, 0];
    const vec2 = [0.8, 0.6, 0];
    const cache: EmbeddingCache = {
      'key-1': vec1,
      'key-2': vec2,
    };

    it('calculates maximum similarity across existing candidate cache keys', () => {
      const query = [1, 0, 0]; // identical to key-1, similarity 1.0 with key-1, 0.8 with key-2
      const sim = calculateCandidateSimilarity(query, ['key-1', 'key-2'], cache);
      expect(sim).toBeCloseTo(1.0, 5);
    });

    it('ignores missing cache keys', () => {
      const query = [1, 0, 0];
      const sim = calculateCandidateSimilarity(query, ['missing-key', 'key-2'], cache);
      expect(sim).toBeCloseTo(0.8, 5);
    });

    it('returns 0 when no keys exist in cache and throwOnMissing is false', () => {
      const query = [1, 0, 0];
      const sim = calculateCandidateSimilarity(query, ['missing-1', 'missing-2'], cache, false);
      expect(sim).toBe(0);
    });

    it('throws error when throwOnMissing is true and no candidate keys exist in cache', () => {
      const query = [1, 0, 0];
      expect(() => calculateCandidateSimilarity(query, ['missing-key'], cache, true)).toThrow(
        'Missing cached embedding for: missing-key'
      );
    });

    it('does not throw when throwOnMissing is true if at least one candidate key exists in cache', () => {
      const query = [1, 0, 0];
      expect(() =>
        calculateCandidateSimilarity(query, ['missing-key', 'key-1'], cache, true)
      ).not.toThrow();
    });

    it('does not throw when throwOnMissing is true if candidateKeys array is empty', () => {
      const query = [1, 0, 0];
      expect(calculateCandidateSimilarity(query, [], cache, true)).toBe(0);
    });
  });

  describe('evaluateRetrievalCandidates', () => {
    const entryA: KBEntry = {
      id: 'faq-a',
      title: 'Title A',
      questionVariants: ['Variant A'],
      answer: 'Answer A',
      searchText: 'Search A',
      sources: [{ type: 'web', url: 'https://example.com/a', lastVerified: '2026-01-01' }],
    };

    const entryB: KBEntry = {
      id: 'faq-b',
      title: 'Title B',
      questionVariants: ['Variant B'],
      answer: 'Answer B',
      searchText: 'Search B',
      confidence: {
        minimumSimilarity: 0.88,
      },
    };

    it('returns unmatched refusal when candidates array is empty', () => {
      const result = evaluateRetrievalCandidates([]);
      expect(result).toEqual({
        matched: false,
        refusalReason: 'No entry meets similarity threshold',
      });
    });

    it('returns matched candidate when score exceeds minimum similarity', () => {
      const result = evaluateRetrievalCandidates([{ entry: entryA, score: 0.85 }]);
      expect(result).toEqual({
        matched: true,
        faqId: 'faq-a',
        answer: 'Answer A',
        sourceUrl: 'https://example.com/a',
        confidence: 0.85,
        effectiveMin: 0.78,
      });
    });

    it('returns unmatched refusal when best candidate score is below effective minimum', () => {
      const result = evaluateRetrievalCandidates([{ entry: entryA, score: 0.75 }]);
      expect(result).toEqual({
        matched: false,
        faqId: 'faq-a',
        confidence: 0.75,
        effectiveMin: 0.78,
        refusalReason: 'No entry meets similarity threshold',
      });
    });

    it('returns ambiguous refusal when competing candidates fall below ambiguity gap threshold', () => {
      const candidates = [
        { entry: entryA, score: 0.85 },
        { entry: entryB, score: 0.82 }, // gap = 0.03 < 0.1
      ];

      const result = evaluateRetrievalCandidates(candidates, 0.78, 0.1, false);
      expect(result).toEqual({
        matched: false,
        faqId: 'faq-a',
        confidence: 0.85,
        effectiveMin: 0.78,
        gap: expect.closeTo(0.03, 5),
        refusalReason: 'Two or more entries compete',
      });
    });

    it('matches best candidate when second-best candidate is below effective minimum even if gap is small', () => {
      const candidates = [
        { entry: entryA, score: 0.8 },
        { entry: entryB, score: 0.75 }, // gap = 0.05 < 0.1, but entryB is below effectiveMin (0.78)
      ];

      const result = evaluateRetrievalCandidates(candidates, 0.78, 0.1, false);
      expect(result.matched).toBe(true);
      expect(result.faqId).toBe('faq-a');
    });

    it('honors per-entry minimum similarity threshold when honorEntryThreshold is true', () => {
      // entryB has minimumSimilarity = 0.88
      const candidates = [{ entry: entryB, score: 0.85 }];

      const withoutHonor = evaluateRetrievalCandidates(candidates, 0.78, 0.1, false);
      expect(withoutHonor.matched).toBe(true);
      expect(withoutHonor.effectiveMin).toBe(0.78);

      const withHonor = evaluateRetrievalCandidates(candidates, 0.78, 0.1, true);
      expect(withHonor.matched).toBe(false);
      expect(withHonor.effectiveMin).toBe(0.88);
      expect(withHonor.refusalReason).toBe('No entry meets similarity threshold');
    });

    it('falls back to global minimum similarity when honorEntryThreshold is true but entry has no custom minimum', () => {
      // entryA has no minimumSimilarity specified in confidence
      const candidates = [{ entry: entryA, score: 0.8 }];
      const result = evaluateRetrievalCandidates(candidates, 0.78, 0.1, true);
      expect(result.matched).toBe(true);
      expect(result.effectiveMin).toBe(0.78);
    });
  });

  describe('retrieveAnswerCore', () => {
    const entry1: KBEntry = {
      id: 'faq-1',
      title: 'Mailbox Sizes',
      questionVariants: ['What mailbox sizes are available?'],
      answer: 'We offer Small, Medium, and Large mailboxes.',
      searchText: 'mailbox sizes small medium large',
    };

    const entry2: KBEntry = {
      id: 'faq-2',
      title: 'Store Hours',
      questionVariants: ['What are your hours?'],
      answer: 'We are open Monday through Friday 9 AM to 6 PM.',
      searchText: 'hours store operating schedule',
    };

    const queryVec = [1, 0, 0];
    const matchVec = [1, 0, 0];
    const nonMatchVec = [0, 1, 0];

    it('retrieves answer for query using primary cache key match', () => {
      const cache: EmbeddingCache = {
        [buildCacheKey('faq-1', 'What mailbox sizes are available?')]: matchVec,
        [buildCacheKey('faq-1', 'mailbox sizes small medium large')]: nonMatchVec,
        [buildCacheKey('faq-1', 'Mailbox Sizes')]: nonMatchVec,
        [buildCacheKey('faq-2', 'What are your hours?')]: nonMatchVec,
      };

      const result = retrieveAnswerCore(queryVec, [entry1, entry2], cache);
      expect(result.matched).toBe(true);
      expect(result.faqId).toBe('faq-1');
      expect(result.answer).toBe('We offer Small, Medium, and Large mailboxes.');
    });

    it('retrieves answer using fallback RETRIEVAL_QUERY and RETRIEVAL_DOCUMENT cache keys', () => {
      const cache: EmbeddingCache = {
        // query variant fallback
        [buildCacheKey('RETRIEVAL_QUERY', 'What mailbox sizes are available?')]: matchVec,
        // document text fallback
        [buildCacheKey('RETRIEVAL_DOCUMENT', 'hours store operating schedule')]: nonMatchVec,
      };

      const result = retrieveAnswerCore(queryVec, [entry1, entry2], cache);
      expect(result.matched).toBe(true);
      expect(result.faqId).toBe('faq-1');
    });

    it('accepts options passed as a number (minSimilarity)', () => {
      const cache: EmbeddingCache = {
        [buildCacheKey('faq-1', 'What mailbox sizes are available?')]: [0.8, 0.6, 0], // similarity = 0.8
      };

      // Score = 0.8, threshold set to 0.85 -> unmatched
      const resHighThreshold = retrieveAnswerCore(queryVec, [entry1], cache, 0.85);
      expect(resHighThreshold.matched).toBe(false);
      expect(resHighThreshold.effectiveMin).toBe(0.85);

      // Score = 0.8, threshold set to 0.75 -> matched
      const resLowThreshold = retrieveAnswerCore(queryVec, [entry1], cache, 0.75);
      expect(resLowThreshold.matched).toBe(true);
      expect(resLowThreshold.effectiveMin).toBe(0.75);
    });

    it('accepts options passed as a RetrievalOptions object', () => {
      const cache: EmbeddingCache = {
        [buildCacheKey('faq-1', 'What mailbox sizes are available?')]: [0.8, 0.6, 0], // similarity 0.8
        [buildCacheKey('faq-2', 'What are your hours?')]: [0.79, 0.61, 0], // similarity 0.79
      };

      const options = {
        globalMinSimilarity: 0.75,
        ambiguityGapThreshold: 0.05, // gap is 0.01 < 0.05 -> ambiguous
        honorEntryThreshold: false,
        throwOnMissing: false,
      };

      const result = retrieveAnswerCore(queryVec, [entry1, entry2], cache, options);
      expect(result.matched).toBe(false);
      expect(result.refusalReason).toBe('Two or more entries compete');
    });

    it('throws error when throwOnMissing is true and cache keys are missing', () => {
      const emptyCache: EmbeddingCache = {};
      expect(() =>
        retrieveAnswerCore(queryVec, [entry1], emptyCache, { throwOnMissing: true })
      ).toThrow('Missing cached embedding for: faq-1::What mailbox sizes are available?');
    });

    it('filters out empty text strings from entry search candidates', () => {
      const entryWithEmptyFields: KBEntry = {
        id: 'faq-empty',
        title: '',
        questionVariants: ['Valid variant', ''],
        answer: 'Answer',
        searchText: '',
      };

      const cache: EmbeddingCache = {
        [buildCacheKey('faq-empty', 'Valid variant')]: matchVec,
      };

      const result = retrieveAnswerCore(queryVec, [entryWithEmptyFields], cache);
      expect(result.matched).toBe(true);
      expect(result.faqId).toBe('faq-empty');
    });
  });
});
