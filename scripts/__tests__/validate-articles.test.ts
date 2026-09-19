import { describe, it, expect } from 'vitest';
import { validateArticles } from '../validate-articles.ts';

describe('validate-articles', () => {
  const mockRegistry = {
    validRoutes: new Set(['/services/shipping', '/contact-us', '/about-us']),
    dynamicPrefixes: [{ prefix: '/articles', catchAll: false }],
    intentKeyMap: new Map(),
  };

  const validFrontmatterHeader = `---
title: Test Shipping Guide
slug: test-shipping-guide
description: A helpful guide on local shipping.
intentKey: test-shipping-guide
category: pack-ship
pubDate: 2026-01-01
image: /images/test.webp
imageAlt: Test image
keywords: [shipping, test]
relatedServices: [/services/shipping/]
author: Mailbox Plus Team
---
`;

  it('passes validation when articles are well-formed and links exist in registry', () => {
    const articles = [
      {
        baseName: 'valid-article.md',
        content: `${validFrontmatterHeader}\nThis is valid article body content with a link to [/contact-us/](/contact-us/).`,
      },
    ];

    const result = validateArticles({ articles, registry: mockRegistry });
    expect(result.errors).toEqual([]);
    expect(result.success).toBe(true);
    expect(result.articleCount).toBe(1);
  });

  it('detects duplicate intentKey values across articles', () => {
    const article1 = {
      baseName: 'article1.md',
      content: `${validFrontmatterHeader}\nArticle 1 content.`,
    };
    const article2 = {
      baseName: 'article2.md',
      content: `${validFrontmatterHeader
        .replace('title: Test Shipping Guide', 'title: Second Guide')
        .replace('slug: test-shipping-guide', 'slug: second-guide')}\nArticle 2 content.`,
    };

    const result = validateArticles({ articles: [article1, article2], registry: mockRegistry });
    expect(result.success).toBe(false);
    expect(result.errors.some((err) => err.includes('Duplicate intentKey'))).toBe(true);
  });

  it('detects unknown relatedServices routes', () => {
    const article = {
      baseName: 'unknown-service.md',
      content: `---
title: Invalid Related Service
slug: unknown-service
description: Description
intentKey: unknown-service-key
category: pack-ship
pubDate: 2026-01-01
image: /images/test.webp
imageAlt: Test image
keywords: [test]
relatedServices: [/non-existent-route/]
author: Mailbox Plus Team
---
Article content.`,
    };

    const result = validateArticles({ articles: [article], registry: mockRegistry });
    expect(result.success).toBe(false);
    expect(
      result.errors.some((err) =>
        err.includes("relatedServices path '/non-existent-route/' does not match any known route")
      )
    ).toBe(true);
  });

  it('detects invalid internal markdown links', () => {
    const article = {
      baseName: 'invalid-markdown-link.md',
      content: `${validFrontmatterHeader}\nCheck out our [broken link](/invalid-internal-page/).`,
    };

    const result = validateArticles({ articles: [article], registry: mockRegistry });
    expect(result.success).toBe(false);
    expect(
      result.errors.some((err) =>
        err.includes("Markdown link '/invalid-internal-page/' does not match any known route")
      )
    ).toBe(true);
  });

  it('detects empty article content', () => {
    const article = {
      baseName: 'empty-article.md',
      content: `${validFrontmatterHeader}\n   \n`,
    };

    const result = validateArticles({ articles: [article], registry: mockRegistry });
    expect(result.errors.some((err) => err.includes('Article content is empty'))).toBe(true);
  });
});
