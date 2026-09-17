import { type Page, type Locator, expect } from '@playwright/test';

export class TrackingPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly fedexLink: Locator;
  readonly upsLink: Locator;
  readonly uspsLink: Locator;
  readonly dhlLink: Locator;
  readonly helpSection: Locator;
  readonly contactUsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Track a Package' });
    this.fedexLink = page.locator('a[href="https://www.fedex.com/fedextrack"]');
    this.upsLink = page.locator('a[href="https://www.ups.com/track"]');
    this.uspsLink = page.locator('a[href="https://tools.usps.com/go/TrackConfirmAction_input"]');
    this.dhlLink = page.locator('a[href="https://www.dhl.com/us-en/home/tracking.html"]');
    this.helpSection = page.locator('h2', { hasText: 'Need Help Tracking?' }).locator('..');
    this.contactUsButton = page.locator('a[href="/contact-us/"]', { hasText: 'Contact Us' });
  }

  async goto() {
    await this.page.goto('/tracking/');
  }

  async verifyCarrierLinks() {
    const carrierLinks = [this.fedexLink, this.upsLink, this.uspsLink, this.dhlLink];

    for (const link of carrierLinks) {
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }

  async verifySupportSection() {
    await expect(this.helpSection).toBeVisible();
    await expect(this.contactUsButton).toBeVisible();
    await expect(this.contactUsButton).toHaveAttribute('href', '/contact-us/');
  }
}
