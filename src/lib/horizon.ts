import axios from "axios";

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

interface HorizonBalance {
  balance: string;
  asset_type: string;
  asset_code?: string;
}

export interface LeaderboardEntry {
  address: string;
  balance: number;
  rank: number;
}

export async function getAccountBalance(
  publicKey: string,
  assetCode?: string
): Promise<number> {
  try {
    const response = await axios.get(`${HORIZON_URL}/accounts/${publicKey}`);
    const balances = response.data.balances as HorizonBalance[];

    if (assetCode) {
      const assetBalance = balances.find((balance) => balance.asset_code === assetCode);
      return assetBalance ? Number.parseFloat(assetBalance.balance) : 0;
    }

    const nativeBalance = balances.find((balance) => balance.asset_type === "native");
    return nativeBalance ? Number.parseFloat(nativeBalance.balance) : 0;
  } catch {
    throw new Error("Failed to fetch account balance");
  }
}

export async function getLeaderboard(addresses: string[]): Promise<LeaderboardEntry[]> {
  try {
    const balances = await Promise.all(
      addresses.map(async (address) => ({
        address,
        balance: await getAccountBalance(address),
      }))
    );

    return balances
      .sort((a, b) => b.balance - a.balance)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  } catch {
    throw new Error("Failed to fetch leaderboard data");
  }
}

export async function getTransactionStatus(hash: string): Promise<{
  status: "pending" | "success" | "failed";
  message?: string;
}> {
  try {
    const response = await axios.get(`${HORIZON_URL}/transactions/${hash}`);

    if (response.data.successful) {
      return { status: "success" };
    }

    return {
      status: "failed",
      message: response.data.result_xdr ? "Transaction failed" : "Unknown error",
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { status: "pending" };
    }

    throw new Error("Failed to fetch transaction status");
  }
}
