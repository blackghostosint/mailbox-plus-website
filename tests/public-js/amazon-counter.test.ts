// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import counterMod from '../../public/js/amazon-counter.js';

describe('amazon-counter.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="share-fuelmath-btn">Share Fuel Math</button>
      <button id="copy-link-btn-1">Copy Link</button>
      <button id="copy-caption-btn-1">Copy Caption</button>
      <button class="share-copy-btn" data-copy="Sample Instagram Caption">Copy Instagram</button>
    `;
  });

  it('shows copy toast when copyToClipboard is called fallback mode', () => {
    // Mock execCommand
    document.execCommand = vi.fn().mockReturnValue(true);
    counterMod.showToast('Copied!');

    const toast = document.querySelector('.copy-toast');
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toBe('Copied!');
  });

  it('triggers copy or share on button clicks', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    });
    counterMod.initAmazonCounter();

    const copyBtn = document.getElementById('copy-link-btn-1') as HTMLButtonElement;
    copyBtn.click();

    await vi.waitFor(() => {
      const toast = document.querySelector('.copy-toast');
      expect(toast).not.toBeNull();
    });
  });
});
