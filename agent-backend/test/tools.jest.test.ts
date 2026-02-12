/**
 * Jest unit tests: OpenTDB mapping, decode, obfuscate, fetchLadderQuestion, manageLadderState.
 */

import {
  mapLadderIndexToDifficulty,
  decodeArenaQuestion,
  obfuscateForAgent,
  rot13,
  fetchLadderQuestionForIndex,
  createDecodeArenaQuestionTool,
  getMultiplierForIndex,
  isSafeMilestone,
  LADDER_SIZE,
  SAFE_MILESTONES,
} from "../src/tools/index.js";

describe("mapLadderIndexToDifficulty", () => {
  it("maps Q1-5 to easy", () => {
    expect(mapLadderIndexToDifficulty(0)).toBe("easy");
    expect(mapLadderIndexToDifficulty(4)).toBe("easy");
  });
  it("maps Q6-10 to medium", () => {
    expect(mapLadderIndexToDifficulty(5)).toBe("medium");
    expect(mapLadderIndexToDifficulty(9)).toBe("medium");
  });
  it("maps Q11-15 to hard", () => {
    expect(mapLadderIndexToDifficulty(10)).toBe("hard");
    expect(mapLadderIndexToDifficulty(14)).toBe("hard");
  });
});

describe("decodeArenaQuestion", () => {
  it("decodes obfuscated payload round-trip", () => {
    const question = "What is 2+2?";
    const answers = ["3", "4", "5", "6"];
    const obfuscated = obfuscateForAgent(question, answers);
    const decoded = decodeArenaQuestion(obfuscated);
    expect(decoded).not.toBeNull();
    expect(decoded!.question).toBe(question);
    expect(decoded!.answers.sort()).toEqual([...answers].sort());
  });
  it("rot13 is involutive", () => {
    expect(rot13(rot13("Hello"))).toBe("Hello");
  });
});

describe("decode tool", () => {
  it("createDecodeArenaQuestionTool returns tool that decodes", async () => {
    const tool = createDecodeArenaQuestionTool();
    const question = "Capital of France?";
    const answers = ["London", "Paris", "Berlin", "Madrid"];
    const obfuscated = obfuscateForAgent(question, answers);
    const out = await tool.invoke({ obfuscatedPayload: obfuscated });
    const parsed = JSON.parse(out as string);
    expect(parsed.question).toBe(question);
    expect(parsed.answers.sort()).toEqual([...answers].sort());
  });
});

describe("fetchLadderQuestionForIndex", () => {
  it("returns null for out-of-range index", async () => {
    expect(await fetchLadderQuestionForIndex(0)).toBeNull();
    expect(await fetchLadderQuestionForIndex(16)).toBeNull();
  });
  it("returns question for valid index 1-15", async () => {
    const r = await fetchLadderQuestionForIndex(1);
    if (r) {
      expect(r.ladderIndex).toBe(1);
      expect(r.difficulty).toBe("easy");
      expect(r.question).toBeDefined();
      expect(Array.isArray(r.answers)).toBe(true);
      expect(r.answers.length).toBe(4);
    }
  }, 10000);
});

describe("manageLadderState helpers", () => {
  it("getMultiplierForIndex returns correct multipliers", () => {
    expect(getMultiplierForIndex(0)).toBe(1);
    expect(getMultiplierForIndex(4)).toBe(10);
    expect(getMultiplierForIndex(9)).toBe(320);
    expect(getMultiplierForIndex(14)).toBe(10000);
  });
  it("isSafeMilestone is true for Q5 and Q10", () => {
    expect(isSafeMilestone(5)).toBe(true);
    expect(isSafeMilestone(10)).toBe(true);
    expect(isSafeMilestone(1)).toBe(false);
    expect(isSafeMilestone(15)).toBe(false);
  });
  it("LADDER_SIZE and SAFE_MILESTONES are correct", () => {
    expect(LADDER_SIZE).toBe(15);
    expect(SAFE_MILESTONES).toEqual([5, 10]);
  });
});
