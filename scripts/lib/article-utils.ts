import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  articleFrontmatterSchema,
  validateArticleFrontmatter,
  type ArticleFrontmatter,
} from './article-schema.ts';

export interface DynamicPrefix {
  prefix: string;
  catchAll: boolean;
}

export interface RouteRegistry {
  validRoutes: Set<string>;
  dynamicPrefixes: DynamicPrefix[];
  intentKeyMap: Map<string, string[]>;
}

export interface Article {
  filePath: string;
  relPath: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  raw: string;
}

/**
 * Recursively walks a directory and invokes callback for each file found.
 */
export function walkDir(dir: string, callback: (filePath: string) => void): void {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

/**
 * Recursively walks a directory and returns paths of all markdown files,
 * ignoring README.md files (case-insensitive).
 */
export function walkMdFiles(dir: string): string[] {
  const mdFiles: string[] = [];
  walkDir(dir, (filePath) => {
    if (path.extname(filePath) === '.md' && path.basename(filePath).toLowerCase() !== 'readme.md') {
      mdFiles.push(filePath);
    }
  });
  return mdFiles;
}

/**
 * Initializes and derives the route registry from Astro page templates,
 * siteStructure.json, route-registry-allowlist.json, and article frontmatter slugs.
 */
export function initRouteRegistry(
  pagesDir: string,
  contentDir: string,
  options?: { siteStructurePath?: string; allowlistPath?: string }
): RouteRegistry {
  const validRoutes = new Set<string>();
  const dynamicPrefixes: DynamicPrefix[] = [];
  const intentKeyMap = new Map<string, string[]>();

  // 1) Astro page templates under pagesDir
  walkDir(pagesDir, (filePath) => {
    if (path.extname(filePath) !== '.astro') return;
    const rel = path
      .relative(pagesDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.astro$/, '');
    const segments = rel.split('/');
    const dynamicIdx = segments.findIndex((s) => s.startsWith('[') && s.endsWith(']'));
    if (dynamicIdx !== -1) {
      const prefix = '/' + segments.slice(0, dynamicIdx).join('/').replace(/\/$/, '');
      dynamicPrefixes.push({
        prefix: prefix === '' ? '/' : prefix,
        catchAll: segments[dynamicIdx].startsWith('[...'),
      });
      return;
    }
    let route = rel.replace(/\.astro$/, '');
    if (route.endsWith('/index')) route = route.slice(0, -6);
    validRoutes.add('/' + route);
  });

  // 1b) Routes from siteStructure.json
  const siteStructurePath =
    options?.siteStructurePath || path.resolve(pagesDir, '../data/siteStructure.json');
  if (fs.existsSync(siteStructurePath)) {
    try {
      const siteStruct = JSON.parse(fs.readFileSync(siteStructurePath, 'utf8'));
      const addUrl = (url: string | undefined) => {
        if (!url) return;
        const norm = normalizeRoute(url);
        if (norm) validRoutes.add(norm);
      };
      if (siteStruct.homepage?.url) addUrl(siteStruct.homepage.url);
      if (Array.isArray(siteStruct.pillars)) {
        for (const p of siteStruct.pillars) {
          addUrl(p.url);
          if (Array.isArray(p.children)) {
            for (const c of p.children) addUrl(c.url);
          }
        }
      }
      if (Array.isArray(siteStruct.subSupporting)) {
        for (const s of siteStruct.subSupporting) addUrl(s.url);
      }
      if (Array.isArray(siteStruct['seo-landing'])) {
        for (const l of siteStruct['seo-landing']) addUrl(l.url);
      }
    } catch (e) {
      // Ignore reading/parsing error
    }
  }

  // 1c) Routes from route-registry-allowlist.json
  const allowlistPath =
    options?.allowlistPath ||
    path.resolve(pagesDir, '../../../scripts/seo/route-registry-allowlist.json');
  if (fs.existsSync(allowlistPath)) {
    try {
      const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
      if (Array.isArray(allowlist.allowed_exact)) {
        for (const url of allowlist.allowed_exact) {
          const norm = normalizeRoute(url);
          if (norm) validRoutes.add(norm);
        }
      }
    } catch (e) {
      // Ignore reading/parsing error
    }
  }

  // 2) Article routes and intentKeys under contentDir
  if (fs.existsSync(contentDir)) {
    const mdFiles = walkMdFiles(contentDir);
    for (const filePath of mdFiles) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(raw);
        if (parsed.data.slug) {
          validRoutes.add('/articles/' + parsed.data.slug);
        }
        if (parsed.data.intentKey) {
          const ik = String(parsed.data.intentKey);
          const rel = path.relative(path.resolve(contentDir, '..', '..'), filePath);
          if (!intentKeyMap.has(ik)) {
            intentKeyMap.set(ik, []);
          }
          intentKeyMap.get(ik)!.push(rel);
        }
      } catch (e) {
        // Parsing errors are reported during full article validation
      }
    }
  }

  return { validRoutes, dynamicPrefixes, intentKeyMap };
}

/**
 * Normalizes a route for comparison: strips query parameters, hash fragments,
 * and trailing slashes (except root '/').
 */
export function normalizeRoute(p: string): string {
  if (!p) return p;
  let clean = p.trim().split('?')[0].split('#')[0];
  if (!clean.startsWith('/')) clean = '/' + clean;
  return clean.length > 1 ? clean.replace(/\/+$/, '') : clean;
}

/**
 * Checks if target route matches any exact valid route or dynamic route prefix.
 */
export function isKnownRoute(target: string, registry: RouteRegistry): boolean {
  const norm = normalizeRoute(target);
  if (registry.validRoutes.has(norm)) return true;

  for (const { prefix, catchAll } of registry.dynamicPrefixes) {
    if (norm === prefix) return true;
    if (prefix === '/' || !norm.startsWith(prefix + '/')) continue;
    const rest = norm.slice(prefix.length + 1);
    if (catchAll || !rest.includes('/')) return true;
  }

  return false;
}

/**
 * Loads and parses articles from contentDir.
 */
export function loadArticles(
  contentDir: string,
  options?: { filterPublished?: boolean; rootDir?: string }
): Article[] {
  const mdFiles = walkMdFiles(contentDir);
  const articles: Article[] = [];
  const root = options?.rootDir || path.resolve(contentDir, '..', '..');

  for (const filePath of mdFiles) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const validation = validateArticleFrontmatter(data, path.basename(filePath));

    if (!validation.success) {
      console.warn(
        `[loadArticles] Warning: Skipping '${path.relative(root, filePath)}' due to invalid frontmatter:\n  ${validation.errors.join('\n  ')}`
      );
      continue;
    }

    const fm = validation.data;
    if (options?.filterPublished && (fm.status === 'draft' || fm.status === 'draft-noindex')) {
      continue;
    }

    articles.push({
      filePath,
      relPath: path.relative(root, filePath),
      frontmatter: fm,
      content,
      raw,
    });
  }

  return articles;
}

/**
 * Extracts internal links starting with '/' from article markdown body and HTML href attributes.
 */
export function extractInternalHrefs(content: string): string[] {
  const hrefs: string[] = [];
  const mdLinkRegex = /\[([^\]]*)\]\((\/[^)\s]*)\)/g;
  let match: RegExpExecArray | null;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    hrefs.push(match[2]);
  }

  const htmlLinkRegex = /<a\s+[^>]*href="(\/[^"]*)"/gi;
  while ((match = htmlLinkRegex.exec(content)) !== null) {
    hrefs.push(match[1]);
  }

  return hrefs;
}
