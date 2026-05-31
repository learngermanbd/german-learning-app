import IORedis from 'ioredis';
import { env } from '../../config/env';

export class RedisCache {
  private redis: IORedis;
  private defaultTTL = 3600;

  constructor() {
    this.redis = new IORedis(env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl || this.defaultTTL);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async getOrFetch<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    const data = await fetchFn();
    await this.set(key, data, ttl);
    return data;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) await this.redis.del(...keys);
  }
}

export const cache = new RedisCache();
