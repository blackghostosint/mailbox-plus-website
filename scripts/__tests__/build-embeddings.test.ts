import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractUniqueTexts, generateEmbeddings } from '../build-embeddings.ts';
import { validateKb } from '../validate-kb.ts';
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
        sources: [
          {
            type: 'documentation',
            url: 'https://mailboxplusohio.com/test',
            lastVerified: '2026-01-01',
          },
        ],
        constraints: {
          requiresHuman: false,
          disallowedFollowups: [],
        },
        escalation: {
          enabled: false,
          message: 'Escalation disabled',
        },
        tags: ['test'],
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

    it('writes populated kb.meta.json manifest when writeToDisk is true', async () => {
      const tempOut = path.join(os.tmpdir(), `test-emb-out-${Date.now()}.json`);
      const tempCache = path.join(os.tmpdir(), `test-emb-cache-${Date.now()}.json`);
      const tempMeta = path.join(os.tmpdir(), `test-kb-meta-${Date.now()}.json`);

      const mockModel = {
        embedContent: vi.fn().mockResolvedValue({
          embedding: { values: [0.1, 0.2, 0.3, 0.4] },
        }),
      };

      const mockGenAIClient = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel),
      };

      try {
        await generateEmbeddings({
          kb: mockKb,
          testCases: [],
          genAIClient: mockGenAIClient,
          writeToDisk: true,
          outputPath: tempOut,
          cachePath: tempCache,
          metaPath: tempMeta,
          delayMs: 0,
        });

        expect(fs.existsSync(tempMeta)).toBe(true);
        const writtenMeta = JSON.parse(fs.readFileSync(tempMeta, 'utf-8'));

        expect(writtenMeta.site).toBe('mailboxplusohio.com');
        expect(writtenMeta.contentVersion).toBeDefined();
        expect(writtenMeta.embeddingModel).toBe('text-embedding-004');
        expect(writtenMeta.fallbackResponse).toBe(
          "I don't have that information. Please contact the store directly or visit us in person."
        );
        expect(writtenMeta.lastBuiltAt).toBeDefined();
        expect(isNaN(Date.parse(writtenMeta.lastBuiltAt))).toBe(false);
        expect(JSON.stringify(writtenMeta)).not.toContain('PLACEHOLDER');

        // Verify written meta passes validateKb
        const tempKb = path.join(os.tmpdir(), `test-kb-${Date.now()}.json`);
        fs.writeFileSync(tempKb, JSON.stringify(mockKb), 'utf-8');
        const validation = validateKb(tempKb, tempMeta);
        expect(validation.success).toBe(true);
        if (fs.existsSync(tempKb)) fs.unlinkSync(tempKb);
      } finally {
        if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
        if (fs.existsSync(tempCache)) fs.unlinkSync(tempCache);
        if (fs.existsSync(tempMeta)) fs.unlinkSync(tempMeta);
      }
    });
  });
});
