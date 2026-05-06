export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_PREFIX = 'app_cache_';

export const cacheService = {
  getCache: <T>(key: string, ttl: number = 5 * 60 * 1000): T | null => {
    try {
      const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!item) return null;

      const parsed: CacheItem<T> = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > ttl;

      if (isExpired) {
        // We still return the data for stale-while-revalidate,
        // but it will be overwritten by the background fetch.
        // We do not remove it here, useCachedFetch handles the logic.
      }

      return parsed.data;
    } catch (error) {
      console.warn(`Failed to read cache for key: ${key}`, error);
      return null;
    }
  },

  setCache: <T>(key: string, data: T): void => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn(`Failed to set cache for key: ${key}`, error);
      // Fallback if quota exceeded: clear cache and try again
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        cacheService.clearCache();
        try {
          const cacheItem: CacheItem<T> = { data, timestamp: Date.now() };
          localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
        } catch (retryError) {
          console.error('Cache quota exceeded permanently', retryError);
        }
      }
    }
  },

  removeCache: (key: string): void => {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn(`Failed to remove cache for key: ${key}`, error);
    }
  },

  clearCache: (): void => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear cache', error);
    }
  },
};
