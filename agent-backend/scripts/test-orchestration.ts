/**
 * Run orchestration with real prompts and assert responses.
 * Usage: from repo root: cd agent-backend && npx tsx scripts/test-orchestration.ts
 *        or: npm run test:orchestration (from agent-backend)
 * Requires: XAI_API_KEY in .env (or parent .env)
 */
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env only (repo root then agent-backend so local overrides)
config({ path: path.join(__dirname, "..", "..", ".env") });
config({ path: path.join(__dirname, "..", ".env") });

const mockRedis = {
  get: async () => null,
  set: async () => undefined,
  exists: async () => 0,
  sadd: async () => undefined,
  scard: async () => 0,
  expire: async () => undefined,
} as unknown as import("ioredis").Redis;

async function main() {
  const { runOrchestrator } = await import("../src/orchestrator.js");

  if (!process.env.XAI_API_KEY) {
    console.error("XAI_API_KEY is not set. Set it in .env (repo root or agent-backend).");
    process.exit(1);
  }

  const prompts = [
    "What can you help me with in Millionaire Arena?",
    "Give me ladder question 3.",
    "Hello!",
  ];

  console.log("Testing orchestration with xAI (grok-4-1-fast-reasoning)...\n");
  let failed = 0;

  for (const prompt of prompts) {
    process.stdout.write(`Prompt: "${prompt}"\n`);
    try {
      const response = await runOrchestrator(prompt, { redis: mockRedis });
      const ok = typeof response === "string" && response.length > 0;
      if (ok) {
        console.log(`Response (${response.length} chars): ${response.slice(0, 200)}${response.length > 200 ? "..." : ""}\n`);
      } else {
        console.log("Response: (empty)\n");
        failed++;
      }
    } catch (e) {
      console.error("Error:", e instanceof Error ? e.message : e);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} prompt(s) failed or returned empty.`);
    process.exit(1);
  }
  console.log("All prompts returned a response.");
}

main();
