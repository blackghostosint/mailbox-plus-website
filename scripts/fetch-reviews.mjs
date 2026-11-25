#!/usr/bin/env node
/**
 * fetch-reviews.mjs — prebuild script for the Mailbox Plus website.
 *
 * Fetches live Google reviews + aggregate rating from the Places API (New)
 * Place Details endpoint and writes them to astro/src/data/reviews.json so
 * the static build ships real review content (SEO: Googlebot sees the review
 * text in the HTML) and the LocalBusiness schema stays in sync.
 *
 * Failure behavior: if the fetch fails (no key, network, quota), the script
 * exits 0 and leaves the existing reviews.json in place — the build must
 * NEVER break because review data is stale. The committed fallback snapshot
 * (astro/src/data/reviews.json) covers first-build and keyless environments.
 *
 * Env: GOOGLE_PLACES_API_KEY
 */

import path from 'node:path';
import { httpClient } from '../astro/src/lib/http-client.ts';
import {
  PLACES_PLACE_ID,
  PLACES_API_URL,
  PLACES_FIELD_MASK,
  transformPlacesData as transformSharedPlacesData,
} from '../shared/placesReviews.ts';
import { getWorkspaceRoot, atomicWriteJsonSync } from './lib/workspace-paths.ts';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';

export const OUT_FILE = path.resolve(getWorkspaceRoot(), 'astro/src/data/reviews.json');
export { PLACES_PLACE_ID as PLACE_ID, PLACES_API_URL as API_URL, PLACES_FIELD_MASK as FIELD_MASK };

const BUILD_SNAPSHOT_NOTE = 'Refreshed at build time by scripts/fetch-reviews.mjs';

export function transformPlacesData(data = {}) {
  return transformSharedPlacesData(data, { note: BUILD_SNAPSHOT_NOTE });
}

export async function fetchAndSaveReviews(options = {}) {
  const apiKey = options.apiKey ?? process.env.GOOGLE_PLACES_API_KEY;
  const placeId = options.placeId || PLACES_PLACE_ID;
  const outFile = options.outFile || OUT_FILE;
  const fetchFn = options.fetchFn;

  if (!apiKey) {
    console.warn('[fetch-reviews] GOOGLE_PLACES_API_KEY not set — keeping existing reviews.json');
    return { success: false, skipped: true, reason: 'missing_api_key' };
  }

  const apiUrl =
    placeId === PLACES_PLACE_ID
      ? PLACES_API_URL
      : `https://places.googleapis.com/v1/places/${placeId}`;
  try {
    const data = await httpClient(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': PLACES_FIELD_MASK,
      },
      timeout: 10000,
      maxRetries: 3,
      fetch: fetchFn,
    });

    const payload = transformPlacesData(data);

    atomicWriteJsonSync(outFile, payload, 2);
    console.log(
      `[fetch-reviews] Wrote ${payload.reviews.length} reviews, rating ${payload.rating}, count ${payload.userRatingCount} → ${outFile}`
    );

    return { success: true, payload };
  } catch (err) {
    if (err.status) {
      console.warn(
        `[fetch-reviews] Places API error ${err.status} — keeping existing reviews.json`
      );
      return { success: false, skipped: true, status: err.status };
    }
    console.warn('[fetch-reviews] fetch failed — keeping existing reviews.json:', err.message);
    return { success: false, skipped: true, error: err.message };
  }
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  fetchAndSaveReviews()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.warn('[fetch-reviews] fetch failed — keeping existing reviews.json:', err.message);
      process.exit(0);
    });
}
