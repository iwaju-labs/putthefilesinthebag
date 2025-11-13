// Simple rate limiting using in-memory store with localStorage backup
// In production, you'd use Redis or a database

interface RateLimitData {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitData>();
const STORAGE_KEY_PREFIX = 'rate_limit_';

// Helper to get data from localStorage or memory
function getRateLimitData(identifier: string): RateLimitData | null {
  // Check memory first
  let data = rateLimitStore.get(identifier);
  
  // If not in memory, try localStorage (client-side only)
  if (!data && globalThis.localStorage !== undefined) {
    const stored = globalThis.localStorage.getItem(`${STORAGE_KEY_PREFIX}${identifier}`);
    if (stored) {
      try {
        data = JSON.parse(stored);
        if (data) {
          rateLimitStore.set(identifier, data);
        }
      } catch (error) {
        console.error('Failed to parse rate limit data:', error);
      }
    }
  }
  
  return data || null;
}

// Helper to save data to both memory and localStorage
function setRateLimitData(identifier: string, data: RateLimitData) {
  rateLimitStore.set(identifier, data);
  
  // Also save to localStorage (client-side only)
  if (globalThis.localStorage !== undefined) {
    globalThis.localStorage.setItem(`${STORAGE_KEY_PREFIX}${identifier}`, JSON.stringify(data));
  }
}

export function checkRateLimit(identifier: string, maxRequests: number = 3): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  let data = getRateLimitData(identifier);
  console.log('[checkRateLimit] Current data for', identifier, ':', data);
  
  // Reset if expired
  if (!data || now >= data.resetAt) {
    data = {
      count: 0,
      resetAt: now + oneDayMs,
    };
    setRateLimitData(identifier, data);
    console.log('[checkRateLimit] Reset/initialized data:', data);
  }
  
  const remaining = Math.max(0, maxRequests - data.count);
  const allowed = data.count < maxRequests;
  
  if (allowed) {
    data.count++;
    setRateLimitData(identifier, data);
    console.log('[checkRateLimit] Incremented count. New data:', data);
  }
  
  const result = {
    allowed,
    remaining: allowed ? remaining - 1 : remaining,
    resetAt: data.resetAt,
  };
  console.log('[checkRateLimit] Returning:', result);
  
  return result;
}

export function getRemainingConversions(identifier: string, maxRequests: number = 3): number {
  const data = getRateLimitData(identifier);
  const now = Date.now();
  
  if (!data || now >= data.resetAt) {
    return maxRequests;
  }
  
  return Math.max(0, maxRequests - data.count);
}

// Cleanup old entries periodically
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now >= data.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
