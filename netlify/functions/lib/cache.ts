import { getStore } from '@netlify/blobs';

export interface BoundedMemoryCacheOptions {
  maxEntries?: number;
  ttlMs?: number;
}

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Generic LRU in-memory cache primitive with optional per-item or default TTL expiration.
 */
export class BoundedMemoryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private _maxEntries: number;
  private defaultTtlMs?: number;

  constructor(options?: number | BoundedMemoryCacheOptions, defaultTtlMs?: number) {
    if (typeof options === 'number') {
      this._maxEntries = Math.max(1, options);
      this.defaultTtlMs = defaultTtlMs;
    } else {
      this._maxEntries = Math.max(1, options?.maxEntries ?? 1000);
      this.defaultTtlMs = options?.ttlMs;
    }
  }

  get maxEntries(): number {
    return this._maxEntries;
  }

  set maxEntries(capacity: number) {
    this._maxEntries = Math.max(1, capacity);
    this.evict();
  }

  get size(): number {
    return this.cache.size;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    // Refresh LRU order: delete and re-insert to position key as MRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    const effectiveTtl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs;
    const expiresAt =
      effectiveTtl !== undefined && effectiveTtl > 0 ? Date.now() + effectiveTtl : undefined;

    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, { value, expiresAt });
    this.evict();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private evict(): void {
    while (this.cache.size > this._maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      } else {
        break;
      }
    }
  }
}

export interface BlobCacheAdapterOptions {
  storeName: string;
  siteID?: string;
  token?: string;
  throwOnError?: boolean;
}

/**
 * Unified storage adapter wrapper around Netlify Blobs.
 * Manages JSON/string serialization and swallows connection/storage errors gracefully
 * unless throwOnError is explicitly configured.
 */
export class BlobCacheAdapter<T = any> {
  private storeName: string;
  private siteID?: string;
  private token?: string;
  private throwOnError: boolean;

  constructor(options: string | BlobCacheAdapterOptions) {
    if (typeof options === 'string') {
      this.storeName = options;
      this.siteID = process.env.NETLIFY_SITE_ID;
      this.token = process.env.NETLIFY_AUTH_TOKEN;
      this.throwOnError = false;
    } else {
      this.storeName = options.storeName;
      this.siteID = options.siteID ?? process.env.NETLIFY_SITE_ID;
      this.token = options.token ?? process.env.NETLIFY_AUTH_TOKEN;
      this.throwOnError = options.throwOnError ?? false;
    }
  }

  private getStore() {
    try {
      const store = getStore({
        name: this.storeName,
        siteID: this.siteID,
        token: this.token,
      });
      if (!store && this.throwOnError) {
        throw new Error(`Netlify Blobs store '${this.storeName}' returned null or undefined`);
      }
      return store;
    } catch (err) {
      if (this.throwOnError) {
        throw err instanceof Error ? err : new Error(String(err));
      }
      return null;
    }
  }

  async get(key: string): Promise<T | null> {
    try {
      const store = this.getStore();
      if (!store) return null;

      // Try reading JSON first
      const val = await store.get(key, { type: 'json' });
      if (val !== null && val !== undefined) {
        return val as T;
      }

      // Fallback to text reading if JSON returns null
      const textVal = await store.get(key, { type: 'text' });
      if (textVal !== null && textVal !== undefined) {
        try {
          return JSON.parse(textVal) as T;
        } catch {
          return textVal as unknown as T;
        }
      }
      return null;
    } catch (err) {
      if (this.throwOnError) {
        throw err instanceof Error ? err : new Error(String(err));
      }
      return null;
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      const store = this.getStore();
      if (!store) {
        if (this.throwOnError) {
          throw new Error(`Netlify Blobs store '${this.storeName}' is unconfigured or unavailable`);
        }
        return;
      }
      if (typeof value === 'object' && value !== null) {
        await store.setJSON(key, value);
      } else if (typeof value === 'string') {
        await store.set(key, value);
      } else {
        await store.set(key, JSON.stringify(value));
      }
    } catch (err) {
      if (this.throwOnError) {
        throw err instanceof Error ? err : new Error(String(err));
      }
      // Swallows blob errors gracefully when throwOnError is false
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const store = this.getStore();
      if (!store) {
        if (this.throwOnError) {
          throw new Error(`Netlify Blobs store '${this.storeName}' is unconfigured or unavailable`);
        }
        return;
      }
      await store.delete(key);
    } catch (err) {
      if (this.throwOnError) {
        throw err instanceof Error ? err : new Error(String(err));
      }
      // Swallows blob errors gracefully when throwOnError is false
    }
  }
}
