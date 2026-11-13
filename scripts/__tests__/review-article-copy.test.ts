import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import fs from 'fs';
import {
  matchWildcardSegment,
  globMatch,
  resolveFiles,
  evaluateArticle,
  shouldEscalateBorderline,
  resolveReviewVerdict,
  printReport,
} from '../review-article-copy.ts';

describe('review-article-copy', () => {
  describe('matchWildcardSegment', () => {
    it('matches star wildcard against any text', () => {
      expect(matchWildcardSegment('anything', '*')).toBe(true);
    });

    it('matches exact text without wildcards', () => {
      expect(matchWildcardSegment('index.ts', 'index.ts')).toBe(true);
      expect(matchWildcardSegment('index.ts', 'index.js')).toBe(false);
    });

    it('matches prefix and suffix wildcards', () => {
      expect(matchWildcardSegment('article.md', '*.md')).toBe(true);
      expect(matchWildcardSegment('article.txt', '*.md')).toBe(false);
      expect(matchWildcardSegment('article-shipping.md', 'article-*.md')).toBe(true);
    });
  });

  describe('globMatch', () => {
    it('matches recursive glob patterns', () => {
      expect(globMatch('content/articles/sub/post.md', 'content/**/*.md')).toBe(true);
      expect(globMatch('content/articles/post.md', 'content/**/*.md')).toBe(true);
      expect(globMatch('src/components/Header.astro', 'content/**/*.md')).toBe(false);
    });

    it('matches simple directory wildcards', () => {
      expect(globMatch('content/articles/post.md', 'content/*/*.md')).toBe(true);
      expect(globMatch('content/articles/sub/post.md', 'content/*/*.md')).toBe(false);
    });
  });

  describe('resolveFiles', () => {
    const tmpDir = path.resolve(process.cwd(), '../scripts/__test_articles_tmp__');

    it('resolves single existing file', () => {
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      const testFile = path.join(tmpDir, 'sample.md');
      fs.writeFileSync(testFile, '# Test Article');

      try {
        const resolved = resolveFiles(testFile);
        expect(resolved).toEqual([testFile]);
      } finally {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
        if (fs.existsSync(tmpDir)) fs.rmdirSync(tmpDir);
      }
    });

    it('returns empty array when target does not exist', () => {
      expect(resolveFiles('/non-existent-path/file.md')).toEqual([]);
    });
  });

  describe('evaluateArticle error handling', () => {
    it('throws error when custom provider has no base url', async () => {
      await expect(
        evaluateArticle('Sample content', { provider: 'custom', apiKey: 'test' })
      ).rejects.toThrow('--base-url is required');
    });

    it('throws error when provider is unknown', async () => {
      await expect(
        evaluateArticle('Sample content', { provider: 'unknown' as any })
      ).rejects.toThrow('Unknown provider');
    });

    it('evaluates article via custom provider with retries on transient errors', async () => {
      const mockResult = {
        total_score: 85,
        verdict: 'PASS',
        dimensions: {},
        executive_summary: 'Good draft.',
      };

      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: async () => ({ error: 'Service Unavailable' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            choices: [{ message: { content: JSON.stringify(mockResult) } }],
          }),
        });

      vi.stubGlobal('fetch', mockFetch);

      try {
        const res = await evaluateArticle('Sample content for evaluation', {
          provider: 'custom',
          baseUrl: 'https://custom-ai.example.com',
          apiKey: 'test-key',
        });

        expect(res).toEqual(mockResult);
        expect(mockFetch).toHaveBeenCalledTimes(2);
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });

  describe('scale-separated borderline escalation and verdict reporting', () => {
    it('escalates only in [78, 84] for non-kimi models', () => {
      expect(shouldEscalateBorderline('deepseek/deepseek-v4.1-flash', 90)).toBe(false);
      expect(shouldEscalateBorderline('deepseek/deepseek-v4.1-flash', 85)).toBe(false);
      expect(shouldEscalateBorderline('deepseek/deepseek-v4.1-flash', 84)).toBe(true);
      expect(shouldEscalateBorderline('deepseek/deepseek-v4.1-flash', 78)).toBe(true);
      expect(shouldEscalateBorderline('deepseek/deepseek-v4.1-flash', 77)).toBe(false);
      expect(shouldEscalateBorderline('moonshotai/kimi-k2.6', 81)).toBe(false);
    });

    it('keeps flash score as total_score and PASS when K2.6 advisory rescore is >= 60', () => {
      const base = {
        total_score: 81,
        executive_summary: 'Base summary',
        flagged_passages: [],
        dimensions: { fluff_density: { score: 16, critique: 'Base' } },
      };
      const rescore = {
        total_score: 68,
        executive_summary: 'Harsher K2.6 summary',
        flagged_passages: [{ dimension: 'fluff', quote: 'x', problem: 'tighten', fix: 'y' }],
        dimensions: { fluff_density: { score: 13, critique: 'K2.6 critique' } },
      };

      const { result, failed } = resolveReviewVerdict(
        base,
        rescore,
        'deepseek/deepseek-v4.1-flash',
        'moonshotai/kimi-k2.6',
        70
      );

      expect(failed).toBe(false);
      expect(result.total_score).toBe(81);
      expect(result.gate_score).toBe(81);
      expect(result.escalation.rescore_score).toBe(68);
      expect(result.flagged_passages).toHaveLength(1);

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        printReport('notarize-car-title-ohio.md', result, 70);
        const out = spy.mock.calls.map((c) => c.join(' ')).join('\n');
        expect(out).toContain('Score: 81/100 (PASS, floor 70)');
        expect(out).toContain('Advisory rescore (moonshotai/kimi-k2.6): 68/100');
        expect(out).not.toContain('Score: 68/100 (FAIL)');
      } finally {
        spy.mockRestore();
      }
    });

    it('triggers hard-floor FAIL veto when K2.6 rescore falls below 60', () => {
      const base = { total_score: 82 };
      const rescore = { total_score: 54 };

      const { result, failed } = resolveReviewVerdict(
        base,
        rescore,
        'deepseek/deepseek-v4.1-flash',
        'moonshotai/kimi-k2.6',
        70
      );

      expect(failed).toBe(true);
      expect(result.total_score).toBe(74);
      expect(result.verdict_note).toContain('K2.6 hard-floor veto');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        printReport('bad-draft.md', result, 70);
        const out = spy.mock.calls.map((c) => c.join(' ')).join('\n');
        expect(out).toContain('(FAIL, floor 70)');
        expect(out).toContain('K2.6 hard-floor veto');
      } finally {
        spy.mockRestore();
      }
    });
  });
});
