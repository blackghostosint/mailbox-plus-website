import { describe, it, expect } from 'vitest';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkSeoMetadata, discoverServiceMetadata } from '../check-seo-metadata.ts';

describe('SEO Metadata Verification Check', () => {
  const distDir = resolveDistDir();

  it('discovers service metadata rules', () => {
    const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();
    expect(ogImageChecks.length).toBeGreaterThan(0);
    expect(imageObjectSchemaChecks.length).toBeGreaterThan(0);
  });

  it('runs seo metadata check on build output directory', () => {
    const res = checkSeoMetadata(distDir);
    expect(res.ok, res.error || 'SEO metadata check failed').toBe(true);
    expect(res.errors).toBe(0);
  });
});
