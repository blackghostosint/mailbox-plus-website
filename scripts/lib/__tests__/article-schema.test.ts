import { describe, it, expect } from 'vitest';
import { articleFrontmatterSchema, validateArticleFrontmatter } from '../article-schema.ts';

describe('articleFrontmatterSchema', () => {
  const validMinimalData = {
    title: 'Test Title',
    description: 'Test Description',
    slug: 'test-article-slug',
    category: 'Virtual Mailbox',
    intentKey: 'intent-test',
    pubDate: '2026-01-01',
    image: '/images/test.jpg',
    imageAlt: 'Test Image Alt',
    keywords: ['mailbox', 'test'],
    relatedServices: ['service-1'],
    author: 'Jules',
  };

  it('validates a minimal valid frontmatter object and applies default status', () => {
    const result = articleFrontmatterSchema.safeParse(validMinimalData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Test Title');
      expect(result.data.status).toBe('published');
    }
  });

  it('validates a complete valid frontmatter object with optional fields', () => {
    const completeData = {
      ...validMinimalData,
      status: 'draft',
      location: 'New York, NY',
      lastModified: '2026-02-01',
      imageBody1: '/images/body1.jpg',
      imageBody1Alt: 'Body 1 Alt',
      eventDate: new Date('2026-03-01T00:00:00.000Z'),
      source: 'Internal Research',
      sourceLabel: 'Research Note',
      articleType: 'pillar',
      quickAnswer: 'Quick answer summary text',
      faqs: [
        { question: 'What is this?', answer: 'This is a test answer.' },
        { question: 'How does it work?', answer: 'It works via vitest.' },
      ],
    };

    const result = articleFrontmatterSchema.safeParse(completeData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('draft');
      expect(result.data.articleType).toBe('pillar');
      expect(result.data.eventDate).toBe('2026-03-01T00:00:00.000Z');
      expect(result.data.faqs?.length).toBe(2);
    }
  });

  describe('string length & non-empty validations', () => {
    const stringFields = [
      'title',
      'description',
      'category',
      'intentKey',
      'image',
      'imageAlt',
      'author',
    ] as const;

    stringFields.forEach((field) => {
      it(`fails when field '${field}' is empty`, () => {
        const invalidData = { ...validMinimalData, [field]: '' };
        const result = articleFrontmatterSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('slug format validation', () => {
    it('accepts valid kebab-case slugs', () => {
      const validSlugs = ['article', 'my-article-title', 'article-123-test', 'a-b-c'];
      validSlugs.forEach((slug) => {
        const result = articleFrontmatterSchema.safeParse({ ...validMinimalData, slug });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid slug formats', () => {
      const invalidSlugs = [
        '',
        'My-Article',
        'my_article',
        'my article',
        '-leading-dash',
        'trailing-dash-',
        'double--dash',
        'slug@special',
      ];
      invalidSlugs.forEach((slug) => {
        const result = articleFrontmatterSchema.safeParse({ ...validMinimalData, slug });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('date field validations', () => {
    it('accepts valid date strings and Date instances for pubDate', () => {
      const validPubDates = [
        '2026-01-01',
        '2026-01-01T12:00:00Z',
        'October 19, 2026',
        new Date('2026-10-19'),
      ];
      validPubDates.forEach((pubDate) => {
        const result = articleFrontmatterSchema.safeParse({ ...validMinimalData, pubDate });
        expect(result.success).toBe(true);
      });
    });

    it('rejects empty or unparseable date strings for pubDate', () => {
      const invalidDates = ['', 'not-a-date', '2026-99-99'];
      invalidDates.forEach((pubDate) => {
        const result = articleFrontmatterSchema.safeParse({ ...validMinimalData, pubDate });
        expect(result.success).toBe(false);
      });
    });

    it('accepts valid optional dates (lastModified, eventDate)', () => {
      const result = articleFrontmatterSchema.safeParse({
        ...validMinimalData,
        lastModified: '2026-05-01',
        eventDate: new Date('2026-06-01'),
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid optional date formats', () => {
      const result = articleFrontmatterSchema.safeParse({
        ...validMinimalData,
        lastModified: 'invalid-date',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('articleType enum validation', () => {
    it('accepts allowed articleType enum values', () => {
      const allowedTypes = ['pillar', 'comparison', 'guide', 'batch'] as const;
      allowedTypes.forEach((articleType) => {
        const result = articleFrontmatterSchema.safeParse({
          ...validMinimalData,
          articleType,
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects disallowed articleType values', () => {
      const result = articleFrontmatterSchema.safeParse({
        ...validMinimalData,
        articleType: 'blog',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('keywords and faqs array validations', () => {
    it('rejects empty keywords array', () => {
      const result = articleFrontmatterSchema.safeParse({ ...validMinimalData, keywords: [] });
      expect(result.success).toBe(false);
    });

    it('validates faqs list items required fields', () => {
      const invalidFaqs = articleFrontmatterSchema.safeParse({
        ...validMinimalData,
        faqs: [{ question: '', answer: 'Valid answer' }],
      });
      expect(invalidFaqs.success).toBe(false);
    });
  });

  describe('passthrough behavior', () => {
    it('allows unrecognized additional frontmatter properties', () => {
      const extraData = { ...validMinimalData, customField: 'extra value', priority: 10 };
      const result = articleFrontmatterSchema.safeParse(extraData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect((result.data as any).customField).toBe('extra value');
        expect((result.data as any).priority).toBe(10);
      }
    });
  });
});

describe('validateArticleFrontmatter', () => {
  const validData = {
    title: 'Valid Title',
    description: 'Valid Description',
    slug: 'valid-slug',
    category: 'Category',
    intentKey: 'intent-key',
    pubDate: '2026-01-01',
    image: '/img.png',
    imageAlt: 'Img Alt',
    keywords: ['tag'],
    relatedServices: [],
    author: 'Author Name',
  };

  it('returns success: true and parsed data for valid frontmatter', () => {
    const result = validateArticleFrontmatter(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe('valid-slug');
      expect(result.data.status).toBe('published');
    }
  });

  it('returns success: false with formatted errors when validation fails (without fileName)', () => {
    const invalidData = {
      ...validData,
      slug: 'INVALID SLUG',
      title: '',
    };
    const result = validateArticleFrontmatter(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors.some((err) => err.includes("Field 'slug':"))).toBe(true);
      expect(result.errors.some((err) => err.includes("Field 'title':"))).toBe(true);
      expect(result.errors.every((err) => err.startsWith('❌ Field'))).toBe(true);
    }
  });

  it('prefixes errors with fileName when fileName parameter is provided', () => {
    const invalidData = {
      ...validData,
      slug: 'Bad Slug',
    };
    const result = validateArticleFrontmatter(invalidData, 'my-article.md');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain("❌ my-article.md: Field 'slug':");
    }
  });
});
