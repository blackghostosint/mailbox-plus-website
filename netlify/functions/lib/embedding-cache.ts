import { createHash } from 'node:crypto';
import { BoundedMemoryCache, BlobCacheAdapter } from './cache';

// In-memory fallback cache for query embeddings capped at 500 entries
const memoryEmbeddingCache = new BoundedMemoryCache<number[]>({ maxEntries: 500 });
const embeddingBlobCache = new BlobCacheAdapter<number[]>('query-embeddings');

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
 * Checks in-memory cache first with fallback to Netlify Blobs storage adapter.
 */
export async function getCachedEmbedding(queryHash: string): Promise<number[] | null> {
  if (!queryHash) return null;

  // Check in-memory store first (faster hit)
  const memoryHit = memoryEmbeddingCache.get(queryHash);
  if (memoryHit) {
    return memoryHit;
  }

  try {
    const parsed = await embeddingBlobCache.get(queryHash);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryEmbeddingCache.set(queryHash, parsed);
      return parsed;
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
    await embeddingBlobCache.set(queryHash, embedding);
  } catch {
    // Ignore blob write errors, in-memory store is set
  }
}

export function resetEmbeddingCacheMemory(): void {
  memoryEmbeddingCache.clear();
}
