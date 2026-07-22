import { addRedisData, getRedisData } from './redis';

/**
 * Simple sliding window counter backed by Redis.
 * Fails open (allows) if Redis is unavailable so demos still work.
 */
export async function rateLimit(options: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean; remaining: number }> {
  const { key, limit, windowSeconds } = options;
  const redisKey = `rl:${key}`;

  try {
    const existing = await getRedisData(redisKey);
    let count = 0;
    if (typeof existing === 'number') count = existing;
    else if (typeof existing === 'string') count = parseInt(existing, 10) || 0;
    else if (existing && typeof existing === 'object' && 'count' in (existing as object)) {
      count = Number((existing as { count: number }).count) || 0;
    }

    if (count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    const next = count + 1;
    addRedisData(String(next), redisKey, windowSeconds);
    return { allowed: true, remaining: Math.max(0, limit - next) };
  } catch {
    return { allowed: true, remaining: limit };
  }
}

export function clientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
