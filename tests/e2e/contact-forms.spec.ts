import { test, expect } from '@playwright/test';

test.describe('Contact and Accessibility Form Handlers - ARIA Live & Focus Management', () => {
  const pagesToTest = [
    {
      path: '/contact-us/',
      formName: 'contact',
      fields: {
        name: '#name',
        email: '#email',
        message: '#message',
      },
    },
    {
      path: '/accessibility/',
      formName: 'accessibility-barrier',
      fields: {
        name: '#acc-name',
        email: '#acc-email',
        message: '#acc-barrier',
      },
    },
  ];

  for (const pageConfig of pagesToTest) {
    test.describe(`Form on ${pageConfig.path}`, () => {
      test('announces success with role="status", aria-live="polite", tabindex="-1", and programmatic focus', async ({
        page,
      }) => {
        await page.route('**/.netlify/functions/sendEmail*', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true }),
          });
        });

        await page.goto(pageConfig.path);

        const form = page.locator(`form[name="${pageConfig.formName}"]`);
        await expect(form).toBeVisible();

        await page.fill(pageConfig.fields.name, 'Jane Doe');
        await page.fill(pageConfig.fields.email, 'jane@example.com');
        await page.fill(
          pageConfig.fields.message,
          'Test inquiry message for accessibility verification.'
        );

        const submitBtn = form.locator('button[type="submit"]');
        await submitBtn.click();

        const statusContainer = form.locator('[role="status"]');
        await expect(statusContainer).toBeVisible();
        await expect(statusContainer).toHaveAttribute('aria-live', 'polite');
        await expect(statusContainer).toHaveAttribute('tabindex', '-1');
        await expect(statusContainer).toContainText('Thank you! Your message has been sent.');

        await expect(statusContainer).toBeFocused();
      });

      test('replaces alert() with inline error container having role="alert", aria-live="assertive", tabindex="-1", and programmatic focus on server failure', async ({
        page,
      }) => {
        let alertCalled = false;
        page.on('dialog', () => {
          alertCalled = true;
        });

        await page.route('**/.netlify/functions/sendEmail*', async (route) => {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
          });
        });

        await page.goto(pageConfig.path);

        const form = page.locator(`form[name="${pageConfig.formName}"]`);
        await page.fill(pageConfig.fields.name, 'Jane Doe');
        await page.fill(pageConfig.fields.email, 'jane@example.com');
        await page.fill(pageConfig.fields.message, 'Test inquiry message.');

        const submitBtn = form.locator('button[type="submit"]');
        await submitBtn.click();

        const alertContainer = form.locator('[role="alert"]');
        await expect(alertContainer).toBeVisible();
        await expect(alertContainer).toHaveAttribute('aria-live', 'assertive');
        await expect(alertContainer).toHaveAttribute('tabindex', '-1');
        await expect(alertContainer).toContainText('reCAPTCHA verification failed');

        await expect(alertContainer).toBeFocused();
        expect(alertCalled).toBe(false);
      });

      test('handles network failure with inline role="alert" banner and programmatic focus', async ({
        page,
      }) => {
        let alertCalled = false;
        page.on('dialog', () => {
          alertCalled = true;
        });

        await page.route('**/.netlify/functions/sendEmail*', async (route) => {
          await route.abort('failed');
        });

        await page.goto(pageConfig.path);

        const form = page.locator(`form[name="${pageConfig.formName}"]`);
        await page.fill(pageConfig.fields.name, 'Jane Doe');
        await page.fill(pageConfig.fields.email, 'jane@example.com');
        await page.fill(pageConfig.fields.message, 'Test inquiry message.');

        const submitBtn = form.locator('button[type="submit"]');
        await submitBtn.click();

        const alertContainer = form.locator('[role="alert"]');
        await expect(alertContainer).toBeVisible();
        await expect(alertContainer).toHaveAttribute('aria-live', 'assertive');
        await expect(alertContainer).toHaveAttribute('tabindex', '-1');
        await expect(alertContainer).toContainText('Network error. Please try again.');

        await expect(alertContainer).toBeFocused();
        expect(alertCalled).toBe(false);
      });
    });
  }
});
