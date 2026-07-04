import { Article, ArticleFrontmatter } from '../types/article.types';

// Use dynamic imports to keep article content out of the main bundle
const articleModules = import.meta.glob('../content/articles/**/*.md', {
  as: 'raw',
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

/**
 * Lightweight frontmatter parser to avoid loading gray-matter
 *
 * Supports:
 * - Simple key: value pairs
 * - String values with or without quotes
 * - Inline arrays [val1, val2]
 * - YAML block lists (- item)
 */
function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yaml = match[1];
  const content = match[2];
  const data: Record<string, string | string[]> = {};

  const lines = yaml.split('\n');
  let currentKey: string | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check for block list item "- value"
    if (trimmed.startsWith('-') && currentKey) {
      const val = trimmed
        .substring(1)
        .trim()
        .replace(/^['"](.*)['"]$/, '$1');
      let list = data[currentKey];
      if (!Array.isArray(list)) {
        list = [];
        data[currentKey] = list;
      }
      list.push(val);
      return;
    }

    if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      currentKey = key;

      if (!value) {
        // Potential start of a block list
        return;
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        // Handle inline array [a, b, c]
        const vals = value
          .substring(1, value.length - 1)
          .split(',')
          .map((v) => v.trim().replace(/^['"](.*)['"]$/, '$1'));
        data[key] = vals;
      } else {
        // Strip quotes if present
        value = value.replace(/^['"](.*)['"]$/, '$1');
        data[key] = value;
      }
    }
  });

  return { data, content };
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
      const { data, content } = parseFrontmatter(rawContent);
      const frontmatter = data as unknown as ArticleFrontmatter;
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
