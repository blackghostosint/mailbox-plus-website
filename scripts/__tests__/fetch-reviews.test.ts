import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { transformPlacesData, fetchAndSaveReviews } from '../fetch-reviews.mjs';

describe('fetch-reviews', () => {
  let tmpFile: string;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let originalApiKey: string | undefined;

  beforeEach(() => {
    tmpFile = path.join(
      os.tmpdir(),
      `test-reviews-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    originalApiKey = process.env.GOOGLE_PLACES_API_KEY;
  });

  afterEach(() => {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
    consoleWarnSpy.mockRestore();
    if (originalApiKey !== undefined) {
      process.env.GOOGLE_PLACES_API_KEY = originalApiKey;
    } else {
      delete process.env.GOOGLE_PLACES_API_KEY;
    }
  });

  describe('transformPlacesData', () => {
    it('correctly transforms raw Google Places API payload into site schema', () => {
      const rawApiData = {
        rating: 4.9,
        userRatingCount: 85,
        reviews: [
          {
            authorAttribution: {
              displayName: 'Jane Smith',
              uri: 'https://maps.google.com/users/123',
            },
            rating: 5,
            text: { text: 'Excellent service and helpful staff!' },
            relativePublishTimeDescription: '2 weeks ago',
            publishTime: '2026-03-01T12:00:00Z',
          },
        ],
      };

      const result = transformPlacesData(rawApiData);

      expect(result.rating).toBe(4.9);
      expect(result.userRatingCount).toBe(85);
      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0]).toEqual({
        author: 'Jane Smith',
        authorUri: 'https://maps.google.com/users/123',
        rating: 5,
        text: 'Excellent service and helpful staff!',
        relativeTime: '2 weeks ago',
        publishTime: '2026-03-01T12:00:00Z',
      });
      expect(result.fetchedAt).toBeDefined();
      expect(result.note).toContain('scripts/fetch-reviews.mjs');
    });

    it('applies fallback default values for missing author names and ratings', () => {
      const rawApiDataWithMissingFields = {
        rating: 4.8,
        userRatingCount: 10,
        reviews: [
          {
            // missing authorAttribution.displayName and rating
            text: { text: 'Great place' },
          },
        ],
      };

      const result = transformPlacesData(rawApiDataWithMissingFields);

      expect(result.reviews[0].author).toBe('Google User');
      expect(result.reviews[0].rating).toBe(5);
      expect(result.reviews[0].authorUri).toBe('');
    });
  });

  describe('fetchAndSaveReviews', () => {
    it('handles missing GOOGLE_PLACES_API_KEY gracefully without throwing', async () => {
      delete process.env.GOOGLE_PLACES_API_KEY;

      const result = await fetchAndSaveReviews({ apiKey: undefined, outFile: tmpFile });

      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);
      expect(result.reason).toBe('missing_api_key');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('GOOGLE_PLACES_API_KEY not set')
      );
      expect(fs.existsSync(tmpFile)).toBe(false);
    });

    it('handles non-200 HTTP status codes gracefully without throwing', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      });

      const result = await fetchAndSaveReviews({
        apiKey: 'test-api-key',
        outFile: tmpFile,
        fetchFn: mockFetch,
      });

      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);
      expect(result.status).toBe(403);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Places API error 403'));
      expect(fs.existsSync(tmpFile)).toBe(false);
    });

    it('writes formatted JSON output to target output file on successful fetch', async () => {
      const mockApiData = {
        rating: 5.0,
        userRatingCount: 42,
        reviews: [
          {
            authorAttribution: { displayName: 'Alice' },
            rating: 5,
            text: { text: 'A+ service' },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiData,
      });

      const result = await fetchAndSaveReviews({
        apiKey: 'valid-test-key',
        outFile: tmpFile,
        fetchFn: mockFetch,
      });

      expect(result.success).toBe(true);
      expect(fs.existsSync(tmpFile)).toBe(true);

      const writtenContent = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'));
      expect(writtenContent.rating).toBe(5.0);
      expect(writtenContent.userRatingCount).toBe(42);
      expect(writtenContent.reviews[0].author).toBe('Alice');
    });
  });
});
