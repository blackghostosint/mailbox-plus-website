import { test, expect } from '@playwright/test';
import { ContactUsPage } from './pages/contact-us.page';

test.describe('Contact Us Conversion Pathway', () => {
  test('renders contact details, store hours, and form structure', async ({ page }) => {
    const contactPage = new ContactUsPage(page);
    await contactPage.goto();
    await contactPage.verifyContactDetails();
  });

  test('submits contact form and verifies API payload and DOM success state', async ({ page }) => {
    const contactPage = new ContactUsPage(page);

    const mockApi = await contactPage.mockSendEmailApi({
      status: 200,
      body: { ok: true, message: 'Email sent successfully' },
    });

    await contactPage.goto();

    const formData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(440) 555-0123',
      service: 'shipping',
      message: 'Hello, I would like more information about custom packing and carrier options.',
    };

    await contactPage.fillForm(formData);

    const responsePromise = page.waitForResponse('**/.netlify/functions/sendEmail');
    await contactPage.submitForm();
    await responsePromise;

    const payload = mockApi.getCapturedPayload();
    expect(payload).not.toBeNull();
    expect(payload?.name).toBe('John Doe');
    expect(payload?.email).toBe('john.doe@example.com');
    expect(payload?.phone).toBe('(440) 555-0123');
    expect(payload?.service).toBe('shipping');
    expect(payload?.message).toBe(
      'Hello, I would like more information about custom packing and carrier options.'
    );

    await contactPage.verifySuccessState();
  });

  test('handles API submission errors gracefully', async ({ page }) => {
    const contactPage = new ContactUsPage(page);

    await contactPage.mockSendEmailApi({
      status: 500,
      body: { error: 'Internal server error processing email' },
    });

    await contactPage.goto();

    await contactPage.fillForm({
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'Testing error state handling.',
    });

    const dialogPromise = page.waitForEvent('dialog');
    await contactPage.submitForm();
    const dialog = await dialogPromise;

    expect(dialog.message()).toContain('Internal server error processing email');
    await dialog.dismiss();
    await expect(contactPage.submitButton).toBeEnabled();
  });

  test('enforces client-side validation for required fields', async ({ page }) => {
    const contactPage = new ContactUsPage(page);
    await contactPage.goto();

    await contactPage.submitForm();

    const isNameValid = await page.$eval('#name', (el: HTMLInputElement) => el.checkValidity());
    expect(isNameValid).toBe(false);
  });
});
