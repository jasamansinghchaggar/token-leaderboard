"use client";

import { useState } from "react";
import { WalletConnector } from "@/components/WalletConnector";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TransactionStatus } from "@/components/TransactionStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/horizon";
import { useAppStore } from "@/stores/appStore";

const DEMO_ADDRESSES = [
  "GBRPYHIL2CI3WHZKZ7WJBQW4N3PZJFMRFGAKJXXYQGZ2JFQJWJMW3M7B",
  "GCONMNLVF2D5AQZX3G4A57HBOVM6QYKQ6JYQ4S5XAWVGJ6PQYP2T5Q42",
  "GBZO5W2E6NK7Q6KQVIJDU5NQZ7AMJY74QXQ3MF53V4J5Q55A3XGTGZUH",
] as const;

interface HomeClientProps {
  initialLeaderboard: LeaderboardEntry[];
}

export function HomeClient({ initialLeaderboard }: HomeClientProps) {
  const { isConnected } = useAppStore();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardEntry[]>(initialLeaderboard);
  const [loading, setLoading] = useState(false);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard([...DEMO_ADDRESSES]);
      setLeaderboardData(data);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Token Leaderboard</h1>
            <p className="text-muted-foreground">
              Real-time token holder rankings on Stellar testnet
            </p>
            <p className="text-sm text-muted-foreground">
              Wallet: {isConnected ? "Connected" : "Not connected"}
            </p>
          </div>

          <ErrorBoundary>
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Wallet Connection</h2>
              <WalletConnector />
            </section>
          </ErrorBoundary>

          <ErrorBoundary>
            <section>
              <TransactionStatus />
            </section>
          </ErrorBoundary>

          <ErrorBoundary>
            <section className="rounded-lg border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Top Token Holders</h2>
                <Button onClick={() => void loadLeaderboard()} disabled={loading} variant="outline">
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              <LeaderboardTable data={leaderboardData} loading={loading} />
            </section>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
