/**
 * Payment/Economy agent: gasless stake (ERC-4337 + Paymaster), pot contribution, payout (20% to winners).
 * Uses CDP Paymaster and allowlisted pot/token methods. viem encodeFunctionData for ArenaPot.
 */

import { encodeFunctionData, type Address } from "viem";

export const WINNER_SHARE_BPS = 2000; // 20%

const ARENA_POT_ABI = [
  {
    name: "stake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "roundId", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "contributeToPot",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "roundId", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

/** Convert string roundId to bytes32 (right-padded hex). For keccak256 use from client. */
export function roundIdToBytes32(roundId: string): `0x${string}` {
  if (roundId.startsWith("0x") && roundId.length === 66) return roundId as `0x${string}`;
  const hex = Buffer.from(roundId.slice(0, 32), "utf-8").toString("hex").padEnd(64, "0");
  return `0x${hex}` as `0x${string}`;
}

export interface StakeParams {
  roundId: string;
  amountWei: string;
  userAddress: string;
}

export interface ContributeParams {
  roundId: string;
  amountWei: string;
  userAddress: string;
}

export async function prepareStakeCall(
  params: StakeParams,
  potAddress: Address,
  _paymasterUrl: string
): Promise<{ to: Address; data: `0x${string}`; value: bigint }> {
  const roundIdBytes32 = roundIdToBytes32(params.roundId);
  const amount = BigInt(params.amountWei);
  const data = encodeFunctionData({
    abi: ARENA_POT_ABI,
    functionName: "stake",
    args: [roundIdBytes32, amount],
  });
  return {
    to: potAddress,
    data,
    value: 0n,
  };
}

export async function prepareContributeCall(
  params: ContributeParams,
  potAddress: Address
): Promise<{ to: Address; data: `0x${string}` }> {
  const roundIdBytes32 = roundIdToBytes32(params.roundId);
  const amount = BigInt(params.amountWei);
  const data = encodeFunctionData({
    abi: ARENA_POT_ABI,
    functionName: "contributeToPot",
    args: [roundIdBytes32, amount],
  });
  return {
    to: potAddress,
    data,
  };
}
