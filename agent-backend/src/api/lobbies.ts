/**
 * REST API for mini-app: list lobbies from Redis.
 */

import type { Redis } from "ioredis";

export async function listLobbies(redis: Redis): Promise<{ id: string; count: number }[]> {
  const keys = await redis.keys("lobby:*");
  const out: { id: string; count: number }[] = [];
  for (const key of keys) {
    const id = key.replace("lobby:", "");
    const count = await redis.scard(key);
    out.push({ id, count });
  }
  return out;
}
