import { describe, it, expect } from 'vitest';
import {
  executeTest,
  generateMarkdownReport,
  verifyVectorCoverage,
} from './retrieval-test-runner.js';
import type { TestCase } from './retrieval-test-suite.js';
import type { KnowledgeBase, EmbeddingCache, RetrievalResult } from './retrieval-core.js';
import type { TestExecutionResult } from './retrieval-evaluator.js';

describe('Retrieval Test Runner Unit Tests', () => {
  describe('executeTest()', () => {
    const acceptTestCase: TestCase = {
      id: 'test-accept-01',
      category: 'direct_match',
      query: 'Which carriers do you work with?',
      expectedResult: 'ACCEPT',
      expectedFaqId: 'faq-carriers',
      notes: 'Test carrier query',
    };

    const refuseTestCase: TestCase = {
      id: 'test-refuse-01',
      category: 'out_of_scope',
      query: 'What is the stock price of Apple?',
      expectedResult: 'REFUSE',
      notes: 'Out of scope query',
    };

    it('should pass when expected ACCEPT matches and correct FAQ ID is returned', async () => {
      const mockRetriever = async (): Promise<RetrievalResult> => ({
        matched: true,
        faqId: 'faq-carriers',
        confidence: 0.92,
        answer: 'We work with FedEx, UPS, and USPS.',
      });

      const result = await executeTest(acceptTestCase, mockRetriever);

      expect(result.passed).toBe(true);
      expect(result.actualResult).toBe('ACCEPT');
      expect(result.actualFaqId).toBe('faq-carriers');
      expect(result.confidence).toBe(0.92);
      expect(result.failureReason).toBeUndefined();
    });

    it('should fail when expected ACCEPT matches a wrong FAQ ID', async () => {
      const mockRetriever = async (): Promise<RetrievalResult> => ({
        matched: true,
        faqId: 'faq-wrong-id',
        confidence: 0.88,
      });

      const result = await executeTest(acceptTestCase, mockRetriever);

      expect(result.passed).toBe(false);
      expect(result.actualResult).toBe('ACCEPT');
      expect(result.actualFaqId).toBe('faq-wrong-id');
      expect(result.failureReason).toContain(
        'Wrong FAQ matched: expected faq-carriers, got faq-wrong-id'
      );
    });

    it('should fail when expected ACCEPT is refused', async () => {
      const mockRetriever = async (): Promise<RetrievalResult> => ({
        matched: false,
        confidence: 0.45,
        refusalReason: 'No entry meets similarity threshold',
      });

      const result = await executeTest(acceptTestCase, mockRetriever);

      expect(result.passed).toBe(false);
      expect(result.actualResult).toBe('REFUSE');
      expect(result.failureReason).toContain('Expected ACCEPT, got REFUSE');
    });

    it('should pass when expected REFUSE is refused', async () => {
      const mockRetriever = async (): Promise<RetrievalResult> => ({
        matched: false,
        confidence: 0.3,
        refusalReason: 'No entry meets similarity threshold',
      });

      const result = await executeTest(refuseTestCase, mockRetriever);

      expect(result.passed).toBe(true);
      expect(result.actualResult).toBe('REFUSE');
      expect(result.failureReason).toBeUndefined();
    });

    it('should fail when expected REFUSE is unexpectedly accepted', async () => {
      const mockRetriever = async (): Promise<RetrievalResult> => ({
        matched: true,
        faqId: 'faq-some-id',
        confidence: 0.85,
      });

      const result = await executeTest(refuseTestCase, mockRetriever);

      expect(result.passed).toBe(false);
      expect(result.actualResult).toBe('ACCEPT');
      expect(result.failureReason).toContain('Expected REFUSE, got ACCEPT');
    });
  });

  describe('generateMarkdownReport()', () => {
    const mockPassedResult: TestExecutionResult = {
      testCase: {
        id: 'tc-01',
        category: 'direct_match',
        query: 'What carriers do you use?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-carriers',
      },
      actualResult: 'ACCEPT',
      actualFaqId: 'faq-carriers',
      confidence: 0.95,
      passed: true,
    };

    const mockFailedResult: TestExecutionResult = {
      testCase: {
        id: 'tc-02',
        category: 'out_of_scope',
        query: 'What is the speed of light?',
        expectedResult: 'REFUSE',
      },
      actualResult: 'ACCEPT',
      actualFaqId: 'faq-physics',
      confidence: 0.82,
      passed: false,
      failureReason: 'Expected REFUSE, got ACCEPT',
    };

    it('should generate approved markdown report when all tests pass', () => {
      const report = generateMarkdownReport([mockPassedResult]);

      expect(report).toContain('# Retrieval Test Report');
      expect(report).toContain('✅ **RETRIEVAL APPROVED** - All tests passed.');
      expect(report).toContain('| Total Tests | 1 |');
      expect(report).toContain('| Passed | 1 |');
      expect(report).toContain('| Failed | 0 |');
      expect(report).toContain('| Pass Rate | 100.0% |');
      expect(report).not.toContain('## ⚠️ Failed Tests');
    });

    it('should generate blocked markdown report when tests fail', () => {
      const report = generateMarkdownReport([mockPassedResult, mockFailedResult]);

      expect(report).toContain('❌ **UI ROLLOUT BLOCKED** - 1 test(s) failed.');
      expect(report).toContain('| Total Tests | 2 |');
      expect(report).toContain('| Passed | 1 |');
      expect(report).toContain('| Failed | 1 |');
      expect(report).toContain('| Pass Rate | 50.0% |');
      expect(report).toContain('## ⚠️ Failed Tests');
      expect(report).toContain('### tc-02: What is the speed of light?');
      expect(report).toContain('- **Reason:** Expected REFUSE, got ACCEPT');
    });

    it('should handle empty result array gracefully', () => {
      const report = generateMarkdownReport([]);

      expect(report).toContain('| Total Tests | 0 |');
      expect(report).toContain('| Pass Rate | 0.0% |');
      expect(report).toContain('✅ **RETRIEVAL APPROVED**');
    });
  });

  describe('verifyVectorCoverage()', () => {
    const mockVector = new Array(768).fill(0.1);

    const mockKb: KnowledgeBase = {
      entries: [
        {
          id: 'kb-01',
          title: 'Carrier Information',
          questionVariants: ['Which carriers do you work with?'],
          answer: 'We work with FedEx and UPS.',
          searchText: 'carrier shipping fedex ups',
        },
      ],
    };

    const mockTests: TestCase[] = [
      {
        id: 'test-01',
        category: 'direct_match',
        query: 'Which carriers do you work with?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'kb-01',
      },
    ];

    it('should pass verification when all vectors are present in cache', () => {
      const mockCache: EmbeddingCache = {
        'kb-01::Which carriers do you work with?': mockVector,
        'kb-01::carrier shipping fedex ups': mockVector,
        'kb-01::Carrier Information': mockVector,
        'RETRIEVAL_QUERY::Which carriers do you work with?': mockVector,
      };

      const coverage = verifyVectorCoverage(mockKb, mockTests, mockCache);

      expect(coverage.valid).toBe(true);
      expect(coverage.missing).toHaveLength(0);
    });

    it('should detect missing questionVariant embedding', () => {
      const mockCache: EmbeddingCache = {
        'kb-01::carrier shipping fedex ups': mockVector,
        'kb-01::Carrier Information': mockVector,
      };

      const coverage = verifyVectorCoverage(mockKb, mockTests, mockCache);

      expect(coverage.valid).toBe(false);
      expect(coverage.missing.some((m) => m.includes('questionVariant'))).toBe(true);
    });

    it('should detect missing document embedding', () => {
      const mockCache: EmbeddingCache = {
        'kb-01::Which carriers do you work with?': mockVector,
        // missing searchText and title
        'RETRIEVAL_QUERY::Which carriers do you work with?': mockVector,
      };

      const coverage = verifyVectorCoverage(mockKb, mockTests, mockCache);

      expect(coverage.valid).toBe(false);
      expect(coverage.missing.some((m) => m.includes('document embedding'))).toBe(true);
    });

    it('should detect missing test query embedding', () => {
      const mockCache: EmbeddingCache = {
        'kb-01::Which carriers do you work with?': mockVector,
        'kb-01::carrier shipping fedex ups': mockVector,
        'kb-01::Carrier Information': mockVector,
        // missing test query
      };

      const coverage = verifyVectorCoverage(mockKb, mockTests, mockCache);

      expect(coverage.valid).toBe(false);
      expect(coverage.missing.some((m) => m.includes('Benchmark test query missing'))).toBe(true);
    });

    it('should detect invalid vector dimensions in cache', () => {
      const mockCache: EmbeddingCache = {
        'kb-01::Which carriers do you work with?': new Array(100).fill(0.1), // Wrong dimension (100 vs 768)
        'kb-01::carrier shipping fedex ups': mockVector,
        'kb-01::Carrier Information': mockVector,
        'RETRIEVAL_QUERY::Which carriers do you work with?': mockVector,
      };

      const coverage = verifyVectorCoverage(mockKb, mockTests, mockCache);

      expect(coverage.valid).toBe(false);
      expect(coverage.missing.some((m) => m.includes('invalid vector'))).toBe(true);
    });
  });
});
