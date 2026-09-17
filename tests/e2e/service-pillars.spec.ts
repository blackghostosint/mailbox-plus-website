import { test, expect } from '@playwright/test';
import { ServicePillarsPage } from './pages/service-pillars.page';

test.describe('Service Pillars Conversion Pathways', () => {
  const servicePillars = [
    {
      slug: '/private-mailbox-rental/',
      titleKeyword: 'Missed Delivery',
    },
    {
      slug: '/pack-ship/',
      titleKeyword: 'The Counter That Compares',
    },
    {
      slug: '/copy-print/',
      titleKeyword: 'Copy & Print',
    },
  ];

  for (const pillar of servicePillars) {
    test(`renders hero, features, FAQs, and CTAs for ${pillar.slug}`, async ({ page }) => {
      const servicePage = new ServicePillarsPage(page);
      await servicePage.goto(pillar.slug);

      await servicePage.verifyHeroTitle(new RegExp(pillar.titleKeyword, 'i'));
      await servicePage.verifyFaqsExist();
      await servicePage.verifyCtaButtons();
    });
  }

  test('toggles FAQ disclosure on service pillar page', async ({ page }) => {
    const servicePage = new ServicePillarsPage(page);
    await servicePage.goto('/private-mailbox-rental/');

    const firstFaq = servicePage.getFaqItems().first();
    const isInitiallyOpen = (await firstFaq.getAttribute('open')) !== null;

    await servicePage.toggleFaq(0);

    const isOpenAfterToggle = (await firstFaq.getAttribute('open')) !== null;
    expect(isOpenAfterToggle).toBe(!isInitiallyOpen);
  });
});
