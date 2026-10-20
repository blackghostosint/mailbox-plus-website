import { describe, it, expect } from 'vitest';
import { parseValidDate, formatDisplayDate, toISODateString, compareDatesDesc } from './dateUtils';

describe('dateUtils', () => {
  describe('parseValidDate', () => {
    it('parses valid YYYY-MM-DD date strings', () => {
      const result = parseValidDate('2026-08-19');
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toContain('2026-08-19');
    });

    it('parses ISO timestamps with offsets', () => {
      const result = parseValidDate('2026-08-19T17:30:00-04:00');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(new Date('2026-08-19T17:30:00-04:00').getTime());
    });

    it('handles Date instances and numbers', () => {
      const now = new Date();
      expect(parseValidDate(now)).toBe(now);

      const ts = 1700000000000;
      expect(parseValidDate(ts)).toEqual(new Date(ts));
    });

    it('returns null for invalid or empty inputs', () => {
      expect(parseValidDate(null)).toBeNull();
      expect(parseValidDate(undefined)).toBeNull();
      expect(parseValidDate('')).toBeNull();
      expect(parseValidDate('not-a-date')).toBeNull();
      expect(parseValidDate(new Date('invalid'))).toBeNull();
    });
  });

  describe('formatDisplayDate', () => {
    it('formats date strings in UTC timeZone', () => {
      expect(formatDisplayDate('2026-08-19')).toBe('August 19, 2026');
      expect(formatDisplayDate('2026-08-19T00:00:00Z')).toBe('August 19, 2026');
    });

    it('formats ISO timestamps with offsets deterministically in UTC', () => {
      // 2026-08-19T23:30:00-04:00 corresponds to 2026-08-20T03:30:00.000Z
      expect(formatDisplayDate('2026-08-19T23:30:00-04:00')).toBe('August 20, 2026');
    });

    it('returns fallback string for invalid dates', () => {
      expect(formatDisplayDate(null)).toBe('N/A');
      expect(formatDisplayDate('invalid-date', 'Unknown Date')).toBe('Unknown Date');
    });

    it('supports custom formatting options', () => {
      expect(
        formatDisplayDate('2026-08-19', 'N/A', { month: 'short', day: '2-digit', year: '2-digit' })
      ).toBe('Aug 19, 26');
    });
  });

  describe('toISODateString', () => {
    it('formats valid date inputs into YYYY-MM-DD by default', () => {
      expect(toISODateString('2026-08-19T14:30:00Z')).toBe('2026-08-19');
      expect(toISODateString(new Date('2026-08-19T00:00:00Z'))).toBe('2026-08-19');
    });

    it('formats valid date inputs into full ISO string when format is iso', () => {
      expect(toISODateString('2026-08-19T14:30:00Z', 'unknown', 'iso')).toBe(
        '2026-08-19T14:30:00.000Z'
      );
    });

    it('returns fallback for invalid date inputs', () => {
      expect(toISODateString(null)).toBe('unknown');
      expect(toISODateString('bad-date', 'N/A')).toBe('N/A');
    });
  });

  describe('compareDatesDesc', () => {
    it('sorts dates in descending order (newest first)', () => {
      const dates = ['2025-01-01', '2026-08-19', '2026-01-15'];
      const sorted = [...dates].sort(compareDatesDesc);
      expect(sorted).toEqual(['2026-08-19', '2026-01-15', '2025-01-01']);
    });

    it('handles null, undefined, and invalid date inputs safely', () => {
      const items = [
        { date: null },
        { date: '2026-08-19' },
        { date: 'invalid' },
        { date: '2025-05-10' },
      ];
      items.sort((a, b) => compareDatesDesc(a.date, b.date));
      expect(items.map((i) => i.date)).toEqual(['2026-08-19', '2025-05-10', null, 'invalid']);
    });
  });
});
