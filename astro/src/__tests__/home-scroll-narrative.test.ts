import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import IndexPage from '../pages/index.astro';
import LocationScene from '../components/LocationScene.astro';

describe('Homepage scroll narrative (DESIGN_PHASE1_SPEC §3.2, §4 Task 6)', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
    container.addServerRenderer({
      name: '@astrojs/react',
      renderer: {
        async check(Component: unknown) {
          return (
            typeof Component === 'function' ||
            (typeof Component === 'object' && Component !== null && '$$typeof' in Component)
          );
        },
        async renderToStaticMarkup(
          Component: React.ComponentType<Record<string, unknown>>,
          props: Record<string, unknown>,
          children: unknown
        ) {
          const childrenHtml =
            typeof children === 'object' && children !== null && 'default' in children
              ? (children as { default: string }).default
              : children;
          const childrenElement =
            typeof childrenHtml === 'string'
              ? React.createElement('div', { dangerouslySetInnerHTML: { __html: childrenHtml } })
              : (childrenHtml as React.ReactNode);
          const element = React.createElement(Component, props, childrenElement);
          const html = renderToStaticMarkup(element);
          return { html };
        },
      },
    });
  });

  it('renders post-hero narrative sections with at most ONE pinned section and IntersectionObserver reveal hooks', async () => {
    const html = await container.renderToString(IndexPage);

    // Hero + 3 <main> narrative sections + ReviewSection rendered by BaseLayout = 4 post-hero beats.
    expect(html).toContain('id="home-hero"');
    expect(html).toContain('id="home-services"');
    expect(html).toContain('id="visit-us"');
    expect(html).toContain('id="home-service-areas"');
    expect(html).toContain('id="reviews-section"');

    // Spec §3.2 / §4 Task 6: ONE pinned section maximum.
    const pinnedMatches = html.match(/data-home-pinned\b/g) || [];
    expect(pinnedMatches.length).toBe(1);

    // IntersectionObserver reveal attributes present across post-hero sections.
    expect((html.match(/data-reveal(-stagger)?\b/g) || []).length).toBeGreaterThanOrEqual(4);

    // Zero duplicate HTML id attributes on the entire rendered homepage.
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    expect(duplicates).toEqual([]);
  });

  it('preserves 100% of homepage copy and trailing-slash internal links', async () => {
    const html = await container.renderToString(IndexPage);

    for (const expectedText of [
      'Our Core Services',
      'Ship a Package',
      'UPS, FedEx, USPS, DHL — we compare rates and get it out same day.',
      'Return an Order',
      "FedEx, UPS, USPS — doesn't matter who the label's from, we scan it and it's gone.",
      'Private Mailbox',
      'A real street address for your business or privacy. All-carrier package acceptance, no porch theft.',
      'Notary &amp; More',
      'Notary, shredding, fingerprinting — everything else your errand list needs, one counter.',
      'Next to Pub Frato in Gristmill Village — serving all of Lake County',
      'Stop by Mailbox Plus for all your shipping, printing, and business service needs. We are ready to help you.',
      'Service Areas',
    ]) {
      expect(html).toContain(expectedText);
    }

    for (const href of [
      '/pack-ship/',
      '/pack-ship/package-receiving/',
      '/home-business/mailbox-rental/',
      '/home-business/notary-services/',
      '/service-area/concord-township/',
      '/service-area/mentor/',
      '/service-area/geneva/',
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it('renders LocationScene purely as decorative vector artwork (aria-hidden, zero text, zero raster images)', async () => {
    const sceneHtml = await container.renderToString(LocationScene);

    expect(sceneHtml).toContain('aria-hidden="true"');
    expect(sceneHtml).not.toMatch(/<img\b/i);
    expect(sceneHtml).not.toMatch(/<image\b/i);
    expect(sceneHtml).not.toMatch(/<text\b/i);
    expect(sceneHtml).not.toMatch(/<title\b/i);
    expect(sceneHtml).toContain('data-pin-routes');
    expect(sceneHtml).toContain('data-pin-halo');
    expect(sceneHtml).toContain('data-pin-marker');
    expect(sceneHtml).toContain('data-pin-card');
  });
});
