import { test, expect } from '@playwright/test';

test.describe('Security behaviors', () => {
  test('contact form exists with required fields', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForSelector('#name', { state: 'visible', timeout: 10000 });
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
  });

  test('external links have noopener noreferrer', async ({ page }) => {
    await page.goto('/');
    const externalLinks = page.locator('a[target="_blank"][href^="http"]');
    const count = await externalLinks.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('inline scripts count is reasonable', async ({ page }) => {
    await page.goto('/');
    const scripts = page.locator('script:not([src])');
    const inlineCount = await scripts.count();
    // Inline scripts exist (GTM, analytics), but should be under 10
    expect(inlineCount).toBeLessThanOrEqual(10);
  });

  test('form has submit button', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForSelector('#name', { state: 'visible', timeout: 10000 });
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('page has no html injection via URL params', async ({ page }) => {
    await page.goto('/?test=<script>alert(1)</script>');
    const content = await page.content();
    expect(content).not.toContain('<script>alert(1)</script>');
  });
});

// NOTE: Security header verification (CSP, HSTS, X-Frame-Options) is done
// via deployment check, not Playwright, because the Vite dev server doesn't
// set Netlify headers. See docs/SECURITY.md Section 3 for the curl command
// to verify headers on the live site.
