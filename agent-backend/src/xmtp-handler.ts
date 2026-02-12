/**
 * XMTP entrypoint: /arena join (mini-app URL, lobby), stake commands, rich preview.
 */

import type { Redis } from "ioredis";

const MINI_APP_URL = process.env.AGENT_MINI_APP_URL || "https://your-miniapp-url.com";
const ARENA_JOIN_CMD = "/arena join";
const STAKE_PATTERN = /(\/arena\s+)?stake\s+(\d+)/i;

export function isArenaJoinCommand(text: string): boolean {
  return text.trim().toLowerCase().includes(ARENA_JOIN_CMD.toLowerCase());
}

export function getArenaJoinReply(miniAppUrl: string = MINI_APP_URL): string {
  return `Ready for Millionaire Arena! Join the battle royale here:\n\n${miniAppUrl}\n\nNo purchase necessary. Skill-based contest.`;
}

/** Rich preview for unfurl: pot/players/ladder teaser. */
export async function getArenaJoinReplyRich(
  redis: Redis,
  conversationId: string,
  miniAppUrl: string = MINI_APP_URL
): Promise<string> {
  const key = `lobby:${conversationId}`;
  const count = await redis.scard(key).catch(() => 0);
  return `Ready for Millionaire Arena! 15-question ladder, gasless stakes.\n${count} in lobby. Join: ${miniAppUrl}\n\nNo purchase necessary. Skill-based contest.`;
}

export function isStakeCommand(text: string): boolean {
  return STAKE_PATTERN.test(text.trim());
}

/** Parse stake amount from "stake 100" or "/arena stake 100". */
export function parseStakeAmount(text: string): number | null {
  const m = text.trim().match(STAKE_PATTERN);
  return m ? parseInt(m[2]!, 10) : null;
}

export function getStakeReply(amount: number, miniAppUrl: string = MINI_APP_URL): string {
  return `To stake ${amount} $MILLION (gasless): open the mini-app and use "Stake" or "Feed pot".\n\n${miniAppUrl}\n\nStakes go to the arena pot. No purchase necessary to play.`;
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
