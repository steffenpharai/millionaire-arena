/**
 * Deploy MillionToken and ArenaPot to Base Sepolia / Base Mainnet.
 * Requires: PRIVATE_KEY, BASE_SEPOLIA_RPC_URL or BASE_MAINNET_RPC_URL.
 * Run from repo root: npx tsx deploy/deploy-token.ts
 */
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { baseSepolia, base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const chain = process.env.NETWORK_ID === "base-mainnet" ? base : baseSepolia;
const rpc = process.env.BASE_MAINNET_RPC_URL || process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";

const client = createPublicClient({ chain, transport: http(rpc) });

async function main() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk?.startsWith("0x")) throw new Error("Set PRIVATE_KEY");
  const account = privateKeyToAccount(pk as `0x${string}`);
  console.log("Deployer:", account.address);
  console.log("Chain:", chain.name);
  // Deployment is done via Foundry in production (contracts/script/Deploy.s.sol).
  // This script is for documentation and optional viem-based deploy.
  console.log("Run: cd contracts && forge script script/Deploy.s.sol --rpc-url", rpc, "--broadcast --verify");
}

main().catch(console.error);
