/**
 * XMTP entrypoint: on "text" containing /arena join, reply with mini-app URL and create/join lobby (Redis).
 */

import type { Redis } from "ioredis";

const MINI_APP_URL = process.env.AGENT_MINI_APP_URL || "https://your-miniapp-url.com";
const ARENA_JOIN_CMD = "/arena join";

export function isArenaJoinCommand(text: string): boolean {
  return text.trim().toLowerCase().includes(ARENA_JOIN_CMD.toLowerCase());
}

export function getArenaJoinReply(miniAppUrl: string = MINI_APP_URL): string {
  return `Ready for Millionaire Arena! Join the battle royale here:\n\n${miniAppUrl}\n\nNo purchase necessary. Skill-based contest.`;
}

export async function createOrJoinLobby(redis: Redis, conversationId: string, participantAddress: string): Promise<string> {
  const key = `lobby:${conversationId}`;
  const exists = await redis.exists(key);
  if (!exists) await redis.sadd(key, participantAddress);
  else await redis.sadd(key, participantAddress);
  await redis.expire(key, 86400);
  const count = await redis.scard(key);
  return `Lobby has ${count} participant(s). Open the mini-app to start when ready.`;
}
