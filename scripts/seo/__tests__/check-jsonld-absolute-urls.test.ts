import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkJsonLdAbsoluteUrls } from '../check-jsonld-absolute-urls.mjs';

describe('SEO JSON-LD Absolute URLs Check', () => {
  const distDir = resolveDistDir();

  it('runs jsonld absolute urls check when dist exists or handles missing dist', () => {
    if (!fs.existsSync(distDir)) {
      const res = checkJsonLdAbsoluteUrls(distDir);
      expect(res.ok).toBe(false);
      expect(res.error).toContain('does not exist');
      return;
    }

    const res = checkJsonLdAbsoluteUrls(distDir);
    expect(res.ok).toBe(true);
    expect(res.failures).toBe(0);
  });
});
