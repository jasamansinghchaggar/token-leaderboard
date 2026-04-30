import axios from "axios";

const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";

export interface LeaderboardEntry {
  publicKey: string;
  balance: number;
  rank: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch("/api/leaderboard?refresh=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }

    const payload = (await response.json()) as ApiResponse<LeaderboardEntry[]>;
    if (!payload.success) {
      throw new Error(payload.error || "Failed to fetch leaderboard");
    }

    return payload.data || [];
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
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
