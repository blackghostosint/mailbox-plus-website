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

/**
 * Hook to dynamically load FAQ data from JSON files.
 * FAQ data is stored in /public/data/faqs/{category}/{file}.json
 */
export function useFAQs(
  category: string,
  fileName: string,
  options: UseFAQsOptions = {}
): UseFAQsReturn {
  const { immediate = true, onLoad, onError } = options;
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to prevent callback recreation
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Store callbacks in refs to keep callback stable
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
      // Construct URL: /data/faqs/{category}/{fileName}.json
      // Handle both cases: fileName may or may not include .json extension
      const normalizedFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
      const url = `/data/faqs/${category}/${normalizedFileName}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load FAQs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
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
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [category, fileName]);

  // Initial load
  useEffect(() => {
    if (immediate) {
      load();
    }
  }, [immediate, load]);

  return { faqs, isLoading, isLoaded, error, reload: load };
}

/**
 * Hook to load multiple FAQ files from a category and flatten them.
 * Useful for the "Ask Mailbox Plus" page that combines multiple FAQ arrays.
 */
export function useCategoryFAQs(
  category: string,
  fileNames: string[],
  options: UseFAQsOptions = {}
): UseFAQsReturn {
  const { immediate = true, onLoad, onError } = options;
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to prevent callback recreation
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Store callbacks in refs to keep callback stable
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

  // Stabilize fileNames reference to prevent hook execution on reference changes
  const fileNamesStr = JSON.stringify(fileNames);

  const load = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    const allFAQs: FAQ[] = [];

    try {
      const parsedFileNames: string[] = JSON.parse(fileNamesStr);
      for (const fileName of parsedFileNames) {
        // Handle both cases: fileName may or may not include .json extension
        const normalizedFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
        const url = `/data/faqs/${category}/${normalizedFileName}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}: ${response.status}`);
        }

        const data = await response.json();
        allFAQs.push(...data);
      }

      if (isMountedRef.current) {
        setFaqs(allFAQs);
        setIsLoaded(true);
        onLoadRef.current?.(allFAQs);
      }
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      if (isMountedRef.current) {
        setError(errObj);
        onErrorRef.current?.(errObj);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [category, fileNamesStr]);

  useEffect(() => {
    if (immediate) {
      load();
    }
  }, [immediate, load]);

  return { faqs, isLoading, isLoaded, error, reload: load };
}

/**
 * Hook to load all FAQs from a category (uses manifest.json to discover files)
 */
export function useAllCategoryFAQs(
  category: string,
  options: UseFAQsOptions = {}
): UseFAQsReturn & { manifest: string[] | null } {
  const { immediate = true, onLoad, onError } = options;
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [manifest, setManifest] = useState<string[] | null>(null);

  // Use refs to prevent callback recreation
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Store callbacks in refs to keep callback stable
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
      // First load the manifest
      const manifestUrl = `/data/faqs/manifest.json`;
      const manifestResp = await fetch(manifestUrl);
      if (!manifestResp.ok) throw new Error('Failed to load manifest');
      const manifestData = await manifestResp.json();

      const files = manifestData[category] || [];
      if (isMountedRef.current) {
        setManifest(files);
      }

      // Load all FAQ files
      const allFAQs: FAQ[] = [];
      for (const fileName of files) {
        const url = `/data/faqs/${category}/${fileName}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        const data = await response.json();
        allFAQs.push(...data);
      }

      if (isMountedRef.current) {
        setFaqs(allFAQs);
        setIsLoaded(true);
        onLoadRef.current?.(allFAQs);
      }
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      if (isMountedRef.current) {
        setError(errObj);
        onErrorRef.current?.(errObj);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [category]);

  useEffect(() => {
    if (immediate) {
      load();
    }
  }, [immediate, load]);

  return { faqs, isLoading, isLoaded, error, reload: load, manifest };
}

/**
 * Preload FAQ data for faster subsequent access
 */
export function preloadFAQs(category: string, fileNames: string[]): Promise<void> {
  // Don't await - just trigger the fetches in background
  fileNames.forEach((fileName) => {
    fetch(`/data/faqs/${category}/${fileName}.json`).catch(() => {});
  });
  return Promise.resolve();
}
