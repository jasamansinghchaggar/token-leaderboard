import axios from "axios";
import type { HorizonAccount } from "./types";

const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";

export async function getAccountBalance(publicKey: string): Promise<number> {
  try {
    const response = await axios.get<HorizonAccount>(`${HORIZON_URL}/accounts/${publicKey}`, {
      timeout: 5000,
    });

    const nativeBalance = response.data.balances.find((balance) => balance.asset_type === "native");
    return nativeBalance ? Number.parseFloat(nativeBalance.balance) : 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return 0;
    }

    console.error(`Failed to fetch account balance for ${publicKey}:`, error);
    return 0;
  }
}

export async function getMultipleBalances(
  publicKeys: string[]
): Promise<Array<{ publicKey: string; balance: number }>> {
  return Promise.all(
    publicKeys.map(async (publicKey) => ({
      publicKey,
      balance: await getAccountBalance(publicKey),
    }))
  );
}

export function getLeaderboardRanking(
  balances: Array<{ publicKey: string; balance: number }>
): Array<{ publicKey: string; balance: number; rank: number }> {
  return balances
    .sort((a, b) => b.balance - a.balance)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
