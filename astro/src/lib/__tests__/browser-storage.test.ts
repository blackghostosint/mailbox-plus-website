// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  BrowserStorage,
  resetMemoryStorage,
  getPrefixedKey,
  isStorageAvailable,
  DEFAULT_STORAGE_PREFIX,
} from '../browser-storage';

describe('BrowserStorage Utility Module', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    resetMemoryStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    resetMemoryStorage();
    vi.restoreAllMocks();
  });

  describe('Key Namespacing', () => {
    it('applies the default prefix when no prefix is specified', () => {
      expect(getPrefixedKey('testKey')).toBe(`${DEFAULT_STORAGE_PREFIX}testKey`);
    });

    it('applies custom prefix when specified', () => {
      expect(getPrefixedKey('testKey', 'custom:')).toBe('custom:testKey');
    });

    it('bypasses prefixing when prefix is an empty string', () => {
      expect(getPrefixedKey('testKey', '')).toBe('testKey');
    });

    it('does not duplicate prefix if key is already prefixed', () => {
      expect(getPrefixedKey('mbp:testKey')).toBe('mbp:testKey');
    });
  });

  describe('Storage Wrapper Operations', () => {
    it('stores and retrieves primitive values (strings, numbers, booleans)', () => {
      setStorageItem('strKey', 'hello');
      setStorageItem('numKey', 42);
      setStorageItem('boolKey', true);

      expect(getStorageItem<string>('strKey')).toBe('hello');
      expect(getStorageItem<number>('numKey')).toBe(42);
      expect(getStorageItem<boolean>('boolKey')).toBe(true);
    });

    it('stores and retrieves complex objects and arrays', () => {
      const payload = { id: 123, items: ['a', 'b'] };
      setStorageItem('objKey', payload);

      expect(getStorageItem<typeof payload>('objKey')).toEqual(payload);
    });

    it('removes stored items', () => {
      setStorageItem('removeMe', 'val');
      expect(getStorageItem('removeMe')).toBe('val');

      removeStorageItem('removeMe');
      expect(getStorageItem('removeMe')).toBeNull();
    });

    it('clears storage for the specified storage type', () => {
      setStorageItem('item1', 'v1');
      setStorageItem('item2', 'v2');

      clearStorage({ storageType: 'session' });
      expect(getStorageItem('item1')).toBeNull();
      expect(getStorageItem('item2')).toBeNull();
    });

    it('supports localStorage when storageType option is set', () => {
      setStorageItem('localItem', 'localVal', { storageType: 'local' });

      expect(getStorageItem('localItem', { storageType: 'local' })).toBe('localVal');
      expect(getStorageItem('localItem', { storageType: 'session' })).toBeNull();
    });

    it('works via BrowserStorage class interface', () => {
      BrowserStorage.setItem('classKey', { success: true });
      expect(BrowserStorage.getItem<{ success: boolean }>('classKey')).toEqual({ success: true });

      BrowserStorage.removeItem('classKey');
      expect(BrowserStorage.getItem('classKey')).toBeNull();
      expect(BrowserStorage.isAvailable('session')).toBe(true);
    });
  });

  describe('JSON Parsing Resilience', () => {
    it('returns raw string when stored string is not valid JSON without throwing', () => {
      sessionStorage.setItem('mbp:rawString', 'unquoted raw text');

      expect(() => {
        const val = getStorageItem<string>('rawString');
        expect(val).toBe('unquoted raw text');
      }).not.toThrow();
    });

    it('returns null for non-existent items', () => {
      expect(getStorageItem('nonExistentKey')).toBeNull();
    });
  });

  describe('In-Memory Fallback Mode', () => {
    it('falls back seamlessly to in-memory store when sessionStorage.setItem throws SecurityError', () => {
      const spy = vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Access denied in private mode', 'SecurityError');
      });

      expect(() => {
        setStorageItem('restrictedKey', 'fallbackValue');
      }).not.toThrow();

      expect(getStorageItem('restrictedKey')).toBe('fallbackValue');
      spy.mockRestore();
    });

    it('falls back seamlessly when sessionStorage.setItem throws QuotaExceededError', () => {
      const spy = vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
      });

      setStorageItem('quotaKey', { large: 'data' });
      expect(getStorageItem<{ large: string }>('quotaKey')).toEqual({ large: 'data' });
      spy.mockRestore();
    });

    it('falls back seamlessly when native storage access throws SecurityError', () => {
      const spy = vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
        throw new DOMException('Access denied', 'SecurityError');
      });

      setStorageItem('securityKey', 'secureVal');
      expect(getStorageItem('securityKey')).toBe('secureVal');
      spy.mockRestore();
    });

    it('isolates fallback storage in module memory without setting global properties', () => {
      const spy = vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Denied', 'SecurityError');
      });

      setStorageItem('memOnlyKey', 'memVal');
      expect(getStorageItem('memOnlyKey')).toBe('memVal');
      expect((window as unknown as Record<string, unknown>).memOnlyKey).toBeUndefined();
      spy.mockRestore();
    });

    it('clears memory fallback store via resetMemoryStorage', () => {
      const spy = vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Denied', 'SecurityError');
      });

      setStorageItem('memKey', 'memVal');
      resetMemoryStorage();
      expect(getStorageItem('memKey')).toBeNull();
      spy.mockRestore();
    });
  });

  describe('Storage Availability Check', () => {
    it('returns true when storage is functional', () => {
      expect(isStorageAvailable('session')).toBe(true);
      expect(isStorageAvailable('local')).toBe(true);
    });

    it('is non-destructive and preserves pre-existing storage keys and values', () => {
      sessionStorage.setItem('mbp:user_session', 'active-session-token');
      const initialLength = sessionStorage.length;

      expect(isStorageAvailable('session')).toBe(true);

      expect(sessionStorage.length).toBe(initialLength);
      expect(sessionStorage.getItem('mbp:user_session')).toBe('active-session-token');
    });

    it('restores pre-existing value if probe key already exists in storage', () => {
      const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
      const mockDate = vi.spyOn(Date, 'now').mockReturnValue(1000000);
      const expectedKey = '__mbp_storage_test_4fzzzxg_1000000__';

      sessionStorage.setItem(expectedKey, 'original-value');

      expect(isStorageAvailable('session')).toBe(true);
      expect(sessionStorage.getItem(expectedKey)).toBe('original-value');

      mockRandom.mockRestore();
      mockDate.mockRestore();
    });

    it('returns false when storage throws an exception', () => {
      const spy = vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Denied', 'SecurityError');
      });

      expect(isStorageAvailable('session')).toBe(false);
      spy.mockRestore();
    });
  });
});
