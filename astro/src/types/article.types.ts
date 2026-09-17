import type { ArticleFrontmatter } from '../../../scripts/lib/article-schema';

export type { ArticleFrontmatter };

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  htmlContent?: string; // For pre-rendered HTML if needed
}

export interface ArticleSummary {
  title: string;
  description: string;
  slug: string;
  category: string;
  pubDate: string;
  image: string;
  imageAlt: string;
}
