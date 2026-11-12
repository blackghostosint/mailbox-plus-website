import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HomeHero from './HomeHero.astro';
import CounterScene from './CounterScene.astro';
import reviewsData from '../data/reviews.json';

describe('HomeHero.astro + CounterScene.astro rendering (DESIGN_PHASE1_SPEC §3.1 Task 5)', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders eyebrow, static LCP H1, supporting copy, and dual CTAs with trailing slashes', async () => {
    const html = await container.renderToString(HomeHero);

    expect(html).toContain('CONCORD TOWNSHIP, OH — PACK &amp; SHIP HUB');
    expect(html).toContain('Four carriers.');
    expect(html).toContain('One counter.');
    expect(html).toContain('No runaround.');
    expect(html).toContain(
      "Shipping shouldn't cost you an hour. Stop running around Lake County for returns or carrier drop-offs."
    );
    expect(html).toContain('href="/pack-ship/package-drop-offs/"');
    expect(html).toContain('Drop Off a Return');
    expect(html).toContain('href="/private-mailbox-rental/"');
    expect(html).toContain('Rent a Mailbox');

    // H1 is the static LCP node — never given an entrance animation class.
    const h1Match = html.match(/<h1[^>]*>/);
    expect(h1Match).not.toBeNull();
    expect(h1Match![0]).not.toContain('hero-enter');
  });

  it('reuses live review badge data from reviews.json and renders monochrome carrier strip', async () => {
    const html = await container.renderToString(HomeHero);

    expect(html).toContain(`id="hero-reviews-rating">${reviewsData.rating}</span>`);
    expect(html).toContain(`id="hero-reviews-count">${reviewsData.userRatingCount}</span>`);
    expect(html).toContain('verified Google reviews');

    for (const carrier of ['UPS', 'FedEx', 'USPS', 'DHL']) {
      expect(html).toContain(`<span class="sr-only">${carrier}</span>`);
    }
  });

  it('contains zero raster photography in the hero and marks CounterScene aria-hidden within 5–15KB', async () => {
    const heroHtml = await container.renderToString(HomeHero);
    const sceneHtml = await container.renderToString(CounterScene);

    // Brand rule: no photography / raster images in hero.
    expect(heroHtml).not.toMatch(/<img\b/i);
    expect(sceneHtml).not.toMatch(/<image\b/i);

    expect(sceneHtml).toContain('aria-hidden="true"');
    expect(sceneHtml).toContain('data-scene-box-main');
    expect(sceneHtml).toContain('data-scene-label');
    expect(sceneHtml).toContain('data-scene-scanline');
    expect(sceneHtml).toContain('data-scene-alpacka');

    const byteLength = Buffer.byteLength(sceneHtml, 'utf8');
    expect(byteLength).toBeGreaterThanOrEqual(5 * 1024);
    expect(byteLength).toBeLessThanOrEqual(15 * 1024);
  });
});
