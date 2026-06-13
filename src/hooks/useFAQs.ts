import { useState, useEffect, useCallback } from 'react';
import { FAQ } from '../types/faq';

interface UseFAQsOptions {
  /** Whether to load immediately on mount */
  immediate?: boolean;
  /** Callback when data is loaded */
  // eslint-disable-next-line no-unused-vars
  onLoad?: (_faqs: FAQ[]) => void;
  /** Callback on error */
  // eslint-disable-next-line no-unused-vars
  onError?: (_error: Error) => void;
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

  const load = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Construct URL: /data/faqs/{category}/{fileName}.json
      const url = `/data/faqs/${category}/${fileName}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load FAQs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setFaqs(data);
      setIsLoaded(true);
      onLoad?.(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [category, fileName, isLoading, onLoad, onError]);

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

  const load = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    const allFAQs: FAQ[] = [];

    try {
      for (const fileName of fileNames) {
        const url = `/data/faqs/${category}/${fileName}.json`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}: ${response.status}`);
        }

        const data = await response.json();
        allFAQs.push(...data);
      }

      setFaqs(allFAQs);
      setIsLoaded(true);
      onLoad?.(allFAQs);
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      onError?.(errObj);
    } finally {
      setIsLoading(false);
    }
  }, [category, fileNames, isLoading, onLoad, onError]);

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

  const load = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // First load the manifest
      const manifestUrl = `/data/faqs/manifest.json`;
      const manifestResp = await fetch(manifestUrl);
      if (!manifestResp.ok) throw new Error('Failed to load manifest');
      const manifestData = await manifestResp.json();

      const files = manifestData[category] || [];
      setManifest(files);

      // Load all FAQ files
      const allFAQs: FAQ[] = [];
      for (const fileName of files) {
        const url = `/data/faqs/${category}/${fileName}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        const data = await response.json();
        allFAQs.push(...data);
      }

      setFaqs(allFAQs);
      setIsLoaded(true);
      onLoad?.(allFAQs);
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      onError?.(errObj);
    } finally {
      setIsLoading(false);
    }
  }, [category, isLoading, onLoad, onError]);

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
}
