import matter from 'gray-matter';
import type { Article, ArticleFrontmatter } from '../types/article.types';

// Since valid filesystem access isn't available in the browser during runtime,
// we need to import all markdown files via Vite's glob import.
// This creates a map of paths to module loaders.
// Exclude README.md files from the glob pattern
const articleModules = import.meta.glob('../../content/articles/**/*.md', {
    as: 'raw',
    eager: true
});

// Filter out README.md files
const filteredModules = Object.keys(articleModules).reduce((acc, key) => {
    if (!key.includes('README.md')) {
        acc[key] = articleModules[key];
    }
    return acc;
}, {} as Record<string, string>);

export const articleLoader = {
    getAllArticles: async (): Promise<Article[]> => {
        const articles: Article[] = [];

        for (const path in filteredModules) {
            const rawContent = filteredModules[path] as string;
            try {
                const { data, content } = matter(rawContent);
                // Ensure required fields are present or provide defaults to avoid crashes
                // Type assertion is safe here if we trust the validation script
                const frontmatter = data as ArticleFrontmatter;

                articles.push({ frontmatter, content });
            } catch (err) {
                console.error(`Error parsing article at ${path}:`, err);
            }
        }

        // Sort by publication date (newest first)
        return articles.sort((a, b) =>
            new Date(b.frontmatter.pubDate).getTime() - new Date(a.frontmatter.pubDate).getTime()
        );
    },

    getArticleBySlug: async (slug: string): Promise<Article | null> => {
        // Find the file that matches the slug in its frontmatter or filename
        // Since we can't efficiently query by frontmatter without loading, we load all.
        // Optimization: In a real app with 5000+ files, this should be done at build time
        // to generate a JSON index. For now, we scan.

        for (const path in filteredModules) {
            const rawContent = filteredModules[path] as string;
            try {
                const { data, content } = matter(rawContent);
                if (data.slug === slug) {
                    return { frontmatter: data as ArticleFrontmatter, content };
                }
            } catch (err) {
                console.error(`Error parsing article at ${path}:`, err);
            }
        }

        return null;
    },

    getRelatedArticles: async (category: string, currentSlug: string, limit = 3): Promise<Article[]> => {
        const allArticles = await articleLoader.getAllArticles();
        return allArticles
            .filter(a => a.frontmatter.category === category && a.frontmatter.slug !== currentSlug)
            .slice(0, limit);
    }
};
