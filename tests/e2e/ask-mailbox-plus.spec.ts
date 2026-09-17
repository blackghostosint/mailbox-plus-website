import { test, expect } from '@playwright/test';
import { AskMailboxPlusPage } from './pages/ask-mailbox-plus.page';

test.describe('Ask Mailbox Plus / FAQ Pathway', () => {
  test('renders page title, intro text, and FAQ accordion items', async ({ page }) => {
    const askPage = new AskMailboxPlusPage(page);
    await askPage.goto();

    await askPage.verifyPageHeader();

    const faqCount = await askPage.getFaqCount();
    expect(faqCount).toBeGreaterThan(0);
  });

  test('toggles FAQ accordion disclosure items smoothly', async ({ page }) => {
    const askPage = new AskMailboxPlusPage(page);
    await askPage.goto();

    const initialOpen = await askPage.isFaqOpen(0);
    expect(initialOpen).toBe(false);

    await askPage.toggleFaq(0);
    const openedState = await askPage.isFaqOpen(0);
    expect(openedState).toBe(true);

    const firstFaqAnswer = page.locator('details').nth(0).locator('.mt-2');
    await expect(firstFaqAnswer).toBeVisible();

    await askPage.toggleFaq(0);
    const closedState = await askPage.isFaqOpen(0);
    expect(closedState).toBe(false);
  });

  test('provides valid contact escalation link', async ({ page }) => {
    const askPage = new AskMailboxPlusPage(page);
    await askPage.goto();

    await askPage.verifyContactLink();

    await askPage.contactLink.click();
    await expect(page).toHaveURL(/\/contact-us\/?$/);
  });
});
