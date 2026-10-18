import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkCanonicalSlash } from '../check-canonical-slash.mjs';

describe('SEO Canonical Trailing Slash Check', () => {
  const distDir = resolveDistDir();

  it('runs canonical slash check when dist exists or handles missing dist gracefully', () => {
    if (!fs.existsSync(distDir)) {
      const res = checkCanonicalSlash(distDir);
      expect(res.ok).toBe(false);
      expect(res.error).toContain('does not exist');
      return;
    }

    const res = checkCanonicalSlash(distDir);
    expect(res.ok).toBe(true);
    expect(res.failures).toBe(0);
  });
});
