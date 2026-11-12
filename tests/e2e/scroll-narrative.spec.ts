import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';

const AXE_PATH = path.resolve(process.cwd(), 'node_modules/axe-core/axe.min.js');
const ARTICLE_PAGE = '/articles/24-7-mail-access/';

async function scrollThroughHome(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(220, Math.floor(window.innerHeight / 2));
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 55));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
}

test.describe('Homepage scroll narrative (DESIGN_PHASE1_SPEC §3.2, §4 Task 6)', () => {
  test('renders 4 post-hero narrative beats with strictly ONE pinned section at desktop 1440x900', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('#home-services')).toBeVisible();
    await expect(page.locator('#visit-us')).toBeVisible();
    await expect(page.locator('#home-service-areas')).toBeVisible();
    await expect(page.locator('#reviews-section')).toBeVisible();

    // Spec §3.2 / Task 6: ONE pinned section maximum.
    await expect(page.locator('[data-home-pinned]')).toHaveCount(1);
    const pinStage = page.locator('#visit-us .home-pin-stage');
    await expect(pinStage).toBeVisible();
    const stagePosition = await pinStage.evaluate((el) => getComputedStyle(el).position);
    expect(stagePosition).toBe('sticky');

    // No other <main> section or child uses sticky/fixed positioning.
    const otherPinnedCount = await page.evaluate(() => {
      const mainEls = Array.from(document.querySelectorAll('main section, main section > div'));
      return mainEls.filter((el) => {
        if (el.classList.contains('home-pin-stage')) return false;
        const pos = getComputedStyle(el).position;
        return pos === 'sticky' || pos === 'fixed';
      }).length;
    });
    expect(otherPinnedCount).toBe(0);
  });

  test('reveals below-fold homepage sections once via IntersectionObserver and scrubs pinned stage with transform/opacity only', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'ready');
    await page.waitForFunction(
      () => document.getElementById('visit-us')?.dataset.scrollReady === 'true'
    );

    const initialPending = await page.locator('.reveal-pending').count();
    expect(initialPending).toBeGreaterThan(0);

    // Scroll into the pinned #visit-us runway and verify transform progress advances monotonically.
    const pinTop = await page
      .locator('#visit-us')
      .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 520)), pinTop);
    let earlyScaleX = 0;
    await expect
      .poll(async () => {
        earlyScaleX = await page.locator('[data-pin-progress]').evaluate((el) => {
          const m = (el as HTMLElement).style.transform.match(/scaleX\(([0-9.]+)\)/);
          return m ? parseFloat(m[1]) : 0;
        });
        return earlyScaleX;
      })
      .toBeGreaterThan(0);

    await page.evaluate((y) => window.scrollTo(0, y + 260), pinTop);
    await expect
      .poll(async () => {
        return page.locator('[data-pin-progress]').evaluate((el) => {
          const m = (el as HTMLElement).style.transform.match(/scaleX\(([0-9.]+)\)/);
          return m ? parseFloat(m[1]) : 0;
        });
      })
      .toBeGreaterThan(earlyScaleX);

    // Complete scroll through full narrative -> all reveals complete once and settle cleanly.
    await scrollThroughHome(page);
    await expect(page.locator('.reveal-pending')).toHaveCount(0);
    await page.waitForTimeout(1250);

    const revealedStates = await page
      .locator('[data-reveal], [data-reveal-stagger] > *')
      .evaluateAll((els) =>
        els.map((el) => ({
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
        }))
      );
    for (const s of revealedStates) {
      expect(s.opacity).toBe('1');
      expect(s.transform).toBe('none');
    }

    // once: true — scrolling back to top never re-hides revealed sections.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(180);
    await expect(page.locator('.reveal-pending')).toHaveCount(0);
  });

  test('maintains CLS < 0.001 (<= 0.05 gate) across full homepage scroll narrative', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'layout-shift PerformanceObserver is Chromium-only');
    await page.addInitScript(() => {
      (window as unknown as { __homeCls: number }).__homeCls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<
          PerformanceEntry & { value: number; hadRecentInput: boolean }
        >) {
          if (!entry.hadRecentInput) {
            (window as unknown as { __homeCls: number }).__homeCls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    for (const vp of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await scrollThroughHome(page);
      await page.waitForTimeout(1250);
      const cls = await page.evaluate(() => (window as unknown as { __homeCls: number }).__homeCls);
      expect(cls, `CLS at ${vp.width}x${vp.height}`).toBeLessThan(0.001);
    }
  });

  for (const vp of [
    { width: 1440, height: 900, label: 'desktop 1440x900' },
    { width: 390, height: 844, label: 'mobile 390x844' },
  ]) {
    test(`passes WCAG 2.1 AA axe-core audit across scrolled homepage at ${vp.label}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await scrollThroughHome(page);
      await page.waitForTimeout(1250);

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

  test.describe('prefers-reduced-motion: reduce', () => {
    test.use({ reducedMotion: 'reduce' });

    test('renders a 100% static readable homepage with sticky pin disabled and zero motion JS chunks fetched', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await scrollThroughHome(page);

      await expect(page.locator('.reveal-pending')).toHaveCount(0);

      const pinStagePos = await page
        .locator('#visit-us .home-pin-stage')
        .evaluate((el) => getComputedStyle(el).position);
      expect(pinStagePos).toBe('relative');

      const scrollReady = await page
        .locator('#visit-us')
        .evaluate((el) => (el as HTMLElement).dataset.scrollReady);
      expect(scrollReady).toBeUndefined();

      const chunksRequested = await page.evaluate(() =>
        performance
          .getEntriesByType('resource')
          .some((r) => /\/_astro\/(gsap|motion)\./.test(r.name))
      );
      expect(chunksRequested).toBe(false);

      const layerStates = await page
        .locator('[data-pin-progress], .home-svg-layer, [data-parallax-layer], .home-card-accent')
        .evaluateAll((els) =>
          els.map((el) => ({
            opacity: getComputedStyle(el).opacity,
            transform: getComputedStyle(el).transform,
          }))
        );
      for (const s of layerStates) {
        expect(s.opacity).toBe('1');
        expect(s.transform).toBe('none');
      }
    });
  });

  test.describe('JavaScript disabled', () => {
    test.use({ javaScriptEnabled: false });

    test('renders all homepage narrative sections, links, and LocationScene visible without JS', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');

      await expect(page.locator('#home-services h3')).toHaveCount(4);
      await expect(page.locator('#visit-us')).toBeVisible();
      await expect(page.locator('#visit-location-scene svg')).toBeVisible();
      await expect(page.locator('#home-service-areas a')).toHaveCount(12);
      await expect(page.locator('#reviews-section')).toBeVisible();

      const opacities = await page
        .locator('#home-services, #visit-us, #home-service-areas, #visit-location-scene svg')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
      for (const o of opacities) {
        expect(o).toBe('1');
      }
    });
  });

  test('keeps tier-3 article pages calm with zero homepage scroll scripts or reveals', async ({
    page,
  }) => {
    await page.goto(ARTICLE_PAGE);
    await page.waitForLoadState('networkidle');
    await scrollThroughHome(page);

    expect(await page.locator('html').getAttribute('data-motion-tier')).toBe('calm');
    await expect(page.locator('.reveal-pending, .reveal-in, [data-home-pinned]')).toHaveCount(0);

    const homeScriptsLoaded = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((r) => /\/_astro\/(gsap|HomeHero|index\.astro)/.test(r.name))
    );
    expect(homeScriptsLoaded).toBe(false);
  });

  test.describe('GA4 analytics + View Transition round-trip (North America timezone gate)', () => {
    test.use({ timezoneId: 'America/New_York' });

    test('fires GA4 page_view when navigating from scroll narrative card and re-mounts cleanly on return to /', async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
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
          __gaScrollEvents?: unknown[][];
          gtag?: (...args: unknown[]) => void;
        };
        w.__gaScrollEvents = [];
        const orig = w.gtag;
        w.gtag = (...args: unknown[]) => {
          w.__gaScrollEvents!.push(args);
          orig?.(...args);
        };
      });

      // Click a service-area link in the post-hero narrative and verify GA4 page_view fires.
      const areaLink = page.locator('#home-service-areas a[href="/service-area/mentor/"]');
      await areaLink.scrollIntoViewIfNeeded();
      await areaLink.click({ force: true });

      await expect(page).toHaveURL(/\/service-area\/mentor\/?$/);
      await page.waitForFunction(
        () =>
          ((window as Window & { __gaScrollEvents?: unknown[][] }).__gaScrollEvents || []).some(
            (args) => args[0] === 'event' && args[1] === 'page_view'
          ),
        null,
        { timeout: 5000 }
      );

      // Navigate back to / via persistent header logo and confirm home-scroll re-mounts cleanly.
      await page.locator('header a[href="/"]').first().click();
      await expect(page).toHaveURL(/\/$/);
      await page.waitForFunction(
        () => document.getElementById('visit-us')?.dataset.scrollReady === 'true'
      );
    });
  });
});
