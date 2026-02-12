/**
 * Millionaire Arena agent backend: XMTP listener + multi-agent swarm (Game Master, Social, Payment, Ecosystem).
 * Plan: AgentKit + LangChain patterns; /arena join shares mini-app; Redis for sessions.
 */

import "dotenv/config";
import http from "node:http";
import { Agent } from "@xmtp/agent-sdk";
import IORedis from "ioredis";
import { isArenaJoinCommand, getArenaJoinReply, createOrJoinLobby } from "./xmtp-handler.js";
import { decodeArenaQuestion } from "./tools/index.js";
import { listLobbies } from "./api/lobbies.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redis = new (IORedis as any)(process.env.REDIS_URL || "redis://localhost:6379");

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
      req.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true, message: "Contribute (gasless) would be sent via Paymaster" }));
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
    const c = ctx as { content?: unknown; conversation?: { sendText?: (msg: string) => Promise<unknown> }; senderAddress?: string; conversationId?: string };
    const text = typeof c.content === "string" ? c.content : "";
    const send = async (msg: string) => {
      if (c.conversation?.sendText) await c.conversation.sendText(msg);
    };
    if (isArenaJoinCommand(text)) {
      await send(getArenaJoinReply());
      if (c.senderAddress) {
        const lobbyMsg = await createOrJoinLobby(redis, c.conversationId || "dm", c.senderAddress);
        await send(lobbyMsg);
      }
      return;
    }
    if (text.includes("decode") && text.length > 20) {
      const decoded = decodeArenaQuestion(text);
      const out = decoded ? `Decoded: ${decoded.question} | Answers: ${decoded.answers.join(", ")}` : "Could not decode.";
      await send(out);
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
