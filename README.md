# Millionaire Arena

Multi-user, social trivia battle royale on Coinbase's **Base L2**—inspired by "Who Wants to Be a Millionaire" with multiplayer arenas (5–20 players), 15-question ladder, and gasless gameplay.

**Skill-based knowledge contest.** No purchase necessary to participate. Not gambling.

## Overview

- **Discovery:** Join via XMTP chat (`/arena join`); agent shares the mini-app; gasless Base Account auth.
- **Game:** 15 questions (easy → medium → hard), 30s per question, elimination on wrong answer. Lifelines: 50:50, Poll (XMTP), Phone-a-friend (AI), Ask-agent (decode).
- **Economy:** $MILLION ERC-20 on Base; community pot; gasless stakes and payouts via ERC-4337 + CDP Paymaster.
- **Stack:** Agent backend (AgentKit + LangChain + XMTP), Next.js mini-app (Base App manifest), Solidity contracts (Foundry), Redis for session state.

## Forked / referenced repos

- **AgentKit:** Fork of [coinbase/agentkit](https://github.com/coinbase/agentkit) → `agentkit/` (your fork: `steffenpharai/agentkit`). Use for agent swarm and LangChain integration.
- **Base guides:** Fork of [base-org/guides](https://github.com/base-org/guides) → `guides/`. Cookbook patterns (launch AI agents, go gasless, spend permissions).
- **XMTP JS SDK:** Clone of [xmtp/xmtp-js](https://github.com/xmtp/xmtp-js) → `xmtp-js/`. Used for chat integration; runtime dependency is `@xmtp/agent-sdk`.
- **Replit AgentKit template:** [AgentKitjs-Quickstart-010](https://replit.com/@lincolnmurr/AgentKitjs-Quickstart-010). Fork on Replit for a Node.js quickstart; `agent-backend/` in this repo follows the same patterns and uses the local `agentkit/` fork.

## Repo structure

```
/
├── README.md
├── .env.example
├── agentkit/            # Fork of coinbase/agentkit
├── guides/              # Fork of base-org/guides
├── xmtp-js/             # Clone of xmtp/xmtp-js
├── agent-backend/       # AgentKit + XMTP (Node) – app code
├── miniapp/             # Next.js mini-app
├── contracts/           # Solidity (MillionToken, ArenaPot)
├── deploy/               # Deploy scripts
└── tests/               # Unit, integration, E2E
```

## Prerequisites

- Node.js 18+, npm 9+
- Foundry (for contracts)
- Redis (for agent session state)
- Accounts: CDP, XMTP agent wallet, Base App (for mini-app manifest)

## Setup

### 1. Environment

```bash
cp .env.example .env
# Edit .env with your keys (see below).
```

### 2. Contracts (Base Sepolia first)

If Foundry is installed in **WSL**, run from WSL with `forge` on your PATH (e.g. `export PATH=$HOME/.foundry/bin:$PATH`) or use the full path to `forge`:

```bash
cd contracts   # or from repo root: cd /mnt/c/Base/Agent/contracts (in WSL)
forge install  # installs OpenZeppelin, forge-std (forge-std goes to repo root lib/)
forge build
forge test
# Deploy: see deploy/ and "Deployment" below.
```

### 3. Agent backend

```bash
cd agent-backend
npm install
npm run build
# Set env: CDP_*, OPENAI_API_KEY, XMTP_*, REDIS_URL, PAYMASTER_URL, etc.
npm start
```

### 4. Mini-app

```bash
cd miniapp
npm install
npm run dev
# Configure .well-known/farcaster.json and accountAssociation for Base App.
```

## Environment variables

See `.env.example`. Key groups:

- **CDP:** `CDP_API_KEY_NAME`, `CDP_API_KEY_PRIVATE_KEY`, `NETWORK_ID` (base-sepolia / base-mainnet)
- **XMTP:** `XMTP_WALLET_KEY`, `XMTP_DB_ENCRYPTION_KEY`, `XMTP_ENV=production` for Base App
- **Paymaster:** `PAYMASTER_URL` (CDP Paymaster + Bundler endpoint)
- **Redis:** `REDIS_URL`
- **Mini-app:** `NEXT_PUBLIC_AGENT_API_URL`, `NEXT_PUBLIC_CHAIN_ID`

## Gasless and Paymaster

- **ERC-4337:** User-facing stakes and "feed pot" use smart accounts (permissionless + viem or CDP Smart Wallets). All such actions are user operations.
- **CDP Paymaster:** Use the single RPC URL (Paymaster + Bundler) from [CDP Portal](https://portal.cdp.coinbase.com/products/bundler-and-paymaster). Allowlist only arena contract methods: `stake`, `contributeToPot`, `settleAndClaim`. Set per-user and global limits in the portal.
- **Policy:** Testnet (Base Sepolia) has unlimited sponsorship; mainnet is capped (e.g. up to $10k/month per plan). Use a proxy in production for endpoint security ([Go Gasless](https://docs.base.org/cookbook/go-gasless)).

## Token launch (Clanker)

- **$MILLION** is implemented as a custom ERC-20 in `contracts/` (exact tokenomics: tax, burn, pot/LP). For a **Clanker**-style launch (e.g. [clanker.world](https://clanker.world)), use their UI or API for distribution; custom supply/tax/burn require this repo’s contracts. See [Launch a Token](https://docs.base.org/cookbook/launch-tokens).

## Deployment

1. **Base Sepolia:** Run `cd contracts && forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify`. Set agent and mini-app env to testnet; run agent and mini-app.
2. **Mainnet:** Same flow with `BASE_MAINNET_RPC_URL`; configure Paymaster allowlist and limits.
3. **Order:** Deploy contracts first, then set `NEXT_PUBLIC_POT_CONTRACT_ADDRESS` and `NEXT_PUBLIC_MILLION_TOKEN_ADDRESS` in the mini-app.

## Testing and deploy order (plan §11)

1. **Unit (agent):** Jest in `agent-backend/`: OpenTDB mapping, fetchLadderQuestion, obfuscate/decode tool, manageLadderState: `cd agent-backend && npm run test`.
2. **Unit (contracts):** `cd contracts && forge test` (from WSL if Forge is there).
3. **E2E (root):** Join flow, ladder mapping, decode round-trip: `npm run test:e2e` from repo root.
4. **E2E (miniapp):** Cypress for ladder, game, feed-pot: ensure the app is served at http://localhost:3000 (`cd miniapp && npm run dev`), then in another terminal `cd miniapp && npm run test:e2e` (uses `cypress.config.cjs`; runs via `npx cypress run`).
5. **Deploy:** Base Sepolia first, then mainnet with policy and compliance in place.

## Verification

- Run from repo root: `npm run test` (agent Jest + root e2e). From WSL in `contracts/`: `forge test`. For miniapp Cypress: start miniapp with `cd miniapp && npm run dev`, then in another terminal `cd miniapp && npm run test:e2e`.
- All tests must pass before considering the implementation complete.

## Progress (core agent + miniapp iteration)

- **Agent backend:** Custom tools (fetchLadderQuestion, obfuscateQuestion, manageLadderState), decode tool (LangChain). XMTP: `/arena join`, stake command parsing, rich preview. Swarm: Game Master + Social Coordinator wired in index. Gasless API: `POST /api/stake` and `POST /api/contribute` return encoded calldata for Paymaster (allowlist: stake, contributeToPot).
- **Mini-app:** Base manifest, ladder (progress bar, safe milestones), game (timer, lifelines, plain/obfuscated view), leaderboard, feed-pot with gasless preview. viem for future one-tap submit; XMTP noted in lobby.
- **Contracts:** Deploy script fixed (MillionToken with deployer placeholder, then ArenaPot, then setPotAddress). Seed script in `deploy/seed-pot.ts`.
- **Tests:** Jest (agent-backend), Cypress (miniapp), root e2e critical path.

## Compliance and disclaimers

- **Skill-based:** Contest is based on knowledge/skill only.
- **No purchase necessary:** Entry path without payment is available.
- **NY-friendly:** This contest is structured as skill-based where applicable. Not gambling. Disclaimers appear in the app footer and README; no gambling messaging. Participants in NY and other jurisdictions should review local rules.
- In-app: footer with "No purchase necessary", "Skill-based contest", "Not gambling", and link to full terms (see `miniapp/app/terms`).

## References

- [CDP AgentKit Quickstart](https://docs.cdp.coinbase.com/agent-kit/getting-started/quickstart)
- [CDP Paymaster](https://docs.cdp.coinbase.com/paymaster/introduction/welcome)
- [Base: Launch AI Agents](https://docs.base.org/cookbook/launch-ai-agents)
- [Base: Spend Permissions AI Agent](https://docs.base.org/cookbook/spend-permissions-ai-agent)
- [Base: Mini Apps and Agents](https://docs.base.org/base-app/agents/mini-apps-and-agents)
- [Base: Go Gasless](https://docs.base.org/cookbook/go-gasless)
- [Base: Launch a Token](https://docs.base.org/cookbook/launch-tokens)
- [XMTP: Build an agent](https://docs.xmtp.org/agents/get-started/build-an-agent)
- [OpenTDB API](https://opentdb.com/api_config.php)
