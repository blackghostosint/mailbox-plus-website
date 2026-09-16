import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { articleLoader, invalidateArticleCache } from './articleLoader';
import matter from 'gray-matter';

vi.mock('gray-matter', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const matterFn = typeof actual === 'function' ? actual : actual.default;
  return {
    ...actual,
    default: vi.fn((raw: string) => matterFn(raw)),
  };
});

describe('articleLoader', () => {
  beforeEach(() => {
    invalidateArticleCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    invalidateArticleCache();
  });

  describe('getAllArticles', () => {
    it('loads all published articles from markdown files', async () => {
      const articles = await articleLoader.getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);

      const firstArticle = articles[0];
      expect(firstArticle).toHaveProperty('frontmatter');
      expect(firstArticle).toHaveProperty('content');
      expect(firstArticle.frontmatter).toHaveProperty('title');
      expect(firstArticle.frontmatter).toHaveProperty('slug');
      expect(firstArticle.frontmatter).toHaveProperty('pubDate');
    });

    it('sorts articles in reverse chronological order (newest first)', async () => {
      const articles = await articleLoader.getAllArticles();
      expect(articles.length).toBeGreaterThan(1);

      for (let i = 0; i < articles.length - 1; i++) {
        const currentDate = new Date(articles[i].frontmatter.pubDate).getTime();
        const nextDate = new Date(articles[i + 1].frontmatter.pubDate).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });

  describe('getArticleBySlug', () => {
    it('returns article when matching slug exists', async () => {
      const allArticles = await articleLoader.getAllArticles();
      const targetArticle = allArticles[0];
      const targetSlug = targetArticle.frontmatter.slug;

      const foundArticle = await articleLoader.getArticleBySlug(targetSlug);
      expect(foundArticle).not.toBeNull();
      expect(foundArticle?.frontmatter.slug).toBe(targetSlug);
      expect(foundArticle?.frontmatter.title).toBe(targetArticle.frontmatter.title);
    });

    it('returns null when slug does not exist', async () => {
      const result = await articleLoader.getArticleBySlug('non-existent-article-slug-xyz');
      expect(result).toBeNull();
    });
  });

  describe('getRelatedArticles', () => {
    it('returns articles in the same category excluding the current article slug', async () => {
      const allArticles = await articleLoader.getAllArticles();
      const target = allArticles.find((a) => a.frontmatter.category);
      expect(target).toBeDefined();

      const category = target!.frontmatter.category;
      const currentSlug = target!.frontmatter.slug;

      const related = await articleLoader.getRelatedArticles(category, currentSlug, 3);
      expect(Array.isArray(related)).toBe(true);

      for (const article of related) {
        expect(article.frontmatter.category).toBe(category);
        expect(article.frontmatter.slug).not.toBe(currentSlug);
      }
    });

    it('respects the limit parameter', async () => {
      const allArticles = await articleLoader.getAllArticles();
      const target = allArticles.find((a) => a.frontmatter.category);
      if (target) {
        const category = target.frontmatter.category;
        const currentSlug = target.frontmatter.slug;

        const relatedLimit1 = await articleLoader.getRelatedArticles(category, currentSlug, 1);
        expect(relatedLimit1.length).toBeLessThanOrEqual(1);
      }
    });

    it('returns empty array if no related articles exist', async () => {
      const related = await articleLoader.getRelatedArticles(
        'non-existent-category-abc',
        'some-slug',
        3
      );
      expect(related).toEqual([]);
    });
  });

  describe('invalidateArticleCache', () => {
    it('resets module cache so subsequent calls re-trigger loading', async () => {
      const list1 = await articleLoader.getAllArticles();
      const list2 = await articleLoader.getAllArticles();
      expect(list1).toBe(list2); // Same cached array reference

      invalidateArticleCache();

      const list3 = await articleLoader.getAllArticles();
      expect(list3).not.toBe(list1); // Freshly loaded array reference after cache invalidation
    });
  });

  describe('draft article filtering', () => {
    it('filters out draft articles when showDrafts is false (production mode)', async () => {
      vi.stubEnv('DEV', false);
      vi.stubEnv('VITE_NETLIFY_CONTEXT', '');

      let callCount = 0;
      vi.mocked(matter).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            data: {
              title: 'Draft Article',
              slug: 'draft-article-test',
              pubDate: '2026-09-01',
              category: 'pack-ship',
              status: 'draft',
            },
            content: 'Draft body',
          } as any;
        }
        return {
          data: {
            title: `Published Article ${callCount}`,
            slug: `published-article-${callCount}`,
            pubDate: '2026-08-01',
            category: 'pack-ship',
            status: 'published',
          },
          content: 'Published body',
        } as any;
      }) as any);

      invalidateArticleCache();
      const articles = await articleLoader.getAllArticles();

      const draftArticle = articles.find((a) => a.frontmatter.slug === 'draft-article-test');
      expect(draftArticle).toBeUndefined();
    });

    it('includes draft articles when DEV is true (development mode)', async () => {
      vi.stubEnv('DEV', true);
      vi.stubEnv('VITE_NETLIFY_CONTEXT', '');

      let callCount = 0;
      vi.mocked(matter).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            data: {
              title: 'Draft Article',
              slug: 'draft-article-test',
              pubDate: '2026-09-01',
              category: 'pack-ship',
              status: 'draft',
            },
            content: 'Draft body',
          } as any;
        }
        return {
          data: {
            title: `Published Article ${callCount}`,
            slug: `published-article-${callCount}`,
            pubDate: '2026-08-01',
            category: 'pack-ship',
            status: 'published',
          },
          content: 'Published body',
        } as any;
      }) as any);

      invalidateArticleCache();
      const articles = await articleLoader.getAllArticles();

      const draftArticle = articles.find((a) => a.frontmatter.slug === 'draft-article-test');
      expect(draftArticle).toBeDefined();
      expect(draftArticle?.frontmatter.status).toBe('draft');
    });

    it('includes draft articles in deploy-preview context', async () => {
      vi.stubEnv('DEV', false);
      vi.stubEnv('VITE_NETLIFY_CONTEXT', 'deploy-preview');

      let callCount = 0;
      vi.mocked(matter).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            data: {
              title: 'Draft Article',
              slug: 'draft-article-test',
              pubDate: '2026-09-01',
              category: 'pack-ship',
              status: 'draft',
            },
            content: 'Draft body',
          } as any;
        }
        return {
          data: {
            title: `Published Article ${callCount}`,
            slug: `published-article-${callCount}`,
            pubDate: '2026-08-01',
            category: 'pack-ship',
            status: 'published',
          },
          content: 'Published body',
        } as any;
      }) as any);

      invalidateArticleCache();
      const articles = await articleLoader.getAllArticles();

      const draftArticle = articles.find((a) => a.frontmatter.slug === 'draft-article-test');
      expect(draftArticle).toBeDefined();
      expect(draftArticle?.frontmatter.status).toBe('draft');
    });

    it('includes draft articles in branch-deploy context', async () => {
      vi.stubEnv('DEV', false);
      vi.stubEnv('VITE_NETLIFY_CONTEXT', 'branch-deploy');

      let callCount = 0;
      vi.mocked(matter).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            data: {
              title: 'Draft Article',
              slug: 'draft-article-test',
              pubDate: '2026-09-01',
              category: 'pack-ship',
              status: 'draft',
            },
            content: 'Draft body',
          } as any;
        }
        return {
          data: {
            title: `Published Article ${callCount}`,
            slug: `published-article-${callCount}`,
            pubDate: '2026-08-01',
            category: 'pack-ship',
            status: 'published',
          },
          content: 'Published body',
        } as any;
      }) as any);

      invalidateArticleCache();
      const articles = await articleLoader.getAllArticles();

      const draftArticle = articles.find((a) => a.frontmatter.slug === 'draft-article-test');
      expect(draftArticle).toBeDefined();
      expect(draftArticle?.frontmatter.status).toBe('draft');
    });
  });
});
