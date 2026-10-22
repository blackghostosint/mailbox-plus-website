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
            ok: true,
            data: {
              url: `https://checkout.stripe.com/c/pay/test_session_${tier}`,
            },
          }),
        });
      });

      await page.goto('/private-mailbox-rental/');

      // Scope to the canonical pricing grid: the page intentionally has two
      // buy buttons per tier (above-the-fold strip + full grid).
      const btn = page.locator(`#pricing .checkout-btn[data-tier="${tier}"]`);
      await expect(btn).toBeVisible();

      const responsePromise = page.waitForResponse('**/.netlify/functions/create-checkout');
      await btn.click();
      await responsePromise;

      expect(interceptedTier).toBe(tier);
    });
  }

  // Regression guard (2026-10-21 incident): Astro 7.4 changed the default
  // envPrefix, which silently compiled the reCAPTCHA site key to an empty
  // object in the client bundle. CI stayed green because the tier tests mock
  // create-checkout. This test asserts the REAL built chunk carries an
  // inlined site key — if env inlining regresses, this fails.
  test('checkout chunk inlines the reCAPTCHA site key (env inlining guard)', async ({ page }) => {
    await page.goto('/private-mailbox-rental/');

    // Find the checkout chunk referenced by the page's module graph.
    const chunkUrl = await page.evaluate(async () => {
      const scripts = [...document.querySelectorAll('script[src]')]
        .map((s) => (s as HTMLScriptElement).src)
        .filter((s) => s.includes('/_astro/'));
      for (const src of scripts) {
        const code = await (await fetch(src)).text();
        const match = code.match(/checkout\.[A-Za-z0-9_-]+\.js/);
        if (match) return new URL(match[0], src).href;
      }
      return null;
    });
    expect(chunkUrl, 'checkout chunk referenced from page scripts').toBeTruthy();

    const chunk = await (await page.request.get(chunkUrl!)).text();
    const siteKey = chunk.match(/['"`](6L[A-Za-z0-9_-]{30,})['"`]/);
    expect(siteKey, 'reCAPTCHA site key inlined into the bundle').toBeTruthy();
    expect(chunk).not.toContain('{}.VITE_RECAPTCHA_SITE_KEY');
  });
});
