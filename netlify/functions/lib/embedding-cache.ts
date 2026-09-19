import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { serverEnv } from './env';

// In-memory fallback map for query embeddings
const memoryEmbeddingCache = new Map<string, number[]>();

function getEmbeddingStore() {
  try {
    return getStore({
      name: 'query-embeddings',
      siteID: serverEnv.NETLIFY_SITE_ID,
      token: serverEnv.NETLIFY_AUTH_TOKEN,
    });
  } catch {
    return null;
  }
}

/**
 * Normalizes user query text by trimming whitespace, lowercasing, and collapsing spaces.
 */
export function normalizeQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Generates a SHA-256 hex string hash from normalized query text.
 */
export function hashQuery(query: string): string {
  const normalized = normalizeQuery(query);
  return createHash('sha256').update(normalized).digest('hex');
}

/**
 * Retrieves cached query embedding vector by SHA-256 query hash.
 * Checks Netlify Blobs first with fallback to in-memory store.
 */
export async function getCachedEmbedding(queryHash: string): Promise<number[] | null> {
  if (!queryHash) return null;

  // Check in-memory store first (faster hit)
  if (memoryEmbeddingCache.has(queryHash)) {
    return memoryEmbeddingCache.get(queryHash) || null;
  }

  try {
    const store = getEmbeddingStore();
    if (store) {
      const raw = await store.get(queryHash);
      if (raw) {
        const parsed = JSON.parse(raw) as number[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryEmbeddingCache.set(queryHash, parsed);
          return parsed;
        }
      }
    }
  } catch {
    // Netlify Blobs read failed; return in-memory cache result if any
  }

  return memoryEmbeddingCache.get(queryHash) || null;
}

/**
 * Caches query embedding vector by SHA-256 query hash into Netlify Blobs and in-memory store.
 */
export async function setCachedEmbedding(queryHash: string, embedding: number[]): Promise<void> {
  if (!queryHash || !Array.isArray(embedding)) return;

  memoryEmbeddingCache.set(queryHash, embedding);

  try {
    const store = getEmbeddingStore();
    if (store) {
      await store.set(queryHash, JSON.stringify(embedding));
    }
  } catch {
    // Ignore blob write errors, in-memory store is set
  }
}

export function resetEmbeddingCacheMemory(): void {
  memoryEmbeddingCache.clear();
}
