import { type Page, type Locator, expect } from '@playwright/test';

export class ServicePillarsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    // Ensure route path has mandatory trailing slash
    const formattedPath = path.endsWith('/') ? path : `${path}/`;
    await this.page.goto(formattedPath);
  }

  getHeroHeading(): Locator {
    return this.page.locator('h1');
  }

  getFaqItems(): Locator {
    return this.page.locator('details');
  }

  async verifyHeroTitle(expectedTextOrPattern: string | RegExp) {
    const heading = this.getHeroHeading();
    await expect(heading).toBeVisible();
    if (typeof expectedTextOrPattern === 'string') {
      await expect(heading).toContainText(expectedTextOrPattern);
    } else {
      await expect(heading).toHaveText(expectedTextOrPattern);
    }
  }

  async verifyCtaButtons() {
    const ctaButtons = this.page.locator('a[href="/contact-us/"], a[href="#pricing"]');
    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);
    await expect(ctaButtons.first()).toBeVisible();
  }

  async verifyFaqsExist() {
    const count = await this.getFaqItems().count();
    expect(count).toBeGreaterThan(0);
  }

  async toggleFaq(index: number) {
    const faq = this.getFaqItems().nth(index);
    const summary = faq.locator('summary');
    await summary.click();
  }
}
