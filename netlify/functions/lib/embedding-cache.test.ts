import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeQuery,
  hashQuery,
  getCachedEmbedding,
  setCachedEmbedding,
  resetEmbeddingCacheMemory,
} from './embedding-cache';

describe('embedding-cache', () => {
  beforeEach(() => {
    resetEmbeddingCacheMemory();
  });

  it('normalizes queries correctly by trimming, lowercasing, and collapsing spaces', () => {
    expect(normalizeQuery('   What   are your HOURS?  ')).toBe('what are your hours?');
    expect(normalizeQuery('CAN I   RENT  A MAILBOX? ')).toBe('can i rent a mailbox?');
  });

  it('generates consistent SHA-256 hashes for identical normalized queries', () => {
    const hash1 = hashQuery('What are your hours?');
    const hash2 = hashQuery('   what   are YOUR hours?  ');
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 length in hex
  });

  it('stores and retrieves query embeddings in memory/Netlify Blobs cache', async () => {
    const hash = hashQuery('How much is mailbox rental?');
    const embeddingVector = [0.123, 0.456, 0.789];

    expect(await getCachedEmbedding(hash)).toBeNull();

    await setCachedEmbedding(hash, embeddingVector);

    const cached = await getCachedEmbedding(hash);
    expect(cached).toEqual(embeddingVector);
  });
});
