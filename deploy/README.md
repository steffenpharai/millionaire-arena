# Deploy scripts

## Vercel (miniapp)

The **miniapp** (Next.js) is deployed to Vercel.

**Setup (already done):**

- Vercel CLI: `npm install -g vercel` or use `npx vercel`
- Project linked from `miniapp/`: run `vercel link --yes` inside `miniapp/` (linked to **phygitaleng/miniapp**)
- Config: `miniapp/vercel.json` (build, framework, region)

**Deploy (after build passes):**

```bash
cd miniapp
vercel          # preview
vercel --prod   # production
```

**Env (set in Vercel dashboard → Project → Settings → Environment Variables):**

- `NEXT_PUBLIC_AGENT_API_URL` – Agent backend API base URL
- `NEXT_PUBLIC_URL` – Miniapp public URL (e.g. `https://miniapp.vercel.app` or custom domain)
- `NEXT_PUBLIC_CHAIN_ID` – e.g. `84532` (Base Sepolia) or `8453` (Base Mainnet)
- `NEXT_PUBLIC_POT_CONTRACT_ADDRESS` – ArenaPot address (after contracts deploy)
- `NEXT_PUBLIC_MILLION_TOKEN_ADDRESS` – MillionToken address
- Optional: `ACCOUNT_ASSOCIATION_HEADER`, `ACCOUNT_ASSOCIATION_PAYLOAD`, `ACCOUNT_ASSOCIATION_SIGNATURE` for Base App manifest

**Optional:** Connect the repo to Vercel (Git integration) for automatic deploys on push.

---

## Contracts (Forge)

Deploy MillionToken and ArenaPot to **Base Sepolia** (testnet) or Base Mainnet.

**Prerequisites:**

- `PRIVATE_KEY` – Deployer wallet private key (hex, with 0x).
- `BASE_SEPOLIA_RPC_URL` – e.g. `https://sepolia.base.org` (or use Base mainnet RPC for mainnet).
- Optional: `BASESCAN_API_KEY` for contract verification.

From repo root (WSL if Forge is in WSL):

```bash
cd contracts
export PRIVATE_KEY=0x...
export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify
```

For mainnet, use `BASE_MAINNET_RPC_URL` and ensure sufficient ETH for gas.

**Deploy order:** MillionToken is deployed with deployer as temporary pot/lp; then ArenaPot(token) is deployed; then token.setPotAddress(pot) is called.

## Node scripts

- `deploy-token.ts` – Documents the Forge deploy flow; run Forge as above for actual deployment.
- `deploy-pot.ts` – ArenaPot is deployed together with the token in `Deploy.s.sol`.
- `seed-pot.ts` – Seed the arena pot with tokens for a test round (create round + contribute). See below.

## Seed pot (simulate Clanker / 100M tokens)

To seed the pot with tokens for a test round (e.g. 100M tokens):

1. Set env: `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL`, `POT_CONTRACT_ADDRESS`, `MILLION_TOKEN_ADDRESS`, `ROUND_ID` (e.g. `round1` as bytes32 hex or use script default).
2. Run: `npx tsx deploy/seed-pot.ts`

The script creates the round (if owner) and contributes tokens to the pot. For a Clanker-style launch, use Clanker UI/API for distribution; this repo’s contracts are for custom supply/tax/burn.
