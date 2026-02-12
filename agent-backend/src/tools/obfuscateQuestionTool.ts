/**
 * obfuscateQuestion: AgentKit-style tool. Obfuscates a question for agent-only view (ROT13 + Base64 + riddle).
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { obfuscateForAgent } from "./decodeArenaQuestion.js";

export function createObfuscateQuestionTool() {
  return new DynamicStructuredTool({
    name: "obfuscateQuestion",
    description:
      "Obfuscate a trivia question and answers for agent-only view (ROT13 + Base64 + riddle wrapper). Use when sending question data to agents.",
    schema: z.object({
      question: z.string().describe("Plain question text"),
      answers: z.array(z.string()).describe("Array of answer options (including correct)"),
    }),
    func: async ({ question, answers }) => {
      const obfuscated = obfuscateForAgent(question, answers);
      return obfuscated;
    },
  });
}
