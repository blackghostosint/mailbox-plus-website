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

const errors: string[] = [];
const intentKeys = new Map<string, string>();
let linkCount = 0;
let articleCount = 0;

console.log(`🔍 Scanning articles in ${CONTENT_DIR}...`);

if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
  process.exit(1);
}

const registry = initRouteRegistry(PAGES_DIR, CONTENT_DIR);
console.log(
  `ℹ️ Valid routes derived from filesystem (${registry.validRoutes.size} exact + ${registry.dynamicPrefixes.length} dynamic prefixes)`
);

const mdFiles = walkMdFiles(CONTENT_DIR);

for (const filePath of mdFiles) {
  articleCount++;
  const baseName = path.basename(filePath);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

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

if (errors.length > 0) {
  console.error('\nFound validation errors:');
  errors.forEach((e) => console.error(e));
  console.log(`\n🔗 Validated ${linkCount} internal links across ${articleCount} articles.`);
  process.exit(1);
} else {
  console.log('\n✅ All articles validated successfully!');
  console.log(`🔗 Validated ${linkCount} internal links across ${articleCount} articles.`);
}
