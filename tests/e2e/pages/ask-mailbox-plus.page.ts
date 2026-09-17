import { type Page, type Locator, expect } from '@playwright/test';

export class AskMailboxPlusPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly faqItems: Locator;
  readonly contactLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Ask Mailbox Plus' });
    this.faqItems = page.locator('details');
    this.contactLink = page.locator('main a[href="/contact-us/"]');
  }

  async goto() {
    await this.page.goto('/ask-mailbox-plus/');
  }

  async getFaqCount(): Promise<number> {
    return await this.faqItems.count();
  }

  async toggleFaq(index: number) {
    const summary = this.faqItems.nth(index).locator('summary');
    await summary.click();
  }

  async isFaqOpen(index: number): Promise<boolean> {
    const details = this.faqItems.nth(index);
    return (await details.getAttribute('open')) !== null;
  }

  async verifyPageHeader() {
    await expect(this.heading).toBeVisible();
    await expect(
      this.page.locator('text=Find answers to common questions about our shipping')
    ).toBeVisible();
  }

  async verifyContactLink() {
    await expect(this.contactLink).toBeVisible();
    await expect(this.contactLink).toHaveAttribute('href', '/contact-us/');
  }
}
