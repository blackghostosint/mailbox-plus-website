// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  announcePolite,
  announceAssertive,
  getPoliteElement,
  getAssertiveElement,
  resetAnnouncer,
  getPoliteMessage,
  getAssertiveMessage,
} from '../announcer';

describe('announcer module', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div class="sr-only" aria-hidden="false">
        <div id="live-announcer-polite" role="status" aria-live="polite" aria-atomic="true"></div>
        <div id="live-announcer-assertive" role="alert" aria-live="assertive" aria-atomic="true"></div>
      </div>
    `;
    resetAnnouncer();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('locates pre-rendered live region DOM containers', () => {
    const politeEl = getPoliteElement();
    const assertiveEl = getAssertiveElement();

    expect(politeEl).not.toBeNull();
    expect(politeEl?.id).toBe('live-announcer-polite');
    expect(assertiveEl).not.toBeNull();
    expect(assertiveEl?.id).toBe('live-announcer-assertive');
  });

  it('handles polite announcements with 50ms timer reset', () => {
    announcePolite('Test polite message');

    const politeEl = getPoliteElement();
    expect(politeEl?.textContent).toBe('');

    vi.advanceTimersByTime(50);

    expect(politeEl?.textContent).toBe('Test polite message');
    expect(getPoliteMessage()).toBe('Test polite message');
  });

  it('handles assertive announcements with 50ms timer reset', () => {
    announceAssertive('Test assertive error');

    const assertiveEl = getAssertiveElement();
    expect(assertiveEl?.textContent).toBe('');

    vi.advanceTimersByTime(50);

    expect(assertiveEl?.textContent).toBe('Test assertive error');
    expect(getAssertiveMessage()).toBe('Test assertive error');
  });

  it('resets timer when consecutive polite announcements are triggered', () => {
    announcePolite('First message');
    vi.advanceTimersByTime(30);

    announcePolite('Second message');
    vi.advanceTimersByTime(30);

    const politeEl = getPoliteElement();
    expect(politeEl?.textContent).toBe('');

    vi.advanceTimersByTime(20);
    expect(politeEl?.textContent).toBe('Second message');
  });

  it('resets timer when consecutive assertive announcements are triggered', () => {
    announceAssertive('First alert');
    vi.advanceTimersByTime(30);

    announceAssertive('Second alert');
    vi.advanceTimersByTime(30);

    const assertiveEl = getAssertiveElement();
    expect(assertiveEl?.textContent).toBe('');

    vi.advanceTimersByTime(20);
    expect(assertiveEl?.textContent).toBe('Second alert');
  });
});
