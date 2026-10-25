import { BoundedMemoryCache, BlobCacheAdapter } from './cache';
import { DEFAULT_CLIENT_IP, isDevelopmentOrTestEnvironment } from './fallbacks';
import { logger } from './logger';

const WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 10;
const DEFAULT_MAX_MEMORY_ENTRIES = 1000;

// In-memory fallback cache for rate-limiting capped at 1,000 entries by default (active only in local dev/test mode)
const memoryStore = new BoundedMemoryCache<number[]>({ maxEntries: DEFAULT_MAX_MEMORY_ENTRIES });

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  storeName?: string;
  keyPrefix?: string;
  maxMemoryEntries?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetMs: number;
  storageError?: boolean;
}

/**
 * Case-insensitively extracts the true client IP address from Netlify function headers.
 * Prioritizes Netlify Edge trusted headers ('x-nf-client-connection-ip' and 'client-ip')
 * which are set/overwritten by Netlify Edge proxies and cannot be spoofed by incoming client HTTP headers.
 * Falls back to the trusted/rightmost entry in X-Forwarded-For when Netlify edge headers are absent.
 * Supports both Fetch API Headers objects and plain Record<string, string | undefined> header maps.
 */
export function getClientIp(headers: Record<string, string | undefined> | Headers = {}): string {
  if (headers && typeof (headers as Headers).get === 'function') {
    const h = headers as Headers;
    const xNfIp = h.get('x-nf-client-connection-ip');
    if (xNfIp) return xNfIp.trim();
    const clientIp = h.get('client-ip');
    if (clientIp) return clientIp.trim();
    const xForwardedFor = h.get('x-forwarded-for');
    if (xForwardedFor) {
      const parts = xForwardedFor
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length > 0) return parts[parts.length - 1];
    }
    return 'unknown';
  }

  const normalized: Record<string, string> = {};
  for (const [key, val] of Object.entries((headers as Record<string, string | undefined>) || {})) {
    if (val) normalized[key.toLowerCase()] = String(val);
  }

  if (normalized['x-nf-client-connection-ip']) {
    return normalized['x-nf-client-connection-ip'].trim();
  }

  if (normalized['client-ip']) {
    return normalized['client-ip'].trim();
  }

  if (normalized['x-forwarded-for']) {
    const parts = normalized['x-forwarded-for']
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  return 'unknown';
}

/**
 * Checks client IP request rate against a sliding window.
 * Default: Max 10 requests per 60 seconds allowed.
 * Enforces mandatory persistent storage in Netlify Blobs with fail-closed behavior in production environments.
 */
export async function checkRateLimit(
  clientIp: string,
  options?: RateLimitOptions
): Promise<RateLimitResult> {
  const isDevOrTest = isDevelopmentOrTestEnvironment();
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const maxRequests = options?.maxRequests ?? MAX_REQUESTS;
  const storeName = options?.storeName ?? 'rate-limits';
  const prefix = options?.keyPrefix ? `${options.keyPrefix}_` : '';
  const maxMemoryEntries = options?.maxMemoryEntries ?? DEFAULT_MAX_MEMORY_ENTRIES;

  memoryStore.maxEntries = maxMemoryEntries;

  const now = Date.now();
  const safeIp = clientIp || DEFAULT_CLIENT_IP;
  const key = `${prefix}ip_${safeIp.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

  const storeAdapter = new BlobCacheAdapter<number[]>({
    storeName,
    throwOnError: !isDevOrTest,
  });

  let timestamps: number[] = [];

  if (isDevOrTest) {
    try {
      const cached = await storeAdapter.get(key);
      if (Array.isArray(cached)) {
        timestamps = cached;
      } else {
        timestamps = memoryStore.get(key) || [];
      }
    } catch {
      timestamps = memoryStore.get(key) || [];
    }

    const windowStart = now - windowMs;
    const validTimestamps = Array.isArray(timestamps)
      ? timestamps.filter((ts) => typeof ts === 'number' && ts > windowStart)
      : [];

    if (validTimestamps.length === 0) {
      memoryStore.delete(key);
    } else {
      memoryStore.set(key, validTimestamps);
    }

    if (validTimestamps.length >= maxRequests) {
      const oldest = validTimestamps[0] || now;
      const resetMs = Math.max(0, oldest + windowMs - now);
      return {
        allowed: false,
        count: validTimestamps.length,
        remaining: 0,
        resetMs,
      };
    }

    validTimestamps.push(now);
    memoryStore.set(key, validTimestamps);

    try {
      await storeAdapter.set(key, validTimestamps);
    } catch {
      // Swallow write failure in local dev or unit test mode
    }

    return {
      allowed: true,
      count: validTimestamps.length,
      remaining: maxRequests - validTimestamps.length,
      resetMs: windowMs,
    };
  }

  // Production Serverless Execution: Fail-Closed Persistent Storage Mode
  try {
    const cached = await storeAdapter.get(key);
    if (Array.isArray(cached)) {
      timestamps = cached;
    } else {
      timestamps = [];
    }

    const windowStart = now - windowMs;
    const validTimestamps = Array.isArray(timestamps)
      ? timestamps.filter((ts) => typeof ts === 'number' && ts > windowStart)
      : [];

    if (validTimestamps.length >= maxRequests) {
      const oldest = validTimestamps[0] || now;
      const resetMs = Math.max(0, oldest + windowMs - now);
      return {
        allowed: false,
        count: validTimestamps.length,
        remaining: 0,
        resetMs,
      };
    }

    validTimestamps.push(now);

    await storeAdapter.set(key, validTimestamps);

    return {
      allowed: true,
      count: validTimestamps.length,
      remaining: maxRequests - validTimestamps.length,
      resetMs: windowMs,
    };
  } catch (err) {
    logger.error('Netlify Blobs rate limit persistent storage error in production', {
      key,
      storeName,
      safeIp,
      error: err instanceof Error ? err.message : String(err),
    });

    return {
      allowed: false,
      count: maxRequests,
      remaining: 0,
      resetMs: windowMs,
      storageError: true,
    };
  }
}

export function resetRateLimitMemory(): void {
  memoryStore.clear();
}

export function getMemoryStoreSize(): number {
  return memoryStore.size;
}
