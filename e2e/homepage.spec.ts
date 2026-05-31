import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and displays key elements', async ({ page }) => {
    await page.goto('/');

    // Hero section
    await expect(page.locator('h1')).toContainText('Pack & Ship');
    await expect(page.getByText('Your trusted local partner')).toBeVisible();

    // Navigation
    await expect(page.locator('nav').first()).toContainText('Services');
    await expect(page.locator('nav').first()).toContainText('Contact');

    // CTA section
    await expect(page.getByText('Visit Us in Concord Township')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');

    // Navigate to Services using the nav link (desktop)
    const navLink = page.locator('nav').getByText('Services');
    if (await navLink.isVisible()) {
      await navLink.click();
      await expect(page).toHaveURL(/services/);
    }

    // Navigate to Contact
    await page.goto('/');
    const contactLink = page.locator('nav').getByText('Contact');
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/contact-us/);
    }
  });

  test('get directions button has valid Google Maps link', async ({ page }) => {
    await page.goto('/');
    const directionsLink = page.locator('a[href*="google.com/maps"]').first();
    await expect(directionsLink).toBeVisible();
    const href = await directionsLink.getAttribute('href');
    expect(href).toContain('google.com/maps');
  });
});

test.describe('Services page', () => {
  test('loads service categories', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('h1')).toContainText('Services');
    // Categories section exists (may need scroll)
    await expect(page.locator('#categories')).toBeVisible();
  });

  test('service cards are clickable', async ({ page }) => {
    await page.goto('/services');
    const serviceLink = page.locator('a[href*="/pack-ship"]').first();
    if (await serviceLink.isVisible()) {
      await serviceLink.click();
      await expect(page).toHaveURL(/pack-ship/);
    }
  });
});

test.describe('Contact page', () => {
  test('loads contact form', async ({ page }) => {
    await page.goto('/contact-us');
    await expect(page.locator('h1')).toBeVisible();

    // Form fields — wait for them to be visible (may be below fold)
    await page.waitForSelector('#name', { state: 'visible', timeout: 10000 });
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForSelector('#name', { state: 'visible', timeout: 10000 });
    await expect(page.locator('#name')).toHaveAttribute('required', '');
    await expect(page.locator('#email')).toHaveAttribute('required', '');
  });
});

test.describe('404 page', () => {
  test('shows 404 for invalid routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page Not Found')).toBeVisible();
  });

  test('has link back to homepage', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.click('text=Go Home');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Footer', () => {
  test('displays on all pages', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Contact info
    await expect(footer).toContainText('7554 Fredle Drive');
    await expect(footer).toContainText('Concord Township');

    // Store hours
    await expect(footer).toContainText('Store Hours');

    // Quick links
    await expect(footer).toContainText('Services');
    await expect(footer).toContainText('Resources');
  });
});

test.describe('Responsive', () => {
  test('mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Hamburger menu should be visible on mobile
    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg)').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Mobile nav should appear
      await expect(page.locator('nav').last()).toContainText('Services');
    }
  });

  test('hero text scales on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    // Font size should be smaller on mobile (text-3xl = 30px)
    const fontSize = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeLessThanOrEqual(36);
  });
});
