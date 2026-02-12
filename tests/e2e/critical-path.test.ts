/**
 * E2E critical path: join flow, ladder mapping, decode tool.
 * Plan: Join -> round -> pot feed / payout where testable (chain ops mocked).
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { isArenaJoinCommand, getArenaJoinReply } from "../../agent-backend/src/xmtp-handler.js";
import {
  decodeArenaQuestion,
  mapLadderIndexToDifficulty,
  obfuscateForAgent,
} from "../../agent-backend/src/tools/index.js";

describe("E2E critical path", () => {
  it("detects /arena join and returns mini-app URL", () => {
    assert.strictEqual(isArenaJoinCommand("/arena join"), true);
    assert.strictEqual(isArenaJoinCommand("  /arena join  "), true);
    assert.strictEqual(isArenaJoinCommand("hello"), false);
    const reply = getArenaJoinReply();
    assert.ok(reply.includes("Millionaire Arena"));
    assert.ok(reply.includes("No purchase necessary"));
  });

  it("ladder mapping Q1-15 to easy/medium/hard", () => {
    for (let i = 0; i < 5; i++) assert.strictEqual(mapLadderIndexToDifficulty(i), "easy");
    for (let i = 5; i < 10; i++) assert.strictEqual(mapLadderIndexToDifficulty(i), "medium");
    for (let i = 10; i < 15; i++) assert.strictEqual(mapLadderIndexToDifficulty(i), "hard");
  });

  it("decodeArenaQuestion round-trip with obfuscateForAgent", () => {
    const question = "What is 2+2?";
    const answers = ["3", "4", "5", "6"];
    const obfuscated = obfuscateForAgent(question, answers);
    const decoded = decodeArenaQuestion(obfuscated);
    assert.ok(decoded != null);
    assert.strictEqual(decoded!.question, question);
    assert.deepStrictEqual(decoded!.answers.sort(), [...answers].sort());
  });
});
