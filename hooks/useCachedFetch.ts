import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheService } from '@/lib/cache';

interface UseCachedFetchOptions {
  ttl?: number;
  enabled?: boolean;
}

interface UseCachedFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

// Global in-memory map to deduplicate concurrent requests for the same key
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * useCachedFetch Hook
 * Follows the Refactoring Guidelines: SWR & Loading States
 */
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCachedFetchOptions = {}
): UseCachedFetchResult<T> {
  const { ttl = 5 * 60 * 1000, enabled = true } = options;

  const [data, setData] = useState<T | null>(() => {
    if (typeof window === 'undefined') return null;
    return cacheService.getCache<T>(key, ttl);
  });
  
  const hasInitialCache = data !== null;
  const [isLoading, setIsLoading] = useState(!hasInitialCache && enabled);
  const [isRefreshing, setIsRefreshing] = useState(hasInitialCache && enabled);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    mountedRef.current = true;
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `app_cache_${key}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData(parsed.data);
        } catch (err) {
          console.error('Failed to sync cache across tabs', err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, [key]);

  const executeFetch = useCallback(async (ignoreCache = false) => {
    if (!enabled) return;

    const cachedData = cacheService.getCache<T>(key, ttl);
    
    let isExpired = true;
    try {
      const rawItem = localStorage.getItem(`app_cache_${key}`);
      if (rawItem) {
        const parsed = JSON.parse(rawItem);
        isExpired = Date.now() - parsed.timestamp > ttl;
      }
    } catch {
      isExpired = true;
    }

    if (!ignoreCache && cachedData && !isExpired) {
      if (mountedRef.current) {
        setData(cachedData);
        setIsLoading(false);
        setIsRefreshing(false);
      }
      return;
    }

    if (mountedRef.current) {
      if (!cachedData) setIsLoading(true);
      else setIsRefreshing(true);
    }

    try {
      if (!pendingRequests.has(key)) {
        pendingRequests.set(key, fetcherRef.current());
      }

      const result = await (pendingRequests.get(key) as Promise<T>);

      if (mountedRef.current) {
        setData(result);
        setError(null);
        cacheService.setCache(key, result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during fetch';
        setError(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
      setTimeout(() => pendingRequests.delete(key), 0);
    }
  }, [key, ttl, enabled]);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  const refresh = useCallback(() => {
    return executeFetch(true);
  }, [executeFetch]);

  return {
    data,
    isLoading,
    error,
    isRefreshing,
    refresh,
  };
}
