/**
 * Seed the arena pot with tokens for a test round (e.g. 100M tokens).
 * Requires: PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, POT_CONTRACT_ADDRESS, MILLION_TOKEN_ADDRESS.
 * Optional: ROUND_ID (bytes32 hex). Creates round and contributes from deployer.
 * Run from repo root: npx tsx deploy/seed-pot.ts
 */
import { createPublicClient, createWalletClient, http, encodeFunctionData, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const rpc = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
const chain = baseSepolia;
const client = createPublicClient({ chain, transport: http(rpc) });

const potAbi = parseAbi([
  "function createRound(bytes32 roundId) external",
  "function contributeToPot(bytes32 roundId, uint256 amount) external",
]);
const tokenAbi = parseAbi(["function approve(address spender, uint256 amount) returns (bool)"]);

function roundIdToBytes32(roundId: string): `0x${string}` {
  if (roundId.startsWith("0x") && roundId.length === 66) return roundId as `0x${string}`;
  const hex = Buffer.from(roundId.slice(0, 32), "utf-8").toString("hex").padEnd(64, "0");
  return `0x${hex}` as `0x${string}`;
}

async function main() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk?.startsWith("0x")) throw new Error("Set PRIVATE_KEY");
  const account = privateKeyToAccount(pk as `0x${string}`);
  const potAddress = process.env.POT_CONTRACT_ADDRESS as `0x${string}` | undefined;
  const tokenAddress = process.env.MILLION_TOKEN_ADDRESS as `0x${string}` | undefined;
  if (!potAddress || !tokenAddress) {
    console.error("Set POT_CONTRACT_ADDRESS and MILLION_TOKEN_ADDRESS (deployed contract addresses)");
    process.exit(1);
  }
  const roundId = process.env.ROUND_ID || "round1";
  const amountWei = process.env.SEED_AMOUNT_WEI || "100000000000000000000000000"; // 100M (18 decimals)

  const walletClient = createWalletClient({ account, chain, transport: http(rpc) });
  if (!walletClient) throw new Error("Wallet client failed");

  const roundIdBytes32 = roundIdToBytes32(roundId);
  console.log("Create round (if owner)...");
  try {
    const hashCreate = await walletClient.writeContract({
      address: potAddress,
      abi: potAbi,
      functionName: "createRound",
      args: [roundIdBytes32],
      account,
    });
    console.log("createRound tx:", hashCreate);
  } catch (e) {
    console.warn("createRound (may already exist):", (e as Error).message);
  }

  console.log("Approve pot to spend tokens...");
  const hashApprove = await walletClient.writeContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "approve",
    args: [potAddress, BigInt(amountWei)],
    account,
  });
  console.log("approve tx:", hashApprove);

  console.log("Contribute to pot...");
  const hashContribute = await walletClient.writeContract({
    address: potAddress,
    abi: potAbi,
    functionName: "contributeToPot",
    args: [roundIdBytes32, BigInt(amountWei)],
    account,
  });
  console.log("contributeToPot tx:", hashContribute);
  console.log("Seed done. RoundId:", roundId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
