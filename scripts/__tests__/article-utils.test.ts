import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { validateArticleFrontmatter } from '../lib/article-schema.ts';
import { loadArticles, initRouteRegistry } from '../lib/article-utils.ts';

describe('article-schema & article-utils contextual validation', () => {
  const mockRegistry = {
    validRoutes: new Set(['/services/shipping', '/contact-us', '/about-us']),
    dynamicPrefixes: [{ prefix: '/articles', catchAll: false }],
    intentKeyMap: new Map<string, string[]>(),
  };

  const validFrontmatter = {
    title: 'Test Article',
    slug: 'test-article',
    description: 'A test article description',
    intentKey: 'test-intent-key',
    category: 'shipping',
    pubDate: '2026-01-01',
    status: 'published',
    image: '/images/test.webp',
    imageAlt: 'Test image alt',
    keywords: ['test', 'shipping'],
    relatedServices: ['/services/shipping'],
    author: 'Mailbox Plus Team',
  };

  it('validates frontmatter without contextual options', () => {
    const res = validateArticleFrontmatter(validFrontmatter, 'test.md');
    expect(res.success).toBe(true);
  });

  it('detects unknown relatedServices routes in validateArticleFrontmatter', () => {
    const invalidFm = {
      ...validFrontmatter,
      relatedServices: ['/services/invalid-route'],
    };
    const res = validateArticleFrontmatter(invalidFm, 'test.md', { registry: mockRegistry });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0]).toContain(
        "relatedServices path '/services/invalid-route' does not match any known route"
      );
    }
  });

  it('detects duplicate intentKeys in validateArticleFrontmatter', () => {
    const intentKeys = new Map<string, string>();
    intentKeys.set('test-intent-key', 'first-article.md');

    const res = validateArticleFrontmatter(validFrontmatter, 'second-article.md', {
      intentKeys,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0]).toContain("Duplicate intentKey 'test-intent-key'");
    }
  });

  it('loads articles with extracted links and validated frontmatter', () => {
    const tmpDir = path.join(os.tmpdir(), `article-test-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const articleContent = `---
title: Sample Article
slug: sample-article
description: Sample article description
intentKey: sample-key
category: pack-ship
pubDate: 2026-01-01
status: published
image: /images/sample.webp
imageAlt: Sample image
keywords: [sample]
relatedServices: [/services/shipping]
author: Mailbox Plus Team
---
Check out [/contact-us](/contact-us) and [/about-us](/about-us).
`;

    const filePath = path.join(tmpDir, 'sample-article.md');
    fs.writeFileSync(filePath, articleContent, 'utf8');

    try {
      const articles = loadArticles(tmpDir, { registry: mockRegistry });
      expect(articles.length).toBe(1);
      expect(articles[0].frontmatter.slug).toBe('sample-article');
      expect(articles[0].links).toEqual(['/contact-us', '/about-us']);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
