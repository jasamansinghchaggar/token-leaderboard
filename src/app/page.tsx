import { HomeClient } from "@/components/HomeClient";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/horizon";

const DEMO_ADDRESSES = [
  "GBRPYHIL2CI3WHZKZ7WJBQW4N3PZJFMRFGAKJXXYQGZ2JFQJWJMW3M7B",
  "GCONMNLVF2D5AQZX3G4A57HBOVM6QYKQ6JYQ4S5XAWVGJ6PQYP2T5Q42",
  "GBZO5W2E6NK7Q6KQVIJDU5NQZ7AMJY74QXQ3MF53V4J5Q55A3XGTGZUH",
] as const;

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialLeaderboard: LeaderboardEntry[] = [];

  try {
    initialLeaderboard = await getLeaderboard([...DEMO_ADDRESSES]);
  } catch (error) {
    console.error("Failed to load initial leaderboard:", error);
  }

  return <HomeClient initialLeaderboard={initialLeaderboard} />;
}
