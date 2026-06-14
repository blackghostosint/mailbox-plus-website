import { test, expect } from '@playwright/test';

test('verify hero rotation and article loading', async ({ page }) => {
  // Go to home page
  await page.goto('http://localhost:5173');

  // Wait for the rotating services component
  const rotatingServices = page.locator('text=/Experts in/');
  await expect(rotatingServices).toBeVisible();

  // Take a screenshot of the start state
  await page.screenshot({ path: 'home_rotation_start.png' });

  // Wait for a rotation (should happen every 3s)
  await page.waitForTimeout(3500);

  // Take another screenshot to verify change
  await page.screenshot({ path: 'home_rotation_end.png' });

  // Check if blog section is visible (if any)
  const blogLink = page.locator('nav >> text=Articles');
  if (await blogLink.isVisible()) {
    await blogLink.click();
    await page.waitForSelector('text=Latest Articles');
    await page.screenshot({ path: 'articles_index.png' });
  }
});
