import localforage from 'localforage';

// Configure a store for our application
const cache = localforage.createInstance({
  name: 'finboard-cache',
  storeName: 'api_cache',
  description: 'Cache for API responses',
});

type CachedResponse<T> = {
  data: T;
  expires: number;
};

/**
 * Get data from cache if it exists and hasn't expired
 * @param key Unique cache key
 * @returns Cached data or null if not found/expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cached = await cache.getItem<CachedResponse<T>>(key);
    if (cached && Date.now() < cached.expires) {
      console.log(`[Cache] Hit: ${key}`);
      return cached.data;
    }
    if (cached) {
      console.log(`[Cache] Expired: ${key}`);
      // Remove expired entry
      await cache.removeItem(key);
    }
    return null;
  } catch (error) {
    console.error('[Cache] Error getting cached data:', error);
    return null;
  }
}

/**
 * Store data in cache with TTL
 * @param key Unique cache key
 * @param data Data to cache
 * @param ttlMs Time to live in milliseconds
 */
export async function setCachedData<T>(key: string, data: T, ttlMs: number): Promise<void> {
  try {
    const expires = Date.now() + ttlMs;
    const payload: CachedResponse<T> = { data, expires };
    await cache.setItem(key, payload);
    console.log(`[Cache] Set: ${key} (expires in ${Math.round(ttlMs / 1000)}s)`);
  } catch (error) {
    console.error('[Cache] Error setting cached data:', error);
  }
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  try {
    await cache.clear();
    console.log('[Cache] Cleared all cached data');
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
  }
}

// Cache TTLs in milliseconds
export const CACHE_TTL = {
  INTRADAY: 5 * 60 * 1000, // 5 minutes for intraday data
  DAILY: 24 * 60 * 60 * 1000, // 24 hours for daily data
  WEEKLY: 7 * 24 * 60 * 60 * 1000, // 1 week for weekly data
  MONTHLY: 30 * 24 * 60 * 60 * 1000, // 30 days for monthly data
};

/**
 * Generate a cache key for API requests
 * @param prefix Service prefix (e.g., 'alphavantage', 'finnhub')
 * @param symbol Stock symbol
 * @param interval Data interval (if applicable)
 * @returns Generated cache key
 */
export function generateCacheKey(prefix: string, symbol: string, interval?: string): string {
  return `${prefix}:${symbol}${interval ? `:${interval}` : ''}`.toLowerCase();
}
