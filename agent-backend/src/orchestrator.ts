/**
 * Orchestrator using xAI's recommended stack: Vercel AI SDK + @ai-sdk/xai.
 * Tool loop and multi-step execution are handled by the AI SDK (no custom agent loop).
 * @see https://docs.x.ai/developers/tools/function-calling
 * @see https://sdk.vercel.ai/providers/ai-sdk-providers/xai
 */

import { xai } from "@ai-sdk/xai";
import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import type { Redis } from "ioredis";
import { decodeArenaQuestion, fetchLadderQuestionForIndex } from "./tools/index.js";
import { getRoundState, setRoundState } from "./agents/game-master.js";
import {
  getMultiplierForIndex,
  isSafeMilestone,
  LADDER_SIZE,
} from "./tools/manageLadderState.js";

const MODEL_ID = "grok-4-1-fast-reasoning";

export interface OrchestratorOptions {
  redis: Redis;
}

const SYSTEM_PROMPT = `You are the Millionaire Arena assistant. You can decode obfuscated questions, fetch ladder questions (1–15), and get/set ladder state. Be concise. Only use tools when the user asks for decode, a question number, or ladder/arena state.`;

function buildTools(redis: Redis) {
  return {
    decodeArenaQuestion: tool({
      description:
        "Decode an obfuscated Millionaire Arena question (ROT13 + Base64 + riddle). Returns the plain question and answer options.",
      inputSchema: z.object({
        obfuscatedPayload: z.string().describe("The obfuscated question string (e.g. from Arena riddle)"),
      }),
      execute: async ({ obfuscatedPayload }: { obfuscatedPayload: string }) => {
        const decoded = decodeArenaQuestion(obfuscatedPayload);
        if (!decoded) return { error: "Could not decode payload" };
        return { question: decoded.question, answers: decoded.answers };
      },
    }),
    fetchLadderQuestion: tool({
      description:
        "Fetch one trivia question for the Millionaire Arena ladder. Ladder index 1–15: Q1–5 easy, Q6–10 medium, Q11–15 hard.",
      inputSchema: z.object({
        ladderIndex: z.number().min(1).max(15).describe("Ladder step 1 to 15"),
      }),
      execute: async ({ ladderIndex }: { ladderIndex: number }) => {
        const result = await fetchLadderQuestionForIndex(ladderIndex);
        if (!result) return { error: "No question available for this ladder index" };
        return result;
      },
    }),
    manageLadderState: tool({
      description:
        "Get or update ladder/round state for an arena. 15-question ladder with multipliers; Q5 and Q10 are safe milestones.",
      inputSchema: z.object({
        arenaId: z.string().describe("Arena/session identifier"),
        round: z.number().min(1).describe("Round number"),
        action: z.enum(["get", "set"]).describe("Get current state or set state"),
        questionIndex: z.number().min(0).max(14).optional().describe("Ladder question index 0–14"),
        endsAt: z.number().optional().describe("Unix timestamp when round ends"),
        eliminated: z.array(z.string()).optional().describe("Addresses eliminated this round"),
      }),
      execute: async (args: {
        arenaId: string;
        round: number;
        action: "get" | "set";
        questionIndex?: number;
        endsAt?: number;
        eliminated?: string[];
      }) => {
        const { arenaId, round, action, questionIndex, endsAt, eliminated } = args;
        if (action === "get") {
          const state = await getRoundState(redis, arenaId, round);
          if (!state) {
            return {
              arenaId,
              round,
              state: null,
              multiplier: 1,
              isSafeMilestone: false,
              ladderSize: LADDER_SIZE,
            };
          }
          return {
            arenaId,
            currentRound: round,
            questionIndex: state.questionIndex,
            endsAt: state.endsAt,
            eliminated: state.eliminated,
            multiplier: getMultiplierForIndex(state.questionIndex),
            isSafeMilestone: isSafeMilestone(state.questionIndex),
            ladderSize: LADDER_SIZE,
          };
        }
        if (action === "set") {
          if (
            questionIndex === undefined ||
            endsAt === undefined ||
            eliminated === undefined
          ) {
            return { error: "set requires questionIndex, endsAt, and eliminated" };
          }
          await setRoundState(redis, arenaId, round, {
            questionIndex,
            endsAt,
            eliminated,
          });
          return {
            ok: true,
            arenaId,
            round,
            questionIndex,
            multiplier: getMultiplierForIndex(questionIndex),
            isSafeMilestone: isSafeMilestone(questionIndex),
          };
        }
        return { error: "Invalid action" };
      },
    }),
  };
}

/**
 * Run orchestration using xAI (grok-4-1-fast-reasoning) and Vercel AI SDK.
 * The SDK handles the tool-call loop; no custom agent loop.
 */
export async function runOrchestrator(userMessage: string, options: OrchestratorOptions): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is not set");

  const { redis } = options;
  const model = xai(MODEL_ID);
  const tools = buildTools(redis);

  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: userMessage,
    tools,
    stopWhen: stepCountIs(5),
  });

  return (text ?? "").trim() || "I don't have a response for that.";
}
