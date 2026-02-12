/**
 * Payment/Economy agent: gasless stake (ERC-4337 + Paymaster), pot contribution, payout (20% to winners).
 * Uses CDP Paymaster and allowlisted pot/token methods.
 */

export const WINNER_SHARE_BPS = 2000; // 20%

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
  _params: StakeParams,
  potAddress: string,
  _paymasterUrl: string
): Promise<{ to: string; data: string; value: string }> {
  // In production: encode ArenaPot.stake(roundId, amount) and wrap in ERC-4337 userOp with Paymaster.
  const roundIdBytes32 = "0x" + Buffer.from(_params.roundId).toString("hex").padStart(64, "0");
  return {
    to: potAddress,
    data: encodeStakeCalldata(roundIdBytes32, _params.amountWei),
    value: "0x0",
  };
}

function encodeStakeCalldata(roundId: string, amount: string): string {
  const sig = "0x" + Buffer.from("stake(bytes32,uint256)").toString("hex");
  // Minimal ABI encoding placeholder; real impl uses viem encodeFunctionData.
  return sig + roundId.slice(2).padStart(64, "0") + BigInt(amount).toString(16).padStart(64, "0");
}

export async function prepareContributeCall(
  params: ContributeParams,
  potAddress: string
): Promise<{ to: string; data: string }> {
  const roundIdBytes32 = "0x" + Buffer.from(params.roundId).toString("hex").padStart(64, "0");
  return {
    to: potAddress,
    data: encodeStakeCalldata(roundIdBytes32, params.amountWei),
  };
}
