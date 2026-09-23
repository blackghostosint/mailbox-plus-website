import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractUniqueTexts, generateEmbeddings } from '../build-embeddings.ts';
import type { KnowledgeBase } from '../../knowledge/retrieval-core.js';

describe('build-embeddings', () => {
  const mockKb: KnowledgeBase = {
    entries: [
      {
        id: 'kb-test-01',
        intent: 'test_intent',
        title: 'Document Title One',
        questionVariants: ['Question Variant One', 'Question Variant Two'],
        answer: 'Test Answer',
        confidence: { minimumSimilarity: 0.8, requiresExactMatch: false },
        sources: [],
        searchText: 'Search Text One',
      },
    ],
  };

  const mockTestCases = [{ query: 'Benchmark Query One' }, { query: 'Question Variant One' }];

  describe('extractUniqueTexts', () => {
    it('extracts and deduplicates unique strings from KB entries and test cases', () => {
      const taskMap = extractUniqueTexts(mockKb, mockTestCases);

      expect(taskMap.has('Document Title One')).toBe(true);
      expect(taskMap.has('Search Text One')).toBe(true);
      expect(taskMap.has('Question Variant One')).toBe(true);
      expect(taskMap.has('Question Variant Two')).toBe(true);
      expect(taskMap.has('Benchmark Query One')).toBe(true);
      // 'Question Variant One' was present in both KB questionVariants and mockTestCases
      expect(taskMap.size).toBe(5);
    });

    it('assigns RETRIEVAL_DOCUMENT for titles and searchTexts, and RETRIEVAL_QUERY for variants and benchmark queries', () => {
      const taskMap = extractUniqueTexts(mockKb, mockTestCases);

      expect(taskMap.get('Document Title One')).toEqual({
        taskType: 'RETRIEVAL_DOCUMENT',
        entryId: 'kb-test-01',
      });
      expect(taskMap.get('Search Text One')).toEqual({
        taskType: 'RETRIEVAL_DOCUMENT',
        entryId: 'kb-test-01',
      });
      expect(taskMap.get('Question Variant One')).toEqual({
        taskType: 'RETRIEVAL_QUERY',
        entryId: 'kb-test-01',
      });
      expect(taskMap.get('Benchmark Query One')).toEqual({
        taskType: 'RETRIEVAL_QUERY',
      });
    });
  });

  describe('generateEmbeddings', () => {
    let originalApiKey: string | undefined;

    beforeEach(() => {
      originalApiKey = process.env.GEMINI_API_KEY;
    });

    afterEach(() => {
      if (originalApiKey !== undefined) {
        process.env.GEMINI_API_KEY = originalApiKey;
      } else {
        delete process.env.GEMINI_API_KEY;
      }
    });

    it('throws error when GEMINI_API_KEY is missing and no client is passed', async () => {
      delete process.env.GEMINI_API_KEY;

      await expect(
        generateEmbeddings({
          kb: mockKb,
          testCases: [],
          apiKey: undefined,
          genAIClient: undefined,
        })
      ).rejects.toThrow('GEMINI_API_KEY environment variable is not set.');
    });

    it('generates expected EmbeddingResult structure using mocked genAIClient', async () => {
      const mockModel = {
        embedContent: vi.fn().mockResolvedValue({
          embedding: { values: [0.1, 0.2, 0.3, 0.4] },
        }),
      };

      const mockGenAIClient = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel),
      };

      const result = await generateEmbeddings({
        kb: mockKb,
        testCases: [{ query: 'Benchmark Query One' }],
        genAIClient: mockGenAIClient,
        delayMs: 0,
      });

      expect(result.metadata.model).toBeDefined();
      expect(result.metadata.generatedAt).toBeDefined();
      expect(typeof result.embeddings).toBe('object');
      expect(mockModel.embedContent).toHaveBeenCalled();

      // Check key presence for one of the unique strings
      expect(result.embeddings['Document Title One']).toEqual([0.1, 0.2, 0.3, 0.4]);
      expect(result.embeddings['RETRIEVAL_DOCUMENT::Document Title One']).toEqual([
        0.1, 0.2, 0.3, 0.4,
      ]);
      expect(result.embeddings['kb-test-01::Document Title One']).toEqual([0.1, 0.2, 0.3, 0.4]);
    });
  });
});
