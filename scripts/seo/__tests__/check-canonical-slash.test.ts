import { describe, it, expect } from 'vitest';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkCanonicalSlash } from '../check-canonical-slash.mjs';

describe('SEO Canonical Trailing Slash Check', () => {
  const distDir = resolveDistDir();

  it('runs canonical slash check on build output directory', () => {
    const res = checkCanonicalSlash(distDir);
    expect(res.ok, res.error || 'SEO canonical check failed').toBe(true);
    expect(res.failures).toBe(0);
  });
});
