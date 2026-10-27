import { describe, it, expect } from 'vitest';
import { getTestStats, retrievalTests, type TestCase } from './retrieval-test-suite.js';

describe('Retrieval Test Suite Statistics (getTestStats)', () => {
  it('should return accurate stats for the default retrievalTests suite', () => {
    const stats = getTestStats();

    expect(stats.total).toBe(retrievalTests.length);
    expect(stats.total).toBeGreaterThan(0);

    // Verify all 5 expected categories exist
    expect(stats.byCategory).toHaveProperty('direct_match');
    expect(stats.byCategory).toHaveProperty('paraphrase');
    expect(stats.byCategory).toHaveProperty('ambiguous');
    expect(stats.byCategory).toHaveProperty('operational');
    expect(stats.byCategory).toHaveProperty('out_of_scope');

    // Sum of category counts should equal total
    const totalCategoryCount = Object.values(stats.byCategory).reduce(
      (sum, count) => sum + count,
      0
    );
    expect(totalCategoryCount).toBe(stats.total);

    // Verify ACCEPT and REFUSE breakdown
    expect(stats.shouldAccept + stats.shouldRefuse).toBe(stats.total);
    expect(stats.shouldAccept).toBe(
      retrievalTests.filter((t) => t.expectedResult === 'ACCEPT').length
    );
    expect(stats.shouldRefuse).toBe(
      retrievalTests.filter((t) => t.expectedResult === 'REFUSE').length
    );
  });

  it('should return zero stats when an empty test list is provided', () => {
    const stats = getTestStats([]);

    expect(stats.total).toBe(0);
    expect(stats.shouldAccept).toBe(0);
    expect(stats.shouldRefuse).toBe(0);
    expect(Object.keys(stats.byCategory)).toHaveLength(0);
  });

  it('should correctly aggregate stats for custom injected test cases', () => {
    const customTests: TestCase[] = [
      {
        id: 'custom-1',
        category: 'direct_match',
        query: 'Custom query 1',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-1',
      },
      {
        id: 'custom-2',
        category: 'direct_match',
        query: 'Custom query 2',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-1',
      },
      {
        id: 'custom-3',
        category: 'out_of_scope',
        query: 'Custom query 3',
        expectedResult: 'REFUSE',
      },
    ];

    const stats = getTestStats(customTests);

    expect(stats.total).toBe(3);
    expect(stats.shouldAccept).toBe(2);
    expect(stats.shouldRefuse).toBe(1);
    expect(stats.byCategory).toEqual({
      direct_match: 2,
      out_of_scope: 1,
    });
  });
});
