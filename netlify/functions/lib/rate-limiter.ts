import { getStore } from '@netlify/blobs';
import { serverEnv } from './env';

const WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 10;

// In-memory fallback map for temporary latency or offline environments
const memoryStore = new Map<string, number[]>();

function getRateLimitStore(storeName = 'rate-limits') {
  try {
    return getStore({
      name: storeName,
      siteID: serverEnv.NETLIFY_SITE_ID,
      token: serverEnv.NETLIFY_AUTH_TOKEN,
    });
  } catch {
    return null;
  }
}

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  storeName?: string;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetMs: number;
}

/**
 * Case-insensitively extracts the true client IP address from Netlify function headers.
 * Prioritizes Netlify Edge trusted headers ('x-nf-client-connection-ip' and 'client-ip')
 * which are set/overwritten by Netlify Edge proxies and cannot be spoofed by incoming client HTTP headers.
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
 */
export async function checkRateLimit(
  clientIp: string,
  options?: RateLimitOptions
): Promise<RateLimitResult> {
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const maxRequests = options?.maxRequests ?? MAX_REQUESTS;
  const storeName = options?.storeName ?? 'rate-limits';
  const prefix = options?.keyPrefix ? `${options.keyPrefix}_` : '';

  const now = Date.now();
  const safeIp = clientIp || '127.0.0.1';
  const key = `${prefix}ip_${safeIp.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

  let timestamps: number[] = [];

  // Try reading from Netlify Blobs with in-memory fallback
  let store: ReturnType<typeof getStore> | null = null;
  try {
    store = getRateLimitStore(storeName);
    if (store) {
      const raw = await store.get(key);
      if (raw) {
        timestamps = JSON.parse(raw);
      }
    } else {
      timestamps = memoryStore.get(key) || [];
    }
  } catch {
    timestamps = memoryStore.get(key) || [];
  }

  // Filter timestamps within sliding window
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

  // Record current request timestamp
  validTimestamps.push(now);
  memoryStore.set(key, validTimestamps);

  try {
    if (store) {
      await store.set(key, JSON.stringify(validTimestamps));
    }
  } catch {
    // Ignore blob write failure; in-memory store remains updated
  }

  return {
    allowed: true,
    count: validTimestamps.length,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}

export function resetRateLimitMemory(): void {
  memoryStore.clear();
}
