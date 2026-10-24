import { describe, it, expect } from 'vitest';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkInternalHrefSlash, isBadInternal } from '../check-internal-href-slash.mjs';

describe('SEO Internal Href Trailing Slash Check', () => {
  const distDir = resolveDistDir();

  it('correctly identifies bad internal URLs lacking trailing slash', () => {
    expect(isBadInternal('/services')).toBe(true);
    expect(isBadInternal('/contact-us')).toBe(true);

    expect(isBadInternal('/')).toBe(false);
    expect(isBadInternal('/services/')).toBe(false);
    expect(isBadInternal('/logo.png')).toBe(false);
    expect(isBadInternal('https://example.com')).toBe(false);
  });

  it('runs internal href slash check on build output directory', () => {
    const res = checkInternalHrefSlash(distDir);
    expect(res.ok, res.error || 'SEO internal href slash check failed').toBe(true);
    expect(res.offenders.size).toBe(0);
  });
});
