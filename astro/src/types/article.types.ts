export interface ArticleFrontmatter {
  title: string;
  description: string;
  slug: string;
  category: string;
  intentKey: string;
  pubDate: string;
  image: string;
  imageAlt: string;
  location?: string;
  keywords?: string[];
  relatedServices?: string[];
  author?: string;
  lastModified?: string;
  status?: 'draft' | 'published';
}

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
