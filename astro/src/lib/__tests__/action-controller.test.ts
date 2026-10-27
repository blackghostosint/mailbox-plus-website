// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ActionController, executeAction } from '../action-controller';
import { ApiClientError } from '../api-client';
import { getPoliteMessage, getAssertiveMessage, resetAnnouncer } from '../announcer';

describe('action-controller module', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    resetAnnouncer();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('manages pending state and restores button state on success', async () => {
    document.body.innerHTML = `
      <form id="my-form">
        <button type="submit" id="btn">Submit Order</button>
      </form>
    `;

    const button = document.getElementById('btn') as HTMLButtonElement;
    const controller = new ActionController({
      button,
      pendingText: 'Processing...',
    });

    let executed = false;
    const promise = controller.run(async () => {
      expect(button.disabled).toBe(true);
      expect(button.textContent).toBe('Processing...');
      vi.advanceTimersByTime(50);
      expect(getPoliteMessage()).toBe('Processing...');
      executed = true;
      return 'ok';
    });

    const result = await promise;
    expect(executed).toBe(true);
    expect(result).toBe('ok');
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Submit Order');
  });

  it('renders error, focuses error container, and restores button text on failure', async () => {
    document.body.innerHTML = `
      <form id="my-form">
        <button type="submit" id="btn">Send Request</button>
      </form>
    `;

    const form = document.getElementById('my-form') as HTMLFormElement;
    const button = document.getElementById('btn') as HTMLButtonElement;

    const controller = new ActionController({
      button,
      pendingText: 'Sending...',
      container: form,
      getErrorMessage: () => 'Server error occurred',
    });

    await expect(
      controller.run(async () => {
        throw new Error('API Failure');
      })
    ).rejects.toThrow('API Failure');

    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Send Request');

    const alertEl = form.querySelector('[role="alert"]');
    expect(alertEl).not.toBeNull();
    expect(alertEl?.textContent).toBe('Server error occurred');
    expect(document.activeElement).toBe(alertEl);
    vi.advanceTimersByTime(50);
    expect(getAssertiveMessage()).toBe('Server error occurred');
  });

  it('clears existing error alerts before running action', async () => {
    document.body.innerHTML = `
      <form id="my-form">
        <div role="alert">Old error alert</div>
        <button type="submit" id="btn">Submit</button>
      </form>
    `;

    const form = document.getElementById('my-form') as HTMLFormElement;
    const button = document.getElementById('btn') as HTMLButtonElement;

    expect(form.querySelector('[role="alert"]')).not.toBeNull();

    await executeAction(
      async () => {
        expect(form.querySelector('[role="alert"]')).toBeNull();
        return 123;
      },
      { button, container: form }
    );

    expect(form.querySelector('[role="alert"]')).toBeNull();
  });

  it('formats ApiClientError timeout correctly when getErrorMessage is omitted', async () => {
    document.body.innerHTML = `
      <div id="container">
        <button id="btn">Click Me</button>
      </div>
    `;

    const container = document.getElementById('container') as HTMLElement;
    const button = document.getElementById('btn') as HTMLButtonElement;

    const apiErr = new ApiClientError('Request failed');
    apiErr.isTimeout = true;

    await expect(
      executeAction(
        async () => {
          throw apiErr;
        },
        { button, container }
      )
    ).rejects.toThrow();

    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl?.textContent).toBe('Request timed out. Please try again.');
  });
});
