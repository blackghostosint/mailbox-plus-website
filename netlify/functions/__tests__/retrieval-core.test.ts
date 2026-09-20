import { describe, it, expect } from 'vitest';
import {
  buildCacheKey,
  cosineSimilarity,
  calculateCandidateSimilarity,
  evaluateRetrievalCandidates,
  retrieveAnswerCore,
  EMBEDDING_MODEL,
  MINIMUM_SIMILARITY,
  KBEntry,
  EmbeddingCache,
} from '../../../knowledge/retrieval-core.js';

describe('Retrieval Core Module', () => {
  describe('Constants & Cache Key Builder', () => {
    it('exports required model constants', () => {
      expect(EMBEDDING_MODEL).toBe('text-embedding-004');
      expect(MINIMUM_SIMILARITY).toBe(0.78);
    });

    it('builds deterministic cache key', () => {
      expect(buildCacheKey('RETRIEVAL_QUERY', 'hello')).toBe('RETRIEVAL_QUERY::hello');
      expect(buildCacheKey('faq-1', 'world')).toBe('faq-1::world');
    });
  });

  describe('Cosine Similarity', () => {
    it('calculates exact cosine similarity for parallel vectors', () => {
      const v1 = [1, 2, 3];
      const v2 = [2, 4, 6];
      expect(cosineSimilarity(v1, v2)).toBeCloseTo(1.0);
    });

    it('returns 0 for orthogonal vectors', () => {
      const v1 = [1, 0];
      const v2 = [0, 1];
      expect(cosineSimilarity(v1, v2)).toBeCloseTo(0.0);
    });

    it('returns -1 for opposite vectors', () => {
      const v1 = [1, 2];
      const v2 = [-1, -2];
      expect(cosineSimilarity(v1, v2)).toBeCloseTo(-1.0);
    });

    it('throws error for unequal vector lengths', () => {
      expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow(
        'Vectors must have the same length'
      );
    });
  });

  describe('Candidate Similarity & Evaluation', () => {
    const mockCache: EmbeddingCache = {
      'faq-1::q1': [1, 0, 0],
      'faq-2::q1': [0, 1, 0],
      'faq-3::q1': [0.8, 0.6, 0],
    };

    const mockEntries: KBEntry[] = [
      {
        id: 'faq-1',
        title: 'FAQ 1',
        questionVariants: ['q1'],
        searchText: 'q1',
        answer: 'Answer 1',
        sources: [{ type: 'url', url: 'https://example.com/1', lastVerified: '2026-01-01' }],
      },
      {
        id: 'faq-2',
        title: 'FAQ 2',
        questionVariants: ['q1'],
        searchText: 'q1',
        answer: 'Answer 2',
      },
    ];

    it('calculates max similarity across candidates in cache', () => {
      const queryVector = [1, 0, 0];
      const score = calculateCandidateSimilarity(
        queryVector,
        ['faq-1::q1', 'faq-2::q1'],
        mockCache
      );
      expect(score).toBeCloseTo(1.0);
    });

    it('accepts candidate meeting threshold without competing entries', () => {
      const candidates = [
        { entry: mockEntries[0], score: 0.85 },
        { entry: mockEntries[1], score: 0.5 },
      ];

      const result = evaluateRetrievalCandidates(candidates, 0.78);
      expect(result.matched).toBe(true);
      expect(result.faqId).toBe('faq-1');
      expect(result.answer).toBe('Answer 1');
      expect(result.sourceUrl).toBe('https://example.com/1');
    });

    it('refuses when best candidate is below threshold', () => {
      const candidates = [
        { entry: mockEntries[0], score: 0.7 },
        { entry: mockEntries[1], score: 0.5 },
      ];

      const result = evaluateRetrievalCandidates(candidates, 0.78);
      expect(result.matched).toBe(false);
      expect(result.refusalReason).toBe('No entry meets similarity threshold');
    });

    it('refuses when two entries compete (gap < 0.1 and second >= threshold)', () => {
      const candidates = [
        { entry: mockEntries[0], score: 0.82 },
        { entry: mockEntries[1], score: 0.8 },
      ];

      const result = evaluateRetrievalCandidates(candidates, 0.78, 0.1);
      expect(result.matched).toBe(false);
      expect(result.refusalReason).toBe('Two or more entries compete');
    });

    it('throws when throwOnMissing is true and key is absent', () => {
      const queryVector = [1, 0, 0];
      expect(() =>
        calculateCandidateSimilarity(queryVector, ['nonexistent::key'], mockCache, true)
      ).toThrow('Missing cached embedding for: nonexistent::key');
    });

    it('honors per-entry threshold override when honorEntryThreshold is true', () => {
      const customEntry: KBEntry = {
        ...mockEntries[0],
        confidence: { minimumSimilarity: 0.9 },
      };
      const candidates = [{ entry: customEntry, score: 0.85 }];

      // Default: ignores entry threshold
      const resDefault = evaluateRetrievalCandidates(candidates, 0.78, 0.1, false);
      expect(resDefault.matched).toBe(true);

      // honorEntryThreshold = true: uses 0.9 threshold
      const resHonored = evaluateRetrievalCandidates(candidates, 0.78, 0.1, true);
      expect(resHonored.matched).toBe(false);
    });

    it('retrieves answer using retrieveAnswerCore', () => {
      const queryVector = [1, 0, 0];
      const result = retrieveAnswerCore(queryVector, mockEntries, mockCache, 0.78);
      expect(result.matched).toBe(true);
      expect(result.faqId).toBe('faq-1');
    });
  });
});
