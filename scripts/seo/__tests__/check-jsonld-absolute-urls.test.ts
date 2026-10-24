import { describe, it, expect } from 'vitest';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkJsonLdAbsoluteUrls } from '../check-jsonld-absolute-urls.mjs';

describe('SEO JSON-LD Absolute URLs Check', () => {
  const distDir = resolveDistDir();

  it('runs jsonld absolute urls check on build output directory', () => {
    const res = checkJsonLdAbsoluteUrls(distDir);
    expect(res.ok, res.error || 'SEO jsonld absolute urls check failed').toBe(true);
    expect(res.failures).toBe(0);
  });
});
