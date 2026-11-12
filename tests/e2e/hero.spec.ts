import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const AXE_PATH = path.resolve(process.cwd(), 'node_modules/axe-core/axe.min.js');

test.describe('Homepage hero rebuild + SVG counter scene (DESIGN_PHASE1_SPEC §3.1, §4 Task 5)', () => {
  for (const vp of [
    { width: 1440, height: 900, label: 'desktop 1440x900' },
    { width: 390, height: 844, label: 'mobile 390x844' },
  ]) {
    test(`renders asymmetric hero with both CTAs fully above the fold at ${vp.label}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      const hero = page.locator('#home-hero');
      await expect(hero).toBeVisible();

      const h1 = hero.locator('h1#hero-heading');
      await expect(h1).toHaveText('Four carriers. One counter. No runaround.');

      // H1 is static: no CSS entrance animation, opacity 1, transform none.
      const h1Style = await h1.evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          opacity: cs.opacity,
          transform: cs.transform,
          animationName: cs.animationName,
        };
      });
      expect(h1Style.opacity).toBe('1');
      expect(h1Style.transform).toBe('none');
      expect(h1Style.animationName).toBe('none');

      // No raster photography in hero.
      await expect(hero.locator('img')).toHaveCount(0);

      // Both CTAs visible and completely above the viewport fold (not occluded by sticky header either).
      const headerBox = await page.locator('header').boundingBox();
      const primaryCta = hero.locator('[data-hero-cta="primary"]');
      const secondaryCta = hero.locator('[data-hero-cta="secondary"]');
      await expect(primaryCta).toBeVisible();
      await expect(secondaryCta).toBeVisible();

      const primaryBox = await primaryCta.boundingBox();
      const secondaryBox = await secondaryCta.boundingBox();
      expect(primaryBox).not.toBeNull();
      expect(secondaryBox).not.toBeNull();
      expect(headerBox).not.toBeNull();

      expect(primaryBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
      expect(primaryBox!.y + primaryBox!.height).toBeLessThanOrEqual(vp.height);
      expect(secondaryBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
      expect(secondaryBox!.y + secondaryBox!.height).toBeLessThanOrEqual(vp.height);

      // Live review badge + monochrome carrier strip visible.
      await expect(hero.locator('#hero-reviews-rating')).toBeVisible();
      await expect(hero.locator('[data-hero-carriers] li')).toHaveCount(4);

      // SVG counter scene present and aria-hidden.
      const scene = hero.locator('#hero-counter-scene');
      await expect(scene).toBeVisible();
      await expect(scene).toHaveAttribute('aria-hidden', 'true');
    });

    test(`passes WCAG 2.1 AA axe-core contrast & accessibility audit at ${vp.label}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Wait past the <=1.2s hero settle so computed styles are in final state.
      await page.waitForTimeout(950);

      const axeSource = fs.readFileSync(AXE_PATH, 'utf8');
      await page.addScriptTag({ content: axeSource });

      const violations = await page.evaluate(async () => {
        // @ts-expect-error injected axe global
        const results = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
        });
        return results.violations.map(
          (v: { id: string; impact: string; description: string; nodes: { html: string }[] }) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => n.html.slice(0, 120)),
          })
        );
      });

      expect(violations).toEqual([]);
    });
  }

  test('LCP element is the static H1, never the SVG counter scene', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'LargestContentfulPaint observer is Chromium-only');
    await page.addInitScript(() => {
      (window as unknown as { __lcpTag: string }).__lcpTag = '';
      new PerformanceObserver((list) => {
        const entries = list.getEntries() as Array<PerformanceEntry & { element?: Element | null }>;
        const last = entries[entries.length - 1];
        if (last?.element) {
          (window as unknown as { __lcpTag: string }).__lcpTag = last.element.tagName;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Trigger input to finalize LCP entry reporting in Chromium.
    await page.mouse.click(10, 10);
    await page.waitForTimeout(150);

    const lcpTag = await page.evaluate(() => (window as unknown as { __lcpTag: string }).__lcpTag);
    expect(lcpTag).toBe('H1');
  });

  test.describe('JavaScript disabled', () => {
    test.use({ javaScriptEnabled: false });

    test('entire hero + static SVG counter scene render visible with JS off', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');

      await expect(page.locator('#hero-heading')).toBeVisible();
      await expect(page.locator('[data-hero-cta="primary"]')).toBeVisible();
      await expect(page.locator('[data-hero-cta="secondary"]')).toBeVisible();
      await expect(page.locator('#hero-counter-scene svg')).toBeVisible();

      const opacities = await page
        .locator('#home-hero h1, #home-hero .hero-enter, #hero-counter-scene svg')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
      for (const o of opacities) {
        expect(o).toBe('1');
      }
    });
  });

  test.describe('prefers-reduced-motion: reduce', () => {
    test.use({ reducedMotion: 'reduce' });

    test('disables hero animations and skips fetching the GSAP chunk', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const gsapRequested = await page.evaluate(() =>
        performance.getEntriesByType('resource').some((r) => /\/_astro\/gsap\./.test(r.name))
      );
      expect(gsapRequested).toBe(false);

      const states = await page.locator('.hero-ambient-gradient, .hero-enter').evaluateAll((els) =>
        els.map((el) => ({
          anim: getComputedStyle(el).animationName,
          transform: getComputedStyle(el).transform,
        }))
      );
      for (const s of states) {
        expect(s.anim).toBe('none');
        expect(s.transform).toBe('none');
      }
    });
  });

  test.describe('GA4 analytics (North America timezone gate)', () => {
    // BaseLayout.astro and astro/src/lib/analytics.ts intentionally gate GA4 page_view
    // events to North American timezones (America/* or Pacific/Honolulu). Pin timezoneId
    // so CI runners in UTC exercise the production North American visitor path.
    test.use({ timezoneId: 'America/New_York' });

    test('GA4 analytics initializes on homepage and re-fires on client-side View Transition navigation', async ({
      page,
    }) => {
      await page.goto('/');
      // Trigger user interaction so deferred analytics loader initializes immediately.
      await page.mouse.move(60, 60);
      await page.mouse.click(60, 60);
      await page.waitForFunction(
        () =>
          typeof (window as Window & { gtag?: unknown }).gtag === 'function' &&
          typeof (window as Window & { fbq?: unknown }).fbq === 'function',
        null,
        { timeout: 5000 }
      );

      await page.evaluate(() => {
        const w = window as Window & {
          __gaEvents?: unknown[][];
          gtag?: (...args: unknown[]) => void;
        };
        w.__gaEvents = [];
        const orig = w.gtag;
        w.gtag = (...args: unknown[]) => {
          w.__gaEvents!.push(args);
          orig?.(...args);
        };
      });

      await page.locator('[data-hero-cta="secondary"]').click();
      await expect(page).toHaveURL(/\/private-mailbox-rental\/?$/);
      await page.waitForFunction(
        () =>
          ((window as Window & { __gaEvents?: unknown[][] }).__gaEvents || []).some(
            (args) => args[0] === 'event' && args[1] === 'page_view'
          ),
        null,
        { timeout: 5000 }
      );
    });
  });
});
