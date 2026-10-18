import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import fs from 'fs';
import {
  matchWildcardSegment,
  globMatch,
  resolveFiles,
  evaluateArticle,
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
});
