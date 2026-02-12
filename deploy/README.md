# Deploy scripts

## Contracts (Forge)

Deploy MillionToken and ArenaPot to Base Sepolia or Base Mainnet.

**Prerequisites:** `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL` or `BASE_MAINNET_RPC_URL`, optional `BASESCAN_API_KEY` for verification.

From repo root (WSL if Forge is in WSL):

```bash
cd contracts
export PRIVATE_KEY=0x...
export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify
```

For mainnet, use `BASE_MAINNET_RPC_URL` and ensure sufficient ETH for gas.

## Node scripts

- `deploy-token.ts` – Documents the Forge deploy flow; run Forge as above for actual deployment.
- `deploy-pot.ts` – ArenaPot is deployed together with the token in `Deploy.s.sol`.
