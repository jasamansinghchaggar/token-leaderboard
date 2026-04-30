import { NextResponse } from "next/server";
import { getLeaderboardRanking, getMultipleBalances } from "@/lib/server/horizon";
import {
  deleteAllLeaderboardEntries,
  getAllUsers,
  updateLeaderboardEntry,
} from "@/lib/server/repository";
import type { ApiResponse, LeaderboardEntry } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const publicKeys = await getAllUsers();

    if (!publicKeys.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "No users to fetch",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const balances = await getMultipleBalances(publicKeys);
    const ranked = getLeaderboardRanking(balances);

    await deleteAllLeaderboardEntries();

    for (const entry of ranked) {
      await updateLeaderboardEntry(entry.publicKey, entry.balance, entry.rank);
    }

    const response: ApiResponse<LeaderboardEntry[]> = {
      success: true,
      data: ranked,
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
