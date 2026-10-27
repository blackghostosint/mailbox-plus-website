import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ArticleCta from './ArticleCta.astro';

describe('ArticleCta.astro container rendering', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders category data mapping for mailbox-rentals', async () => {
    const result = await container.renderToString(ArticleCta, {
      props: {
        category: 'mailbox-rentals',
        slug: 'test-mailbox-article',
      },
    });

    expect(result).toContain('data-category="mailbox-rentals"');
    expect(result).toContain('data-slug="test-mailbox-article"');
    expect(result).toContain('COMMERCIAL STREET ADDRESS · SUITE NUMBERS');
    expect(result).toContain('Stop PO Box Rejections &amp; Protect Your Home Address');
    expect(result).toContain('/home-business/mailbox-rental/');
    expect(result).toContain('Explore Mailbox Plans &amp; Pricing');
    expect(result).toContain('data-cta="article_mailbox-rentals_primary_cta"');
    expect(result).toContain('Real Street Suite Address');
    expect(result).toContain('All Carriers Accepted');
    expect(result).toContain('Personal &amp; Business Tiers');
  });

  it('renders category data mapping for pack-ship', async () => {
    const result = await container.renderToString(ArticleCta, {
      props: {
        category: 'pack-ship',
      },
    });

    expect(result).toContain('MULTI-CARRIER COUNTER · ZERO GUESSWORK');
    expect(result).toContain('Bring Your Packages in — Compare All Rates on One Screen');
    expect(result).toContain('/pack-ship/');
    expect(result).toContain('See Pack &amp; Ship Services');
    expect(result).toContain('data-cta="article_pack-ship_primary_cta"');
  });

  it('renders category data mapping for notary, document-services, and printing', async () => {
    const notaryResult = await container.renderToString(ArticleCta, {
      props: { category: 'notary' },
    });
    expect(notaryResult).toContain('Licensed Notary Public Always on Duty During Business Hours');
    expect(notaryResult).toContain('/home-business/notary-services/');

    const docResult = await container.renderToString(ArticleCta, {
      props: { category: 'document-services' },
    });
    expect(docResult).toContain('Shredding, High-Res Scanning &amp; Secure Fax Made Simple');
    expect(docResult).toContain('/document-services-concord-township/');

    const printResult = await container.renderToString(ArticleCta, {
      props: { category: 'printing' },
    });
    expect(printResult).toContain('Copies, Flyers &amp; Local Print Runs Handled by Real People');
    expect(printResult).toContain('/copy-print/');
  });

  it('renders fallback CTA data for unknown or empty categories', async () => {
    const result = await container.renderToString(ArticleCta, {
      props: {
        category: 'unknown-category',
      },
    });

    expect(result).toContain('CONCORD TOWNSHIP · INDEPENDENT BUSINESS HUB');
    expect(result).toContain('Done in Under 3 Minutes at 7554 Fredle Drive');
    expect(result).toContain('Explore All Services');
    expect(result).toContain('href="/services/"');
  });

  it('respects headingLevel prop variations (h2, h3, h4)', async () => {
    const h2Result = await container.renderToString(ArticleCta, {
      props: { category: 'pack-ship', headingLevel: 'h2' },
    });
    expect(h2Result).toContain('<h2');

    const h3Result = await container.renderToString(ArticleCta, {
      props: { category: 'pack-ship', headingLevel: 'h3' },
    });
    expect(h3Result).toContain('<h3');

    const h4Result = await container.renderToString(ArticleCta, {
      props: { category: 'pack-ship', headingLevel: 'h4' },
    });
    expect(h4Result).toContain('<h4');
  });
});
