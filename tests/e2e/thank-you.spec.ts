import { test, expect } from '@playwright/test';

test.describe('Post-Checkout Confirmation Flow', () => {
  test('renders confirmation state, ID document checklist, and store location details', async ({
    page,
  }) => {
    let sessionVerifyCalled = false;

    // Stub session verification endpoint response
    await page.route('**/.netlify/functions/verify-session*', async (route) => {
      sessionVerifyCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          amount: 2500,
          currency: 'USD',
          product: 'Small +10 Packages',
          tier: 'small_packages10',
        }),
      });
    });

    // Navigate to thank-you confirmation page with test session_id and trailing slash
    await page.goto('/thank-you/?session_id=cs_test_mock_123');

    // Verify hero section confirmation text
    await expect(page.locator('h1')).toContainText("You're All Set. Your Mailbox Is Reserved.");
    await expect(page.locator('.trust-pill')).toContainText(
      'Payment received · Your mailbox is reserved'
    );

    // Verify ID checklist section
    const idSection = page.locator('#what-to-bring');
    await expect(idSection).toBeVisible();
    await expect(idSection.locator('h2')).toContainText("Two IDs. That's It.");
    await expect(page.locator('.id-card').nth(0)).toContainText('Primary Photo ID');
    await expect(page.locator('.id-card').nth(1)).toContainText('Address Proof');

    // Verify explicit warning banner about utility bills
    await expect(page.locator('.no-banner')).toContainText("Don't bring a utility bill");

    // Verify store info and location details
    const visitSection = page.locator('#visit');
    await expect(visitSection).toBeVisible();
    await expect(visitSection).toContainText('Fredle Square retail center');
    await expect(visitSection).toContainText('Store Hours');
    await expect(visitSection).toContainText('Monday – Friday');

    // Verify session verification API was called
    expect(sessionVerifyCalled).toBe(true);
  });
});
