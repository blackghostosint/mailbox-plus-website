import { test, expect } from '@playwright/test';

test.describe('Private Mailbox Reservation Flow', () => {
  const tiers = ['small_mail_only', 'small_packages10', 'large_mail_only', 'large_packages10'];

  for (const tier of tiers) {
    test(`initiating checkout for tier ${tier} sends correct payload`, async ({ page }) => {
      let interceptedTier: string | null = null;

      await page.route('**/.netlify/functions/create-checkout', async (route) => {
        const payload = JSON.parse(route.request().postData() || '{}');
        interceptedTier = payload.tier;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            url: `https://checkout.stripe.com/c/pay/test_session_${tier}`,
          }),
        });
      });

      await page.goto('/private-mailbox-rental/');

      const btn = page.locator(`.checkout-btn[data-tier="${tier}"]`);
      await expect(btn).toBeVisible();

      await Promise.all([
        page.waitForResponse('**/.netlify/functions/create-checkout'),
        btn.click(),
      ]);

      expect(interceptedTier).toBe(tier);
    });
  }
});
