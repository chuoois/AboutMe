// services/api/server.ts
// Server-side fetch wrapper for RSC data fetching (no axios needed)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

/**
 * Server-side fetch wrapper. Uses Next.js extended fetch with caching.
 * Only use in Server Components or server-side functions.
 */
export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { cache, revalidate, tags } = options;

  const fetchOptions: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Configure caching strategy
  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate, tags };
  } else if (cache) {
    fetchOptions.cache = cache;
  } else {
    // Default: revalidate every 60 seconds (ISR-style)
    fetchOptions.next = { revalidate: 60, tags };
  }

  const res = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
