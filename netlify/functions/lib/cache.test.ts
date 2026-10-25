import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BoundedMemoryCache, BlobCacheAdapter } from './cache';

const { mockGetStore, mockStoreGet, mockStoreSet, mockStoreSetJSON, mockStoreDelete } = vi.hoisted(
  () => ({
    mockGetStore: vi.fn(),
    mockStoreGet: vi.fn(),
    mockStoreSet: vi.fn(),
    mockStoreSetJSON: vi.fn(),
    mockStoreDelete: vi.fn(),
  })
);

vi.mock('@netlify/blobs', () => ({
  getStore: mockGetStore,
}));

describe('BoundedMemoryCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and retrieves items correctly', () => {
    const cache = new BoundedMemoryCache<string>({ maxEntries: 10 });
    cache.set('key1', 'val1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.get('key1')).toBe('val1');
    expect(cache.size).toBe(1);
  });

  it('evicts least recently used (LRU) entry when max capacity is reached', () => {
    const cache = new BoundedMemoryCache<string>({ maxEntries: 3 });
    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');
    expect(cache.size).toBe(3);

    // Access 'a' so it becomes MRU
    cache.get('a');

    // Add 'd', pushing size to 4 -> 'b' (the oldest / LRU) should be evicted
    cache.set('d', '4');
    expect(cache.size).toBe(3);
    expect(cache.has('b')).toBe(false);
    expect(cache.get('a')).toBe('1');
    expect(cache.get('c')).toBe('3');
    expect(cache.get('d')).toBe('4');
  });

  it('supports updating maxEntries capacity and evicts excess items', () => {
    const cache = new BoundedMemoryCache<string>(5);
    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');
    cache.set('d', '4');
    cache.set('e', '5');
    expect(cache.size).toBe(5);

    cache.maxEntries = 2;
    expect(cache.size).toBe(2);
    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(false);
    expect(cache.has('c')).toBe(false);
    expect(cache.get('d')).toBe('4');
    expect(cache.get('e')).toBe('5');
  });

  it('expires entries after default TTL ms', () => {
    const cache = new BoundedMemoryCache<string>({ maxEntries: 10, ttlMs: 1000 });
    cache.set('temp', 'value');
    expect(cache.get('temp')).toBe('value');

    vi.advanceTimersByTime(1001);

    expect(cache.has('temp')).toBe(false);
    expect(cache.get('temp')).toBeUndefined();
  });

  it('allows per-item TTL override on set()', () => {
    const cache = new BoundedMemoryCache<string>({ maxEntries: 10, ttlMs: 5000 });
    cache.set('short', 'val1', 500);
    cache.set('long', 'val2', 10000);

    vi.advanceTimersByTime(600);
    expect(cache.get('short')).toBeUndefined();
    expect(cache.get('long')).toBe('val2');
  });

  it('deletes and clears entries properly', () => {
    const cache = new BoundedMemoryCache<number>(10);
    cache.set('n1', 100);
    cache.set('n2', 200);

    expect(cache.delete('n1')).toBe(true);
    expect(cache.has('n1')).toBe(false);
    expect(cache.size).toBe(1);

    cache.clear();
    expect(cache.size).toBe(0);
  });
});

describe('BlobCacheAdapter', () => {
  const blobStorage = new Map<string, any>();

  beforeEach(() => {
    vi.clearAllMocks();
    blobStorage.clear();

    mockStoreGet.mockImplementation(async (key: string) => blobStorage.get(key) ?? null);
    mockStoreSet.mockImplementation(async (key: string, val: any) => blobStorage.set(key, val));
    mockStoreSetJSON.mockImplementation(async (key: string, val: any) => blobStorage.set(key, val));
    mockStoreDelete.mockImplementation(async (key: string) => blobStorage.delete(key));

    mockGetStore.mockReturnValue({
      get: mockStoreGet,
      set: mockStoreSet,
      setJSON: mockStoreSetJSON,
      delete: mockStoreDelete,
    });
  });

  it('reads and writes JSON payloads using Netlify Blobs', async () => {
    const adapter = new BlobCacheAdapter<{ name: string }>('test-store');
    const data = { name: 'Mailbox Plus' };

    await adapter.set('item1', data);
    expect(mockStoreSetJSON).toHaveBeenCalledWith('item1', data);

    const fetched = await adapter.get('item1');
    expect(fetched).toEqual(data);
  });

  it('reads and writes string payloads', async () => {
    const adapter = new BlobCacheAdapter<string>('string-store');
    await adapter.set('strKey', 'plain string');
    expect(mockStoreSet).toHaveBeenCalledWith('strKey', 'plain string');

    const fetched = await adapter.get('strKey');
    expect(fetched).toBe('plain string');
  });

  it('handles delete operations', async () => {
    const adapter = new BlobCacheAdapter<string>('test-store');
    await adapter.set('key', 'val');
    await adapter.delete('key');
    expect(mockStoreDelete).toHaveBeenCalledWith('key');
    expect(await adapter.get('key')).toBeNull();
  });

  it('swallows errors gracefully when getStore throws', async () => {
    mockGetStore.mockImplementation(() => {
      throw new Error('Connection refused');
    });

    const adapter = new BlobCacheAdapter('broken-store');
    expect(await adapter.get('any')).toBeNull();
    await expect(adapter.set('any', 'val')).resolves.not.toThrow();
    await expect(adapter.delete('any')).resolves.not.toThrow();
  });

  it('swallows errors when store operations throw', async () => {
    mockStoreGet.mockRejectedValue(new Error('Read timeout'));
    mockStoreSet.mockRejectedValue(new Error('Write failure'));
    mockStoreDelete.mockRejectedValue(new Error('Delete failure'));

    const adapter = new BlobCacheAdapter('failing-ops');
    expect(await adapter.get('key')).toBeNull();
    await expect(adapter.set('key', 'val')).resolves.not.toThrow();
    await expect(adapter.delete('key')).resolves.not.toThrow();
  });
});
