import { describe, it, expect } from 'vitest';
import { getAnchorText } from './internal-links';

describe('internal-links deterministic', () => {
  it('returns the same anchor text for the same serviceId and variant', () => {
    const serviceId = 'pack-ship';
    const variant = 'exact';

    const firstCall = getAnchorText(serviceId, variant);
    const secondCall = getAnchorText(serviceId, variant);

    expect(firstCall).toBe(secondCall);
  });

  it('returns different anchor text for different serviceIds (likely)', () => {
    const first = getAnchorText('pack-ship', 'exact');
    const second = getAnchorText('copy-print', 'exact');

    expect(first).not.toBe(second);
  });
});
