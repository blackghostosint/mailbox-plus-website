import { useState, useEffect, useCallback, useRef } from 'react';
import { FAQ } from '../types/faq';

interface UseFAQsOptions {
  /** Whether to load immediately on mount */
  immediate?: boolean;
  /** Callback when data is loaded */
  // eslint-disable-next-line no-unused-vars
  onLoad?: (faqs: FAQ[]) => void;
  /** Callback on error */
  // eslint-disable-next-line no-unused-vars
  onError?: (error: Error) => void;
}

interface UseFAQsReturn {
  /** The loaded FAQ data */
  faqs: FAQ[];
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether data has been loaded at least once */
  isLoaded: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Manually trigger a reload */
  reload: () => Promise<void>;
}

// ── Internal: shared state machinery ────────────────────────────────

function useFAQState(loader: () => Promise<FAQ[]>, options: UseFAQsOptions = {}): UseFAQsReturn {
  const { immediate = true, onLoad, onError } = options;
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Guard against concurrent fetches
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Keep callbacks stable via refs
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  }, [onLoad, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await loader();
      if (isMountedRef.current) {
        setFaqs(data);
        setIsLoaded(true);
        onLoadRef.current?.(data);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (isMountedRef.current) {
        setError(error);
        onErrorRef.current?.(error);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (immediate) load();
  }, [immediate, load]);

  return { faqs, isLoading, isLoaded, error, reload: load };
}

// ── Public API ──────────────────────────────────────────────────────

/** Normalize a file name to include .json extension if missing */
const normalizeFileName = (name: string) => (name.endsWith('.json') ? name : `${name}.json`);

/**
 * Hook to dynamically load a single FAQ JSON file.
 * FAQ data is stored in /public/data/faqs/{category}/{fileName}.json
 */
export function useFAQs(
  category: string,
  fileName: string,
  options: UseFAQsOptions = {}
): UseFAQsReturn {
  const loader = useCallback(async () => {
    const url = `/data/faqs/${category}/${normalizeFileName(fileName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load FAQs: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<FAQ[]>;
  }, [category, fileName]);

  return useFAQState(loader, options);
}

/**
 * Hook to load multiple FAQ files from a category and flatten them.
 * Useful for pages that combine multiple FAQ arrays.
 */
export function useCategoryFAQs(
  category: string,
  fileNames: string[],
  options: UseFAQsOptions = {}
): UseFAQsReturn {
  // Stabilize reference to prevent unnecessary re-renders
  const fileNamesStr = JSON.stringify(fileNames);

  const loader = useCallback(async () => {
    const parsedNames: string[] = JSON.parse(fileNamesStr);
    const allFAQs: FAQ[] = [];

    for (const file of parsedNames) {
      const url = `/data/faqs/${category}/${normalizeFileName(file)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${file}: ${response.status}`);
      const data = await response.json();
      allFAQs.push(...data);
    }

    return allFAQs;
  }, [category, fileNamesStr]);

  return useFAQState(loader, options);
}

/**
 * Hook to load all FAQs from a category (uses manifest.json to discover files).
 */
export function useAllCategoryFAQs(
  category: string,
  options: UseFAQsOptions = {}
): UseFAQsReturn & { manifest: string[] | null } {
  const [manifest, setManifest] = useState<string[] | null>(null);

  // Load manifest on mount
  useEffect(() => {
    fetch('/data/faqs/manifest.json')
      .then((r) => r.json())
      .then((data) => setManifest(data[category] || []))
      .catch(() => setManifest([]));
  }, [category]);

  const loader = useCallback(async () => {
    const manifestResp = await fetch('/data/faqs/manifest.json');
    if (!manifestResp.ok) throw new Error('Failed to load manifest');
    const manifestData = await manifestResp.json();
    const files: string[] = manifestData[category] || [];

    const allFAQs: FAQ[] = [];
    for (const fileName of files) {
      const url = `/data/faqs/${category}/${fileName}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${fileName}`);
      const data = await response.json();
      allFAQs.push(...data);
    }

    return allFAQs;
  }, [category]);

  const result = useFAQState(loader, options);

  return { ...result, manifest };
}

/**
 * Preload FAQ data for faster subsequent access.
 * Triggers background fetches without awaiting them.
 */
export function preloadFAQs(category: string, fileNames: string[]): Promise<void> {
  fileNames.forEach((fileName) => {
    fetch(`/data/faqs/${category}/${normalizeFileName(fileName)}`).catch(() => {});
  });
  return Promise.resolve();
}
