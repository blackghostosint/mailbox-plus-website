import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import {
  getGrayMatter,
  matter,
  walkDir,
  walkMdFiles,
  initRouteRegistry,
  normalizeRoute,
  isKnownRoute,
  loadArticles,
  extractInternalHrefs,
} from '../article-utils.ts';

describe('article-utils module', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'article-utils-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('getGrayMatter and matter', () => {
    it('resiliently loads gray-matter and caches function reference', () => {
      const fn1 = getGrayMatter();
      const fn2 = getGrayMatter();
      expect(typeof fn1).toBe('function');
      expect(fn1).toBe(fn2);
    });

    it('parses markdown frontmatter and content correctly via matter()', () => {
      const raw = `---\ntitle: Test Note\ncategory: General\n---\n# Heading\nBody text content.`;
      const parsed = matter(raw);
      expect(parsed.data).toEqual({
        title: 'Test Note',
        category: 'General',
      });
      expect(parsed.content.trim()).toBe('# Heading\nBody text content.');
    });
  });

  describe('walkDir and walkMdFiles', () => {
    it('walkDir recursively walks a directory structure and calls callback for files', () => {
      const subDir = path.join(tempDir, 'sub1', 'sub2');
      fs.mkdirSync(subDir, { recursive: true });

      const file1 = path.join(tempDir, 'file1.txt');
      const file2 = path.join(subDir, 'file2.md');
      fs.writeFileSync(file1, 'hello');
      fs.writeFileSync(file2, '# title');

      const visited: string[] = [];
      walkDir(tempDir, (filePath) => visited.push(filePath));

      expect(visited.length).toBe(2);
      expect(visited).toContain(file1);
      expect(visited).toContain(file2);
    });

    it('walkDir does not throw when directory does not exist', () => {
      const nonExistent = path.join(tempDir, 'does-not-exist');
      const visited: string[] = [];
      expect(() => walkDir(nonExistent, (p) => visited.push(p))).not.toThrow();
      expect(visited.length).toBe(0);
    });

    it('walkMdFiles returns .md files and ignores README.md (case-insensitive) & non-md files', () => {
      const subDir = path.join(tempDir, 'articles');
      fs.mkdirSync(subDir, { recursive: true });

      const md1 = path.join(subDir, 'guide.md');
      const md2 = path.join(subDir, 'post.md');
      const readme1 = path.join(subDir, 'README.md');
      const readme2 = path.join(tempDir, 'readme.md');
      const txtFile = path.join(subDir, 'notes.txt');

      fs.writeFileSync(md1, 'guide');
      fs.writeFileSync(md2, 'post');
      fs.writeFileSync(readme1, 'readme');
      fs.writeFileSync(readme2, 'readme root');
      fs.writeFileSync(txtFile, 'text');

      const mdFiles = walkMdFiles(tempDir);

      expect(mdFiles).toContain(md1);
      expect(mdFiles).toContain(md2);
      expect(mdFiles).not.toContain(readme1);
      expect(mdFiles).not.toContain(readme2);
      expect(mdFiles).not.toContain(txtFile);
    });

    it('walkMdFiles returns empty array when directory does not exist', () => {
      const mdFiles = walkMdFiles(path.join(tempDir, 'nonexistent'));
      expect(mdFiles).toEqual([]);
    });
  });

  describe('normalizeRoute', () => {
    it('normalizes routes by stripping query strings, hash tags, and trailing slashes', () => {
      expect(normalizeRoute('/services/mailbox/')).toBe('/services/mailbox');
      expect(normalizeRoute('/contact?src=footer#form')).toBe('/contact');
      expect(normalizeRoute('about/us/')).toBe('/about/us');
      expect(normalizeRoute('/')).toBe('/');
    });

    it('returns empty string or falsy value if empty input is passed', () => {
      expect(normalizeRoute('')).toBe('');
      expect(normalizeRoute(null as any)).toBe(null);
    });
  });

  describe('initRouteRegistry and isKnownRoute', () => {
    it('correctly initializes route registry from templates, JSON structures, allowlist, and content', () => {
      const pagesDir = path.join(tempDir, 'astro', 'src', 'pages');
      const contentDir = path.join(tempDir, 'content', 'articles');
      fs.mkdirSync(pagesDir, { recursive: true });
      fs.mkdirSync(contentDir, { recursive: true });

      // Astro templates
      fs.writeFileSync(path.join(pagesDir, 'about.astro'), '');

      const servicesDir = path.join(pagesDir, 'services');
      fs.mkdirSync(servicesDir, { recursive: true });
      fs.writeFileSync(path.join(servicesDir, 'index.astro'), '');

      const blogDir = path.join(pagesDir, 'blog');
      fs.mkdirSync(blogDir, { recursive: true });
      fs.writeFileSync(path.join(blogDir, '[slug].astro'), '');

      const docsDir = path.join(pagesDir, 'docs');
      fs.mkdirSync(docsDir, { recursive: true });
      fs.writeFileSync(path.join(docsDir, '[...slug].astro'), '');

      // siteStructure JSON
      const siteStructurePath = path.join(tempDir, 'siteStructure.json');
      fs.writeFileSync(
        siteStructurePath,
        JSON.stringify({
          homepage: { url: '/home/' },
          pillars: [{ url: '/services/shipping/', children: [{ url: '/services/mailbox/' }] }],
          subSupporting: [{ url: '/faq/' }],
          'seo-landing': [{ url: '/compare/' }],
        })
      );

      // Allowlist JSON
      const allowlistPath = path.join(tempDir, 'allowlist.json');
      fs.writeFileSync(
        allowlistPath,
        JSON.stringify({
          allowed_exact: ['/allowed-page/'],
        })
      );

      // Article content
      const articlePath = path.join(contentDir, 'sample-article.md');
      fs.writeFileSync(
        articlePath,
        `---\ntitle: Sample Article\nslug: sample-article-slug\nintentKey: sample-intent\n---\nArticle content.`
      );

      const registry = initRouteRegistry(pagesDir, contentDir, {
        siteStructurePath,
        allowlistPath,
      });

      expect(registry.validRoutes.has('/about')).toBe(true);
      expect(registry.validRoutes.has('/services')).toBe(true);
      expect(registry.validRoutes.has('/home')).toBe(true);
      expect(registry.validRoutes.has('/services/shipping')).toBe(true);
      expect(registry.validRoutes.has('/services/mailbox')).toBe(true);
      expect(registry.validRoutes.has('/faq')).toBe(true);
      expect(registry.validRoutes.has('/compare')).toBe(true);
      expect(registry.validRoutes.has('/allowed-page')).toBe(true);
      expect(registry.validRoutes.has('/articles/sample-article-slug')).toBe(true);

      expect(registry.intentKeyMap.has('sample-intent')).toBe(true);

      // Test isKnownRoute
      expect(isKnownRoute('/about', registry)).toBe(true);
      expect(isKnownRoute('/about/', registry)).toBe(true);
      expect(isKnownRoute('/blog/first-post', registry)).toBe(true);
      expect(isKnownRoute('/blog/first/second', registry)).toBe(false); // [slug] is single segment
      expect(isKnownRoute('/docs/a/b/c', registry)).toBe(true); // [...slug] catch-all
      expect(isKnownRoute('/non-existent-page', registry)).toBe(false);
    });

    it('gracefully handles missing siteStructure or allowlist files', () => {
      const pagesDir = path.join(tempDir, 'astro', 'src', 'pages');
      const contentDir = path.join(tempDir, 'content', 'articles');
      fs.mkdirSync(pagesDir, { recursive: true });
      fs.mkdirSync(contentDir, { recursive: true });

      const registry = initRouteRegistry(pagesDir, contentDir, {
        siteStructurePath: path.join(tempDir, 'nonexistent-structure.json'),
        allowlistPath: path.join(tempDir, 'nonexistent-allowlist.json'),
      });

      expect(registry.validRoutes instanceof Set).toBe(true);
      expect(registry.dynamicPrefixes).toBeDefined();
    });
  });

  describe('loadArticles', () => {
    it('loads valid articles and skips articles with invalid frontmatter logging warnings', () => {
      const contentDir = path.join(tempDir, 'articles');
      fs.mkdirSync(contentDir, { recursive: true });

      const validArticle1 = `---\ntitle: Valid Title 1\ndescription: Desc 1\nslug: article-one\ncategory: Category 1\nintentKey: intent-1\npubDate: 2026-01-01\nimage: /img1.jpg\nimageAlt: Alt 1\nkeywords: [tag1]\nrelatedServices: []\nauthor: Author 1\nstatus: published\n---\nContent 1`;

      const validArticle2 = `---\ntitle: Valid Title 2\ndescription: Desc 2\nslug: article-two\ncategory: Category 2\nintentKey: intent-2\npubDate: 2026-01-01\nimage: /img2.jpg\nimageAlt: Alt 2\nkeywords: [tag2]\nrelatedServices: []\nauthor: Author 2\nstatus: draft\n---\nContent 2`;

      const invalidArticle = `---\ntitle: Invalid\nslug: INVALID SLUG WITH SPACES\n---\nInvalid content`;

      fs.writeFileSync(path.join(contentDir, 'art1.md'), validArticle1);
      fs.writeFileSync(path.join(contentDir, 'art2.md'), validArticle2);
      fs.writeFileSync(path.join(contentDir, 'art3.md'), invalidArticle);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const articles = loadArticles(contentDir, { rootDir: tempDir });

      expect(articles.length).toBe(2);
      expect(articles.map((a) => a.frontmatter.slug)).toEqual(['article-one', 'article-two']);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[loadArticles] Warning: Skipping')
      );

      warnSpy.mockRestore();
    });

    it('filters out draft and draft-noindex articles when filterPublished option is true', () => {
      const contentDir = path.join(tempDir, 'articles');
      fs.mkdirSync(contentDir, { recursive: true });

      const pubArticle = `---\ntitle: Published\ndescription: Desc\nslug: pub-article\ncategory: Cat\nintentKey: ik1\npubDate: 2026-01-01\nimage: /img.png\nimageAlt: Alt\nkeywords: [k]\nrelatedServices: []\nauthor: Auth\nstatus: published\n---\nPub`;

      const draftArticle = `---\ntitle: Draft\ndescription: Desc\nslug: draft-article\ncategory: Cat\nintentKey: ik2\npubDate: 2026-01-01\nimage: /img.png\nimageAlt: Alt\nkeywords: [k]\nrelatedServices: []\nauthor: Auth\nstatus: draft\n---\nDraft`;

      const draftNoIndex = `---\ntitle: Draft NoIndex\ndescription: Desc\nslug: draft-noindex-article\ncategory: Cat\nintentKey: ik3\npubDate: 2026-01-01\nimage: /img.png\nimageAlt: Alt\nkeywords: [k]\nrelatedServices: []\nauthor: Auth\nstatus: draft-noindex\n---\nDraft Noindex`;

      fs.writeFileSync(path.join(contentDir, 'pub.md'), pubArticle);
      fs.writeFileSync(path.join(contentDir, 'draft.md'), draftArticle);
      fs.writeFileSync(path.join(contentDir, 'draft-noindex.md'), draftNoIndex);

      const publishedOnly = loadArticles(contentDir, { filterPublished: true, rootDir: tempDir });

      expect(publishedOnly.length).toBe(1);
      expect(publishedOnly[0].frontmatter.slug).toBe('pub-article');
    });
  });

  describe('extractInternalHrefs', () => {
    it('extracts markdown internal links and HTML href attributes starting with /', () => {
      const markdown = `
# Article Heading

Check out our [Mailbox Services](/services/mailbox-rentals/) and our [Contact Page](/contact-us/).

Also view our external site [Google](https://google.com) and relative link [Anchor](anchor-tag).

<p>For more details, visit <a href="/faq/">our FAQ</a> or <a href="/pricing/">pricing page</a>.</p>
<a href="https://external.com">External HTML</a>
`;

      const hrefs = extractInternalHrefs(markdown);

      expect(hrefs).toEqual(['/services/mailbox-rentals/', '/contact-us/', '/faq/', '/pricing/']);
    });

    it('returns empty array if no internal links exist', () => {
      const text = 'Just plain text with no links or [external links](https://example.com)';
      const hrefs = extractInternalHrefs(text);
      expect(hrefs).toEqual([]);
    });
  });
});
