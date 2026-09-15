import { test, expect } from '@playwright/test';

interface CustomerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

test.describe('Customer Portal Rewards Join Flow', () => {
  test('renders interactive rewards island and handles signup form submission', async ({
    page,
  }) => {
    let submittedPayload: CustomerPayload | null = null;

    // Stub /api/customer signup endpoint
    await page.route('**/api/customer', async (route) => {
      submittedPayload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'cust_mock_999',
          firstName: submittedPayload.firstName,
          lastName: submittedPayload.lastName,
          email: submittedPayload.email,
        }),
      });
    });

    // Navigate to rewards join page with trailing slash
    await page.goto('/rewards/join/');

    // Verify hero section renders
    await expect(page.locator('h1')).toContainText('Every Package You Ship');
    await expect(page.locator('h1')).toContainText('Pays You Back.');

    // Scroll to signup form
    const formSection = page.locator('#join');
    await expect(formSection).toBeVisible();

    // Fill in form fields
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Doe');
    await page.fill('#phone', '440-555-0199');
    await page.fill('#email', 'jane.doe@example.com');
    await page.fill('#street', '123 Main St');
    await page.fill('#city', 'Concord Township');
    await page.fill('#state', 'OH');
    await page.fill('#zip', '44077');

    // Check terms agreement checkbox
    await page.check('#terms');

    // Wait for response promise when submitting form
    const responsePromise = page.waitForResponse('**/api/customer');
    await page.click('button[type="submit"]');
    await responsePromise;

    // Verify submitted request payload contains form data
    expect(submittedPayload).not.toBeNull();
    expect(submittedPayload.firstName).toBe('Jane');
    expect(submittedPayload.lastName).toBe('Doe');
    expect(submittedPayload.email).toBe('jane.doe@example.com');
    expect(submittedPayload.phone).toBe('440-555-0199');

    // Verify state transition to success message
    await expect(page.getByRole('heading', { name: 'Welcome to Plus Points!' })).toBeVisible();
    await expect(page.locator('.animate-fade-in-up')).toContainText('jane.doe@example.com');
  });
});
