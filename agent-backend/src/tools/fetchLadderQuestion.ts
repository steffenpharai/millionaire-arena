/**
 * fetchLadderQuestion: AgentKit-style tool. Fetches one OpenTDB question for ladder position 1–15.
 * Mapping: Q1–5 easy, Q6–10 medium, Q11–15 hard; general categories only.
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {
  fetchOpenTDBQuestions,
  mapLadderIndexToDifficulty,
  type OpenTDBQuestion,
} from "./opentdb.js";

export interface FetchLadderQuestionResult {
  ladderIndex: number;
  difficulty: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  category: string;
}

export async function fetchLadderQuestionForIndex(
  ladderIndex: number
): Promise<FetchLadderQuestionResult | null> {
  if (ladderIndex < 1 || ladderIndex > 15) return null;
  const difficulty = mapLadderIndexToDifficulty(ladderIndex - 1);
  const questions = await fetchOpenTDBQuestions(difficulty, 1);
  const q = questions[0] as OpenTDBQuestion | undefined;
  if (!q) return null;
  const answers = [q.correct_answer, ...q.incorrect_answers].sort(
    () => Math.random() - 0.5
  );
  return {
    ladderIndex,
    difficulty,
    question: q.question,
    answers,
    correctAnswer: q.correct_answer,
    category: q.category,
  };
}

export function createFetchLadderQuestionTool() {
  return new DynamicStructuredTool({
    name: "fetchLadderQuestion",
    description:
      "Fetch one trivia question for the Millionaire Arena ladder. Ladder index 1–15: Q1–5 easy, Q6–10 medium, Q11–15 hard. Uses OpenTDB with general categories.",
    schema: z.object({
      ladderIndex: z
        .number()
        .min(1)
        .max(15)
        .describe("Ladder step 1 to 15"),
    }),
    func: async ({ ladderIndex }) => {
      const result = await fetchLadderQuestionForIndex(ladderIndex);
      if (!result)
        return JSON.stringify({
          error: "No question available for this ladder index",
        });
      return JSON.stringify(result);
    },
  });
}
