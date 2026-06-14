import { Article, ArticleFrontmatter } from '../types/article.types';

// Use dynamic imports to keep article content out of the main bundle
const articleModules = import.meta.glob('../../content/articles/**/*.md', {
  as: 'raw',
  eager: false,
});

// Filter out README.md files
const articlePaths = Object.keys(articleModules).filter((key) => !key.includes('README.md'));

/**
 * Lightweight frontmatter parser to avoid loading gray-matter
 *
 * Supports:
 * - Simple key: value pairs
 * - String values with or without quotes
 * - Inline arrays [val1, val2]
 * - YAML block lists (- item)
 */
function parseFrontmatter(raw: string): { data: any; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yaml = match[1];
  const content = match[2];
  const data: any = {};

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
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(val);
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

export const articleLoader = {
  getAllArticles: async (): Promise<Article[]> => {
    const articlePromises = articlePaths.map(async (path) => {
      try {
        const rawContent = (await articleModules[path]()) as string;
        const { data, content } = parseFrontmatter(rawContent);
        const frontmatter = data as ArticleFrontmatter;
        return { frontmatter, content };
      } catch (err) {
        console.error(`Error loading article at ${path}:`, err);
        return null;
      }
    });

    const results = await Promise.all(articlePromises);
    const articles = results.filter((a): a is Article => a !== null);

    // Sort by publication date (newest first)
    return articles.sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).getTime() - new Date(a.frontmatter.pubDate).getTime()
    );
  },

  getArticleBySlug: async (slug: string): Promise<Article | null> => {
    const articlePromises = articlePaths.map(async (path) => {
      try {
        const rawContent = (await articleModules[path]()) as string;
        const { data, content } = parseFrontmatter(rawContent);
        if (data.slug === slug) {
          return { frontmatter: data as ArticleFrontmatter, content };
        }
        return null;
      } catch (err) {
        console.error(`Error loading article at ${path}:`, err);
        return null;
      }
    });

    const results = await Promise.all(articlePromises);
    return results.find((a) => a !== null) || null;
  },

  getRelatedArticles: async (
    category: string,
    currentSlug: string,
    limit = 3
  ): Promise<Article[]> => {
    const allArticles = await articleLoader.getAllArticles();
    return allArticles
      .filter((a) => a.frontmatter.category === category && a.frontmatter.slug !== currentSlug)
      .slice(0, limit);
  },
};
