import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildReviewCard, initReviewSection, type ReviewItem } from './reviews';

class MockElement {
  tagName: string;
  className: string = '';
  id: string = '';
  textContent: string = '';
  href: string = '';
  target: string = '';
  rel: string = '';
  children: MockElement[] = [];
  attributes: Record<string, string> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  appendChild(child: MockElement) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...nodes: MockElement[]) {
    this.children = [...nodes];
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
    if (name === 'class') this.className = value;
    if (name === 'id') this.id = value;
    if (name === 'href') this.href = value;
  }

  getAttribute(name: string) {
    return this.attributes[name] ?? null;
  }

  querySelector(selector: string): MockElement | null {
    return matchSelector(this, selector);
  }
}

function matchSelector(root: MockElement, selector: string): MockElement | null {
  const parts = selector.trim().split(/\s+/);
  if (parts.length === 1) {
    return findSingle(root, parts[0]);
  } else if (parts.length === 2) {
    const parent = findSingle(root, parts[0]);
    if (!parent) return null;
    return findSingle(parent, parts[1], true);
  }
  return null;
}

function findSingle(root: MockElement, sel: string, skipRootCheck = false): MockElement | null {
  if (!skipRootCheck) {
    if (sel.startsWith('.')) {
      const className = sel.slice(1);
      if (root.className.split(/\s+/).includes(className)) return root;
    } else {
      const tag = sel.toUpperCase();
      if (root.tagName === tag) return root;
    }
  }
  for (const child of root.children) {
    const found = findSingle(child, sel, false);
    if (found) return found;
  }
  return null;
}

function parseHTMLToMockElements(html: string): MockElement[] {
  const root = new MockElement('root');
  const stack: MockElement[] = [root];

  const tagRegex = /<(\/)?([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const isClose = match[1] === '/';
    const tagName = match[2];
    const attrsStr = match[3];
    const textContent = match[4];

    if (textContent) {
      const text = textContent.trim();
      if (text && stack.length > 1) {
        stack[stack.length - 1].textContent +=
          (stack[stack.length - 1].textContent ? ' ' : '') + text;
      }
    } else if (isClose) {
      if (stack.length > 1) {
        stack.pop();
      }
    } else if (tagName) {
      const el = new MockElement(tagName);
      const idMatch = attrsStr.match(/id=["']([^"']+)["']/);
      if (idMatch) el.id = idMatch[1];
      const classMatch = attrsStr.match(/class=["']([^"']+)["']/);
      if (classMatch) el.className = classMatch[1];

      stack[stack.length - 1].appendChild(el);
      stack.push(el);
    }
  }

  return root.children;
}

function setupMockDocument() {
  const elementsById = new Map<string, MockElement>();

  const body = new MockElement('body');
  Object.defineProperty(body, 'innerHTML', {
    get() {
      return '';
    },
    set(html: string) {
      elementsById.clear();
      body.children = [];
      if (!html) return;
      const parsed = parseHTMLToMockElements(html);
      for (const el of parsed) {
        body.appendChild(el);
        if (el.id) elementsById.set(el.id, el);
        for (const child of el.children) {
          if (child.id) elementsById.set(child.id, child);
        }
      }
    },
  });

  const mockDoc = {
    body,
    createElement(tag: string) {
      return new MockElement(tag);
    },
    createElementNS(_ns: string, tag: string) {
      return new MockElement(tag);
    },
    getElementById(id: string) {
      return elementsById.get(id) || null;
    },
  };

  // @ts-expect-error Mocking global document for vitest node environment
  globalThis.document = mockDoc;
}

describe('reviews module', () => {
  beforeEach(() => {
    setupMockDocument();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('buildReviewCard', () => {
    it('builds a review card article element with correct stars and text', () => {
      const review: ReviewItem = {
        rating: 4,
        text: 'Great shipping store!',
        author: 'Jane Doe',
        authorUri: 'https://maps.google.com/contrib/123',
        relativeTime: '2 days ago',
      };

      const card = buildReviewCard(review);

      expect(card.tagName.toLowerCase()).toBe('article');
      expect(card.querySelector('.sr-only')?.textContent).toBe('4 out of 5 stars');
      expect(card.querySelector('blockquote p')?.textContent).toBe('“Great shipping store!”');

      const authorLink = card.querySelector('footer a') as HTMLAnchorElement | null;
      expect(authorLink).not.toBeNull();
      expect(authorLink?.textContent).toBe('Jane Doe');
      expect(authorLink?.href).toBe('https://maps.google.com/contrib/123');
      expect(card.querySelector('footer p')?.textContent).toBe('2 days ago');
    });

    it('handles missing authorUri and relativeTime gracefully', () => {
      const review: ReviewItem = {
        rating: 5,
        text: 'Wonderful service!',
      };

      const card = buildReviewCard(review);

      expect(card.querySelector('.sr-only')?.textContent).toBe('5 out of 5 stars');
      const authorP = card.querySelector('footer p');
      expect(authorP?.textContent).toBe('Google User');
    });
  });

  describe('initReviewSection', () => {
    it('fetches reviews and populates DOM elements', async () => {
      document.body.innerHTML = `
        <span id="reviews-count">0</span>
        <span id="reviews-rating">0</span>
        <div id="reviews-list"></div>
      `;

      const mockData = {
        userRatingCount: 150,
        rating: 4.9,
        reviews: [
          {
            rating: 5,
            text: 'First review',
            author: 'Alice',
            publishTime: '2026-09-15T10:00:00Z',
          },
          {
            rating: 5,
            text: 'Second review',
            author: 'Bob',
            publishTime: '2026-09-16T10:00:00Z',
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockData,
        })
      );

      await initReviewSection();

      expect(document.getElementById('reviews-count')?.textContent).toBe('150');
      expect(document.getElementById('reviews-rating')?.textContent).toBe('4.9');

      const listEl = document.getElementById('reviews-list');
      expect(listEl?.children.length).toBe(2);
      // Newest should be first (Bob)
      expect(listEl?.children[0].querySelector('blockquote p')?.textContent).toBe(
        '“Second review”'
      );
    });

    it('fails gracefully when fetch fails', async () => {
      document.body.innerHTML = `
        <span id="reviews-count">100</span>
        <span id="reviews-rating">4.8</span>
        <div id="reviews-list"><div>Static</div></div>
      `;

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
        })
      );

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await initReviewSection();

      expect(document.getElementById('reviews-count')?.textContent).toBe('100');
      expect(document.getElementById('reviews-list')?.children.length).toBe(1);
      warnSpy.mockRestore();
    });
  });
});
