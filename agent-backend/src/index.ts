/**
 * Millionaire Arena agent backend: XMTP listener + multi-agent swarm (Game Master, Social, Payment).
 * Plan: AgentKit + LangChain tools; /arena join shares mini-app; stake commands; Redis for sessions.
 */

import "dotenv/config";
import http from "node:http";
import { Agent } from "@xmtp/agent-sdk";
import IORedis from "ioredis";
import {
  isArenaJoinCommand,
  getArenaJoinReplyRich,
  createOrJoinLobby,
  isStakeCommand,
  parseStakeAmount,
  getStakeReply,
} from "./xmtp-handler.js";
import {
  decodeArenaQuestion,
  fetchLadderQuestionForIndex,
  createManageLadderStateTool,
} from "./tools/index.js";
import { listLobbies } from "./api/lobbies.js";
import { prepareStakeCall, prepareContributeCall } from "./agents/payment-economy.js";
import { runOrchestrator } from "./orchestrator.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redis = new (IORedis as any)(process.env.REDIS_URL || "redis://localhost:6379");
const manageLadderStateTool = createManageLadderStateTool(redis);

function startApiServer(port: number) {
  const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/api/lobbies") {
      try {
        const lobbies = await listLobbies(redis);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(lobbies));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e) }));
      }
      return;
    }
    if (req.method === "GET" && req.url === "/api/leaderboard") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify([]));
      return;
    }
    if (req.method === "POST" && req.url === "/api/contribute") {
      let body = "";
      req.on("data", (c) => { body += c; });
      req.on("end", async () => {
        try {
          const json = JSON.parse(body || "{}") as { roundId?: string; amountWei?: string };
          const roundId = json.roundId ?? "";
          const amountWei = json.amountWei ?? "0";
          const potAddress = (process.env.POT_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_POT_CONTRACT_ADDRESS) as `0x${string}` | undefined;
          if (!potAddress) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "POT_CONTRACT_ADDRESS not configured" }));
            return;
          }
          const call = await prepareContributeCall(
            { roundId, amountWei, userAddress: "" },
            potAddress
          );
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, to: call.to, data: call.data }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
      return;
    }
    if (req.method === "POST" && req.url === "/api/stake") {
      let body = "";
      req.on("data", (c) => { body += c; });
      req.on("end", async () => {
        try {
          const json = JSON.parse(body || "{}") as { roundId?: string; amountWei?: string };
          const roundId = json.roundId ?? "";
          const amountWei = json.amountWei ?? "0";
          const potAddress = (process.env.POT_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_POT_CONTRACT_ADDRESS) as `0x${string}` | undefined;
          const paymasterUrl = process.env.PAYMASTER_URL || "";
          if (!potAddress) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "POT_CONTRACT_ADDRESS not configured" }));
            return;
          }
          const call = await prepareStakeCall(
            { roundId, amountWei, userAddress: "" },
            potAddress,
            paymasterUrl
          );
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, to: call.to, data: call.data, value: call.value.toString() }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
      return;
    }
    res.statusCode = 404;
    res.end();
  });
  server.listen(port, () => console.log("Agent API listening on", port));
}

startApiServer(Number(process.env.AGENT_API_PORT) || 3001);

async function main() {
  const agent = await Agent.createFromEnv({
    env: (process.env.XMTP_ENV as "dev" | "production") || "dev",
  });

  agent.on("text", async (ctx: unknown) => {
    const c = ctx as {
      content?: unknown;
      conversation?: { sendText?: (msg: string) => Promise<unknown> };
      senderAddress?: string;
      conversationId?: string;
    };
    const text = typeof c.content === "string" ? c.content : "";
    const send = async (msg: string) => {
      if (c.conversation?.sendText) await c.conversation.sendText(msg);
    };

    if (isArenaJoinCommand(text)) {
      const reply = await getArenaJoinReplyRich(redis, c.conversationId || "dm");
      await send(reply);
      if (c.senderAddress) {
        const lobbyMsg = await createOrJoinLobby(redis, c.conversationId || "dm", c.senderAddress);
        await send(lobbyMsg);
      }
      return;
    }

    if (isStakeCommand(text)) {
      const amount = parseStakeAmount(text);
      if (amount != null) await send(getStakeReply(amount));
      return;
    }

    const getQuestionMatch = text.match(/get\s+question\s+(\d+)|question\s+(\d+)/i);
    if (getQuestionMatch) {
      const idx = parseInt(getQuestionMatch[1] || getQuestionMatch[2]!, 10);
      if (idx >= 1 && idx <= 15) {
        const q = await fetchLadderQuestionForIndex(idx);
        if (q) await send(`Q${idx}: ${q.question}\nAnswers: ${q.answers.join(", ")}`);
        else await send(`No question available for step ${idx}.`);
      }
      return;
    }

    const ladderStateMatch = text.match(/ladder\s+state\s+(\S+)\s+round\s+(\d+)/i);
    if (ladderStateMatch) {
      const [, arenaId, roundStr] = ladderStateMatch;
      const round = parseInt(roundStr!, 10);
      const out = await manageLadderStateTool.invoke({
        arenaId: arenaId!,
        round,
        action: "get",
      });
      await send(String(out));
      return;
    }

    if (text.includes("decode") && text.length > 20) {
      const decoded = decodeArenaQuestion(text);
      const out = decoded
        ? `Decoded: ${decoded.question} | Answers: ${decoded.answers.join(", ")}`
        : "Could not decode.";
      await send(out);
      return;
    }

    // Agentic fallback: XAI grok-4-1-fast-reasoning + tools (decode, ladder, fetch question)
    if (process.env.XAI_API_KEY) {
      try {
        const reply = await runOrchestrator(text, { redis });
        await send(reply);
      } catch (e) {
        console.error("Orchestrator error:", e);
        await send("Something went wrong. Try /arena join or ask for a question 1–15.");
      }
    } else {
      await send("Ask me to join the arena (/arena join), stake, get question 1–15, or decode an arena riddle.");
    }
  });

  agent.on("start", () => {
    console.log("Millionaire Arena agent waiting for messages. Address:", agent.address);
  });

  await agent.start();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
