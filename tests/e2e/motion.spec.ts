import { test, expect, type Page } from '@playwright/test';

// Motion layer guard rails (DESIGN_PHASE1_SPEC §1, §4 Task 3): scroll reveals and
// micro-interactions must never hide content without JS, must be fully static under
// prefers-reduced-motion, and must not cause layout shift.
const SERVICE_PAGE = '/pack-ship/';
const ARTICLE_PAGE = '/articles/24-7-mail-access/';

async function revealTargets(page: Page) {
  return page.locator('[data-reveal], [data-reveal-stagger]');
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight / 2));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
}

test.describe('Motion layer (scroll reveals + micro-interactions)', () => {
  test('content below the fold reveals once on scroll and ends fully visible', async ({ page }) => {
    await page.goto(SERVICE_PAGE);
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'ready');
    const pendingBefore = await page.locator('.reveal-pending').count();
    expect(pendingBefore).toBeGreaterThan(0);

    await scrollThrough(page);
    await expect(page.locator('.reveal-pending')).toHaveCount(0);
    // After the reveal settles every target is opaque and untransformed.
    await page.waitForTimeout(1300);
    const states = await (
      await revealTargets(page)
    ).evaluateAll((els) =>
      els.map((el) => ({ o: getComputedStyle(el).opacity, t: getComputedStyle(el).transform }))
    );
    for (const s of states) {
      expect(s.o).toBe('1');
      expect(s.t).toBe('none');
    }
    // once: true — scrolling back up does not re-hide anything.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await expect(page.locator('.reveal-pending')).toHaveCount(0);
  });

  test('never hides anything that is visible in the first viewport', async ({ page }) => {
    await page.goto(SERVICE_PAGE);
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'ready');
    const hiddenAboveFold = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('.reveal-pending')).filter(
          (el) => el.getBoundingClientRect().top < window.innerHeight
        ).length
    );
    expect(hiddenAboveFold).toBe(0);
  });

  test.describe('prefers-reduced-motion: reduce', () => {
    test.use({ reducedMotion: 'reduce' });

    test('page is fully static: no hidden state, no transitions, no hover movement', async ({
      page,
    }) => {
      await page.goto(SERVICE_PAGE);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.reveal-pending')).toHaveCount(0);
      // Motion chunk is never requested.
      const motionChunk = await page.evaluate(() =>
        performance.getEntriesByType('resource').some((r) => /\/_astro\/motion\./.test(r.name))
      );
      expect(motionChunk).toBe(false);

      const moving = await page.evaluate(() => {
        const els = document.querySelectorAll('.motion-press, .motion-lift');
        return Array.from(els).filter((el) => {
          const d = getComputedStyle(el)
            .transitionDuration.split(',')
            .map((v) => parseFloat(v));
          return d.some((v) => v > 0.001);
        }).length;
      });
      expect(moving).toBe(0);

      const card = page.locator('.motion-lift').first();
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    });
  });

  test.describe('JavaScript disabled', () => {
    test.use({ javaScriptEnabled: false });

    test('every reveal target is visible in the static HTML', async ({ page }) => {
      await page.goto(SERVICE_PAGE);
      const targets = await revealTargets(page);
      expect(await targets.count()).toBeGreaterThan(0);
      const states = await targets.evaluateAll((els) =>
        els.map((el) => ({
          o: getComputedStyle(el).opacity,
          pending: el.classList.contains('reveal-pending'),
        }))
      );
      for (const s of states) {
        expect(s.pending).toBe(false);
        expect(s.o).toBe('1');
      }
    });
  });

  test('tier-3 article pages stay calm: no scroll reveals', async ({ page }) => {
    await page.goto(ARTICLE_PAGE);
    await page.waitForLoadState('networkidle');
    await scrollThrough(page);
    await expect(page.locator('.reveal-pending, .reveal-in')).toHaveCount(0);
    expect(await page.locator('html').getAttribute('data-motion-tier')).toBe('calm');
  });

  test('zero cumulative layout shift from load through full scroll', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only');
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<
          PerformanceEntry & { value: number; hadRecentInput: boolean }
        >) {
          if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    for (const path of [SERVICE_PAGE, '/']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await scrollThrough(page);
      await page.waitForTimeout(1300);
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls, `CLS on ${path}`).toBeLessThan(0.001);
    }
  });
});
