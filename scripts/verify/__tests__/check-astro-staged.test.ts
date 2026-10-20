import { describe, it, expect } from 'vitest';
import { checkAstroStaged } from '../../check-astro-staged.mjs';

describe('check-astro-staged.mjs', () => {
  it('returns success when no .astro files are passed', async () => {
    const result = await checkAstroStaged([]);
    expect(result.success).toBe(true);
    expect(result.stagedCount).toBe(0);
    expect(result.stagedErrorsCount).toBe(0);
  });

  it('passes on clean staged .astro file (index.astro)', async () => {
    const result = await checkAstroStaged(['astro/src/pages/index.astro']);
    expect(result.success).toBe(true);
    expect(result.stagedCount).toBe(1);
    expect(result.stagedErrorsCount).toBe(0);
  }, 30000);

  it('filters non-astro files from argument list', async () => {
    const result = await checkAstroStaged(['package.json', 'astro/src/pages/index.astro']);
    expect(result.success).toBe(true);
    expect(result.stagedCount).toBe(1);
  }, 30000);
});
