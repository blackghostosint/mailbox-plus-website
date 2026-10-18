// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { onDOMReady } from '../dom-utils';

describe('dom-utils module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('executes callback immediately when document.readyState is interactive or complete', () => {
    const callback = vi.fn();
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    onDOMReady(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('attaches DOMContentLoaded listener when document.readyState is loading', () => {
    const callback = vi.fn();
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    onDOMReady(callback);

    expect(callback).not.toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', callback, { once: true });

    // Simulate DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
