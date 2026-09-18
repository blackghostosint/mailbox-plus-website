/* eslint-disable */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  openMenu,
  closeMenu,
  toggleMenu,
  initHeader,
  getIsOpen,
  handleMediaChange,
} from '../../../public/js/header.js';

class MockElement {
  id: string = '';
  tagName: string;
  style: Record<string, string> = {};
  attributes: Record<string, string> = {};
  dataset: Record<string, string> = {};
  classList = {
    _classes: new Set<string>(),
    add: (...clss: string[]) => clss.forEach((c) => this.classList._classes.add(c)),
    remove: (...clss: string[]) => clss.forEach((c) => this.classList._classes.delete(c)),
    contains: (c: string) => this.classList._classes.has(c),
    toggle: (c: string) => {
      if (this.classList._classes.has(c)) this.classList._classes.delete(c);
      else this.classList._classes.add(c);
    },
  };
  children: MockElement[] = [];
  listeners: Record<string, ((event: unknown) => void)[]> = {};
  scrollHeight: number = 200;

  constructor(tagName: string, id: string = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
    if (name === 'id') this.id = value;
  }

  getAttribute(name: string) {
    return this.attributes[name] ?? null;
  }

  removeAttribute(name: string) {
    delete this.attributes[name];
  }

  addEventListener(event: string, fn: (event: unknown) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  removeEventListener(event: string, fn: (event: unknown) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((f) => f !== fn);
  }

  dispatchEvent(event: {
    type: string;
    preventDefault?: () => void;
    key?: string;
    shiftKey?: boolean;
  }) {
    const list = this.listeners[event.type] || [];
    list.forEach((fn) => fn(event));
  }

  click() {
    this.focus();
    this.dispatchEvent({ type: 'click', preventDefault: () => {} });
  }

  focus() {
    mockDocument.activeElement = this;
  }

  querySelector(selector: string): MockElement | null {
    if (selector === '[data-mobile-link]') {
      return this.children.find((c) => c.dataset.mobileLink !== undefined) || null;
    }
    return null;
  }

  querySelectorAll(selector: string): MockElement[] {
    if (selector === '[data-mobile-link]') {
      return this.children.filter((c) => c.dataset.mobileLink !== undefined);
    }
    return [];
  }
}

interface MockDocument {
  activeElement: MockElement | null;
  readyState: string;
  getElementById: (id: string) => MockElement | null;
  querySelector: (selector: string) => MockElement | null;
  querySelectorAll: (selector: string) => MockElement[];
  addEventListener: (event: string, fn: (event: unknown) => void) => void;
  removeEventListener: (event: string, fn: (event: unknown) => void) => void;
  dispatchEvent: (event: {
    type: string;
    key?: string;
    shiftKey?: boolean;
    preventDefault?: () => void;
  }) => void;
}

let mockDocument: MockDocument;
let docListeners: Record<string, ((event: unknown) => void)[]> = {};

function setupMockEnvironment() {
  docListeners = {};

  const btn = new MockElement('button', 'mobile-menu-btn');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open menu');

  const iconOpen = new MockElement('svg', 'menu-icon-open');
  const iconClose = new MockElement('svg', 'menu-icon-close');
  iconClose.classList.add('hidden');

  const link1 = new MockElement('a', 'link-1');
  link1.dataset.mobileLink = 'true';
  const link2 = new MockElement('a', 'link-2');
  link2.dataset.mobileLink = 'true';
  const link3 = new MockElement('a', 'link-3');
  link3.dataset.mobileLink = 'true';

  const menu = new MockElement('div', 'mobile-menu');
  menu.children = [link1, link2, link3];

  const elementsById: Record<string, MockElement> = {
    'mobile-menu-btn': btn,
    'mobile-menu': menu,
    'menu-icon-open': iconOpen,
    'menu-icon-close': iconClose,
    'link-1': link1,
    'link-2': link2,
    'link-3': link3,
  };

  mockDocument = {
    activeElement: btn,
    readyState: 'complete',
    getElementById(id: string) {
      return elementsById[id] || null;
    },
    querySelector(selector: string) {
      if (selector === '[data-mobile-link]') return link1;
      return null;
    },
    querySelectorAll(selector: string) {
      if (selector === '[data-mobile-link]') return [link1, link2, link3];
      return [];
    },
    addEventListener(event: string, fn: (event: unknown) => void) {
      if (!docListeners[event]) docListeners[event] = [];
      docListeners[event].push(fn);
    },
    removeEventListener(event: string, fn: (event: unknown) => void) {
      if (!docListeners[event]) return;
      docListeners[event] = docListeners[event].filter((f) => f !== fn);
    },
    dispatchEvent(event: {
      type: string;
      key?: string;
      shiftKey?: boolean;
      preventDefault?: () => void;
    }) {
      const list = docListeners[event.type] || [];
      list.forEach((fn) => fn(event));
    },
  };

  // @ts-expect-error Mock global document
  globalThis.document = mockDocument;

  // @ts-expect-error Mock global window
  globalThis.window = {
    matchMedia: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  };
}

describe('header.js mobile drawer controller & keyboard state machine', () => {
  beforeEach(() => {
    if (getIsOpen()) {
      closeMenu();
    }
    setupMockEnvironment();
    initHeader();
  });

  it('opens and closes drawer via toggleMenu', () => {
    const btn = mockDocument.getElementById('mobile-menu-btn')!;
    const menu = mockDocument.getElementById('mobile-menu')!;
    const iconOpen = mockDocument.getElementById('menu-icon-open')!;
    const iconClose = mockDocument.getElementById('menu-icon-close')!;

    expect(getIsOpen()).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');

    toggleMenu();

    expect(getIsOpen()).toBe(true);
    expect(menu.style.maxHeight).toBe('200px');
    expect(menu.style.opacity).toBe('1');
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Close menu');
    expect(iconOpen.classList.contains('hidden')).toBe(true);
    expect(iconClose.classList.contains('hidden')).toBe(false);

    toggleMenu();

    expect(getIsOpen()).toBe(false);
    expect(menu.style.maxHeight).toBe('0');
    expect(menu.style.opacity).toBe('0');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Open menu');
    expect(iconOpen.classList.contains('hidden')).toBe(false);
    expect(iconClose.classList.contains('hidden')).toBe(true);
  });

  it('shifts focus to the first mobile link when opened', () => {
    openMenu();
    expect(mockDocument.activeElement?.id).toBe('link-1');
  });

  it('closes drawer and restores focus to #mobile-menu-btn when Escape is pressed', () => {
    const btn = mockDocument.getElementById('mobile-menu-btn')!;

    openMenu();
    expect(getIsOpen()).toBe(true);

    let defaultPrevented = false;
    mockDocument.dispatchEvent({
      type: 'keydown',
      key: 'Escape',
      preventDefault: () => {
        defaultPrevented = true;
      },
    });

    expect(defaultPrevented).toBe(true);
    expect(getIsOpen()).toBe(false);
    expect(mockDocument.activeElement).toBe(btn);
  });

  it('traps focus forward: tabbing past the last link wraps focus back to #mobile-menu-btn', () => {
    const btn = mockDocument.getElementById('mobile-menu-btn')!;
    const lastLink = mockDocument.getElementById('link-3')!;

    openMenu();
    lastLink.focus();
    expect(mockDocument.activeElement).toBe(lastLink);

    let defaultPrevented = false;
    mockDocument.dispatchEvent({
      type: 'keydown',
      key: 'Tab',
      shiftKey: false,
      preventDefault: () => {
        defaultPrevented = true;
      },
    });

    expect(defaultPrevented).toBe(true);
    expect(mockDocument.activeElement).toBe(btn);
  });

  it('traps focus backward: Shift-tabbing from #mobile-menu-btn wraps focus to the last link', () => {
    const btn = mockDocument.getElementById('mobile-menu-btn')!;
    const lastLink = mockDocument.getElementById('link-3')!;

    openMenu();
    btn.focus();
    expect(mockDocument.activeElement).toBe(btn);

    let defaultPrevented = false;
    mockDocument.dispatchEvent({
      type: 'keydown',
      key: 'Tab',
      shiftKey: true,
      preventDefault: () => {
        defaultPrevented = true;
      },
    });

    expect(defaultPrevented).toBe(true);
    expect(mockDocument.activeElement).toBe(lastLink);
  });

  it('traps focus backward: Shift-tabbing from the first link wraps focus to the last link', () => {
    const firstLink = mockDocument.getElementById('link-1')!;
    const lastLink = mockDocument.getElementById('link-3')!;

    openMenu();
    firstLink.focus();
    expect(mockDocument.activeElement).toBe(firstLink);

    let defaultPrevented = false;
    mockDocument.dispatchEvent({
      type: 'keydown',
      key: 'Tab',
      shiftKey: true,
      preventDefault: () => {
        defaultPrevented = true;
      },
    });

    expect(defaultPrevented).toBe(true);
    expect(mockDocument.activeElement).toBe(lastLink);
  });

  it('closes menu and restores focus to #mobile-menu-btn when a mobile link is clicked', () => {
    const btn = mockDocument.getElementById('mobile-menu-btn')!;
    const firstLink = mockDocument.getElementById('link-1')!;

    openMenu();
    expect(getIsOpen()).toBe(true);

    firstLink.click();

    expect(getIsOpen()).toBe(false);
    expect(mockDocument.activeElement).toBe(btn);
  });

  it('automatically closes menu on screen resize to desktop (>= 768px)', () => {
    openMenu();
    expect(getIsOpen()).toBe(true);

    handleMediaChange({ matches: true } as unknown as MediaQueryListEvent);

    expect(getIsOpen()).toBe(false);
  });
});
