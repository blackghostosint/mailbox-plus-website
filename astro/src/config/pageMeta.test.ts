import { describe, it, expect } from 'vitest';
import { pageMeta, getPageMeta } from './pageMeta';
import { getSchemaGraph } from '../utils/schema';
import { siteConfig } from './siteConfig';

describe('pageMeta configuration and getPageMeta helper', () => {
  it('contains expected route keys and geo metadata', () => {
    expect(pageMeta['/']).toBeDefined();
    expect(pageMeta['/about-us']).toBeDefined();
    expect(pageMeta['/services']).toBeDefined();

    expect(pageMeta['/'].geoRegion).toBe('US-OH');
    expect(pageMeta['/'].geoPlacename).toBe('Concord Township');
    expect(pageMeta['/'].geoPosition).toBeDefined();
    expect(pageMeta['/'].icbm).toBeDefined();
  });

  it('getPageMeta resolves route metadata regardless of trailing slash', () => {
    const aboutMetaWithoutSlash = getPageMeta('/about-us');
    const aboutMetaWithSlash = getPageMeta('/about-us/');

    expect(aboutMetaWithoutSlash).toBeDefined();
    expect(aboutMetaWithSlash).toBeDefined();
    expect(aboutMetaWithoutSlash?.title).toBe('About Us | Mailbox Plus');
    expect(aboutMetaWithSlash?.title).toBe('About Us | Mailbox Plus');
  });

  it('getPageMeta resolves home page correctly', () => {
    const homeMeta = getPageMeta('/');
    expect(homeMeta).toBeDefined();
    expect(homeMeta?.title).toContain('Mailbox Plus');
  });

  it('merges pageMeta schema into getSchemaGraph without duplicating @id entities', () => {
    const routeMeta = getPageMeta('/');
    expect(routeMeta?.schema).toBeDefined();

    const result = getSchemaGraph(siteConfig, routeMeta?.schema || [], {
      title: routeMeta?.title,
      description: routeMeta?.description,
      canonicalUrl: 'https://mailboxplusohio.com/',
    });

    expect(result['@graph']).toBeDefined();
    const localBusinessNodes = result['@graph'].filter(
      (node) =>
        node['@type'] === 'LocalBusiness' ||
        node['@id'] === 'https://mailboxplusohio.com#localbusiness'
    );
    // Should be deduplicated so only 1 LocalBusiness node exists
    expect(localBusinessNodes.length).toBe(1);
  });
});
