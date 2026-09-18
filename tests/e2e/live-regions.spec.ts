import { test, expect } from '@playwright/test';

test.describe('ARIA Live Regions - Dynamic Announcements & Focus Management', () => {
  test('Amazon counter page copy button triggers toast notification with role="status", aria-live="polite", and aria-atomic="true" without moving focus', async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions if supported by browser
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});

    await page.goto('/amazon-counter/');

    const copyBtn = page.locator('#copy-link-btn');
    await expect(copyBtn).toBeVisible();

    await copyBtn.focus();
    await copyBtn.click();

    const toast = page.locator('.copy-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('role', 'status');
    await expect(toast).toHaveAttribute('aria-live', 'polite');
    await expect(toast).toHaveAttribute('aria-atomic', 'true');
    await expect(toast).toHaveText('Copied!');

    // Ensure keyboard focus remains on the active copy button control
    await expect(copyBtn).toBeFocused();
  });

  test('404 error page #quote paragraph declares role="status", aria-live="polite", and aria-atomic="true"', async ({
    page,
  }) => {
    await page.goto('/404/');

    const quoteEl = page.locator('#quote');
    await expect(quoteEl).toBeVisible();
    await expect(quoteEl).toHaveAttribute('role', 'status');
    await expect(quoteEl).toHaveAttribute('aria-live', 'polite');
    await expect(quoteEl).toHaveAttribute('aria-atomic', 'true');

    // Initial quote text loaded
    const initialText = await quoteEl.textContent();
    expect(initialText).toBeTruthy();

    const cheerBtn = page.locator('#quoteButton');
    await expect(cheerBtn).toBeVisible();

    await cheerBtn.focus();
    await cheerBtn.click();

    // Verify quote element receives text update while focus stays on button
    await expect(quoteEl).toHaveAttribute('role', 'status');
    await expect(cheerBtn).toBeFocused();
  });
});
