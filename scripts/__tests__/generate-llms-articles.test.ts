import { describe, it, expect } from 'vitest';
import {
  fmtDate,
  articleSection,
  fullSection,
  spliceSection,
  ArticleItem,
} from '../generate-llms-articles.ts';

describe('generate-llms-articles', () => {
  describe('fmtDate', () => {
    it('formats valid ISO date strings to YYYY-MM-DD', () => {
      expect(fmtDate('2026-05-12T10:30:00.000Z')).toBe('2026-05-12');
      expect(fmtDate('2025-01-01')).toBe('2025-01-01');
    });

    it('returns "unknown" for null or undefined values', () => {
      expect(fmtDate(null)).toBe('unknown');
      expect(fmtDate(undefined)).toBe('unknown');
    });

    it('returns "unknown" for invalid date strings', () => {
      expect(fmtDate('invalid-date-string')).toBe('unknown');
      expect(fmtDate('')).toBe('unknown');
    });
  });

  describe('articleSection', () => {
    it('groups articles by category and formats Markdown list entries', () => {
      const mockArticles: ArticleItem[] = [
        {
          slug: 'ups-shipping-guide',
          title: 'UPS Shipping Guide',
          description: 'A comprehensive guide to UPS shipping.',
          category: 'pack-ship',
          pubDate: '2026-02-10',
          lastModified: '2026-02-15',
          content: 'Sample content',
        },
        {
          slug: 'mailbox-benefits',
          title: 'Mailbox Benefits',
          description: 'Why rent a mailbox?',
          category: 'mailbox-rentals',
          pubDate: '2026-01-05',
          lastModified: null,
          content: 'Sample content 2',
        },
      ];

      const result = articleSection(mockArticles);

      expect(result).toContain('## Articles');
      expect(result).toContain('### mailbox-rentals');
      expect(result).toContain('### pack-ship');
      expect(result).toContain(
        '- [UPS Shipping Guide](https://mailboxplusohio.com/articles/ups-shipping-guide/): A comprehensive guide to UPS shipping.'
      );
      expect(result).toContain('Published 2026-02-10, updated 2026-02-15.');
      expect(result).toContain(
        '- [Mailbox Benefits](https://mailboxplusohio.com/articles/mailbox-benefits/): Why rent a mailbox?'
      );
      expect(result).toContain('Published 2026-01-05.');
    });
  });

  describe('fullSection', () => {
    it('formats full text entries for each article sorted by slug', () => {
      const mockArticles: ArticleItem[] = [
        {
          slug: 'b-article',
          title: 'Article B',
          description: 'Desc B',
          category: 'general',
          pubDate: '2026-03-01',
          lastModified: null,
          content: 'Content B',
        },
        {
          slug: 'a-article',
          title: 'Article A',
          description: 'Desc A',
          category: 'general',
          pubDate: '2026-02-01',
          lastModified: '2026-02-05',
          content: 'Content A',
        },
      ];

      const result = fullSection(mockArticles);

      expect(result).toContain('## Articles (Full Text)');
      expect(result.indexOf('Article A')).toBeLessThan(result.indexOf('Article B'));
      expect(result).toContain('URL: https://mailboxplusohio.com/articles/a-article/');
      expect(result).toContain('Category: general');
      expect(result).toContain('Published: 2026-02-01 | Updated: 2026-02-05');
      expect(result).toContain('Content A');
    });
  });

  describe('spliceSection', () => {
    it('replaces an existing section starting from headerRegex without altering prior content', () => {
      const existing = `# Mailbox Plus AI Docs\n\nSome introductory preamble.\n\n## Articles\n\nOld articles content here.`;
      const newSection = `## Articles\n\nUpdated articles list.`;

      const result = spliceSection(existing, /## Articles/, newSection);

      expect(result).toBe(
        `# Mailbox Plus AI Docs\n\nSome introductory preamble.\n\n## Articles\n\nUpdated articles list.\n`
      );
    });

    it('appends new section if headerRegex is not matched in existing content', () => {
      const existing = `# Mailbox Plus AI Docs\n\nSome introductory preamble.`;
      const newSection = `## Articles\n\nAppended articles section.`;

      const result = spliceSection(existing, /## Articles/, newSection);

      expect(result).toBe(
        `# Mailbox Plus AI Docs\n\nSome introductory preamble.\n\n## Articles\n\nAppended articles section.\n`
      );
    });
  });
});
