# Changelog

All notable changes to the Millionaire Arena repo are documented here.

## [Unreleased]

### Agent backend – xAI orchestration

- **Orchestrator uses xAI’s recommended stack (Vercel AI SDK + @ai-sdk/xai).**
  - Replaced custom LangChain tool loop with the official JS approach: [xAI Function Calling](https://docs.x.ai/developers/tools/function-calling), [Vercel AI SDK xAI provider](https://sdk.vercel.ai/providers/ai-sdk-providers/xai).
  - Model: `grok-4-1-fast-reasoning` via `xai('grok-4-1-fast-reasoning')`.
  - Tools (decode, fetchLadderQuestion, manageLadderState) defined with AI SDK `tool()`: `inputSchema` (Zod) + `execute`. Multi-step handled by SDK with `stopWhen: stepCountIs(5)`.
  - Dependencies: added `ai`, `@ai-sdk/xai`; orchestrator no longer uses a manual message/tool loop.

- **Orchestration test script**
  - `agent-backend/scripts/test-orchestration.ts`: runs real prompts against the orchestrator (uses `.env` only: repo root then `agent-backend`).
  - npm script: `cd agent-backend && npm run test:orchestration`. Requires `XAI_API_KEY` in `.env`.

### Contract tests on Windows (Forge in WSL)

- **`scripts/run-forge-test.js`**
  - Runs contract tests via WSL when on Windows so `forge test` works when Foundry is installed in WSL. Adds `$HOME/.foundry/bin` to PATH in the WSL shell.
- **Root `package.json`**
  - `test:contracts`: `node scripts/run-forge-test.js`
  - `test`: runs `test:contracts` then `test:agent` then `test:e2e`.
- **Docs**
  - `.cursor/rules/verification.mdc`: checklist uses `npm run test:contracts` (WSL on Windows).
  - README: contract testing and verification sections updated for `npm run test:contracts` and WSL.

### Environment

- **`.env` only for orchestration test**
  - Orchestration script loads only `.env` (repo root, then agent-backend). No `.env.example` fallback so local `.env` is the single source of truth for keys.
