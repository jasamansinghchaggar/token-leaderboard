import { NextRequest, NextResponse } from "next/server";
import { getLeaderboardRanking, getMultipleBalances } from "@/lib/server/horizon";
import {
  deleteAllLeaderboardEntries,
  getAllUsers,
  getLeaderboardEntries,
  updateLeaderboardEntry,
} from "@/lib/server/repository";
import type { ApiResponse, LeaderboardEntry } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function refreshLeaderboardData() {
  const publicKeys = await getAllUsers();

  if (!publicKeys.length) {
    return [];
  }

  const balances = await getMultipleBalances(publicKeys);
  const ranked = getLeaderboardRanking(balances);

  await deleteAllLeaderboardEntries();

  for (const entry of ranked) {
    await updateLeaderboardEntry(entry.publicKey, entry.balance, entry.rank);
  }

  return ranked;
}

export async function GET(request: NextRequest) {
  try {
    const shouldRefresh = request.nextUrl.searchParams.get("refresh") === "true";

    if (shouldRefresh) {
      const ranked = await refreshLeaderboardData();
      const response: ApiResponse<LeaderboardEntry[]> = {
        success: true,
        data: ranked,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response);
    }

    const leaderboard = await getLeaderboardEntries();
    const serialized: LeaderboardEntry[] = leaderboard.map((entry) => ({
      publicKey: entry.publicKey,
      balance: entry.balance,
      rank: entry.rank,
      lastFetched: entry.lastFetched,
    }));

    const response: ApiResponse<LeaderboardEntry[]> = {
      success: true,
      data: serialized,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
