/**
 * manageLadderState: AgentKit-style tool. Enforces 15-question ladder with multipliers and safe milestones (Q5, Q10).
 */

import type { Redis } from "ioredis";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {
  getRoundState,
  setRoundState,
} from "../agents/game-master.js";

export const LADDER_SIZE = 15;
export const MULTIPLIERS = [
  1, 2, 3, 5, 10, 20, 40, 80, 160, 320, 640, 1250, 2500, 5000, 10000,
];
export const SAFE_MILESTONES = [5, 10]; // Q5 and Q10 are safe (walk away)

export interface LadderStateSummary {
  arenaId: string;
  currentRound: number;
  questionIndex: number;
  endsAt: number;
  eliminated: string[];
  multiplier: number;
  isSafeMilestone: boolean;
  ladderSize: number;
}

export function getMultiplierForIndex(index: number): number {
  return MULTIPLIERS[index] ?? 1;
}

export function isSafeMilestone(questionIndex: number): boolean {
  return SAFE_MILESTONES.includes(questionIndex);
}

export function createManageLadderStateTool(redis: Redis) {
  return new DynamicStructuredTool({
    name: "manageLadderState",
    description:
      "Get or update ladder/round state for an arena. 15-question ladder with multipliers; Q5 and Q10 are safe milestones.",
    schema: z.object({
      arenaId: z.string().describe("Arena/session identifier"),
      round: z.number().min(1).describe("Round number"),
      action: z.enum(["get", "set"]).describe("Get current state or set state"),
      questionIndex: z.number().min(0).max(14).optional().describe("Ladder question index 0–14"),
      endsAt: z.number().optional().describe("Unix timestamp when round ends"),
      eliminated: z.array(z.string()).optional().describe("Addresses eliminated this round"),
    }),
    func: async ({
      arenaId,
      round,
      action,
      questionIndex,
      endsAt,
      eliminated,
    }) => {
      if (action === "get") {
        const state = await getRoundState(redis, arenaId, round);
        if (!state) {
          return JSON.stringify({
            arenaId,
            round,
            state: null,
            multiplier: 1,
            isSafeMilestone: false,
            ladderSize: LADDER_SIZE,
          });
        }
        const summary: LadderStateSummary = {
          arenaId,
          currentRound: round,
          questionIndex: state.questionIndex,
          endsAt: state.endsAt,
          eliminated: state.eliminated,
          multiplier: getMultiplierForIndex(state.questionIndex),
          isSafeMilestone: isSafeMilestone(state.questionIndex),
          ladderSize: LADDER_SIZE,
        };
        return JSON.stringify(summary);
      }
      if (action === "set") {
        if (
          questionIndex === undefined ||
          endsAt === undefined ||
          eliminated === undefined
        ) {
          return JSON.stringify({
            error: "set requires questionIndex, endsAt, and eliminated",
          });
        }
        await setRoundState(redis, arenaId, round, {
          questionIndex,
          endsAt,
          eliminated,
        });
        return JSON.stringify({
          ok: true,
          arenaId,
          round,
          questionIndex,
          multiplier: getMultiplierForIndex(questionIndex),
          isSafeMilestone: isSafeMilestone(questionIndex),
        });
      }
      return JSON.stringify({ error: "Invalid action" });
    },
  });
}
