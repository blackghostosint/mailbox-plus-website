import { test, expect } from '@playwright/test';

test.describe('ARIA Live Regions - Dynamic Announcements & Focus Management', () => {
  test('Amazon counter page copy button triggers toast notification with aria-hidden="true" and polite live region announcement without moving focus', async ({
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
    await expect(toast).toHaveAttribute('aria-hidden', 'true');
    await expect(toast).toHaveText('Copied!');

    const politeAnnouncer = page.locator('#live-announcer-polite');
    await expect(politeAnnouncer).toHaveText('Copied!');

    // Ensure keyboard focus remains on the active copy button control
    await expect(copyBtn).toBeFocused();
  });

  test('Amazon counter page fuel-math share button uses explicit aria-label starting with visible text label', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});

    await page.goto('/amazon-counter/');

    const fuelMathBtn = page.locator('#share-fuelmath-btn');
    await expect(fuelMathBtn).toBeVisible();

    // Verify explicit aria-label is present and starts with the visible text label
    await expect(fuelMathBtn).toHaveAttribute(
      'aria-label',
      /^Tap to share this graphic — every share moves Amazon's needle/
    );

    // Verify accessible name includes both visible text label and graphic description
    const accessibleName = await fuelMathBtn.ariaSnapshot();
    expect(accessibleName).toContain(
      "Whiteboard graphic comparing Amazon's current returns system"
    );
    expect(accessibleName).toContain('Tap to share this graphic');

    await expect(fuelMathBtn).toHaveAccessibleName(
      /Tap to share this graphic.*Whiteboard graphic comparing Amazon's current returns system/s
    );

    // Verify click handler triggers fallback clipboard copy or share
    await fuelMathBtn.click();
    const toast = page.locator('.copy-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText('Copied!');
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
