import { describe, it, expect } from 'vitest';
import { hashString } from './hash-helpers';

describe('hashString', () => {
  it('returns 0 for empty string', () => {
    expect(hashString('')).toBe(0);
  });

  it('produces deterministic output across repeated calls with identical input', () => {
    const input = 'mailbox-plus-concord-township';
    const first = hashString(input);
    for (let i = 0; i < 50; i++) {
      expect(hashString(input)).toBe(first);
    }
  });

  it('computes exact expected 32-bit integer for a known string', () => {
    // Manually verified: 'test' -> 't'(116)*31 + 'e'(101) = 3697; *31 + 's'(115) = 114722; *31 + 't'(116) = 3556498
    expect(hashString('test')).toBe(3556498);
  });

  it('is sensitive to seed changes', () => {
    const hash1 = hashString('pack-ship-exact-/services/');
    const hash2 = hashString('pack-ship-exact-/services/pack-ship/');
    const hash3 = hashString('pack-ship-lsi-/services/');

    expect(hash1).not.toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash2).not.toBe(hash3);
  });

  it('handles unicode and special characters deterministically', () => {
    const input = '📦 Mailbox Plus® — Concord Twp, OH 44077! #123';
    const h1 = hashString(input);
    const h2 = hashString(input);
    expect(h1).toBe(h2);
    expect(typeof h1).toBe('number');
    expect(Number.isInteger(h1)).toBe(true);
  });

  it('always produces a 32-bit signed integer', () => {
    const longInput = 'A'.repeat(10000);
    const result = hashString(longInput);
    expect(result).toBeGreaterThanOrEqual(-2147483648);
    expect(result).toBeLessThanOrEqual(2147483647);
    expect(result | 0).toBe(result);
  });
});
