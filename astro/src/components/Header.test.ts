import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Header from './Header.astro';
import { siteConfig } from '../config/siteConfig';

describe('Header.astro container rendering', () => {
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

  it('renders top bar phone link, location, and hours from siteConfig', async () => {
    const result = await container.renderToString(Header);
    const expectedPhoneDigits = siteConfig.contact.phone.replace(/[^0-9]/g, '');

    expect(result).toContain(`href="tel:${expectedPhoneDigits}"`);
    expect(result).toContain(siteConfig.contact.phone);
    expect(result).toContain('Concord Township, OH');
    expect(result).toContain('Mon-Fri: 9AM-6PM | Sat: 9AM-2PM');
  });

  it('renders logo image with proper source and alt attributes', async () => {
    const result = await container.renderToString(Header);

    expect(result).toContain('src="/logo.webp"');
    expect(result).toContain('alt="Mailbox Plus - Concord Township, OH"');
    expect(result).toContain('href="/"');
  });

  it('includes navigation items rendered in HeaderNav island', async () => {
    const result = await container.renderToString(Header);

    expect(result).toContain('Home');
    expect(result).toContain('Services');
    expect(result).toContain('Track Your Package');
    expect(result).toContain('Pickup Hours');
    expect(result).toContain('Contact');
    expect(result).toContain('Mailbox Rental');
    expect(result).toContain('Amazon Returns');
  });
});
