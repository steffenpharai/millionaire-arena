/**
 * Unit tests: OpenTDB mapping, decodeArenaQuestion (obfuscation round-trip).
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { mapLadderIndexToDifficulty, decodeArenaQuestion, obfuscateForAgent, rot13 } from "../src/tools/index.js";

describe("mapLadderIndexToDifficulty", () => {
  it("maps Q1-5 to easy", () => {
    assert.strictEqual(mapLadderIndexToDifficulty(0), "easy");
    assert.strictEqual(mapLadderIndexToDifficulty(4), "easy");
  });
  it("maps Q6-10 to medium", () => {
    assert.strictEqual(mapLadderIndexToDifficulty(5), "medium");
    assert.strictEqual(mapLadderIndexToDifficulty(9), "medium");
  });
  it("maps Q11-15 to hard", () => {
    assert.strictEqual(mapLadderIndexToDifficulty(10), "hard");
    assert.strictEqual(mapLadderIndexToDifficulty(14), "hard");
  });
});

describe("decodeArenaQuestion", () => {
  it("decodes obfuscated payload round-trip", () => {
    const question = "What is 2+2?";
    const answers = ["3", "4", "5", "6"];
    const obfuscated = obfuscateForAgent(question, answers);
    const decoded = decodeArenaQuestion(obfuscated);
    assert.ok(decoded != null);
    assert.strictEqual(decoded!.question, question);
    assert.deepStrictEqual(decoded!.answers.sort(), [...answers].sort());
  });
  it("rot13 is involutive", () => {
    assert.strictEqual(rot13(rot13("Hello")), "Hello");
  });
});
