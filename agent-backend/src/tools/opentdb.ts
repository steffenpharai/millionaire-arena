/**
 * OpenTDB API: fetch questions by difficulty and category.
 * Plan: Q1-5 easy, Q6-10 medium, Q11-15 hard. Categories: History 23, Science 17, General 9, Film 11, Music 12.
 */

const OPENTDB = "https://opentdb.com/api.php";
const CATEGORIES = { general: 9, film: 11, music: 12, science: 17, history: 23 } as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export interface OpenTDBQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

function decodeHtml(s: string): string {
  const map: Record<string, string> = {
    "&quot;": '"',
    "&#039;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
  };
  let out = s;
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
  return out;
}

export function mapLadderIndexToDifficulty(index: number): Difficulty {
  if (index < 5) return "easy";
  if (index < 10) return "medium";
  return "hard";
}

export async function fetchOpenTDBQuestions(
  difficulty: Difficulty,
  count: number,
  category?: number
): Promise<OpenTDBQuestion[]> {
  const params = new URLSearchParams({
    amount: String(count),
    difficulty,
    type: "multiple",
  });
  if (category != null) params.set("category", String(category));
  const res = await fetch(`${OPENTDB}?${params}`);
  const data = (await res.json()) as { response_code: number; results?: OpenTDBQuestion[] };
  if (data.response_code !== 0 || !data.results) return [];
  return data.results.map((q) => ({
    ...q,
    question: decodeHtml(q.question),
    correct_answer: decodeHtml(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(decodeHtml),
  }));
}

export function getCategoriesForTier(difficulty: Difficulty): number[] {
  const all = Object.values(CATEGORIES);
  return all;
}
