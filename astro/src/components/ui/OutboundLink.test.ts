import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import OutboundLink from './OutboundLink.astro';

describe('OutboundLink.astro container rendering', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders with default target _blank and automatic noopener noreferrer', async () => {
    const result = await container.renderToString(OutboundLink, {
      props: {
        href: 'https://example.com',
      },
      slots: {
        default: 'External Link',
      },
    });

    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('External Link');
    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
  });

  it('merges custom rel attributes while preserving noopener noreferrer', async () => {
    const result = await container.renderToString(OutboundLink, {
      props: {
        href: 'https://example.com',
        rel: 'nofollow',
      },
      slots: {
        default: 'Nofollow Link',
      },
    });

    expect(result).toContain('rel="nofollow noopener noreferrer"');
  });

  it('does not duplicate noopener or noreferrer if already provided in rel', async () => {
    const result = await container.renderToString(OutboundLink, {
      props: {
        href: 'https://example.com',
        rel: 'noopener nofollow',
      },
    });

    expect(result).toContain('rel="noopener nofollow noreferrer"');
  });

  it('omits automatic rel injection and sr-only text for non-external targets', async () => {
    const result = await container.renderToString(OutboundLink, {
      props: {
        href: '/internal-page/',
        target: '_self',
      },
      slots: {
        default: 'Internal Link',
      },
    });

    expect(result).toContain('href="/internal-page/"');
    expect(result).toContain('target="_self"');
    expect(result).not.toContain('rel=');
    expect(result).not.toContain('(opens in a new tab)');
    expect(result).toContain('Internal Link');
  });

  it('renders custom class names and additional HTML attributes', async () => {
    const result = await container.renderToString(OutboundLink, {
      props: {
        href: 'https://example.com',
        class: 'btn btn-primary',
        id: 'cta-outbound',
        'aria-label': 'Visit partner site',
      },
    });

    expect(result).toContain('class="btn btn-primary"');
    expect(result).toContain('id="cta-outbound"');
    expect(result).toContain('aria-label="Visit partner site"');
  });
});
