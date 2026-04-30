"use client";

import { useEffect, useState } from "react";
import { WalletConnector } from "@/components/WalletConnector";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TransactionStatus } from "@/components/TransactionStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { getLeaderboard } from "@/lib/horizon";
import { useAppStore } from "@/stores/appStore";

export function HomeClient() {
  const { isConnected } = useAppStore();
  const [leaderboardData, setLeaderboardData] = useState<
    Array<{ address: string; balance: number; rank: number }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeaderboard();
      setLeaderboardData(
        data.map((entry) => ({
          address: entry.publicKey,
          balance: entry.balance,
          rank: entry.rank,
        }))
      );
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError(
        `Failed to load leaderboard${err instanceof Error ? `: ${err.message}` : ""}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const runLoad = () => {
      void loadLeaderboard();
    };

    const initialLoadTimer = setTimeout(runLoad, 0);

    const interval = setInterval(() => {
      runLoad();
    }, 30000);

    return () => {
      clearTimeout(initialLoadTimer);
      clearInterval(interval);
    };
  }, []);

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
                <div>
                  <h2 className="text-lg font-semibold">Top Token Holders</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {leaderboardData.length} holders registered
                  </p>
                </div>
                <Button onClick={() => void loadLeaderboard()} disabled={loading} variant="outline">
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              {error ? (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
              <LeaderboardTable data={leaderboardData} loading={loading} />
            </section>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
