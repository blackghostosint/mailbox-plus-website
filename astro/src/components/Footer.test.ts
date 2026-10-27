import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Footer from './Footer.astro';
import { siteConfig } from '../config/siteConfig';

describe('Footer.astro container rendering', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders tagline and site configuration info', async () => {
    const result = await container.renderToString(Footer);

    expect(result).toContain(siteConfig.name);
    expect(result).toContain('Concord Township, Painesville, Mentor, and all of Lake County, Ohio');
    expect(result).toContain('/logo.webp');
    // Escaped apostrophe in tagline "Shipping shouldn't cost you an hour."
    expect(result).toMatch(/Shipping shouldn(&#39;|')t cost you an hour\./);
  });

  it('renders contact details including phone tel: link and email mailto: link', async () => {
    const result = await container.renderToString(Footer);
    const expectedPhoneDigits = siteConfig.contact.phone.replace(/[^0-9]/g, '');

    expect(result).toContain(`href="tel:${expectedPhoneDigits}"`);
    expect(result).toContain(siteConfig.contact.phone);
    expect(result).toContain(`href="mailto:${siteConfig.contact.email}"`);
    expect(result).toContain(siteConfig.contact.email);
    expect(result).toContain(siteConfig.contact.address.street);
    expect(result).toContain(siteConfig.contact.address.city);
  });

  it('renders store hours from siteConfig', async () => {
    const result = await container.renderToString(Footer);

    Object.entries(siteConfig.hours).forEach(([day, hours]) => {
      const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
      expect(result).toContain(`${capitalizedDay}:`);
      expect(result).toContain(hours as string);
    });
  });

  it('renders service navigation items and legal links', async () => {
    const result = await container.renderToString(Footer);

    expect(result).toContain('href="/pack-ship/"');
    expect(result).toContain('href="/copy-print/"');
    expect(result).toContain('href="/private-mailbox-rental/"');
    expect(result).toContain('href="/accessibility/"');
    expect(result).toContain('href="/privacy/"');
    expect(result).toContain('href="/terms/"');
    expect(result).toContain('© 2025 Mailbox Plus of Ohio, LLC. All rights reserved.');
  });

  it('contains google-add-preferred-source-btn container with fallback text', async () => {
    const result = await container.renderToString(Footer);

    expect(result).toContain('google-add-preferred-source-btn');
    expect(result).toContain(
      '<span class="sr-only">Add Mailbox Plus as a preferred source on Google</span>'
    );
  });
});
