import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import {
  articleFrontmatterSchema,
  validateArticleFrontmatter,
  type ArticleFrontmatter,
} from './article-schema.ts';

export type GrayMatterFn = (
  input: string | Buffer,
  options?: Record<string, any>
) => {
  data: Record<string, any>;
  content: string;
  excerpt?: string;
  orig?: Buffer | string;
  language?: string;
  matter?: string;
};

let cachedMatter: GrayMatterFn | null = null;

/**
 * Resiliently resolves and loads the `gray-matter` module.
 * Tries standard specifier, relative candidate paths, and provides
 * user-friendly error details if unavailable.
 */
export function getGrayMatter(): GrayMatterFn {
  if (cachedMatter) return cachedMatter;

  const errors: string[] = [];

  // Attempt 1: Standard module specifier resolution
  try {
    const req = createRequire(import.meta.url);
    const mod = req('gray-matter');
    const fn = (
      mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod
    ) as GrayMatterFn;
    if (typeof fn === 'function') {
      cachedMatter = fn;
      return cachedMatter;
    }
  } catch (e: any) {
    errors.push(`Standard specifier 'gray-matter': ${e?.message || e}`);
  }

  // Attempt 2: Relative module resolution paths
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidatePaths = [
    path.resolve(process.cwd(), 'node_modules', 'gray-matter'),
    path.resolve(process.cwd(), 'astro', 'node_modules', 'gray-matter'),
    path.resolve(currentDir, '..', '..', 'node_modules', 'gray-matter'),
    path.resolve(currentDir, '..', '..', 'astro', 'node_modules', 'gray-matter'),
  ];

  const req = createRequire(import.meta.url);
  for (const candidate of candidatePaths) {
    try {
      if (fs.existsSync(candidate)) {
        const mod = req(candidate);
        const fn = (
          mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod
        ) as GrayMatterFn;
        if (typeof fn === 'function') {
          cachedMatter = fn;
          return cachedMatter;
        }
      }
    } catch (e: any) {
      errors.push(`Candidate path '${candidate}': ${e?.message || e}`);
    }
  }

  throw new Error(
    `[ERR_MODULE_NOT_FOUND] Failed to load 'gray-matter' using resilient module resolution.\n` +
      `Please ensure 'gray-matter' is installed in dependencies (npm install gray-matter).\n` +
      `Resolution attempts log:\n  - ${errors.join('\n  - ')}`
  );
}

/**
 * Helper function that parses frontmatter using resiliently resolved `gray-matter`.
 */
export function matter(input: string | Buffer, options?: Record<string, any>) {
  return getGrayMatter()(input, options);
}

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
  links: string[];
}

export interface LoadArticlesOptions {
  filterPublished?: boolean;
  rootDir?: string;
  registry?: RouteRegistry;
  seenIntentKeys?: Map<string, any> | Set<string>;
  validate?: boolean;
  strict?: boolean;
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

export function matchWildcardSegment(text: string, pattern: string): boolean {
  if (pattern === '*') return true;
  const parts = pattern.split('*');
  if (parts.length === 1) return text === pattern;

  if (!text.startsWith(parts[0])) return false;
  if (!text.endsWith(parts[parts.length - 1])) return false;

  let pos = parts[0].length;
  for (let i = 1; i < parts.length - 1; i++) {
    const part = parts[i];
    if (part === '') continue;
    const found = text.indexOf(part, pos);
    if (found === -1) return false;
    pos = found + part.length;
  }
  return pos <= text.length - parts[parts.length - 1].length;
}

export function matchPathSegments(fileSegs: string[], patSegs: string[]): boolean {
  let fIndex = 0;
  let pIndex = 0;

  while (pIndex < patSegs.length && fIndex < fileSegs.length) {
    const p = patSegs[pIndex];
    if (p === '**') {
      if (pIndex === patSegs.length - 1) return true;
      for (let i = fIndex; i <= fileSegs.length; i++) {
        if (matchPathSegments(fileSegs.slice(i), patSegs.slice(pIndex + 1))) {
          return true;
        }
      }
      return false;
    }

    if (!matchWildcardSegment(fileSegs[fIndex], p)) {
      return false;
    }

    fIndex++;
    pIndex++;
  }

  while (pIndex < patSegs.length && patSegs[pIndex] === '**') {
    pIndex++;
  }

  return fIndex === fileSegs.length && pIndex === patSegs.length;
}

export function globMatch(filePath: string, pattern: string): boolean {
  const fileSegs = filePath
    .replace(/\\/g, '/')
    .split('/')
    .filter((s) => s && s !== '.');
  const patSegs = pattern
    .replace(/\\/g, '/')
    .split('/')
    .filter((s) => s && s !== '.');
  return matchPathSegments(fileSegs, patSegs);
}

export function resolveFiles(target: string): string[] {
  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    return [target];
  }

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    return walkMdFiles(target);
  }

  if (target.includes('*')) {
    const baseDir = target.split('*')[0] || '.';
    const searchDir = fs.existsSync(baseDir)
      ? fs.statSync(baseDir).isDirectory()
        ? baseDir
        : path.dirname(baseDir)
      : '.';
    const allMd = walkMdFiles(searchDir);

    return allMd.filter((f) => globMatch(f, target));
  }

  return [];
}

/**
 * Loads and parses articles from contentDir or target path.
 */
export function loadArticles(dirOrFilePath: string, options?: LoadArticlesOptions): Article[] {
  const mdFiles = resolveFiles(dirOrFilePath);
  const articles: Article[] = [];
  const root =
    options?.rootDir ||
    (fs.existsSync(dirOrFilePath) && fs.statSync(dirOrFilePath).isFile()
      ? path.resolve(path.dirname(dirOrFilePath), '..', '..')
      : path.resolve(dirOrFilePath, '..', '..'));

  for (const filePath of mdFiles) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const validation = validateArticleFrontmatter(data, path.basename(filePath), {
      registry: options?.registry,
      intentKeys: options?.seenIntentKeys,
    });

    if (!validation.success) {
      if (options?.strict) {
        throw new Error(
          `[loadArticles] Validation error in '${path.relative(root, filePath)}':\n  ${validation.errors.join('\n  ')}`
        );
      } else {
        console.warn(
          `[loadArticles] Warning: Skipping '${path.relative(root, filePath)}' due to invalid frontmatter:\n  ${validation.errors.join('\n  ')}`
        );
        continue;
      }
    }

    const fm = validation.data;
    if (options?.filterPublished && (fm.status === 'draft' || fm.status === 'draft-noindex')) {
      continue;
    }

    const links = extractInternalHrefs(content);

    articles.push({
      filePath,
      relPath: path.relative(root, filePath),
      frontmatter: fm,
      content,
      raw,
      links,
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
