import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

interface RateLimitData {
  count: number;
  resetAt: number;
}

interface RateLimitStore {
  [userId: string]: RateLimitData;
}

const STORE_DIR = path.join(process.cwd(), '.rate-limit');
const STORE_FILE = path.join(STORE_DIR, 'store.json');

// Ensure store directory exists
async function ensureStoreExists() {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }
  if (!existsSync(STORE_FILE)) {
    await writeFile(STORE_FILE, JSON.stringify({}));
  }
}

// Read store from disk
async function readStore(): Promise<RateLimitStore> {
  try {
    await ensureStoreExists();
    const data = await readFile(STORE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Write store to disk
async function writeStore(store: RateLimitStore): Promise<void> {
  await ensureStoreExists();
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2));
}

// Get rate limit data for a user
export async function getRateLimitData(userId: string): Promise<RateLimitData | null> {
  const store = await readStore();
  return store[userId] || null;
}

// Set rate limit data for a user
export async function setRateLimitData(userId: string, data: RateLimitData): Promise<void> {
  const store = await readStore();
  store[userId] = data;
  await writeStore(store);
}

// Check if user has exceeded rate limit
export async function checkRateLimit(userId: string, limit: number): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const now = Date.now();
  const data = await getRateLimitData(userId);

  // If no data or reset time passed, initialize/reset
  if (!data || now > data.resetAt) {
    const resetAt = now + 24 * 60 * 60 * 1000; // 24 hours from now
    await setRateLimitData(userId, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
    };
  }

  // Check if limit exceeded
  if (data.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: data.resetAt,
    };
  }

  // Increment count
  data.count += 1;
  await setRateLimitData(userId, data);

  return {
    allowed: true,
    remaining: limit - data.count,
    resetAt: data.resetAt,
  };
}

// Get remaining conversions for a user
export async function getRemainingConversions(userId: string, limit: number): Promise<number> {
  const now = Date.now();
  const data = await getRateLimitData(userId);

  if (!data || now > data.resetAt) {
    return limit;
  }

  return Math.max(0, limit - data.count);
}
