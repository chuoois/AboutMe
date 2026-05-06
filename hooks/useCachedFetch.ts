import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheService } from '@/lib/cache';

interface UseCachedFetchOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  enabled?: boolean; // If false, will not execute fetcher
}

interface UseCachedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refetch: () => Promise<void>;
}

// Global in-memory map to deduplicate concurrent requests for the same key
const pendingRequests = new Map<string, Promise<unknown>>();

export function useCachedFetch<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000,
  enabled = true,
}: UseCachedFetchOptions<T>): UseCachedFetchResult<T> {
  const [data, setData] = useState<T | null>(() => {
    if (typeof window === 'undefined') return null;
    return cacheService.getCache<T>(key, ttl);
  });
  
  // If we have cached data initially, we aren't "loading" (blocking UI), we are just "refreshing".
  const hasInitialCache = data !== null;
  const [loading, setLoading] = useState(!hasInitialCache && enabled);
  const [isRefreshing, setIsRefreshing] = useState(hasInitialCache && enabled);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);

  // Always keep the latest fetcher without triggering re-renders
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Sync state with cross-tab cache updates
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
    
    // Check expiration manually to decide if we need background fetch
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
        setLoading(false);
        setIsRefreshing(false);
      }
      return;
    }

    // Set appropriate loading states
    if (mountedRef.current) {
      if (!cachedData) setLoading(true);
      else setIsRefreshing(true);
    }

    try {
      // Request deduplication
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
        // Do NOT wipe existing cache/data on error, keeping stale data visible
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
      // Remove from pending requests slightly after resolution to handle microtask queue
      setTimeout(() => pendingRequests.delete(key), 0);
    }
  }, [key, ttl, enabled]);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  const refetch = useCallback(() => {
    return executeFetch(true);
  }, [executeFetch]);

  return {
    data,
    loading,
    error,
    isRefreshing,
    refetch,
  };
}
