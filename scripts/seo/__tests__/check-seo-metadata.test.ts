import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkSeoMetadata, discoverServiceMetadata } from '../check-seo-metadata.ts';

describe('SEO Metadata Verification Check', () => {
  const distDir = resolveDistDir();

  it('discovers service metadata rules', () => {
    const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();
    expect(ogImageChecks.length).toBeGreaterThan(0);
    expect(imageObjectSchemaChecks.length).toBeGreaterThan(0);
  });

  it('runs seo metadata check when dist exists or handles missing dist', () => {
    if (!fs.existsSync(distDir)) {
      const res = checkSeoMetadata(distDir);
      expect(res.ok).toBe(false);
      expect(res.error).toContain('does not exist');
      return;
    }

    const res = checkSeoMetadata(distDir);
    expect(res.ok).toBe(true);
    expect(res.errors).toBe(0);
  });
});
