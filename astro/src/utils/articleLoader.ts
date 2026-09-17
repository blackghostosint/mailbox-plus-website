import type { Article, ArticleFrontmatter } from '../types/article.types';
import matter from 'gray-matter';
import { articleFrontmatterSchema } from '../../../scripts/lib/article-schema';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/**
 * Parses article frontmatter using articleFrontmatterSchema.
 * If validation fails due to missing or sparse fields (e.g. drafts or unit test mocks),
 * fills in safe lenient default values and logs a non-fatal warning in development.
 */
export function parseArticleFrontmatter(
  rawData: unknown,
  filePath?: string,
  isDev = false
): ArticleFrontmatter {
  const parseResult = articleFrontmatterSchema.passthrough().safeParse(rawData);
  if (parseResult.success) {
    return parseResult.data;
  }

  const data = rawData && typeof rawData === 'object' ? (rawData as Record<string, unknown>) : {};

  if (isDev) {
    const issueList = parseResult.error.issues
      .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
      .join('; ');
    const label = filePath ? `'${filePath}'` : 'article';
    console.warn(
      `[articleLoader] Frontmatter validation warning for ${label}: ${issueList}. Applying lenient defaults.`
    );
  }

  const fallbackData: Record<string, unknown> = {
    ...data,
  };

  if (!(typeof data.title === 'string' && data.title.trim()))
    fallbackData.title = 'Untitled Article';
  if (!(typeof data.description === 'string' && data.description.trim()))
    fallbackData.description = 'No description provided.';
  if (!(typeof data.slug === 'string' && data.slug.trim())) fallbackData.slug = 'untitled-article';
  if (!(typeof data.category === 'string' && data.category.trim()))
    fallbackData.category = 'general';
  if (!(typeof data.intentKey === 'string' && data.intentKey.trim())) {
    fallbackData.intentKey =
      typeof data.slug === 'string' && data.slug.trim() ? data.slug : 'general';
  }
  if (
    !((typeof data.pubDate === 'string' && data.pubDate.trim()) || data.pubDate instanceof Date)
  ) {
    let mtimeIso = '';
    if (filePath) {
      try {
        const baseDir =
          typeof import.meta !== 'undefined' && import.meta.dirname
            ? import.meta.dirname
            : process.cwd();
        const absolutePath = path.resolve(baseDir, filePath);
        if (fs.existsSync(absolutePath)) {
          mtimeIso = fs.statSync(absolutePath).mtime.toISOString();
        } else {
          const rootPath = path.resolve(process.cwd(), filePath.replace(/^(\.\.\/)+/, ''));
          if (fs.existsSync(rootPath)) {
            mtimeIso = fs.statSync(rootPath).mtime.toISOString();
          }
        }
      } catch {
        // Ignore fs errors in virtual module environments
      }
    }
    fallbackData.pubDate = mtimeIso;
  }
  if (!(typeof data.status === 'string' && data.status.trim())) fallbackData.status = 'published';
  if (!(typeof data.image === 'string' && data.image.trim())) fallbackData.image = '';
  if (!(typeof data.imageAlt === 'string' && data.imageAlt.trim())) fallbackData.imageAlt = '';
  if (!(Array.isArray(data.keywords) && data.keywords.length > 0))
    fallbackData.keywords = ['article'];
  if (!Array.isArray(data.relatedServices)) fallbackData.relatedServices = [];
  if (!(typeof data.author === 'string' && data.author.trim()))
    fallbackData.author = 'Mailbox Plus';

  const secondaryParse = articleFrontmatterSchema.passthrough().safeParse(fallbackData);
  if (secondaryParse.success) {
    return secondaryParse.data;
  }

  return fallbackData as unknown as ArticleFrontmatter;
}

// Use dynamic imports to keep article content out of the main bundle
const articleModules = import.meta.glob('../../../content/articles/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: false,
});

// Filter out README.md files
const articlePaths = Object.keys(articleModules).filter((key) => !key.includes('README.md'));

// ── Module-level cache ──────────────────────────────────────────────
let articlesPromise: Promise<Article[]> | null = null;

/**
 * Clear the article cache so the next call re-fetches from disk.
 * Useful when articles are added or modified during a session.
 */
export function invalidateArticleCache(): void {
  articlesPromise = null;
}

async function loadAllArticles(): Promise<Article[]> {
  const isDev = import.meta.env.DEV;
  const isDeployPreview =
    import.meta.env.VITE_NETLIFY_CONTEXT === 'deploy-preview' ||
    import.meta.env.VITE_NETLIFY_CONTEXT === 'branch-deploy';
  const showDrafts = isDev || isDeployPreview;

  // Load all articles in parallel
  const results = await Promise.allSettled(
    articlePaths.map(async (path) => {
      const rawContent = (await articleModules[path]()) as string;
      const { data, content } = matter(rawContent);
      const frontmatter = parseArticleFrontmatter(data, path, isDev);
      return { frontmatter, content };
    })
  );

  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      const article = result.value;
      // Skip drafts in production
      if (article.frontmatter.status === 'draft' && !showDrafts) {
        continue;
      }
      articles.push(article);
    } else {
      console.error('Error loading article:', result.reason);
    }
  }

  // Sort by publication date (newest first)
  return articles.sort(
    (a, b) => new Date(b.frontmatter.pubDate).getTime() - new Date(a.frontmatter.pubDate).getTime()
  );
}

export const articleLoader = {
  getAllArticles: async (): Promise<Article[]> => {
    if (!articlesPromise) {
      articlesPromise = loadAllArticles();
    }
    return articlesPromise;
  },

  getArticleBySlug: async (slug: string): Promise<Article | null> => {
    // Reuse the cached/all-loaded list instead of scanning files sequentially
    const allArticles = await articleLoader.getAllArticles();
    return allArticles.find((a) => a.frontmatter.slug === slug) ?? null;
  },

  getRelatedArticles: async (
    category: string,
    currentSlug: string,
    limit = 3
  ): Promise<Article[]> => {
    // Reuses the cache via getAllArticles
    const allArticles = await articleLoader.getAllArticles();
    return allArticles
      .filter((a) => a.frontmatter.category === category && a.frontmatter.slug !== currentSlug)
      .slice(0, limit);
  },
};
