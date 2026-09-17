import { getStore } from '@netlify/blobs';

const WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 10;

// In-memory fallback map for temporary latency or offline environments
const memoryStore = new Map<string, number[]>();

function getRateLimitStore() {
  try {
    return getStore({
      name: 'rate-limits',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });
  } catch {
    return null;
  }
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetMs: number;
}

/**
 * Checks client IP request rate against a sliding 60-second window.
 * Max 10 requests per minute allowed.
 */
export async function checkRateLimit(clientIp: string): Promise<RateLimitResult> {
  const now = Date.now();
  const safeIp = clientIp || '127.0.0.1';
  const key = `ip_${safeIp.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

  let timestamps: number[] = [];

  // Try reading from Netlify Blobs with in-memory fallback
  let store: ReturnType<typeof getStore> | null = null;
  try {
    store = getRateLimitStore();
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
  const windowStart = now - WINDOW_MS;
  const validTimestamps = Array.isArray(timestamps)
    ? timestamps.filter((ts) => typeof ts === 'number' && ts > windowStart)
    : [];

  if (validTimestamps.length >= MAX_REQUESTS) {
    const oldest = validTimestamps[0] || now;
    const resetMs = Math.max(0, oldest + WINDOW_MS - now);
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
    remaining: MAX_REQUESTS - validTimestamps.length,
    resetMs: WINDOW_MS,
  };
}

export function resetRateLimitMemory(): void {
  memoryStore.clear();
}
