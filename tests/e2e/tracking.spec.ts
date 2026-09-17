import { test, expect } from '@playwright/test';
import { TrackingPage } from './pages/tracking.page';

test.describe('Package Tracking Portal Pathway', () => {
  test('renders page heading and external carrier tracking links', async ({ page }) => {
    const trackingPage = new TrackingPage(page);
    await trackingPage.goto();

    await expect(trackingPage.heading).toBeVisible();
    await trackingPage.verifyCarrierLinks();
  });

  test('renders store support escalation section with link to contact page', async ({ page }) => {
    const trackingPage = new TrackingPage(page);
    await trackingPage.goto();

    await trackingPage.verifySupportSection();

    await trackingPage.contactUsButton.click();
    await expect(page).toHaveURL(/\/contact-us\/?$/);
  });
});
