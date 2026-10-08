import { describe, it, expect } from 'vitest';
import {
  checkArticleOwnership,
  DEFAULT_AUTHORIZED_AUTHORS,
  IN_HOUSE_STAMP,
} from '../check-article-ownership.mjs';

describe('check-article-ownership', () => {
  const validArticleBody = `
## Article Overview
Some content for the article.

authorship: article-writer-bot (in-house)
  `.trim();

  describe('Non-article pull requests', () => {
    it('passes and exits early when PR does not touch content/articles/', () => {
      const changedFiles = [
        'astro/src/pages/index.astro',
        'README.md',
        'netlify/functions/health.ts',
      ];
      const result = checkArticleOwnership({
        body: 'Just updating index page',
        changedFiles,
        author: 'external-user',
      });

      expect(result.success).toBe(true);
      expect(result.touchesArticles).toBe(false);
      expect(result.reason).toBe('not_applicable');
      expect(result.message).toContain('PR does not touch content/articles/');
    });

    it('passes for non-article PRs even if author is unspecified', () => {
      const changedFiles = ['package.json'];
      const result = checkArticleOwnership({
        body: '',
        changedFiles,
        author: '',
      });

      expect(result.success).toBe(true);
      expect(result.touchesArticles).toBe(false);
      expect(result.reason).toBe('not_applicable');
    });
  });

  describe('Authorized internal authors', () => {
    it('passes when an authorized internal author submits a PR with the in-house stamp', () => {
      const changedFiles = ['content/articles/shipping-guide.md'];

      for (const author of DEFAULT_AUTHORIZED_AUTHORS) {
        const result = checkArticleOwnership({
          body: validArticleBody,
          changedFiles,
          author,
        });

        expect(result.success).toBe(true);
        expect(result.touchesArticles).toBe(true);
        expect(result.reason).toBe('verified');
        expect(result.message).toContain('verified in-house author');
      }
    });

    it('handles author usernames case-insensitively', () => {
      const changedFiles = ['content/articles/shipping-guide.md'];
      const result = checkArticleOwnership({
        body: validArticleBody,
        changedFiles,
        author: 'ARTICLE-WRITER-BOT',
      });

      expect(result.success).toBe(true);
      expect(result.reason).toBe('verified');
    });

    it('fails when an authorized internal author touches articles but misses the stamp', () => {
      const changedFiles = ['content/articles/shipping-guide.md'];
      const result = checkArticleOwnership({
        body: 'Updated shipping guide with new prices.',
        changedFiles,
        author: 'article-writer-bot',
      });

      expect(result.success).toBe(false);
      expect(result.touchesArticles).toBe(true);
      expect(result.reason).toBe('missing_stamp');
      expect(result.message).toContain('missing the in-house authorship stamp');
      expect(result.message).toContain(IN_HOUSE_STAMP);
    });
  });

  describe('External / unauthorized authors (string injection protection)', () => {
    it('rejects PRs from external authors even if they copy the in-house stamp', () => {
      const changedFiles = ['content/articles/malicious-edit.md'];
      const result = checkArticleOwnership({
        body: validArticleBody, // Contains authorship: article-writer-bot (in-house)
        changedFiles,
        author: 'external-hacker',
      });

      expect(result.success).toBe(false);
      expect(result.touchesArticles).toBe(true);
      expect(result.reason).toBe('unauthorized_author');
      expect(result.message).toContain(
        "author 'external-hacker' is not an authorized internal author login"
      );
    });

    it('rejects PRs from external authors without the stamp', () => {
      const changedFiles = ['content/articles/malicious-edit.md'];
      const result = checkArticleOwnership({
        body: 'Some external PR body',
        changedFiles,
        author: 'random-user',
      });

      expect(result.success).toBe(false);
      expect(result.touchesArticles).toBe(true);
      expect(result.reason).toBe('unauthorized_author');
      expect(result.message).toContain(
        "author 'random-user' is not an authorized internal author login"
      );
    });
  });

  describe('Local execution and edge cases', () => {
    it('bypasses author check safely when running locally without author context', () => {
      const changedFiles = ['content/articles/local-test.md'];
      const result = checkArticleOwnership({
        body: validArticleBody,
        changedFiles,
        author: '',
        isLocal: true,
      });

      expect(result.success).toBe(true);
      expect(result.reason).toBe('local_bypass');
      expect(result.message).toContain('Local execution detected');
    });

    it('fails when author context is missing in CI environment (isLocal = false)', () => {
      const changedFiles = ['content/articles/ci-test.md'];
      const result = checkArticleOwnership({
        body: validArticleBody,
        changedFiles,
        author: '',
        isLocal: false,
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('missing_author');
      expect(result.message).toContain('pull request author is unknown');
    });

    it('supports custom authorized author lists', () => {
      const changedFiles = ['content/articles/custom-author.md'];
      const customAuthors = ['custom-bot', 'special-agent'];

      const result = checkArticleOwnership({
        body: validArticleBody,
        changedFiles,
        author: 'special-agent',
        authorizedAuthors: customAuthors,
      });

      expect(result.success).toBe(true);
      expect(result.reason).toBe('verified');

      const rejectedResult = checkArticleOwnership({
        body: validArticleBody,
        changedFiles,
        author: 'article-writer-bot', // Not in custom list
        authorizedAuthors: customAuthors,
      });

      expect(rejectedResult.success).toBe(false);
      expect(rejectedResult.reason).toBe('unauthorized_author');
    });
  });
});
