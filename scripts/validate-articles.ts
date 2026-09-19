#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateArticleFrontmatter } from './lib/article-schema.ts';
import {
  initRouteRegistry,
  isKnownRoute,
  walkMdFiles,
  extractInternalHrefs,
  matter,
} from './lib/article-utils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.resolve(ROOT, 'astro/src/pages');
const CONTENT_DIR = path.resolve(ROOT, 'content/articles');

export interface ArticleValidationInput {
  filePath?: string;
  baseName?: string;
  content: string;
}

export interface ArticleValidationResult {
  success: boolean;
  errors: string[];
  articleCount: number;
  linkCount: number;
}

export interface ValidateArticlesOptions {
  pagesDir?: string;
  contentDir?: string;
  articles?: ArticleValidationInput[];
  registry?: ReturnType<typeof initRouteRegistry>;
}

export function validateArticles(options?: ValidateArticlesOptions): ArticleValidationResult {
  const pagesDir = options?.pagesDir || PAGES_DIR;
  const contentDir = options?.contentDir || CONTENT_DIR;

  const registry = options?.registry || initRouteRegistry(pagesDir, contentDir);
  const errors: string[] = [];
  const intentKeys = new Map<string, string>();
  let linkCount = 0;
  let articleCount = 0;

  let articleInputs: ArticleValidationInput[] = [];

  if (options?.articles) {
    articleInputs = options.articles;
  } else {
    if (!fs.existsSync(contentDir)) {
      return {
        success: false,
        errors: [`❌ Content directory not found: ${contentDir}`],
        articleCount: 0,
        linkCount: 0,
      };
    }
    const mdFiles = walkMdFiles(contentDir);
    articleInputs = mdFiles.map((filePath) => ({
      filePath,
      baseName: path.basename(filePath),
      content: fs.readFileSync(filePath, 'utf8'),
    }));
  }

  for (const article of articleInputs) {
    articleCount++;
    const baseName =
      article.baseName ||
      (article.filePath ? path.basename(article.filePath) : `article-${articleCount}.md`);

    try {
      const { data, content } = matter(article.content);

      // Validate frontmatter schema
      const validation = validateArticleFrontmatter(data, baseName);
      if (!validation.success) {
        errors.push(...validation.errors);
      } else {
        const fm = validation.data;

        // Check intentKey uniqueness
        if (fm.intentKey) {
          if (intentKeys.has(fm.intentKey)) {
            errors.push(
              `❌ ${baseName}: Duplicate intentKey '${fm.intentKey}' (also in ${intentKeys.get(fm.intentKey)})`
            );
          } else {
            intentKeys.set(fm.intentKey, baseName);
          }
        }

        // Validate relatedServices paths
        if (Array.isArray(fm.relatedServices)) {
          for (const servicePath of fm.relatedServices) {
            linkCount++;
            if (!isKnownRoute(servicePath, registry)) {
              errors.push(
                `❌ ${baseName}: relatedServices path '${servicePath}' does not match any known route`
              );
            }
          }
        }
      }

      // Basic content check
      if (!content.trim()) {
        errors.push(`⚠️ ${baseName}: Article content is empty`);
      }

      // Validate internal markdown links in body
      const hrefs = extractInternalHrefs(content);
      for (const linkPath of hrefs) {
        linkCount++;
        if (!isKnownRoute(linkPath, registry)) {
          errors.push(`❌ ${baseName}: Markdown link '${linkPath}' does not match any known route`);
        }
      }
    } catch (err: any) {
      errors.push(`❌ ${baseName}: Parsing error - ${err.message}`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
    articleCount,
    linkCount,
  };
}

export function runValidateArticlesCLI(): void {
  console.log(`🔍 Scanning articles in ${CONTENT_DIR}...`);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const result = validateArticles();

  if (result.errors.length > 0) {
    console.error('\nFound validation errors:');
    result.errors.forEach((e) => console.error(e));
    console.log(
      `\n🔗 Validated ${result.linkCount} internal links across ${result.articleCount} articles.`
    );
    process.exit(1);
  } else {
    console.log('\n✅ All articles validated successfully!');
    console.log(
      `🔗 Validated ${result.linkCount} internal links across ${result.articleCount} articles.`
    );
    process.exit(0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runValidateArticlesCLI();
}
