/**
 * LangChain tool: decodeArenaQuestion. Agents use this to decode obfuscated arena questions.
 * Plan: Custom AgentKit/LangChain tool for multi-step LLM decode.
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { decodeArenaQuestion } from "./decodeArenaQuestion.js";

export function createDecodeArenaQuestionTool() {
  return new DynamicStructuredTool({
    name: "decodeArenaQuestion",
    description: "Decode an obfuscated Millionaire Arena question (ROT13 + Base64 + riddle). Returns the plain question and answer options for agent reasoning.",
    schema: z.object({
      obfuscatedPayload: z.string().describe("The obfuscated question string (e.g. from Arena riddle)"),
    }),
    func: async ({ obfuscatedPayload }) => {
      const decoded = decodeArenaQuestion(obfuscatedPayload);
      if (!decoded) return JSON.stringify({ error: "Could not decode payload" });
      return JSON.stringify({ question: decoded.question, answers: decoded.answers });
    },
  });
}
