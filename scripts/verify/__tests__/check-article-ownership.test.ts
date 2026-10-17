import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  checkArticleOwnership,
  DEFAULT_AUTHORIZED_AUTHORS,
  IN_HOUSE_STAMP,
} from '../check-article-ownership.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

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

    it('fails when body is empty string or undefined and PR touches articles', () => {
      const changedFiles = ['content/articles/new-post.md'];

      const res1 = checkArticleOwnership({ body: '', changedFiles, author: 'article-writer-bot' });
      expect(res1.success).toBe(false);
      expect(res1.reason).toBe('missing_stamp');

      const res2 = checkArticleOwnership({
        body: undefined,
        changedFiles,
        author: 'article-writer-bot',
      });
      expect(res2.success).toBe(false);
      expect(res2.reason).toBe('missing_stamp');
    });

    it('correctly trims whitespace from changed file paths', () => {
      const changedFiles = ['   content/articles/whitespace-path.md   '];
      const result = checkArticleOwnership({
        body: validArticleBody,
        changedFiles,
        author: 'article-writer-bot',
      });

      expect(result.success).toBe(true);
      expect(result.touchesArticles).toBe(true);
      expect(result.reason).toBe('verified');
    });

    it('fails when authorship stamp string is invalid or slightly altered', () => {
      const changedFiles = ['content/articles/test.md'];
      const invalidStamps = [
        'authorship: article-writer-bot (external)',
        'authorship: article-writer-bot',
        'authorship: someone-else (in-house)',
        'author: article-writer-bot (in-house)',
      ];

      for (const stamp of invalidStamps) {
        const result = checkArticleOwnership({
          body: `Here is the article\n\n${stamp}`,
          changedFiles,
          author: 'article-writer-bot',
        });

        expect(result.success).toBe(false);
        expect(result.reason).toBe('missing_stamp');
      }
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

  describe('Deletion-only pull requests (GSC cleanup etc.)', () => {
    const stamplessBody = 'seo: GSC indexing cleanup';

    it('passes when all touched article files are removed and no stamp is present', () => {
      const changedFiles = [
        'content/articles/pack-ship/hambden-stamps.md',
        'content/articles/pack-ship/pack-ship-chardon-city.md',
      ];
      const fileStatuses = {
        'content/articles/pack-ship/hambden-stamps.md': 'removed',
        'content/articles/pack-ship/pack-ship-chardon-city.md': 'removed',
      };

      const result = checkArticleOwnership({
        body: stamplessBody,
        changedFiles,
        author: 'blackghostosint',
        fileStatuses,
      });

      expect(result.success).toBe(true);
      expect(result.touchesArticles).toBe(true);
      expect(result.reason).toBe('deletions_only');
    });

    it('still fails a mixed PR (deleted + added) without the stamp', () => {
      const changedFiles = [
        'content/articles/pack-ship/hambden-stamps.md',
        'content/articles/pack-ship/brand-new-article.md',
      ];
      const fileStatuses = {
        'content/articles/pack-ship/hambden-stamps.md': 'removed',
        'content/articles/pack-ship/brand-new-article.md': 'added',
      };

      const result = checkArticleOwnership({
        body: stamplessBody,
        changedFiles,
        author: 'blackghostosint',
        fileStatuses,
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('missing_stamp');
    });

    it('still fails deletions from an unauthorized author', () => {
      const changedFiles = ['content/articles/pack-ship/hambden-stamps.md'];
      const fileStatuses = { 'content/articles/pack-ship/hambden-stamps.md': 'removed' };

      const result = checkArticleOwnership({
        body: stamplessBody,
        changedFiles,
        author: 'external-hacker',
        fileStatuses,
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('unauthorized_author');
    });

    it('requires the stamp when statuses are unavailable (previous behavior)', () => {
      const changedFiles = ['content/articles/pack-ship/hambden-stamps.md'];

      const result = checkArticleOwnership({
        body: stamplessBody,
        changedFiles,
        author: 'blackghostosint',
        // no fileStatuses
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('missing_stamp');
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

  describe('CLI subprocess execution (execSync)', () => {
    it('exits with code 0 when PR passes checks (valid stamp & authorized author)', () => {
      const tempBodyFile = path.join(os.tmpdir(), `test-body-${Date.now()}-0.txt`);
      const tempFilesFile = path.join(os.tmpdir(), `test-files-${Date.now()}-0.txt`);

      fs.writeFileSync(tempBodyFile, validArticleBody);
      fs.writeFileSync(tempFilesFile, 'content/articles/shipping.md');

      try {
        const stdout = execSync(
          `node scripts/verify/check-article-ownership.mjs "${tempBodyFile}" "${tempFilesFile}" --author=article-writer-bot`,
          { cwd: ROOT, encoding: 'utf8' }
        );
        expect(stdout).toContain('✅ article-ownership: verified in-house author');
      } finally {
        fs.rmSync(tempBodyFile, { force: true });
        fs.rmSync(tempFilesFile, { force: true });
      }
    });

    it('exits with code 0 for non-article PRs', () => {
      const tempBodyFile = path.join(os.tmpdir(), `test-body-${Date.now()}-nonart.txt`);
      const tempFilesFile = path.join(os.tmpdir(), `test-files-${Date.now()}-nonart.txt`);

      fs.writeFileSync(tempBodyFile, 'Just updating README');
      fs.writeFileSync(tempFilesFile, 'README.md');

      try {
        const stdout = execSync(
          `node scripts/verify/check-article-ownership.mjs "${tempBodyFile}" "${tempFilesFile}" --author=random-user`,
          { cwd: ROOT, encoding: 'utf8' }
        );
        expect(stdout).toContain('PR does not touch content/articles/');
      } finally {
        fs.rmSync(tempBodyFile, { force: true });
        fs.rmSync(tempFilesFile, { force: true });
      }
    });

    it('exits with code 1 when PR touches articles but misses the authorship stamp', () => {
      const tempBodyFile = path.join(os.tmpdir(), `test-body-${Date.now()}-1.txt`);
      const tempFilesFile = path.join(os.tmpdir(), `test-files-${Date.now()}-1.txt`);

      fs.writeFileSync(tempBodyFile, 'Missing stamp PR body');
      fs.writeFileSync(tempFilesFile, 'content/articles/shipping.md');

      try {
        execSync(
          `node scripts/verify/check-article-ownership.mjs "${tempBodyFile}" "${tempFilesFile}" --author=article-writer-bot`,
          { cwd: ROOT, encoding: 'utf8' }
        );
        expect.fail('Expected execSync to throw an error due to exit code 1');
      } catch (error: any) {
        expect(error.status).toBe(1);
        expect(error.stderr || error.stdout).toContain('missing the in-house authorship stamp');
      } finally {
        fs.rmSync(tempBodyFile, { force: true });
        fs.rmSync(tempFilesFile, { force: true });
      }
    });

    it('exits with code 2 when missing required positional arguments', () => {
      try {
        execSync('node scripts/verify/check-article-ownership.mjs', {
          cwd: ROOT,
          encoding: 'utf8',
          env: {
            ...process.env,
            PR_BODY_FILE: '',
            GITHUB_EVENT_PATH: '',
          },
        });
        expect.fail('Expected execSync to throw an error due to exit code 2');
      } catch (error: any) {
        expect(error.status).toBe(2);
        expect(error.stderr || error.stdout).toContain(
          'usage: node scripts/verify/check-article-ownership.mjs'
        );
      }
    });
  });
});
