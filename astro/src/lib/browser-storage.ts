export type StorageType = 'session' | 'local';

export interface StorageOptions {
  /**
   * The browser storage engine to target.
   * @default 'session'
   */
  storageType?: StorageType;

  /**
   * Optional prefix prepended to keys to prevent collisions across scripts.
   * Pass an empty string `""` to disable key prefixing.
   * @default 'mbp:'
   */
  prefix?: string;
}

/**
 * Type union of known application storage keys for IDE autocomplete and type safety.
 */
export type KnownStorageKey =
  | `purchase_fired_${string}`
  | 'user_session'
  | 'checkout_cart'
  | 'analytics_client_id'
  | (string & {});

export const DEFAULT_STORAGE_PREFIX = 'mbp:';

// Module-scoped in-memory storage fallbacks for restricted browser environments
const memorySessionStore = new Map<string, string>();
const memoryLocalStore = new Map<string, string>();

function getMemoryStore(type: StorageType): Map<string, string> {
  return type === 'local' ? memoryLocalStore : memorySessionStore;
}

/**
 * Resets in-memory fallback stores. Intended for test isolation.
 */
export function resetMemoryStorage(): void {
  memorySessionStore.clear();
  memoryLocalStore.clear();
}

/**
 * Generates the namespaced storage key with the configured prefix.
 */
export function getPrefixedKey(key: string, prefix?: string): string {
  const effectivePrefix = prefix !== undefined ? prefix : DEFAULT_STORAGE_PREFIX;
  if (!effectivePrefix) return key;
  if (key.startsWith(effectivePrefix)) return key;
  return `${effectivePrefix}${key}`;
}

/**
 * Safely resolves the native Storage object (sessionStorage or localStorage).
 * Returns null if storage is unavailable, disabled, or throws DOM/Security errors.
 */
export function getNativeStorage(type: StorageType = 'session'): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    if (!storage) return null;
    return storage;
  } catch {
    return null;
  }
}

/**
 * Returns true if browser storage of the given type is functional and accessible.
 */
export function isStorageAvailable(type: StorageType = 'session'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    if (!storage) return false;
    const testKey = `__mbp_storage_test_${Math.random().toString(36).slice(2)}_${Date.now()}__`;
    const existingValue = storage.getItem(testKey);
    storage.setItem(testKey, testKey);
    const readValue = storage.getItem(testKey);
    if (existingValue !== null) {
      storage.setItem(testKey, existingValue);
    } else {
      storage.removeItem(testKey);
    }
    return readValue === testKey;
  } catch {
    return false;
  }
}

/**
 * Retrieve an item from browser storage or in-memory fallback.
 * Automatically parses JSON payloads and falls back gracefully on parsing or DOM exceptions.
 */
export function getStorageItem<T = unknown>(
  key: KnownStorageKey | string,
  options?: StorageOptions
): T | null {
  const storageType = options?.storageType ?? 'session';
  const prefixedKey = getPrefixedKey(key, options?.prefix);
  let rawValue: string | null = null;

  try {
    const nativeStorage = getNativeStorage(storageType);
    if (nativeStorage) {
      rawValue = nativeStorage.getItem(prefixedKey);
    }
  } catch {
    // Suppress storage DOM exceptions
  }

  // Fall back to memory store if missing in native storage or native access failed
  if (rawValue === null) {
    rawValue = getMemoryStore(storageType).get(prefixedKey) ?? null;
  }

  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    // Return raw string value if JSON parsing fails without crashing execution
    return rawValue as unknown as T;
  }
}

/**
 * Sets an item in browser storage or in-memory fallback if storage throws errors.
 */
export function setStorageItem<T = unknown>(
  key: KnownStorageKey | string,
  value: T,
  options?: StorageOptions
): boolean {
  const storageType = options?.storageType ?? 'session';
  const prefixedKey = getPrefixedKey(key, options?.prefix);
  const serialized = value === undefined ? 'null' : JSON.stringify(value);

  try {
    const nativeStorage = getNativeStorage(storageType);
    if (nativeStorage) {
      nativeStorage.setItem(prefixedKey, serialized);
    }
  } catch {
    // Storage write failed (e.g., QuotaExceededError or SecurityError)
  }

  // Always update in-memory store to guarantee consistent fallback state
  getMemoryStore(storageType).set(prefixedKey, serialized);
  return true;
}

/**
 * Removes an item from browser storage and in-memory fallback.
 */
export function removeStorageItem(
  key: KnownStorageKey | string,
  options?: StorageOptions
): boolean {
  const storageType = options?.storageType ?? 'session';
  const prefixedKey = getPrefixedKey(key, options?.prefix);

  try {
    const nativeStorage = getNativeStorage(storageType);
    if (nativeStorage) {
      nativeStorage.removeItem(prefixedKey);
    }
  } catch {
    // Suppress storage DOM exceptions
  }

  getMemoryStore(storageType).delete(prefixedKey);
  return true;
}

/**
 * Clears all items from browser storage and in-memory fallback.
 */
export function clearStorage(options?: StorageOptions): void {
  const storageType = options?.storageType ?? 'session';

  try {
    const nativeStorage = getNativeStorage(storageType);
    if (nativeStorage) {
      nativeStorage.clear();
    }
  } catch {
    // Suppress storage DOM exceptions
  }

  getMemoryStore(storageType).clear();
}

/**
 * Unified class interface encapsulating browser storage interactions.
 */
export class BrowserStorage {
  static getItem<T = unknown>(key: KnownStorageKey | string, options?: StorageOptions): T | null {
    return getStorageItem<T>(key, options);
  }

  static setItem<T = unknown>(
    key: KnownStorageKey | string,
    value: T,
    options?: StorageOptions
  ): boolean {
    return setStorageItem<T>(key, value, options);
  }

  static removeItem(key: KnownStorageKey | string, options?: StorageOptions): boolean {
    return removeStorageItem(key, options);
  }

  static clear(options?: StorageOptions): void {
    clearStorage(options);
  }

  static isAvailable(type?: StorageType): boolean {
    return isStorageAvailable(type);
  }

  static resetMemoryFallback(): void {
    resetMemoryStorage();
  }
}
