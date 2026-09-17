import { type Page, type Locator, expect } from '@playwright/test';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export class ContactUsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly serviceSelect: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly phoneCardLink: Locator;
  readonly emailCardLink: Locator;
  readonly storeHoursSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Get in Touch' });
    this.form = page.locator('form[name="contact"]');
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.serviceSelect = page.locator('#service');
    this.messageInput = page.locator('#message');
    this.submitButton = page.locator('form[name="contact"] button[type="submit"]');
    this.phoneCardLink = page.locator('a[href^="tel:"]').filter({ hasText: 'Call Now' });
    this.emailCardLink = page.locator('a[href^="mailto:"]').filter({ hasText: 'Send Email' });
    this.storeHoursSection = page.locator('main').getByRole('heading', { name: 'Store Hours' });
  }

  async goto() {
    await this.page.goto('/contact-us/');
  }

  async mockSendEmailApi(
    options: {
      status?: number;
      body?: Record<string, unknown>;
    } = {}
  ) {
    const status = options.status ?? 200;
    const responseBody = options.body ?? { ok: true, message: 'Email sent successfully' };

    let capturedPayload: Record<string, unknown> | null = null;

    await this.page.route('**/recaptcha/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'window.grecaptcha = { ready: (cb) => cb(), execute: () => Promise.resolve("mock_recaptcha_token") };',
      });
    });

    await this.page.route('**/.netlify/functions/sendEmail', async (route) => {
      if (route.request().method() === 'POST') {
        try {
          capturedPayload = JSON.parse(route.request().postData() || '{}');
        } catch {
          capturedPayload = null;
        }
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify(responseBody),
        });
      } else {
        await route.continue();
      }
    });

    return {
      getCapturedPayload: () => capturedPayload,
    };
  }

  async fillForm(data: ContactFormData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.service) {
      await this.serviceSelect.selectOption(data.service);
    }
    await this.messageInput.fill(data.message);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async verifySuccessState() {
    await expect(this.page.locator('text=Thank you! Your message has been sent.')).toBeVisible();
  }

  async verifyContactDetails() {
    await expect(this.heading).toBeVisible();
    await expect(this.phoneCardLink).toBeVisible();
    await expect(this.emailCardLink).toBeVisible();
    await expect(this.storeHoursSection).toBeVisible();
  }
}
