/**
 * Game Master agent: fetch OpenTDB by tier, map to ladder, obfuscate for agents, round state in Redis.
 */

import type { Redis } from "ioredis";
import {
  fetchOpenTDBQuestions,
  mapLadderIndexToDifficulty,
  obfuscateForAgent,
  type OpenTDBQuestion,
} from "../tools/index.js";

const LADDER_SIZE = 15;
const ROUND_TIMER_SEC = 30;

export interface LadderQuestion {
  index: number;
  multiplier: number;
  difficulty: "easy" | "medium" | "hard";
  question: OpenTDBQuestion;
  obfuscatedForAgent?: string;
}

// US show style: Q1-5 easy (1x-10x), Q6-10 medium (20x-320x), Q11-15 hard (640x-10,000x)
const MULTIPLIERS = [
  1, 2, 3, 5, 10, 20, 40, 80, 160, 320, 640, 1250, 2500, 5000, 10000,
];

export async function buildLadder(redis: Redis): Promise<LadderQuestion[]> {
  const ladder: LadderQuestion[] = [];
  for (let i = 0; i < LADDER_SIZE; i++) {
    const difficulty = mapLadderIndexToDifficulty(i);
    const [q] = await fetchOpenTDBQuestions(difficulty, 1);
    if (!q) continue;
    const answers = [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5);
    ladder.push({
      index: i + 1,
      multiplier: MULTIPLIERS[i] ?? 1,
      difficulty,
      question: q,
      obfuscatedForAgent: obfuscateForAgent(q.question, answers),
    });
  }
  return ladder;
}

export function getRoundTimerSec(): number {
  return ROUND_TIMER_SEC;
}

export async function setRoundState(
  redis: Redis,
  arenaId: string,
  round: number,
  data: { questionIndex: number; endsAt: number; eliminated: string[] }
): Promise<void> {
  await redis.set(`arena:${arenaId}:round:${round}`, JSON.stringify(data), "EX", 3600);
}

export async function getRoundState(
  redis: Redis,
  arenaId: string,
  round: number
): Promise<{ questionIndex: number; endsAt: number; eliminated: string[] } | null> {
  const raw = await redis.get(`arena:${arenaId}:round:${round}`);
  return raw ? JSON.parse(raw) : null;
}
